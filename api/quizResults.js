const fs = require("fs");
const path = require("path");
const {
  appendQuizResult,
  deleteQuizResult,
  ensureQuizResultsFile,
  listQuizResults
} = require("../services/quizExcelStore");

function sendApiError(sendJson, response, statusCode, message) {
  sendJson(response, statusCode, {
    error: message
  });
}

async function createQuizResult(request, response, deps) {
  const { readRequestBody, sendJson } = deps;
  let body = {};

  try {
    body = JSON.parse((await readRequestBody(request)) || "{}");
  } catch {
    sendApiError(sendJson, response, 400, "Invalid JSON payload");
    return;
  }

  try {
    const result = await appendQuizResult(body);
    sendJson(response, 201, { result });
  } catch (error) {
    sendApiError(sendJson, response, 400, error.message || "Unable to save quiz result");
  }
}

async function listResults(request, response, deps) {
  const { requireAdmin, sendJson } = deps;

  if (!requireAdmin(request, response)) {
    return;
  }

  const results = await listQuizResults();
  sendJson(response, 200, { results });
}

async function downloadResults(request, response, deps) {
  const { requireAdmin } = deps;

  if (!requireAdmin(request, response)) {
    return;
  }

  const filePath = await ensureQuizResultsFile();
  const fileName = path.basename(filePath);

  response.writeHead(200, {
    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Content-Disposition": `attachment; filename="${fileName}"`,
    "Cache-Control": "no-store"
  });
  fs.createReadStream(filePath).pipe(response);
}

async function deleteResult(request, response, deps, index) {
  const { requireAdmin, sendJson } = deps;

  if (!requireAdmin(request, response)) {
    return;
  }

  const deleted = await deleteQuizResult(index);

  if (!deleted) {
    sendApiError(sendJson, response, 404, "Quiz result not found");
    return;
  }

  sendJson(response, 200, { ok: true });
}

async function handleQuizResultsApi(request, response, url, deps) {
  const { sendJson } = deps;

  try {
    if (url.pathname === "/api/quiz-results" && request.method === "POST") {
      await createQuizResult(request, response, deps);
      return true;
    }

    if (url.pathname === "/api/quiz-results" && request.method === "GET") {
      await listResults(request, response, deps);
      return true;
    }

    if (url.pathname === "/api/quiz-results/download" && request.method === "GET") {
      await downloadResults(request, response, deps);
      return true;
    }

    const deleteMatch = url.pathname.match(/^\/api\/quiz-results\/(\d+)$/);
    if (deleteMatch && request.method === "DELETE") {
      await deleteResult(request, response, deps, deleteMatch[1]);
      return true;
    }

    return false;
  } catch (error) {
    sendJson(response, 500, {
      error: error.message || "Quiz results API error"
    });
    return true;
  }
}

module.exports = {
  handleQuizResultsApi
};
