const crypto = require("crypto");
const { readComplaints, writeComplaints } = require("../services/complaintStore");
const { uploadComplaintImages, cleanupUploadedImages, deleteImagesByUrl } = require("../services/cloudinaryImages");

const VALID_TYPES = new Set(["message", "recommendation", "complaint"]);
const VALID_STATUSES = new Set(["pending", "in_progress", "resolved"]);
const VALID_PRIORITIES = new Set(["formal", "informal", "communication"]);

function cleanString(value, fallback = "") {
  const cleaned = String(value || "").trim();
  return cleaned || fallback;
}

function createId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function serializeComplaint(complaint) {
  return {
    id: complaint.id,
    name: complaint.name,
    type: complaint.type,
    subject: complaint.subject,
    details: complaint.details,
    imageUrls: complaint.imageUrls || [],
    status: complaint.status,
    client: complaint.client || "stellantis",
    line: complaint.line || "",
    lineValue: complaint.lineValue || "",
    priority: complaint.type === "complaint" ? complaint.priority || "formal" : "",
    senderPhone: complaint.senderPhone || "",
    workDate: complaint.workDate || "",
    workWeek: complaint.workWeek || "",
    createdAt: complaint.createdAt
  };
}

function sendApiError(sendJson, response, statusCode, message) {
  sendJson(response, statusCode, {
    error: message
  });
}

async function listComplaints(response, sendJson) {
  const complaints = await readComplaints();
  const sortedComplaints = [...complaints].sort((first, second) => {
    return new Date(second.createdAt || 0) - new Date(first.createdAt || 0);
  });

  sendJson(response, 200, {
    complaints: sortedComplaints.map(serializeComplaint)
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
  const priority = type === "complaint" ? cleanString(body.priority, "formal") : "";
  const workDate = cleanString(body.workDate);
  const workWeek = cleanString(body.workWeek);

  if (!VALID_TYPES.has(type)) {
    sendApiError(sendJson, response, 400, "Invalid complaint type");
    return;
  }

  if (!subject || !details) {
    sendApiError(sendJson, response, 400, "Subject and details are required");
    return;
  }

  if (type === "complaint" && !VALID_PRIORITIES.has(priority)) {
    sendApiError(sendJson, response, 400, "Invalid priority");
    return;
  }

  let uploadedImages = [];

  try {
    uploadedImages = await uploadComplaintImages(body.images || body.attachments || []);
    const complaints = await readComplaints();
    const complaint = {
      id: createId(),
      name,
      type,
      subject,
      details,
      imageUrls: uploadedImages.map((image) => image.url),
      status: "pending",
      client: cleanString(body.client, "stellantis"),
      line: cleanString(body.line),
      lineValue: cleanString(body.lineValue),
      priority,
      senderPhone: cleanString(body.senderPhone),
      workDate,
      workWeek,
      createdAt: new Date().toISOString()
    };

    complaints.push(complaint);
    await writeComplaints(complaints);

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

  const complaints = await readComplaints();
  const complaint = complaints.find((item) => item.id === complaintId);

  if (!complaint) {
    sendApiError(sendJson, response, 404, "Complaint not found");
    return;
  }

  if (Array.isArray(complaint.imageUrls) && complaint.imageUrls.length) {
    await deleteImagesByUrl(complaint.imageUrls);
  }

  await writeComplaints(complaints.filter((item) => item.id !== complaintId));

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

  const complaints = await readComplaints();
  const index = complaints.findIndex((item) => item.id === complaintId);

  if (index === -1) {
    sendApiError(sendJson, response, 404, "Complaint not found");
    return;
  }

  complaints[index] = {
    ...complaints[index],
    status
  };
  await writeComplaints(complaints);

  sendJson(response, 200, {
    complaint: serializeComplaint(complaints[index])
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

    const deleteMatch = url.pathname.match(/^\/api\/complaints\/([^/]+)$/);
    if (deleteMatch && request.method === "DELETE") {
      await deleteComplaint(request, response, deps, decodeURIComponent(deleteMatch[1]));
      return true;
    }

    const statusMatch = url.pathname.match(/^\/api\/complaints\/([^/]+)\/status$/);
    if (statusMatch && request.method === "PATCH") {
      await updateComplaintStatus(request, response, deps, decodeURIComponent(statusMatch[1]));
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
