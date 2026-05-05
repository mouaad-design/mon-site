const { connectDatabase } = require("../config/database");
const Complaint = require("../models/Complaint");
const { uploadComplaintImages, cleanupUploadedImages, deleteImagesByUrl } = require("../services/cloudinaryImages");

const VALID_TYPES = new Set(Complaint.VALID_TYPES);
const VALID_STATUSES = new Set(Complaint.VALID_STATUSES);
const OBJECT_ID_PATTERN = "[a-f0-9]{24}";

function cleanString(value, fallback = "") {
  const cleaned = String(value || "").trim();
  return cleaned || fallback;
}

function serializeComplaint(complaint) {
  return {
    id: complaint._id.toString(),
    name: complaint.name,
    type: complaint.type,
    subject: complaint.subject,
    details: complaint.details,
    imageUrls: complaint.imageUrls || [],
    status: complaint.status,
    client: complaint.client || "stellantis",
    line: complaint.line || "",
    lineValue: complaint.lineValue || "",
    priority: complaint.priority || "normal",
    senderPhone: complaint.senderPhone || "",
    createdAt: complaint.createdAt
  };
}

function getRouteMatch(pathname, pattern) {
  return pathname.match(new RegExp(pattern, "i"));
}

function sendApiError(sendJson, response, statusCode, message) {
  sendJson(response, statusCode, {
    error: message
  });
}

async function listComplaints(response, sendJson) {
  await connectDatabase();
  const complaints = await Complaint.find().sort({ createdAt: -1 }).lean();

  sendJson(response, 200, {
    complaints: complaints.map(serializeComplaint)
  });
}

async function createComplaint(request, response, deps) {
  const { readRequestBody, sendJson } = deps;
  let body = {};

  try {
    body = JSON.parse((await readRequestBody(request)) || "{}");
  } catch {
    sendApiError(sendJson, response, 400, "Invalid JSON payload");
    return;
  }

  const type = cleanString(body.type, "message");
  const subject = cleanString(body.subject);
  const details = cleanString(body.details);
  const name = cleanString(body.name, cleanString(body.line, "Atelier"));

  if (!VALID_TYPES.has(type)) {
    sendApiError(sendJson, response, 400, "Invalid complaint type");
    return;
  }

  if (!subject || !details) {
    sendApiError(sendJson, response, 400, "Subject and details are required");
    return;
  }

  let uploadedImages = [];

  try {
    await connectDatabase();
    uploadedImages = await uploadComplaintImages(body.images || body.attachments || []);

    const complaint = await Complaint.create({
      name,
      type,
      subject,
      details,
      imageUrls: uploadedImages.map((image) => image.url),
      status: "pending",
      client: cleanString(body.client, "stellantis"),
      line: cleanString(body.line),
      lineValue: cleanString(body.lineValue),
      priority: cleanString(body.priority, "normal"),
      senderPhone: cleanString(body.senderPhone),
      createdAt: new Date()
    });

    sendJson(response, 201, {
      complaint: serializeComplaint(complaint)
    });
  } catch (error) {
    if (uploadedImages.length) {
      await cleanupUploadedImages(uploadedImages);
    }

    sendApiError(sendJson, response, 400, error.message || "Unable to create complaint");
  }
}

async function deleteComplaint(request, response, deps, complaintId) {
  const { requireAdmin, sendJson } = deps;

  if (!requireAdmin(request, response)) {
    return;
  }

  await connectDatabase();
  const complaint = await Complaint.findById(complaintId).lean();

  if (!complaint) {
    sendApiError(sendJson, response, 404, "Complaint not found");
    return;
  }

  if (Array.isArray(complaint.imageUrls) && complaint.imageUrls.length) {
    await deleteImagesByUrl(complaint.imageUrls);
  }

  await Complaint.findByIdAndDelete(complaintId);

  sendJson(response, 200, {
    ok: true
  });
}

async function updateComplaintStatus(request, response, deps, complaintId) {
  const { readRequestBody, requireAdmin, sendJson } = deps;

  if (!requireAdmin(request, response)) {
    return;
  }

  let body = {};

  try {
    body = JSON.parse((await readRequestBody(request)) || "{}");
  } catch {
    sendApiError(sendJson, response, 400, "Invalid JSON payload");
    return;
  }

  const status = cleanString(body.status);

  if (!VALID_STATUSES.has(status)) {
    sendApiError(sendJson, response, 400, "Invalid complaint status");
    return;
  }

  await connectDatabase();
  const complaint = await Complaint.findByIdAndUpdate(
    complaintId,
    { status },
    {
      new: true,
      runValidators: true
    }
  ).lean();

  if (!complaint) {
    sendApiError(sendJson, response, 404, "Complaint not found");
    return;
  }

  sendJson(response, 200, {
    complaint: serializeComplaint(complaint)
  });
}

async function handleComplaintsApi(request, response, url, deps) {
  const { sendJson } = deps;

  try {
    if (url.pathname === "/api/complaints" && request.method === "GET") {
      await listComplaints(response, sendJson);
      return true;
    }

    if (url.pathname === "/api/complaints" && request.method === "POST") {
      await createComplaint(request, response, deps);
      return true;
    }

    const deleteMatch = getRouteMatch(url.pathname, `^/api/complaints/(${OBJECT_ID_PATTERN})$`);
    if (deleteMatch && request.method === "DELETE") {
      await deleteComplaint(request, response, deps, deleteMatch[1]);
      return true;
    }

    const statusMatch = getRouteMatch(url.pathname, `^/api/complaints/(${OBJECT_ID_PATTERN})/status$`);
    if (statusMatch && request.method === "PATCH") {
      await updateComplaintStatus(request, response, deps, statusMatch[1]);
      return true;
    }

    return false;
  } catch (error) {
    sendJson(response, 500, {
      error: error.message || "Complaint API error"
    });
    return true;
  }
}

module.exports = {
  handleComplaintsApi
};
