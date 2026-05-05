const { connectDatabase } = require("../config/database");
const QuizResult = require("../models/QuizResult");

function cleanString(value, fallback = "") {
  const cleaned = String(value || "").trim();
  return cleaned || fallback;
}

function serializeQuizResult(result) {
  return {
    id: result._id.toString(),
    matricule: result.matricule,
    score: result.score,
    totalQuestions: result.totalQuestions,
    rate: result.rate,
    passed: result.passed,
    client: result.client || "stellantis",
    language: result.language || "fr",
    createdAt: result.createdAt
  };
}

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

  const matricule = cleanString(body.matricule);
  const score = Number(body.score);
  const totalQuestions = Number(body.totalQuestions);
  const rate = Number(body.rate);

  if (!matricule) {
    sendApiError(sendJson, response, 400, "Matricule is required");
    return;
  }

  if (!Number.isFinite(score) || !Number.isFinite(totalQuestions) || !Number.isFinite(rate)) {
    sendApiError(sendJson, response, 400, "Score, totalQuestions, and rate are required");
    return;
  }

  if (score < 0 || totalQuestions < 1 || score > totalQuestions || rate < 0 || rate > 100) {
    sendApiError(sendJson, response, 400, "Invalid quiz result values");
    return;
  }

  await connectDatabase();

  const result = await QuizResult.create({
    matricule,
    score,
    totalQuestions,
    rate,
    passed: Boolean(body.passed),
    client: cleanString(body.client, "stellantis"),
    language: cleanString(body.language, "fr"),
    createdAt: new Date()
  });

  sendJson(response, 201, {
    result: serializeQuizResult(result)
  });
}

async function listQuizResults(request, response, deps) {
  const { requireAdmin, sendJson } = deps;

  if (!requireAdmin(request, response)) {
    return;
  }

  await connectDatabase();
  const results = await QuizResult.find().sort({ createdAt: -1 }).limit(500).lean();

  sendJson(response, 200, {
    results: results.map(serializeQuizResult)
  });
}

async function handleQuizResultsApi(request, response, url, deps) {
  const { sendJson } = deps;

  try {
    if (url.pathname === "/api/quiz-results" && request.method === "POST") {
      await createQuizResult(request, response, deps);
      return true;
    }

    if (url.pathname === "/api/quiz-results" && request.method === "GET") {
      await listQuizResults(request, response, deps);
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
