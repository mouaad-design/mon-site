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
const SUPPORT_MAX_PHOTOS = 3;
const SUPPORT_IMAGE_MAX_SIZE = 1280;
const SUPPORT_IMAGE_QUALITY = 0.78;

const langButtons = document.querySelectorAll(".lang-btn");
const translatableNodes = document.querySelectorAll("[data-i18n]");
const revealNodes = document.querySelectorAll(".reveal-section");
const clientCardNodes = document.querySelectorAll("[data-client]");
const clientNameNodes = document.querySelectorAll("[data-client-name]");
const clientLogoNodes = document.querySelectorAll("[data-client-logo]");
const documentActionNodes = document.querySelectorAll("[data-doc-action]");
const quizActionNodes = document.querySelectorAll("[data-quiz-action]");
const supportActionNodes = document.querySelectorAll("[data-support-action]");
const dashboardContentNode = document.querySelector("[data-dashboard-content]");
const documentFrameNode = document.querySelector("[data-doc-frame]");
const documentPdfNode = document.querySelector("[data-doc-pdf]");
const documentVideoNode = document.querySelector("[data-doc-video]");
const documentFrameWrapNode = document.querySelector("[data-doc-frame-wrap]");
const documentPagerNode = document.querySelector("[data-doc-pager]");
const documentPagePrevNode = document.querySelector("[data-doc-page-prev]");
const documentPageNextNode = document.querySelector("[data-doc-page-next]");
const documentPageLabelNode = document.querySelector("[data-doc-page-label]");
const documentZoomOutNode = document.querySelector("[data-doc-zoom-out]");
const documentZoomInNode = document.querySelector("[data-doc-zoom-in]");
const documentZoomResetNode = document.querySelector("[data-doc-zoom-reset]");
const documentClientNameNode = document.querySelector("[data-doc-client-name]");
const documentPageKickerNode = document.querySelector("[data-doc-page-kicker]");
const documentPageTitleNode = document.querySelector("[data-doc-page-title]");
const documentSectionNameNode = document.querySelector("[data-doc-section-name]");
const documentListNode = document.querySelector("[data-doc-list]");
const documentFullscreenButtonNode = document.querySelector("[data-doc-fullscreen-button]");
const documentClosePreviewNode = document.querySelector("[data-doc-close-preview]");
const documentStatusNodes = document.querySelectorAll("[data-doc-status]");
const supportClientNameNode = document.querySelector("[data-support-client-name]");
const supportLineStepNode = document.querySelector(".support-line-step");
const supportUnavailableNode = document.querySelector("[data-support-unavailable]");
const supportLineSelectNode = document.querySelector("[data-support-line-select]");
const supportLineInputNode = document.querySelector("[data-support-line-input]");
const supportLineStatusNode = document.querySelector("[data-support-line-status]");
const supportContentNode = document.querySelector("[data-support-content]");
const supportFormNode = document.querySelector("[data-support-form]");
const supportTypeInputNode = document.querySelector("[data-support-type-input]");
const supportTypeCardNodes = document.querySelectorAll("[data-support-type-card]");
const supportPriorityInputNode = document.querySelector("[data-support-priority-input]");
const supportPhoneInputNode = document.querySelector("[data-support-phone-input]");
const supportSubjectInputNode = document.querySelector("[data-support-subject-input]");
const supportDetailsInputNode = document.querySelector("[data-support-details-input]");
const supportPhotoInputNode = document.querySelector("[data-support-photo-input]");
const supportPhotoHelpNode = document.querySelector("[data-support-photo-help]");
const supportPhotoPreviewNode = document.querySelector("[data-support-photo-preview]");
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
let selectedSupportLine = "";
let supportPhotoItems = [];
let supportPhotoProcessing = false;
let documentSelectionOverride = "";
let pdfRenderToken = 0;
let activeGalleryItems = [];
let activeGalleryIndex = 0;
let activeDocumentZoom = 1;

const documentLibraries = {
  stellantis: {
    quality: [
      {
        id: "caracteres-speciaux-arabe",
        title: "CARACTÈRES SPÉCIAUX arabe",
        path: "./documents/stellantis/caracteres-speciaux-arabe.png",
        mediaType: "image/png"
      },
      {
        id: "cs-operateur",
        title: "Fichier CS operateur",
        path: "./documents/stellantis/fichier-cs-operateur.png",
        mediaType: "image/png"
      },
      {
        id: "mapping-charge-ar-v2",
        title: "Mapping charge AR version 2",
        path: "./documents/stellantis/mapping-charge-ar-version-2.png",
        mediaType: "image/png"
      }
    ],
    training: [
      {
        id: "presentation-operateur",
        title: "Présentation opérateur",
        path: "./documents/stellantis/presentation-operateur/Diapositive1.PNG",
        mediaType: "image/gallery",
        gallery: [
          "./documents/stellantis/presentation-operateur/Diapositive1.PNG",
          "./documents/stellantis/presentation-operateur/Diapositive2.PNG",
          "./documents/stellantis/presentation-operateur/Diapositive3.PNG",
          "./documents/stellantis/presentation-operateur/Diapositive4.PNG",
          "./documents/stellantis/presentation-operateur/Diapositive5.PNG",
          "./documents/stellantis/presentation-operateur/Diapositive6.PNG",
          "./documents/stellantis/presentation-operateur/Diapositive7.PNG",
          "./documents/stellantis/presentation-operateur/Diapositive8.PNG",
          "./documents/stellantis/presentation-operateur/Diapositive9.PNG",
          "./documents/stellantis/presentation-operateur/Diapositive10.PNG",
          "./documents/stellantis/presentation-operateur/Diapositive11.PNG",
          "./documents/stellantis/presentation-operateur/Diapositive12.PNG",
          "./documents/stellantis/presentation-operateur/Diapositive13.PNG",
          "./documents/stellantis/presentation-operateur/Diapositive14.PNG",
          "./documents/stellantis/presentation-operateur/Diapositive15.PNG",
          "./documents/stellantis/presentation-operateur/Diapositive16.PNG",
          "./documents/stellantis/presentation-operateur/Diapositive17.PNG",
          "./documents/stellantis/presentation-operateur/Diapositive18.PNG"
        ]
      }
    ],
    tutorials: [
      {
        id: "cdpo-training-module",
        title: "CDPO Training Module",
        path: "./video/stellantis/CDPO _ Training Module..mp4",
        mediaType: "video/mp4"
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

function compareDocumentTitles(firstDocument, secondDocument) {
  const firstTitle = (firstDocument.title || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const secondTitle = (secondDocument.title || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return firstTitle.localeCompare(secondTitle, "fr", {
    sensitivity: "base",
    numeric: true
  });
}

function normalizeDocumentIdentity(value = "") {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getDocumentIdentityKey(documentItem) {
  const rawTitle =
    documentItem.title ||
    decodeURIComponent((documentItem.path || "").split("/").pop() || "");

  return normalizeDocumentIdentity(rawTitle);
}

function getDocumentCollectionKey(client, section = "quality") {
  return `${client || "stellantis"}:${normalizeDocumentSection(section)}`;
}

function getDocumentFileName(path = "") {
  return decodeURIComponent(path.split("/").pop() || "");
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

function isPdfDocument(documentItem, documentPath = "") {
  const mediaType = documentItem && documentItem.mediaType ? documentItem.mediaType.toLowerCase() : "";
  const pathValue = documentPath || (documentItem && documentItem.path) || "";

  return mediaType.includes("pdf") || /\.pdf($|[?#])/i.test(pathValue);
}

function isImageDocument(documentItem, documentPath = "") {
  const mediaType = documentItem && documentItem.mediaType ? documentItem.mediaType.toLowerCase() : "";
  const pathValue = documentPath || (documentItem && documentItem.path) || "";

  return mediaType.startsWith("image/") || /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(pathValue);
}

function getProtectedPreviewPath(documentPath, documentItem) {
  if (!documentPath || !isPdfDocument(documentItem, documentPath) || documentPath.startsWith("blob:")) {
    return documentPath;
  }

  const separator = documentPath.includes("#") ? "&" : "#";
  return `${documentPath}${separator}toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
}

function isMobileDocumentViewport() {
  return window.matchMedia("(max-width: 760px)").matches;
}

function setMobileDocumentPreviewState(isMobile) {
  if (documentFrameWrapNode) {
    documentFrameWrapNode.classList.toggle("is-mobile-preview", Boolean(isMobile));
  }

  if (documentPdfNode) {
    documentPdfNode.classList.toggle("is-mobile-preview", Boolean(isMobile));
  }
}

function updatePdfPager() {
  const totalItems = activeGalleryItems.length;
  const currentItem = activeGalleryIndex + 1;
  const hasImageGallery = activeGalleryItems.length > 0;

  if (!documentPagerNode || !totalItems) {
    if (documentPagerNode) {
      documentPagerNode.hidden = true;
    }
    return;
  }

  const hasSeveralPages = totalItems > 1;
  documentPagerNode.hidden = !(hasSeveralPages || hasImageGallery);

  if (documentPageLabelNode) {
    documentPageLabelNode.textContent = `${currentItem} / ${totalItems}`;
  }

  if (documentPagePrevNode) {
    documentPagePrevNode.disabled = currentItem <= 1;
  }

  if (documentPageNextNode) {
    documentPageNextNode.disabled = currentItem >= totalItems;
  }

  if (documentZoomOutNode) {
    documentZoomOutNode.disabled = !hasImageGallery || activeDocumentZoom <= 1;
  }

  if (documentZoomInNode) {
    documentZoomInNode.disabled = !hasImageGallery || activeDocumentZoom >= 3;
  }

  if (documentZoomResetNode) {
    documentZoomResetNode.disabled = !hasImageGallery || activeDocumentZoom === 1;
    documentZoomResetNode.textContent = `${Math.round(activeDocumentZoom * 100)}%`;
  }
}

function updateDocumentImageZoom() {
  if (!documentPdfNode) {
    return;
  }

  const imageNode = documentPdfNode.querySelector(".document-viewer-image");
  if (!imageNode) {
    return;
  }

  if (activeDocumentZoom <= 1) {
    imageNode.style.width = "auto";
    imageNode.style.maxWidth = "100%";
    imageNode.style.maxHeight = "";
    return;
  }

  imageNode.style.width = `${Math.round(activeDocumentZoom * 100)}%`;
  imageNode.style.maxWidth = "none";
  imageNode.style.maxHeight = "none";
}

function setDocumentZoom(nextZoom) {
  const normalizedZoom = Math.max(1, Math.min(3, Number(nextZoom) || 1));
  activeDocumentZoom = Math.round(normalizedZoom * 100) / 100;
  updateDocumentImageZoom();
  updatePdfPager();
}

function renderImageGallerySlide(slidePath) {
  if (!documentPdfNode || !slidePath) {
    return;
  }

  setMobileDocumentPreviewState(isMobileDocumentViewport());
  documentPdfNode.classList.add("is-gallery-preview");
  const image = document.createElement("img");
  image.src = slidePath;
  image.alt = "Document image";
  image.className = "document-viewer-image";
  documentPdfNode.innerHTML = "";
  documentPdfNode.appendChild(image);
  updateDocumentImageZoom();
}

function resetDocumentPreview() {
  pdfRenderToken += 1;
  setMobileDocumentPreviewState(false);
  activeGalleryItems = [];
  activeGalleryIndex = 0;
  activeDocumentZoom = isMobileDocumentViewport() ? 1.35 : 1;
  updatePdfPager();

  if (documentFrameNode) {
    documentFrameNode.removeAttribute("src");
    documentFrameNode.hidden = true;
  }

  if (documentPdfNode) {
    documentPdfNode.classList.remove("is-gallery-preview");
    documentPdfNode.innerHTML = "";
    documentPdfNode.hidden = true;
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
  window.location.href = "./dashboard.html";
}

function openClientSelection() {
  window.location.href = "./clients.html";
}

function openSupportCenter(client = "") {
  const params = new URLSearchParams();
  params.set("client", client || getStoredClient());
  window.location.href = `./support-center.html?${params.toString()}`;
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

  window.location.href = `./document-viewer.html${params.toString() ? `?${params.toString()}` : ""}`;
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

function getCurrentSupportLineValue() {
  return (
    (supportLineSelectNode && supportLineSelectNode.value) ||
    selectedSupportLine ||
    (supportLineInputNode && supportLineInputNode.value) ||
    ""
  );
}

function doesEntryMatchSupportLine(entry, lineValue = "") {
  if (!lineValue) {
    return true;
  }

  if (entry.lineValue) {
    return entry.lineValue === lineValue;
  }

  const normalizedEntryLine = (entry.line || "").trim().toLowerCase();

  if (!normalizedEntryLine) {
    return false;
  }

  const lineLabelKey = getSupportLineLabelKey(lineValue);
  const matchingLabels = Object.keys(translations)
    .map((lang) => getText(lang, lineLabelKey).trim().toLowerCase())
    .filter(Boolean);

  return matchingLabels.includes(normalizedEntryLine);
}

function getSupportCenterConfig() {
  const params = new URLSearchParams(window.location.search);
  const client = params.get("client") || getStoredClient();
  const lineValue = getCurrentSupportLineValue();
  const entries = getSupportEntries()
    .filter((entry) => entry.client === client && doesEntryMatchSupportLine(entry, lineValue))
    .sort((firstEntry, secondEntry) => {
      return new Date(secondEntry.createdAt).getTime() - new Date(firstEntry.createdAt).getTime();
    });

  return {
    client,
    lineValue,
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

function getSupportLineLabelKey(lineValue = "") {
  if (lineValue === "charge-ar") {
    return "supportLineChargeAr";
  }

  if (lineValue === "charge-av") {
    return "supportLineChargeAv";
  }

  if (lineValue === "mel-ar") {
    return "supportLineMelAr";
  }

  if (lineValue === "mel-av") {
    return "supportLineMelAv";
  }

  if (lineValue === "jb-ctp-1") {
    return "supportLineJbCtp1";
  }

  if (lineValue === "jb-cce") {
    return "supportLineJbCce";
  }

  if (lineValue === "jb-obc") {
    return "supportLineJbObc";
  }

  if (lineValue === "jb-batt") {
    return "supportLineJbBatt";
  }

  if (lineValue === "bev-12") {
    return "supportLineBev12";
  }

  if (lineValue === "phev-multifunction") {
    return "supportLinePhevMultifunction";
  }

  if (lineValue === "phev-charge-ar") {
    return "supportLinePhevChargeAr";
  }

  if (lineValue === "j4u-grounds") {
    return "supportLineJ4uGrounds";
  }

  if (lineValue === "m182-front") {
    return "supportLineM182Front";
  }

  if (lineValue === "m182-rear") {
    return "supportLineM182Rear";
  }

  if (lineValue === "949-front") {
    return "supportLine949Front";
  }

  if (lineValue === "949-rear") {
    return "supportLine949Rear";
  }

  return "supportLinePlaceholder";
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
    line: getSelectedSupportLineLabel(),
    lineValue: selectedSupportLine || (supportLineInputNode && supportLineInputNode.value) || "",
    type: (supportTypeInputNode && supportTypeInputNode.value) || "message",
    priority: (supportPriorityInputNode && supportPriorityInputNode.value) || "normal",
    senderPhone: (supportPhoneInputNode && supportPhoneInputNode.value.trim()) || "",
    subject: (supportSubjectInputNode && supportSubjectInputNode.value.trim()) || "",
    details: (supportDetailsInputNode && supportDetailsInputNode.value.trim()) || "",
    attachments: supportPhotoItems.map((item) => ({
      name: item.name,
      type: item.type,
      dataUrl: item.dataUrl
    })),
    createdAt: new Date().toISOString()
  };
}
function buildSupportMessage(entry, lang) {
  const translatedLine =
    entry.lineValue && entry.lineValue !== ""
      ? getText(lang, getSupportLineLabelKey(entry.lineValue))
      : entry.line || "";
  const lines = [
    `${getText(lang, "supportLabelClient")}: ${getText(lang, getClientTranslationKey(entry.client || "stellantis"))}`,
    `${getText(lang, "supportLabelType")}: ${getText(lang, getSupportTypeLabelKey(entry.type || "message"))}`,
    `${getText(lang, "supportFieldPriority")}: ${getText(lang, getSupportPriorityLabelKey(entry.priority || "normal"))}`
  ];

  if (translatedLine) {
    lines.push(`${getText(lang, "supportFieldLine")}: ${translatedLine}`);
  }

  if (entry.senderPhone) {
    lines.push(`${getText(lang, "supportFieldPhone")}: ${entry.senderPhone}`);
  }

  if (Array.isArray(entry.attachments) && entry.attachments.length) {
    lines.push(`${getText(lang, "supportLabelPhotos")}: ${entry.attachments.length}`);
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

function saveSupportEntries(entries) {
  try {
    localStorage.setItem(SUPPORT_STORAGE_KEY, JSON.stringify(entries.slice(0, 120)));
    return true;
  } catch {
    return false;
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("read_error"));
    reader.readAsDataURL(file);
  });
}

function compressSupportImage(file) {
  return new Promise(async (resolve, reject) => {
    try {
      const sourceDataUrl = await readFileAsDataUrl(file);
      const image = new Image();

      image.onload = () => {
        const longestSide = Math.max(image.width, image.height) || 1;
        const scale = Math.min(1, SUPPORT_IMAGE_MAX_SIZE / longestSide);
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("canvas_error"));
          return;
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", SUPPORT_IMAGE_QUALITY);

        resolve({
          name: file.name,
          type: "image/jpeg",
          dataUrl
        });
      };

      image.onerror = () => reject(new Error("image_error"));
      image.src = sourceDataUrl;
    } catch (error) {
      reject(error);
    }
  });
}

function updateSupportPhotoHelp(lang) {
  if (!supportPhotoHelpNode) {
    return;
  }

  if (!supportPhotoItems.length) {
    supportPhotoHelpNode.textContent = getText(lang, "supportPhotoHelper");
    return;
  }

  supportPhotoHelpNode.textContent = `${supportPhotoItems.length}/${SUPPORT_MAX_PHOTOS} ${getText(lang, "supportPhotoSelected")}`;
}

function renderSupportPhotoPreview(lang) {
  if (!supportPhotoPreviewNode) {
    return;
  }

  supportPhotoPreviewNode.innerHTML = "";

  supportPhotoItems.forEach((item, index) => {
    const cardNode = document.createElement("div");
    cardNode.className = "support-photo-card";

    const imageNode = document.createElement("img");
    imageNode.src = item.dataUrl;
    imageNode.alt = item.name || getText(lang, "supportFieldPhoto");

    const metaNode = document.createElement("div");
    metaNode.className = "support-photo-card__meta";

    const nameNode = document.createElement("span");
    nameNode.className = "support-photo-card__name";
    nameNode.textContent = item.name || `${getText(lang, "supportFieldPhoto")} ${index + 1}`;

    const removeNode = document.createElement("button");
    removeNode.type = "button";
    removeNode.className = "support-photo-card__remove";
    removeNode.setAttribute("aria-label", getText(lang, "supportPhotoRemove"));
    removeNode.title = getText(lang, "supportPhotoRemove");
    removeNode.textContent = "×";
    removeNode.addEventListener("click", () => {
      supportPhotoItems.splice(index, 1);
      renderSupportPhotoPreview(document.documentElement.lang || "fr");
      updateSupportPhotoHelp(document.documentElement.lang || "fr");
    });

    metaNode.append(nameNode, removeNode);
    cardNode.append(imageNode, metaNode);
    supportPhotoPreviewNode.appendChild(cardNode);
  });

  updateSupportPhotoHelp(lang);
}

function resetSupportPhotoSelection(lang) {
  supportPhotoItems = [];
  supportPhotoProcessing = false;

  if (supportPhotoInputNode) {
    supportPhotoInputNode.value = "";
  }

  renderSupportPhotoPreview(lang);
  updateSupportPhotoHelp(lang);
}

async function handleSupportPhotoSelection(fileList, lang) {
  const files = Array.from(fileList || []).filter((file) => file && /^image\//i.test(file.type));

  if (!files.length) {
    updateSupportStatus(lang, "supportStatusPhotoType", "error");
    if (supportPhotoInputNode) {
      supportPhotoInputNode.value = "";
    }
    return;
  }

  const remainingSlots = Math.max(0, SUPPORT_MAX_PHOTOS - supportPhotoItems.length);

  if (!remainingSlots) {
    updateSupportStatus(lang, "supportStatusPhotoLimit", "error");
    if (supportPhotoInputNode) {
      supportPhotoInputNode.value = "";
    }
    return;
  }

  const filesToProcess = files.slice(0, remainingSlots);
  supportPhotoProcessing = true;
  updateSupportStatus(lang, "supportStatusPhotoProcessing", "info");

  try {
    const compressedItems = [];

    for (const file of filesToProcess) {
      const compressed = await compressSupportImage(file);
      compressedItems.push(compressed);
    }

    supportPhotoItems = supportPhotoItems.concat(compressedItems);
    renderSupportPhotoPreview(lang);

    if (files.length > remainingSlots) {
      updateSupportStatus(lang, "supportStatusPhotoLimit", "error");
    } else {
      updateSupportStatus(lang, "supportStatusPhotoReady", "success");
    }
  } catch {
    updateSupportStatus(lang, "supportStatusPhotoReadError", "error");
  } finally {
    supportPhotoProcessing = false;

    if (supportPhotoInputNode) {
      supportPhotoInputNode.value = "";
    }
  }
}

function getSelectedSupportLineLabel() {
  if (!supportLineSelectNode) {
    return "";
  }

  const selectedOption = supportLineSelectNode.options[supportLineSelectNode.selectedIndex];

  if (!selectedOption || !supportLineSelectNode.value) {
    return "";
  }

  return selectedOption.textContent.trim();
}

function updateSupportLineGate(lang) {
  if (!supportLineSelectNode || !supportContentNode) {
    return;
  }

  selectedSupportLine = supportLineSelectNode.value || "";
  const hasSelectedLine = Boolean(selectedSupportLine);

  if (supportLineInputNode) {
    supportLineInputNode.value = selectedSupportLine;
  }

  if (supportLineStepNode) {
    supportLineStepNode.classList.toggle("is-selected", hasSelectedLine);
  }

  supportContentNode.classList.toggle("is-unlocked", hasSelectedLine);
  supportContentNode.setAttribute("aria-hidden", hasSelectedLine ? "false" : "true");

  if (supportLineStatusNode) {
    supportLineStatusNode.textContent = hasSelectedLine
      ? `${getText(lang, "supportLineSelectedText")}: ${getSelectedSupportLineLabel()}`
      : getText(lang, "supportLineHelper");
  }
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
    const translatedLine =
      entry.lineValue && entry.lineValue !== ""
        ? getText(lang, getSupportLineLabelKey(entry.lineValue))
        : entry.line || "";
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

    const metaValues = [translatedLine, entry.senderPhone].filter(Boolean);

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

    if (Array.isArray(entry.attachments) && entry.attachments.length) {
      const galleryNode = document.createElement("div");
      galleryNode.className = "support-history-item__gallery";

      entry.attachments.forEach((attachment, attachmentIndex) => {
        if (!attachment || !attachment.dataUrl) {
          return;
        }

        const imageNode = document.createElement("img");
        imageNode.src = attachment.dataUrl;
        imageNode.alt = attachment.name || `${getText(lang, "supportFieldPhoto")} ${attachmentIndex + 1}`;
        galleryNode.appendChild(imageNode);
      });

      if (galleryNode.childElementCount) {
        itemNode.appendChild(galleryNode);
      }
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

  if (supportSubjectInputNode) {
    supportSubjectInputNode.placeholder = getText(lang, "supportPlaceholderSubject");
  }

  if (supportDetailsInputNode) {
    supportDetailsInputNode.placeholder = getText(lang, "supportPlaceholderDetails");
  }

  updateSupportPhotoHelp(lang);
  renderSupportPhotoPreview(lang);
  updateSupportLineGate(lang);
  updateSupportTypeCards(currentSupportType);
  renderSupportHistory(lang);
  updateSupportStatus(lang, supportStatusKey, (supportStatusNode && supportStatusNode.dataset.state) || "info");
}

function setupSupportCenter() {
  if (!supportFormNode) {
    return;
  }

  if (supportLineSelectNode) {
    supportLineSelectNode.addEventListener("change", () => {
      updateSupportCenter(document.documentElement.lang || "fr");
    });
  }

  if (supportPhotoInputNode) {
    supportPhotoInputNode.addEventListener("change", async (event) => {
      await handleSupportPhotoSelection(event.target.files, document.documentElement.lang || "fr");
    });
  }

  supportTypeCardNodes.forEach((card) => {
    card.addEventListener("click", () => {
      updateSupportTypeCards(card.dataset.supportType || "message");
    });
  });

  supportFormNode.addEventListener("submit", (event) => {
    event.preventDefault();

    const lang = document.documentElement.lang || "fr";
    updateSupportLineGate(lang);

    if (!selectedSupportLine) {
      if (supportLineSelectNode) {
        supportLineSelectNode.focus();
      }
      return;
    }

    if (supportPhotoProcessing) {
      updateSupportStatus(lang, "supportStatusPhotoProcessing", "info");
      return;
    }

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
    const saveSucceeded = saveSupportEntries(entries);

    if (!saveSucceeded) {
      updateSupportStatus(lang, "supportStatusSaveFailed", "error");
      return;
    }

    if (supportSubjectInputNode) {
      supportSubjectInputNode.value = "";
    }

    if (supportDetailsInputNode) {
      supportDetailsInputNode.value = "";
    }

    resetSupportPhotoSelection(lang);
    updateSupportStatus(lang, "supportStatusSaved", "success");
    renderSupportHistory(lang);
  });

  if (supportCopyButtonNode) {
    supportCopyButtonNode.addEventListener("click", async () => {
      const lang = document.documentElement.lang || "fr";
      updateSupportLineGate(lang);

      if (!selectedSupportLine) {
        if (supportLineSelectNode) {
          supportLineSelectNode.focus();
        }
        return;
      }

      if (supportPhotoProcessing) {
        updateSupportStatus(lang, "supportStatusPhotoProcessing", "info");
        return;
      }

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

  updateSupportPhotoHelp(document.documentElement.lang || "fr");
  updateSupportLineGate(document.documentElement.lang || "fr");
}

function getClientDocuments(client, section = "quality") {
  const normalizedSection = normalizeDocumentSection(section);
  const availableBaseDocuments = getDocumentLibrary(client, normalizedSection);
  const documentsByName = new Map();

  availableBaseDocuments.forEach((documentItem) => {
    const identityKey = getDocumentIdentityKey(documentItem);
    documentsByName.set(identityKey || documentItem.id, documentItem);
  });

  return Array.from(documentsByName.values()).sort(compareDocumentTitles);
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
    documents[0] ||
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

  return `./document-viewer.html?${params.toString()}`;
}

function selectDocument(documentPath, client, section = "quality") {
  documentSelectionOverride = documentPath;
  window.history.replaceState({}, "", getDocumentViewerPageUrl(client, documentPath, section));
  updateDocumentViewer(document.documentElement.lang || "fr");
}

function updateDocumentViewer(lang) {
  if (!documentFrameNode) {
    return;
  }

  const { client, section, documents, documentPath, activeDocumentId, activeDocument } = getDocumentViewerConfig();
  const sortedDocuments = documents.slice().sort(compareDocumentTitles);
  const translatedName = getText(lang, getClientTranslationKey(client));
  const translatedSectionName = getText(lang, getDocumentSectionLabelKey(section));

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
    documentSectionNameNode.textContent = "";
    documentSectionNameNode.hidden = true;
  }

  if (documentListNode) {
    documentListNode.innerHTML = "";

    sortedDocuments.forEach((documentItem) => {
      const item = document.createElement("div");
      item.className = "document-viewer-doc-item";

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

      item.appendChild(link);
      documentListNode.appendChild(item);
    });
  }

  const hasDocuments = sortedDocuments.length > 0;
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
        documentVideoNode.setAttribute("controlsList", "nodownload noplaybackrate");
        documentVideoNode.setAttribute("disablePictureInPicture", "");
      }
    } else if (isPdfDocument(activeDocument, documentPath)) {
      if (documentFrameNode) {
        documentFrameNode.src = getProtectedPreviewPath(documentPath, activeDocument);
        documentFrameNode.hidden = false;
      }
    } else if (activeDocument && Array.isArray(activeDocument.gallery) && activeDocument.gallery.length) {
      activeDocumentZoom = isMobileDocumentViewport() ? 1.35 : 1;
      activeGalleryItems = activeDocument.gallery.slice();
      activeGalleryIndex = 0;
      updatePdfPager();

      if (documentPdfNode) {
        documentPdfNode.hidden = false;
        renderImageGallerySlide(activeGalleryItems[activeGalleryIndex]);
      }
    } else if (isImageDocument(activeDocument, documentPath)) {
      activeDocumentZoom = isMobileDocumentViewport() ? 1.35 : 1;
      activeGalleryItems = [documentPath];
      activeGalleryIndex = 0;
      updatePdfPager();

      if (documentPdfNode) {
        documentPdfNode.hidden = false;
        renderImageGallerySlide(documentPath);
      }
    } else {
      documentFrameNode.src = getProtectedPreviewPath(documentPath, activeDocument);
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

  if (documentPagePrevNode) {
    documentPagePrevNode.addEventListener("click", async () => {
      if (activeGalleryItems.length && documentPdfNode) {
        if (activeGalleryIndex <= 0) {
          return;
        }

        activeGalleryIndex -= 1;
        updatePdfPager();
        renderImageGallerySlide(activeGalleryItems[activeGalleryIndex]);
        return;
      }

      return;
    });
  }

  if (documentPageNextNode) {
    documentPageNextNode.addEventListener("click", async () => {
      if (activeGalleryItems.length && documentPdfNode) {
        if (activeGalleryIndex >= activeGalleryItems.length - 1) {
          return;
        }

        activeGalleryIndex += 1;
        updatePdfPager();
        renderImageGallerySlide(activeGalleryItems[activeGalleryIndex]);
        return;
      }

      return;
    });
  }

  if (documentZoomOutNode) {
    documentZoomOutNode.addEventListener("click", () => {
      if (!activeGalleryItems.length) {
        return;
      }

      setDocumentZoom(activeDocumentZoom - 0.25);
    });
  }

  if (documentZoomInNode) {
    documentZoomInNode.addEventListener("click", () => {
      if (!activeGalleryItems.length) {
        return;
      }

      setDocumentZoom(activeDocumentZoom + 0.25);
    });
  }

  if (documentZoomResetNode) {
    documentZoomResetNode.addEventListener("click", () => {
      if (!activeGalleryItems.length) {
        return;
      }

      setDocumentZoom(1);
    });
  }
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
      return "./assets/volvo-logo.jpg";
  }

  if (client === "tesla") {
      return "./assets/tesla-logo.png";
  }

  return "./assets/stellantis-logo-wide.jpg";
}

function hasStellantisProjectContent(client) {
  return client === "stellantis";
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

function updateDashboardAvailability(client = "stellantis") {
  if (!dashboardContentNode) {
    return;
  }

  dashboardContentNode.hidden = false;

  const isAvailable = hasStellantisProjectContent(client);

  quizActionNodes.forEach((link) => {
    const defaultHref = link.dataset.defaultHref || link.getAttribute("href") || "./quiz.html";
    link.dataset.defaultHref = defaultHref;
    link.classList.toggle("is-disabled", !isAvailable);
    link.setAttribute("aria-disabled", isAvailable ? "false" : "true");
    link.tabIndex = isAvailable ? 0 : -1;
    link.href = isAvailable ? `./quiz.html?client=${client}` : "#";
  });

  supportActionNodes.forEach((button) => {
    button.disabled = !isAvailable;
    button.setAttribute("aria-disabled", isAvailable ? "false" : "true");
  });
}

function updateStoredClient(lang) {
  if (!clientNameNodes.length && !clientLogoNodes.length) {
    const storedClientOnly = getStoredClient();
    updateDashboardClientTheme(storedClientOnly);
    updateDashboardAvailability(storedClientOnly);
    updateDocumentActions(storedClientOnly);
    return;
  }

  const storedClient = getStoredClient();
  const translatedName = getText(lang, getClientTranslationKey(storedClient));
  const logoPath = getClientLogoPath(storedClient);
  updateDashboardClientTheme(storedClient);
  updateDashboardAvailability(storedClient);
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
    window.location.replace("./index.html");
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
