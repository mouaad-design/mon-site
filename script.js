const STORAGE_KEY = "sc-training-home-lang";
const LOCATION_ACCESS_KEY = "sc-training-location-access";
const CLIENT_STORAGE_KEY = "sc-training-client";
const SUPPORT_STORAGE_KEY = "sc-training-support-items";
const COMPANY_LAT = 34.304222;
const COMPANY_LNG = -6.390333;
const ALLOWED_RADIUS_METERS = 150;
const PRACTICAL_RADIUS_METERS = 150;
const MAX_ACCURACY_BONUS_METERS = 180;
const MAX_LOCATION_ATTEMPTS = 3;

const langButtons = document.querySelectorAll(".lang-btn");
const translatableNodes = document.querySelectorAll("[data-i18n]");
const revealNodes = document.querySelectorAll(".reveal-section");
const clientCardNodes = document.querySelectorAll("[data-client]");
const clientNameNodes = document.querySelectorAll("[data-client-name]");
const clientLogoNodes = document.querySelectorAll("[data-client-logo]");
const documentActionNodes = document.querySelectorAll("[data-doc-action]");
const supportActionNodes = document.querySelectorAll("[data-support-action]");
const documentFrameNode = document.querySelector("[data-doc-frame]");
const documentVideoNode = document.querySelector("[data-doc-video]");
const documentFrameWrapNode = document.querySelector("[data-doc-frame-wrap]");
const documentClientNameNode = document.querySelector("[data-doc-client-name]");
const documentPageKickerNode = document.querySelector("[data-doc-page-kicker]");
const documentPageTitleNode = document.querySelector("[data-doc-page-title]");
const documentSectionNameNode = document.querySelector("[data-doc-section-name]");
const documentListNode = document.querySelector("[data-doc-list]");
const documentUploadWrapNode = document.querySelector("[data-doc-upload-wrap]");
const documentUploadHintNode = document.querySelector("[data-doc-upload-hint]");
const documentFullscreenButtonNode = document.querySelector("[data-doc-fullscreen-button]");
const documentClosePreviewNode = document.querySelector("[data-doc-close-preview]");
const documentUploadInputNode = document.querySelector("[data-doc-upload-input]");
const documentVideoUploadWrapNode = document.querySelector("[data-doc-video-upload-wrap]");
const documentVideoUploadInputNode = document.querySelector("[data-doc-video-upload-input]");
const documentStatusNodes = document.querySelectorAll("[data-doc-status]");
const supportClientNameNode = document.querySelector("[data-support-client-name]");
const supportFormNode = document.querySelector("[data-support-form]");
const supportTypeInputNode = document.querySelector("[data-support-type-input]");
const supportTypeCardNodes = document.querySelectorAll("[data-support-type-card]");
const supportNameInputNode = document.querySelector("[data-support-name-input]");
const supportPriorityInputNode = document.querySelector("[data-support-priority-input]");
const supportPhoneInputNode = document.querySelector("[data-support-phone-input]");
const supportAreaInputNode = document.querySelector("[data-support-area-input]");
const supportSubjectInputNode = document.querySelector("[data-support-subject-input]");
const supportDetailsInputNode = document.querySelector("[data-support-details-input]");
const supportCopyButtonNode = document.querySelector("[data-support-copy-button]");
const supportStatusNode = document.querySelector("[data-support-status]");
const supportHistoryNode = document.querySelector("[data-support-history]");
const verifyLocationBtn = document.getElementById("verifyLocationBtn");
const testAccessBtn = document.getElementById("testAccessBtn");
const locationStatus = document.getElementById("locationStatus");
const locationDetail = document.getElementById("locationDetail");
const gpsCard = document.querySelector(".gps-card");

let locationStatusKey = locationStatus ? locationStatus.dataset.i18n || "locationWaiting" : "";
let locationStatusState = locationStatus ? locationStatus.dataset.state || "info" : "info";
let verifyButtonKey = "locationButton";
let verifyButtonDisabled = false;
let verifyButtonResetTimer = null;
let geolocationRetryCount = 0;
let locationAttemptCount = 0;
let locationRequestInProgress = false;
let supportStatusKey = "supportStatusIdle";
let uploadedDocuments = [];
let uploadedDocumentCounter = 0;
let documentSelectionOverride = "";

const documentLibraries = {
  stellantis: {
    quality: [
      {
        id: "cs-operateur",
        title: "Fichier CS operateur",
        path: "documents/stellantis/fichier%20CS%20operateur.pdf"
      },
      {
        id: "caracteres-speciaux-arabe",
        title: "CARACTERES SPECIAUX arabe",
        path: "documents/stellantis/caracteres-speciaux-arabe.pdf"
      },
      {
        id: "mapping-charge-ar-v2",
        title: "Mapping charge AR version 2",
        path: "documents/stellantis/mapping%20charge%20AR%20version%202.pdf"
      }
    ],
    training: [
      {
        id: "presentation-operateur",
        title: "Presentation operateur",
        path: "documents/stellantis/presentation-operateur.pdf"
      }
    ]
  }
};

function getText(lang, key) {
  return (translations[lang] && translations[lang][key]) || translations.fr[key] || "";
}

function normalizeDocumentSection(section) {
  if (section === "training" || section === "tutorials" || section === "quiz") {
    return section;
  }

  return "quality";
}

function getDocumentLibrary(client, section = "quality") {
  const normalizedSection = normalizeDocumentSection(section);
  const clientLibrary = documentLibraries[client];

  if (!clientLibrary) {
    return [];
  }

  return clientLibrary[normalizedSection] || [];
}

function getDocumentSectionLabelKey(section = "quality") {
  const normalizedSection = normalizeDocumentSection(section);

  if (normalizedSection === "training") {
    return "dashboardCard1Title";
  }

  if (normalizedSection === "quiz") {
    return "dashboardCard2Title";
  }

  if (normalizedSection === "tutorials") {
    return "dashboardCard3Title";
  }

  return "dashboardCard4Title";
}

function isTutorialSection(section = "quality") {
  return normalizeDocumentSection(section) === "tutorials";
}

function isVideoDocument(documentItem) {
  if (!documentItem) {
    return false;
  }

  if (documentItem.mediaType) {
    return documentItem.mediaType.startsWith("video/");
  }

  return /\.(mp4|webm|ogg|mov)$/i.test(documentItem.path || "");
}

function resetDocumentPreview() {
  if (documentFrameNode) {
    documentFrameNode.removeAttribute("src");
    documentFrameNode.hidden = true;
  }

  if (documentVideoNode) {
    documentVideoNode.pause();
    documentVideoNode.removeAttribute("src");
    documentVideoNode.load();
    documentVideoNode.hidden = true;
  }
}

function isDocumentPreviewFullscreen() {
  return document.fullscreenElement === documentFrameWrapNode;
}

function syncPreviewFullscreenState(lang = document.documentElement.lang || "fr") {
  const isFullscreen = isDocumentPreviewFullscreen();

  if (documentClosePreviewNode) {
    documentClosePreviewNode.hidden = !isFullscreen;
  }

  if (documentFullscreenButtonNode) {
    documentFullscreenButtonNode.textContent = isFullscreen
      ? getText(lang, "documentPageExitFullscreen")
      : getText(lang, "documentPageFullscreen");
  }
}

async function openDocumentPreviewInFullscreen() {
  if (!documentFrameWrapNode || documentFrameWrapNode.hidden) {
    return;
  }

  try {
    if (isDocumentPreviewFullscreen()) {
      await document.exitFullscreen();
    } else {
      await documentFrameWrapNode.requestFullscreen();
    }
  } catch {
    // Ignore fullscreen errors to keep the page usable.
  } finally {
    syncPreviewFullscreenState();
  }
}

function setLocationStatus(message, state = "info", key = "") {
  if (!locationStatus) {
    return;
  }

  locationStatus.textContent = message;
  locationStatus.dataset.state = state;
  locationStatusState = state;

  if (gpsCard) {
    gpsCard.dataset.state = state;
  }

  if (key) {
    locationStatusKey = key;
  }
}

function setLocationDetail(message = "") {
  if (!locationDetail) {
    return;
  }

  locationDetail.textContent = message;
}

function buildLocationDetail(lang, distance, radius, accuracy = 0) {
  const roundedDistance = Math.round(distance);
  const roundedRadius = Math.round(radius);
  const roundedAccuracy = Math.round(accuracy || 0);

  if (lang === "ar") {
    return `\u0627\u0644\u0645\u0633\u0627\u0641\u0629 \u0627\u0644\u0645\u0643\u062a\u0634\u0641\u0629: ${roundedDistance} \u0645 | \u0627\u0644\u0646\u0637\u0627\u0642 \u0627\u0644\u0645\u0639\u062a\u0645\u062f: ${roundedRadius} \u0645 | \u0627\u0644\u062f\u0642\u0629: ${roundedAccuracy} \u0645`;
  }

  if (lang === "en") {
    return `Detected distance: ${roundedDistance} m | Allowed radius: ${roundedRadius} m | Accuracy: ${roundedAccuracy} m`;
  }

  return `Distance detectee : ${roundedDistance} m | Rayon autorise : ${roundedRadius} m | Precision : ${roundedAccuracy} m`;
}


function setLocationStatusByKey(lang, key, state = "info") {
  setLocationStatus(getText(lang, key), state, key);
}

function setVerifyButtonLabel(lang, key, disabled = false) {
  if (!verifyLocationBtn) {
    return;
  }

  verifyButtonKey = key;
  verifyButtonDisabled = disabled;
  verifyLocationBtn.textContent = getText(lang, key);
  verifyLocationBtn.disabled = disabled;
}

function openDashboard() {
  window.location.href = "dashboard.html";
}

function openClientSelection() {
  window.location.href = "clients.html";
}

function openSupportCenter(client = "") {
  const params = new URLSearchParams();
  params.set("client", client || getStoredClient());
  window.location.href = `support-center.html?${params.toString()}`;
}

function openDocumentViewer(documentPath = "", client = "", section = "quality") {
  documentSelectionOverride = "";
  const params = new URLSearchParams();
  const normalizedSection = normalizeDocumentSection(section);

  if (documentPath) {
    params.set("doc", documentPath);
  }

  if (client) {
    params.set("client", client);
  }

  params.set("section", normalizedSection);

  window.location.href = `document-viewer.html${params.toString() ? `?${params.toString()}` : ""}`;
}

function getStoredClient() {
  return localStorage.getItem(CLIENT_STORAGE_KEY) || "stellantis";
}

function getSupportEntries() {
  try {
    const rawEntries = localStorage.getItem(SUPPORT_STORAGE_KEY);
    const parsedEntries = JSON.parse(rawEntries || "[]");
    return Array.isArray(parsedEntries) ? parsedEntries : [];
  } catch {
    return [];
  }
}

function saveSupportEntries(entries) {
  localStorage.setItem(SUPPORT_STORAGE_KEY, JSON.stringify(entries.slice(0, 120)));
}

function getSupportCenterConfig() {
  const params = new URLSearchParams(window.location.search);
  const client = params.get("client") || getStoredClient();
  const entries = getSupportEntries()
    .filter((entry) => entry.client === client)
    .sort((firstEntry, secondEntry) => {
      return new Date(secondEntry.createdAt).getTime() - new Date(firstEntry.createdAt).getTime();
    });

  return {
    client,
    entries
  };
}

function getSupportTypeLabelKey(type = "message") {
  if (type === "recommendation") {
    return "supportTypeRecommendation";
  }

  if (type === "complaint") {
    return "supportTypeComplaint";
  }

  return "supportTypeMessage";
}

function getSupportPriorityLabelKey(priority = "normal") {
  if (priority === "urgent") {
    return "supportPriorityUrgent";
  }

  if (priority === "high") {
    return "supportPriorityHigh";
  }

  return "supportPriorityNormal";
}

function updateSupportTypeCards(type = "message") {
  if (supportTypeInputNode) {
    supportTypeInputNode.value = type;
  }

  supportTypeCardNodes.forEach((card) => {
    const isActive = card.dataset.supportType === type;
    card.classList.toggle("is-active", isActive);
    card.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function updateSupportStatus(lang, key, state = "info") {
  if (!supportStatusNode) {
    return;
  }

  supportStatusKey = key;
  supportStatusNode.dataset.state = state;
  supportStatusNode.textContent = getText(lang, key);
}

function formatSupportDate(value, lang) {
  if (!value) {
    return "";
  }

  try {
    const locale = lang === "ar" ? "ar-MA" : lang === "en" ? "en-US" : "fr-MA";
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function buildSupportDraft(client) {
  return {
    client,
    type: (supportTypeInputNode && supportTypeInputNode.value) || "message",
    priority: (supportPriorityInputNode && supportPriorityInputNode.value) || "normal",
    senderPhone: (supportPhoneInputNode && supportPhoneInputNode.value.trim()) || "",
    area: (supportAreaInputNode && supportAreaInputNode.value.trim()) || "",
    subject: (supportSubjectInputNode && supportSubjectInputNode.value.trim()) || "",
    details: (supportDetailsInputNode && supportDetailsInputNode.value.trim()) || "",
    createdAt: new Date().toISOString()
  };
}

function buildSupportMessage(entry, lang) {
  const lines = [
    `${getText(lang, "supportLabelClient")}: ${getText(lang, getClientTranslationKey(entry.client || "stellantis"))}`,
    `${getText(lang, "supportLabelType")}: ${getText(lang, getSupportTypeLabelKey(entry.type || "message"))}`,
    `${getText(lang, "supportFieldPriority")}: ${getText(lang, getSupportPriorityLabelKey(entry.priority || "normal"))}`
  ];

  if (entry.senderPhone) {
    lines.push(`${getText(lang, "supportFieldPhone")}: ${entry.senderPhone}`);
  }

  if (entry.area) {
    lines.push(`${getText(lang, "supportFieldArea")}: ${entry.area}`);
  }

  lines.push(`${getText(lang, "supportFieldSubject")}: ${entry.subject || ""}`);
  lines.push(`${getText(lang, "supportFieldDetails")}: ${entry.details || ""}`);

  if (entry.createdAt) {
    lines.push(`${getText(lang, "supportLabelDate")}: ${formatSupportDate(entry.createdAt, lang)}`);
  }

  return lines.join("\n");
}

async function copyTextToClipboard(text) {
  if (!text) {
    return false;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below.
    }
  }

  const helperTextarea = document.createElement("textarea");
  helperTextarea.value = text;
  helperTextarea.setAttribute("readonly", "true");
  helperTextarea.style.position = "fixed";
  helperTextarea.style.opacity = "0";
  document.body.appendChild(helperTextarea);
  helperTextarea.select();
  helperTextarea.setSelectionRange(0, helperTextarea.value.length);

  let copied = false;

  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  helperTextarea.remove();
  return copied;
}

function renderSupportHistory(lang) {
  if (!supportHistoryNode) {
    return;
  }

  const { entries } = getSupportCenterConfig();
  supportHistoryNode.innerHTML = "";

  if (!entries.length) {
    const emptyNode = document.createElement("p");
    emptyNode.className = "support-history-empty";
    emptyNode.textContent = getText(lang, "supportHistoryEmpty");
    supportHistoryNode.appendChild(emptyNode);
    return;
  }

  entries.forEach((entry) => {
    const itemNode = document.createElement("article");
    itemNode.className = "support-history-item";

    const topNode = document.createElement("div");
    topNode.className = "support-history-item__top";

    const badgesNode = document.createElement("div");
    badgesNode.className = "support-history-item__badges";

    const typeBadgeNode = document.createElement("span");
    typeBadgeNode.className = "support-history-item__badge";
    typeBadgeNode.textContent = getText(lang, getSupportTypeLabelKey(entry.type));

    const priorityBadgeNode = document.createElement("span");
    priorityBadgeNode.className = "support-history-item__badge support-history-item__badge--priority";
    priorityBadgeNode.textContent = getText(lang, getSupportPriorityLabelKey(entry.priority));

    badgesNode.append(typeBadgeNode, priorityBadgeNode);

    const dateNode = document.createElement("span");
    dateNode.className = "support-history-item__date";
    dateNode.textContent = formatSupportDate(entry.createdAt, lang);

    topNode.append(badgesNode, dateNode);

    const subjectNode = document.createElement("h3");
    subjectNode.className = "support-history-item__subject";
    subjectNode.textContent = entry.subject || getText(lang, "supportFieldSubject");

    const detailsNode = document.createElement("p");
    detailsNode.className = "support-history-item__details";
    detailsNode.textContent = entry.details || "";

    const metaValues = [entry.area, entry.senderPhone].filter(Boolean);

    itemNode.append(topNode, subjectNode, detailsNode);

    if (metaValues.length) {
      const metaNode = document.createElement("div");
      metaNode.className = "support-history-item__meta";

      metaValues.forEach((value) => {
        const metaPillNode = document.createElement("span");
        metaPillNode.textContent = value;
        metaNode.appendChild(metaPillNode);
      });

      itemNode.appendChild(metaNode);
    }

    supportHistoryNode.appendChild(itemNode);
  });
}

function updateSupportCenter(lang) {
  if (!supportFormNode) {
    return;
  }

  const { client } = getSupportCenterConfig();
  const translatedClientName = getText(lang, getClientTranslationKey(client));
  const currentSupportType = (supportTypeInputNode && supportTypeInputNode.value) || "message";

  localStorage.setItem(CLIENT_STORAGE_KEY, client);
  updateDashboardClientTheme(client);

  if (supportClientNameNode) {
    supportClientNameNode.textContent = translatedClientName;
  }

  if (supportPhoneInputNode) {
    supportPhoneInputNode.placeholder = getText(lang, "supportPlaceholderPhone");
  }

  if (supportAreaInputNode) {
    supportAreaInputNode.placeholder = getText(lang, "supportPlaceholderArea");
  }

  if (supportSubjectInputNode) {
    supportSubjectInputNode.placeholder = getText(lang, "supportPlaceholderSubject");
  }

  if (supportDetailsInputNode) {
    supportDetailsInputNode.placeholder = getText(lang, "supportPlaceholderDetails");
  }

  updateSupportTypeCards(currentSupportType);
  renderSupportHistory(lang);
  updateSupportStatus(lang, supportStatusKey, (supportStatusNode && supportStatusNode.dataset.state) || "info");
}

function setupSupportCenter() {
  if (!supportFormNode) {
    return;
  }

  supportTypeCardNodes.forEach((card) => {
    card.addEventListener("click", () => {
      updateSupportTypeCards(card.dataset.supportType || "message");
    });
  });

  supportFormNode.addEventListener("submit", (event) => {
    event.preventDefault();

    const lang = document.documentElement.lang || "fr";
    const { client } = getSupportCenterConfig();
    const entry = {
      id: `support-${Date.now()}`,
      ...buildSupportDraft(client)
    };

    if (!entry.subject || !entry.details) {
      updateSupportStatus(lang, "supportStatusMissing", "error");
      return;
    }

    const entries = getSupportEntries();
    entries.unshift(entry);
    saveSupportEntries(entries);

    if (supportSubjectInputNode) {
      supportSubjectInputNode.value = "";
    }

    if (supportDetailsInputNode) {
      supportDetailsInputNode.value = "";
    }

    updateSupportStatus(lang, "supportStatusSaved", "success");
    renderSupportHistory(lang);
  });

  if (supportCopyButtonNode) {
    supportCopyButtonNode.addEventListener("click", async () => {
      const lang = document.documentElement.lang || "fr";
      const { client } = getSupportCenterConfig();
      const draftEntry = buildSupportDraft(client);

      if (!draftEntry.subject || !draftEntry.details) {
        updateSupportStatus(lang, "supportStatusMissing", "error");
        return;
      }

      const copied = await copyTextToClipboard(buildSupportMessage(draftEntry, lang));
      updateSupportStatus(
        lang,
        copied ? "supportStatusCopied" : "supportStatusCopyFailed",
        copied ? "success" : "error"
      );
    });
  }
}

function getClientDocuments(client, section = "quality") {
  const normalizedSection = normalizeDocumentSection(section);
  const baseDocuments = getDocumentLibrary(client, normalizedSection);
  const localDocuments = uploadedDocuments.filter(
    (documentItem) => documentItem.client === client && documentItem.section === normalizedSection
  );
  return [...baseDocuments, ...localDocuments];
}

function updateDocumentActions(client) {
  if (!documentActionNodes.length) {
    return;
  }

  documentActionNodes.forEach((button) => {
    const section = normalizeDocumentSection(button.dataset.docSection || "quality");
    const isLocked = button.dataset.docLocked === "true";
    button.dataset.docPath = "";
    button.dataset.docClient = client;
    button.dataset.docSection = section;
    button.disabled = isLocked;
    button.setAttribute("aria-disabled", isLocked ? "true" : "false");
  });
}

function openClientDocument(documentPath, client = "", section = "quality") {
  openDocumentViewer(documentPath, client, section);
}

function getDocumentViewerConfig() {
  const params = new URLSearchParams(window.location.search);
  const client = params.get("client") || getStoredClient();
  const section = normalizeDocumentSection(params.get("section") || "quality");
  const documents = getClientDocuments(client, section);
  const requestedPath = params.get("doc");
  const selectedPath = documentSelectionOverride || requestedPath;
  const activeDocument =
    (selectedPath ? documents.find((documentItem) => documentItem.path === selectedPath) : null) ||
    null;

  return {
    client,
    section,
    documents,
    documentPath: activeDocument ? activeDocument.path : "",
    activeDocumentId: activeDocument ? activeDocument.id : "",
    activeDocument
  };
}

function getDocumentViewerPageUrl(client, documentPath = "", section = "quality") {
  const params = new URLSearchParams();
  params.set("client", client);
  params.set("section", normalizeDocumentSection(section));

  if (documentPath && !documentPath.startsWith("blob:")) {
    params.set("doc", documentPath);
  }

  return `document-viewer.html?${params.toString()}`;
}

function selectDocument(documentPath, client, section = "quality") {
  documentSelectionOverride = documentPath;
  window.history.replaceState({}, "", getDocumentViewerPageUrl(client, documentPath, section));
  updateDocumentViewer(document.documentElement.lang || "fr");
}

function addUploadedDocuments(files, client, section = "quality") {
  if (!files || !files.length) {
    return;
  }

  const normalizedSection = normalizeDocumentSection(section);
  const acceptedFiles = Array.from(files).filter((file) => {
    const lowerName = file.name.toLowerCase();
    const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|ogg|mov)$/i.test(lowerName);
    return (
      file.type.startsWith("image/") ||
      lowerName.endsWith(".pdf") ||
      (normalizedSection === "tutorials" && isVideo)
    );
  });

  if (!acceptedFiles.length) {
    return;
  }

  const newDocuments = acceptedFiles.map((file) => {
    uploadedDocumentCounter += 1;
    return {
      id: `uploaded-${uploadedDocumentCounter}`,
      title: file.webkitRelativePath || file.name,
      path: URL.createObjectURL(file),
      mediaType: file.type || "",
      client,
      section: normalizedSection,
      isUploaded: true
    };
  });

  uploadedDocuments = [...uploadedDocuments, ...newDocuments];
  selectDocument(newDocuments[0].path, client, normalizedSection);
}

function updateDocumentViewer(lang) {
  if (!documentFrameNode) {
    return;
  }

  const { client, section, documents, documentPath, activeDocumentId, activeDocument } = getDocumentViewerConfig();
  const translatedName = getText(lang, getClientTranslationKey(client));
  const translatedSectionName = getText(lang, getDocumentSectionLabelKey(section));
  const tutorialSection = isTutorialSection(section);

  if (documentClientNameNode) {
    documentClientNameNode.textContent = translatedName;
  }

  if (documentPageKickerNode) {
    documentPageKickerNode.textContent = translatedName;
  }

  if (documentPageTitleNode) {
    documentPageTitleNode.textContent = translatedSectionName;
  }

  if (documentSectionNameNode) {
    documentSectionNameNode.textContent = translatedSectionName;
  }

  if (documentUploadInputNode) {
    documentUploadInputNode.setAttribute("accept", ".pdf,image/*");
  }

  if (documentVideoUploadWrapNode) {
    documentVideoUploadWrapNode.hidden = !tutorialSection;
    documentVideoUploadWrapNode.style.display = tutorialSection ? "" : "none";
  }

  if (documentVideoUploadInputNode) {
    documentVideoUploadInputNode.setAttribute("accept", "video/*");
    documentVideoUploadInputNode.disabled = !tutorialSection;
  }

  if (documentUploadHintNode) {
    documentUploadHintNode.textContent = tutorialSection
      ? getText(lang, "documentPageAddHintTutorial")
      : getText(lang, "documentPageAddHint");
  }

  if (documentUploadWrapNode) {
    documentUploadWrapNode.hidden = false;
  }

  if (documentListNode) {
    documentListNode.innerHTML = "";

    documents.forEach((documentItem) => {
      const link = document.createElement("button");
      link.type = "button";
      link.className = "document-viewer-doc-link";
      if (documentItem.id === activeDocumentId) {
        link.classList.add("is-active");
      }
      link.textContent = documentItem.title;
      link.addEventListener("click", () => {
        selectDocument(documentItem.path, client, section);
      });
      documentListNode.appendChild(link);
    });
  }

  const hasDocuments = documents.length > 0;
  const hasSelectedDocument = Boolean(documentPath);

  if (documentFullscreenButtonNode) {
    documentFullscreenButtonNode.disabled = !hasSelectedDocument;
  }

  syncPreviewFullscreenState(lang);

  if (hasSelectedDocument) {
    resetDocumentPreview();

    if (isVideoDocument(activeDocument)) {
      if (documentVideoNode) {
        documentVideoNode.src = documentPath;
        documentVideoNode.hidden = false;
      }
    } else {
      documentFrameNode.src = documentPath;
      documentFrameNode.hidden = false;
    }

    if (documentFrameWrapNode) {
      documentFrameWrapNode.hidden = false;
    }

    documentStatusNodes.forEach((node) => {
      node.hidden = true;
    });

    return;
  }

  resetDocumentPreview();
  if (documentFrameWrapNode) {
    documentFrameWrapNode.hidden = true;
  }

  documentStatusNodes.forEach((node) => {
    node.hidden = hasDocuments;
  });
}

function setupDocumentUpload() {
  if (documentUploadInputNode) {
    documentUploadInputNode.addEventListener("change", () => {
      const { client, section } = getDocumentViewerConfig();
      addUploadedDocuments(documentUploadInputNode.files, client, section);
      documentUploadInputNode.value = "";
    });
  }

  if (documentVideoUploadInputNode) {
    documentVideoUploadInputNode.addEventListener("change", () => {
      const { client, section } = getDocumentViewerConfig();
      if (!isTutorialSection(section)) {
        documentVideoUploadInputNode.value = "";
        return;
      }

      addUploadedDocuments(documentVideoUploadInputNode.files, client, section);
      documentVideoUploadInputNode.value = "";
    });
  }

  if (documentFullscreenButtonNode) {
    documentFullscreenButtonNode.addEventListener("click", () => {
      openDocumentPreviewInFullscreen();
    });
  }

  if (documentClosePreviewNode) {
    documentClosePreviewNode.addEventListener("click", () => {
      if (isDocumentPreviewFullscreen()) {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  document.addEventListener("fullscreenchange", () => {
    syncPreviewFullscreenState();
  });
}

function queueVerifyButtonReset(lang) {
  if (!verifyLocationBtn) {
    return;
  }

  window.clearTimeout(verifyButtonResetTimer);
  verifyButtonResetTimer = window.setTimeout(() => {
    locationRequestInProgress = false;
    setVerifyButtonLabel(lang, "locationButton", false);
  }, 1800);
}

async function getGeolocationPermissionState() {
  if (!navigator.permissions || !navigator.permissions.query) {
    return "";
  }

  try {
    const result = await navigator.permissions.query({ name: "geolocation" });
    return result.state || "";
  } catch {
    return "";
  }
}

function setLanguage(lang) {
  document.documentElement.lang = lang;
  document.body.classList.toggle("rtl", lang === "ar");
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.body.dir = lang === "ar" ? "rtl" : "ltr";

  translatableNodes.forEach((node) => {
    node.textContent = getText(lang, node.dataset.i18n);
  });

  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  updateStoredClient(lang);
  updateDocumentViewer(lang);
  updateSupportCenter(lang);
  setVerifyButtonLabel(lang, verifyButtonKey, verifyButtonDisabled);
  if (locationStatusKey) {
    setLocationStatusByKey(lang, locationStatusKey, locationStatusState);
  }

  localStorage.setItem(STORAGE_KEY, lang);
}

window.setLanguage = setLanguage;

function setupRevealAnimations() {
  if (!revealNodes.length) {
    return;
  }

  document.body.classList.add("motion-ready");

  if (!("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function getClientTranslationKey(client) {
  if (client === "volvo") {
    return "clientVolvo";
  }

  if (client === "tesla") {
    return "clientTesla";
  }

  return "clientStellantis";
}

function getClientLogoPath(client) {
  if (client === "volvo") {
    return "assets/volvo%20logo.jpg";
  }

  if (client === "tesla") {
    return "assets/Tesla%20logo.png";
  }

  return "assets/stelllantis%20logo.jpg";
}

function updateDashboardClientTheme(client) {
  if (!document.body.classList.contains("dashboard-page")) {
    return;
  }

  document.body.classList.remove(
    "dashboard-client--stellantis",
    "dashboard-client--volvo",
    "dashboard-client--tesla"
  );

  document.body.classList.add(`dashboard-client--${client}`);
}

function updateStoredClient(lang) {
  if (!clientNameNodes.length && !clientLogoNodes.length) {
    const storedClientOnly = getStoredClient();
    updateDashboardClientTheme(storedClientOnly);
    updateDocumentActions(storedClientOnly);
    return;
  }

  const storedClient = getStoredClient();
  const translatedName = getText(lang, getClientTranslationKey(storedClient));
  const logoPath = getClientLogoPath(storedClient);
  updateDashboardClientTheme(storedClient);
  updateDocumentActions(storedClient);

  clientNameNodes.forEach((node) => {
    node.textContent = translatedName;
  });

  clientLogoNodes.forEach((node) => {
    node.src = logoPath;
    node.alt = translatedName;
    node.classList.toggle("client-logo--tesla", storedClient === "tesla");
    node.classList.toggle("client-logo--volvo", storedClient === "volvo");
    node.classList.toggle("client-logo--stellantis", storedClient === "stellantis");
  });
}

function toRadians(value) {
  return value * (Math.PI / 180);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

function unlockLocationGate() {
  sessionStorage.setItem(LOCATION_ACCESS_KEY, "granted");
}

function hasLocationAccess() {
  return sessionStorage.getItem(LOCATION_ACCESS_KEY) === "granted";
}

function getEffectiveRadius(position) {
  const accuracy = Number(position.coords.accuracy) || 0;
  const accuracyBonus = Math.min(accuracy, MAX_ACCURACY_BONUS_METERS);
  return Math.max(
    ALLOWED_RADIUS_METERS,
    Math.min(PRACTICAL_RADIUS_METERS, ALLOWED_RADIUS_METERS + accuracyBonus)
  );
}

function handleLocationSuccess(position) {
  const lang = document.documentElement.lang || "fr";
  const distance = calculateDistance(
    position.coords.latitude,
    position.coords.longitude,
    COMPANY_LAT,
    COMPANY_LNG
  );
  const effectiveRadius = getEffectiveRadius(position);
  const detailMessage = buildLocationDetail(lang, distance, effectiveRadius, position.coords.accuracy);

  if (distance <= effectiveRadius) {
    unlockLocationGate();
    locationRequestInProgress = false;
    setLocationStatusByKey(lang, "locationGranted", "success");
    setLocationDetail(detailMessage);
    setVerifyButtonLabel(lang, "locationGranted", true);
    window.setTimeout(() => {
      openClientSelection();
    }, 700);
    return;
  }

  if (locationAttemptCount < MAX_LOCATION_ATTEMPTS - 1) {
    locationAttemptCount += 1;
    setLocationStatusByKey(lang, "locationRequesting", "info");
    setLocationDetail(detailMessage);
    setVerifyButtonLabel(lang, "locationRequesting", true);
    window.setTimeout(() => {
      requestLocation(true);
    }, 1200);
    return;
  }

  setLocationStatusByKey(lang, "locationDenied", "error");
  setLocationDetail(detailMessage);
  setVerifyButtonLabel(lang, "locationDenied", true);
  locationRequestInProgress = false;
  queueVerifyButtonReset(lang);
}

function handleLocationError(error, permissionState = "") {
  const lang = document.documentElement.lang || "fr";
  let errorKey = "locationError";
  const protocol = window.location.protocol;
   
  if (error.code === error.PERMISSION_DENIED) {
    errorKey = permissionState === "granted" ? "locationUnavailable" : "locationRequired";
  } else if (error.code === error.POSITION_UNAVAILABLE) {
    errorKey = "locationUnavailable";
  } else if (error.code === error.TIMEOUT) {
    errorKey = "locationTimeout";
  }

  setLocationStatusByKey(lang, errorKey, "error");
  setLocationDetail("");
  setVerifyButtonLabel(lang, errorKey, true);
  locationRequestInProgress = false;
  queueVerifyButtonReset(lang);

  if (protocol === "file:") {
    setLocationStatusByKey(lang, "locationSecureRequired", "error");
    setVerifyButtonLabel(lang, "locationSecureRequired", true);
    queueVerifyButtonReset(lang);
  }
}

function requestLocation(highAccuracy = true) {
  navigator.geolocation.getCurrentPosition(handleLocationSuccess, async (error) => {
    const lang = document.documentElement.lang || "fr";
    const permissionState = await getGeolocationPermissionState();
  
    if (permissionState === "denied") {
      handleLocationError({ code: 1 }, permissionState);
      return;
    }

    if (
      highAccuracy &&
      geolocationRetryCount === 0 &&
      (error.code === error.POSITION_UNAVAILABLE || permissionState === "granted")
    ) {
      geolocationRetryCount = 1;
      setLocationStatusByKey(lang, "locationRequesting", "info");
      setVerifyButtonLabel(lang, "locationRequesting", true);
      requestLocation(false);
      return;
      }
  
      geolocationRetryCount = 0;
      handleLocationError(error, permissionState);
    }, {
      enableHighAccuracy: highAccuracy,
      timeout: highAccuracy ? 15000 : 20000,
    maximumAge: highAccuracy ? 0 : 60000
  });
}

function setupLocationGate() {
  const isProtectedPage =
    document.body.classList.contains("home-page") ||
    document.body.classList.contains("dashboard-page") ||
    document.body.classList.contains("document-viewer-page");
  const isClientSelectPage = document.body.classList.contains("client-select-page");
  const hasAccess = hasLocationAccess();
  const lang = document.documentElement.lang || "fr";

  if (!isProtectedPage && !isClientSelectPage) {
    return;
  }

  if ((document.body.classList.contains("dashboard-page") || document.body.classList.contains("document-viewer-page") || isClientSelectPage) && !hasAccess) {
    window.location.replace("index.html");
    return;
  }

    if (document.body.classList.contains("home-page")) {
      if (hasAccess) {
        setLocationStatusByKey(lang, "locationGranted", "success");
      } else {
        setLocationStatusByKey(lang, "locationWaiting", "info");
        setLocationDetail("");
      }
    }

  if (verifyLocationBtn) {
    verifyLocationBtn.addEventListener("click", () => {
      const currentLang = document.documentElement.lang || "fr";

      if (locationRequestInProgress) {
        return;
      }

        if (!("geolocation" in navigator)) {
          setLocationStatusByKey(currentLang, "locationUnsupported", "error");
          setLocationDetail("");
          setVerifyButtonLabel(currentLang, "locationUnsupported", true);
          queueVerifyButtonReset(currentLang);
          return;
      }

      window.clearTimeout(verifyButtonResetTimer);
      geolocationRetryCount = 0;
      locationAttemptCount = 0;
        locationRequestInProgress = true;
        setVerifyButtonLabel(currentLang, "locationRequesting", true);
        setLocationStatusByKey(currentLang, "locationRequesting", "info");
        setLocationDetail("");
        requestLocation(true);
      });
    }

  if (testAccessBtn) {
    testAccessBtn.addEventListener("click", () => {
      const currentLang = document.documentElement.lang || "fr";
        unlockLocationGate();
        setLocationStatusByKey(currentLang, "testAccessGranted", "success");
        setLocationDetail("");
        setVerifyButtonLabel(currentLang, "locationGranted", true);
        testAccessBtn.disabled = true;

      window.setTimeout(() => {
        openClientSelection();
      }, 500);
    });
  }

  clientCardNodes.forEach((card) => {
    card.addEventListener("click", () => {
      localStorage.setItem(CLIENT_STORAGE_KEY, card.dataset.client || "stellantis");
      openDashboard();
    });
  });

  documentActionNodes.forEach((button) => {
    button.addEventListener("click", () => {
      openClientDocument(
        button.dataset.docPath || "",
        button.dataset.docClient || "",
        button.dataset.docSection || "quality"
      );
    });
  });

  supportActionNodes.forEach((button) => {
    button.addEventListener("click", () => {
      openSupportCenter(getStoredClient());
    });
  });
}

langButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.__langHandled = true;
    setLanguage(button.dataset.lang);
  });
});

document.addEventListener("click", (event) => {
  if (event.__langHandled) {
    return;
  }

  const button = event.target.closest(".lang-btn");
  if (!button) {
    return;
  }

  setLanguage(button.dataset.lang);
});


setupLocationGate();
setupDocumentUpload();
setupSupportCenter();
setupRevealAnimations();
localStorage.removeItem("sc-training-location-access-persist");
setLanguage(localStorage.getItem(STORAGE_KEY) || "fr");
