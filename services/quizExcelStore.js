const fs = require("fs/promises");
const https = require("https");
const path = require("path");
const { DATA_DIR } = require("./fileStore");
const { cloudinary, assertCloudinaryConfigured } = require("../config/cloudinary");

let ExcelJS = null;

const QUIZ_RESULTS_FILE = path.join(DATA_DIR, "quiz-results.xlsx");
const QUIZ_RESULTS_CLOUDINARY_PUBLIC_ID = "sc-training/excel/quiz-results";
const WORKSHEET_NAME = "Quiz Results";
const COLUMNS = [
  { header: "Full Name", key: "fullName", width: 28 },
  { header: "Matricule", key: "matricule", width: 18 },
  { header: "Score", key: "score", width: 12 },
  { header: "Total Questions", key: "totalQuestions", width: 18 },
  { header: "Percentage", key: "percentage", width: 14 },
  { header: "Date", key: "date", width: 16 },
  { header: "Time", key: "time", width: 14 }
];

function cleanString(value, fallback = "") {
  const cleaned = String(value || "").trim();
  return cleaned || fallback;
}

function getLocalDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("fr-MA", {
    timeZone: "Africa/Casablanca",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}:${parts.second}`
  };
}

function styleWorksheet(worksheet) {
  worksheet.columns = COLUMNS;
  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF184945" }
  };
  worksheet.getRow(1).alignment = { vertical: "middle" };
  worksheet.views = [{ state: "frozen", ySplit: 1 }];
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        downloadFile(response.headers.location, destination).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Cloudinary Excel download failed with status ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", async () => {
        try {
          await fs.mkdir(path.dirname(destination), { recursive: true });
          await fs.writeFile(destination, Buffer.concat(chunks));
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

    request.on("error", reject);
  });
}

async function restoreExcelFromCloudinary() {
  const candidatePublicIds = [
    QUIZ_RESULTS_CLOUDINARY_PUBLIC_ID,
    `${QUIZ_RESULTS_CLOUDINARY_PUBLIC_ID}.xlsx`
  ];

  try {
    assertCloudinaryConfigured();

    for (const publicId of candidatePublicIds) {
      try {
        const resource = await cloudinary.api.resource(publicId, {
          resource_type: "raw"
        });

        if (resource && resource.secure_url) {
          await downloadFile(resource.secure_url, QUIZ_RESULTS_FILE);
          return true;
        }
      } catch {
        // Try the next possible raw public id.
      }
    }
  } catch {
    // The workbook may not exist in Cloudinary yet. A new local one will be created.
  }

  return false;
}

async function syncExcelToCloudinary() {
  try {
    assertCloudinaryConfigured();
    await cloudinary.uploader.upload(QUIZ_RESULTS_FILE, {
      resource_type: "raw",
      public_id: QUIZ_RESULTS_CLOUDINARY_PUBLIC_ID,
      overwrite: true,
      invalidate: true
    });
  } catch (error) {
    console.error(`Quiz results Cloudinary sync failed: ${error.message}`);
  }
}

async function ensureWorkbook() {
  if (!ExcelJS) {
    try {
      ExcelJS = require("exceljs");
    } catch {
      throw new Error("exceljs dependency is required. Run npm install before using quiz Excel storage.");
    }
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  const workbook = new ExcelJS.Workbook();

  try {
    if (!(await pathExists(QUIZ_RESULTS_FILE))) {
      await restoreExcelFromCloudinary();
    }

    await fs.access(QUIZ_RESULTS_FILE);
    await workbook.xlsx.readFile(QUIZ_RESULTS_FILE);

    const existingWorksheet = workbook.getWorksheet(WORKSHEET_NAME) || workbook.worksheets[0];
    if (!existingWorksheet || existingWorksheet.rowCount <= 1) {
      const restored = await restoreExcelFromCloudinary();
      if (restored) {
        await workbook.xlsx.readFile(QUIZ_RESULTS_FILE);
      }
    }
  } catch {
    const worksheet = workbook.addWorksheet(WORKSHEET_NAME);
    styleWorksheet(worksheet);
    await workbook.xlsx.writeFile(QUIZ_RESULTS_FILE);
    await syncExcelToCloudinary();
  }

  let worksheet = workbook.getWorksheet(WORKSHEET_NAME) || workbook.worksheets[0];
  if (!worksheet) {
    worksheet = workbook.addWorksheet(WORKSHEET_NAME);
  }
  styleWorksheet(worksheet);

  return { workbook, worksheet };
}

function serializeRow(row, index) {
  const values = row.values || [];
  const score = Number(values[3]) || 0;
  const totalQuestions = Number(values[4]) || 0;
  const percentage = Number(values[5]) || 0;

  return {
    index,
    fullName: cleanString(values[1]),
    matricule: cleanString(values[2]),
    score,
    totalQuestions,
    percentage,
    rate: percentage,
    passed: percentage >= 90,
    date: cleanString(values[6]),
    time: cleanString(values[7]),
    createdAt: `${cleanString(values[6])}T${cleanString(values[7], "00:00:00")}`
  };
}

async function appendQuizResult(input) {
  const fullName = cleanString(input.fullName || input.name, "");
  const matricule = cleanString(input.matricule);
  const score = Number(input.score);
  const totalQuestions = Number(input.totalQuestions);
  const percentage = Number(input.percentage ?? input.rate);

  if (!matricule) {
    throw new Error("Matricule is required");
  }

  if (!Number.isFinite(score) || !Number.isFinite(totalQuestions) || !Number.isFinite(percentage)) {
    throw new Error("Score, totalQuestions, and percentage are required");
  }

  if (score < 0 || totalQuestions < 1 || score > totalQuestions || percentage < 0 || percentage > 100) {
    throw new Error("Invalid quiz result values");
  }

  const { workbook, worksheet } = await ensureWorkbook();
  const now = new Date();
  const { date, time } = getLocalDateParts(now);

  const row = worksheet.addRow({
    fullName,
    matricule,
    score,
    totalQuestions,
    percentage,
    date,
    time
  });

  await workbook.xlsx.writeFile(QUIZ_RESULTS_FILE);
  await syncExcelToCloudinary();
  return serializeRow(row, row.number - 2);
}

async function listQuizResults() {
  const { worksheet } = await ensureWorkbook();
  const results = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }
    results.push(serializeRow(row, rowNumber - 2));
  });

  return results.reverse();
}

async function deleteQuizResult(index) {
  const numericIndex = Number(index);

  if (!Number.isInteger(numericIndex) || numericIndex < 0) {
    return false;
  }

  const { workbook, worksheet } = await ensureWorkbook();
  const rowNumber = numericIndex + 2;

  if (rowNumber > worksheet.rowCount) {
    return false;
  }

  worksheet.spliceRows(rowNumber, 1);
  await workbook.xlsx.writeFile(QUIZ_RESULTS_FILE);
  await syncExcelToCloudinary();
  return true;
}

async function ensureQuizResultsFile() {
  await ensureWorkbook();
  return QUIZ_RESULTS_FILE;
}

module.exports = {
  QUIZ_RESULTS_FILE,
  QUIZ_RESULTS_CLOUDINARY_PUBLIC_ID,
  appendQuizResult,
  deleteQuizResult,
  ensureQuizResultsFile,
  listQuizResults
};
