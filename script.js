const STORAGE_KEY = "sc-training-home-lang";
const LOCATION_ACCESS_KEY = "sc-training-location-access";
const LOCATION_ACCESS_MODE_KEY = "sc-training-location-access-mode";
const LOCATION_ACCESS_AT_KEY = "sc-training-location-access-at";
const CLIENT_STORAGE_KEY = "sc-training-client";
const ADMIN_STORAGE_KEY = "sc-training-is-admin";
const VISITOR_ACCESS_DURATION_MS = 30 * 60 * 1000;
const COMPANY_LAT = 34.304222;
const COMPANY_LNG = -6.390333;
const ALLOWED_RADIUS_METERS = 150;
const PRACTICAL_RADIUS_METERS = 150;
const MAX_ACCURACY_BONUS_METERS = 180;
const MAX_LOCATION_ATTEMPTS = 3;
const SUPPORT_MAX_PHOTOS = 3;
const SUPPORT_IMAGE_MAX_BYTES = 2 * 1024 * 1024;
const SUPPORT_IMAGE_MAX_SIZE = 1280;
const SUPPORT_IMAGE_QUALITY = 0.78;
const SUPPORT_ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];
const DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;
const DOCUMENT_PHOTO_MAX_BYTES = 2 * 1024 * 1024;
const DOCUMENT_VIDEO_MAX_BYTES = 100 * 1024 * 1024;
const SUPPORT_MIN_DATE = "2026-01-01";
const SUPPORT_MIN_WEEK = "2026-W01";

const langButtons = document.querySelectorAll(".lang-btn");
const translatableNodes = document.querySelectorAll("[data-i18n]");
const placeholderNodes = document.querySelectorAll("[data-i18n-placeholder]");
const revealNodes = document.querySelectorAll(".reveal-section");
const clientCardNodes = document.querySelectorAll("[data-client]");
const weeklyComplaintsActionNode = document.querySelector("[data-weekly-complaints-action]");
const clientNameNodes = document.querySelectorAll("[data-client-name]");
const clientLogoNodes = document.querySelectorAll("[data-client-logo]");
const documentActionNodes = document.querySelectorAll("[data-doc-action]");
const quizActionNodes = document.querySelectorAll("[data-quiz-action]");
const supportActionNodes = document.querySelectorAll("[data-support-action]");
const dashboardContentNode = document.querySelector("[data-dashboard-content]");
const dashboardQuizResultsPanelNode = document.querySelector("[data-dashboard-quiz-results]");
const dashboardQuizResultsListNode = document.querySelector("[data-dashboard-quiz-list]");
const dashboardQuizResultsSearchNode = document.querySelector("[data-dashboard-quiz-search]");
const dashboardQuizResultsRefreshNode = document.querySelector("[data-dashboard-quiz-refresh]");
const dashboardQuizResultsDownloadNode = document.querySelector("[data-dashboard-quiz-download]");
const dashboardQuizResultsStatusNode = document.querySelector("[data-dashboard-quiz-status]");
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
const documentUploadButtonNode = document.querySelector("[data-doc-upload-button]");
const documentUploadInputNode = document.querySelector("[data-doc-upload-input]");
const documentFullscreenButtonNode = document.querySelector("[data-doc-fullscreen-button]");
const documentClosePreviewNode = document.querySelector("[data-doc-close-preview]");
const documentActionStatusNode = document.querySelector("[data-doc-action-status]");
const documentStatusNodes = document.querySelectorAll("[data-doc-status]");
const supportClientNameNode = document.querySelector("[data-support-client-name]");
const weeklyComplaintsDashboardNode = document.querySelector("[data-weekly-complaints-dashboard]");
const weeklyComplaintsPriorityNodes = document.querySelectorAll("[data-weekly-complaints-priority]");
const weeklyComplaintsCountNodes = document.querySelectorAll("[data-weekly-complaints-count]");
const supportLineStepNode = document.querySelector(".support-line-step");
const supportUnavailableNode = document.querySelector("[data-support-unavailable]");
const supportLineSelectNode = document.querySelector("[data-support-line-select]");
const supportLineInputNode = document.querySelector("[data-support-line-input]");
const supportLineStatusNode = document.querySelector("[data-support-line-status]");
const supportContentNode = document.querySelector("[data-support-content]");
const supportAdminPanelNode = document.querySelector("[data-support-admin-panel]");
const supportViewerPanelNode = document.querySelector("[data-support-viewer-panel]");
const supportFormNode = document.querySelector("[data-support-form]");
const supportTypeInputNode = document.querySelector("[data-support-type-input]");
const supportTypeCardNodes = document.querySelectorAll("[data-support-type-card]");
const supportClientFieldNode = document.querySelector("[data-support-client-field]");
const supportClientInputNode = document.querySelector("[data-support-client-input]");
const supportPriorityFieldNode = document.querySelector("[data-support-priority-field]");
const supportPriorityInputNode = document.querySelector("[data-support-priority-input]");
const supportDateInputNode = document.querySelector("[data-support-date-input]");
const supportWeekInputNode = document.querySelector("[data-support-week-input]");
const supportWeekFilterNode = document.querySelector("[data-support-week-filter]");
const supportPhoneInputNode = document.querySelector("[data-support-phone-input]");
const supportSubjectInputNode = document.querySelector("[data-support-subject-input]");
const supportDetailsInputNode = document.querySelector("[data-support-details-input]");
const supportPhotoInputNode = document.querySelector("[data-support-photo-input]");
const supportPhotoHelpNode = document.querySelector("[data-support-photo-help]");
const supportScheduleHintNode = document.querySelector("[data-support-schedule-hint]");
const supportPhotoPreviewNode = document.querySelector("[data-support-photo-preview]");
const supportCopyButtonNode = document.querySelector("[data-support-copy-button]");
const supportStatusNode = document.querySelector("[data-support-status]");
const supportHistoryNode = document.querySelector("[data-support-history]");
const supportPhotoLightboxNode = document.querySelector("[data-support-photo-lightbox]");
const supportPhotoLightboxImageNode = document.querySelector("[data-support-photo-lightbox-image]");
const supportPhotoLightboxCloseNode = document.querySelector("[data-support-photo-lightbox-close]");
const verifyLocationBtn = document.getElementById("verifyLocationBtn");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const visitorModeButtonNode = document.querySelector("[data-visitor-mode-button]");
const adminLoginModal = document.getElementById("adminLoginModal");
const adminLoginCloseBtn = document.getElementById("adminLoginClose");
const adminLoginForm = document.getElementById("adminLoginForm");
const adminPasswordInput = document.getElementById("adminPasswordInput");
const adminPasswordToggleBtn = document.getElementById("adminPasswordToggle");
const adminLoginStatusNode = document.getElementById("adminLoginStatus");
const locationStatus = document.getElementById("locationStatus");
const locationDetail = document.getElementById("locationDetail");
const gpsCard = document.querySelector(".gps-card");
const adminOnlyNodes = document.querySelectorAll("[data-admin-only]");

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
let weeklyComplaintPriorityFilter = "formal";
let supportPhotoItems = [];
let supportPhotoProcessing = false;
let supportEntries = [];
let supportEntriesLoading = false;
let dashboardQuizResults = [];
let dashboardQuizResultsLoading = false;
let dashboardQuizResultsLoaded = false;
let documentSelectionOverride = "";
let pdfRenderToken = 0;
let activeGalleryItems = [];
let activeGalleryIndex = 0;
let activeDocumentZoom = 1;
let adminSessionActive = false;
let adminLoginStatusKey = "";
let documentActionStatusKey = "";
let documentActionStatusState = "info";
const documentServerDocuments = new Map();
const documentDeletedPaths = new Set();
let documentDeletedDocuments = [];

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
        path: "./documents/stellantis/mapping-charge-ar-version-2.PNG",
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

function isAdmin() {
  return adminSessionActive === true;
}

function setAdminState(nextValue) {
  adminSessionActive = nextValue === true;
  document.body.dataset.role = adminSessionActive ? "admin" : "viewer";
}

function getAccessMode() {
  return sessionStorage.getItem(LOCATION_ACCESS_MODE_KEY) || "visitor";
}

function isVisitorAccessMode() {
  return getAccessMode() === "visitor";
}

async function clearAdminSessionOnServer() {
  if (!canUseServerApi()) {
    return;
  }

  try {
    await fetch("./api/admin/logout", {
      method: "POST",
      credentials: "same-origin"
    });
  } catch {
    // Visitor mode must stay local even if the network request fails.
  }
}

async function activateVisitorMode() {
  await clearAdminSessionOnServer();
  setAdminState(false);
  unlockLocationGate("visitor");
  applyRoleUi(document.documentElement.lang || "fr");
}

function applyRoleUi(lang = document.documentElement.lang || "fr") {
  const adminActive = isAdmin();
  document.body.dataset.role = adminActive ? "admin" : "viewer";

  adminOnlyNodes.forEach((node) => {
    node.hidden = !adminActive;
  });

  if (supportAdminPanelNode) {
    supportAdminPanelNode.hidden = !adminActive;
  }

  if (supportViewerPanelNode) {
    supportViewerPanelNode.hidden = adminActive;
  }

  if (dashboardQuizResultsPanelNode) {
    dashboardQuizResultsPanelNode.hidden = !adminActive;
    if (adminActive && !dashboardQuizResultsLoaded && !dashboardQuizResultsLoading) {
      loadDashboardQuizResults(lang);
    }
  }

  updateSupportAccess(lang);
  updateDocumentAccess(lang);
}

function canUseServerApi() {
  return window.location.protocol !== "file:";
}

function updateAdminLoginStatus(lang, key = "", state = "info") {
  if (!adminLoginStatusNode) {
    return;
  }

  adminLoginStatusKey = key;
  adminLoginStatusNode.dataset.state = state;
  adminLoginStatusNode.textContent = key ? getText(lang, key) : "";
}

function setDocumentActionStatus(lang, key = "", state = "info") {
  if (!documentActionStatusNode) {
    return;
  }

  documentActionStatusKey = key;
  documentActionStatusState = state;
  documentActionStatusNode.hidden = !key;
  documentActionStatusNode.classList.toggle("is-success", state === "success");
  documentActionStatusNode.classList.toggle("is-error", state === "error");
  documentActionStatusNode.textContent = key ? getText(lang, key) : "";
}

function confirmDeleteAction(lang = document.documentElement.lang || "fr") {
  return window.confirm(getText(lang, "deleteConfirmPrompt"));
}

function normalizeDocumentSection(section) {
  if (
    section === "training" ||
    section === "tutorials" ||
    section === "quiz" ||
    section === "complaints-formal" ||
    section === "complaints-informal"
  ) {
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

  if (normalizedSection === "complaints-formal") {
    return "weeklyComplaintsFormalDocuments";
  }

  if (normalizedSection === "complaints-informal") {
    return "weeklyComplaintsInformalDocuments";
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
  return getDocumentIdentityKeys(documentItem)[0] || "";
}

function getDocumentIdentityKeys(documentItem = {}) {
  const rawValues = [
    documentItem.id,
    documentItem.title,
    decodeURIComponent((documentItem.path || "").split("/").pop() || ""),
    ...(Array.isArray(documentItem.sourcePaths)
      ? documentItem.sourcePaths.map((sourcePath) => decodeURIComponent(sourcePath.split("/").pop() || ""))
      : [])
  ];

  return Array.from(
    new Set(
      rawValues
        .map((value) => normalizeDocumentIdentity(String(value || "")))
        .filter(Boolean)
    )
  );
}

function documentSharesIdentity(firstDocument = {}, secondDocument = {}) {
  const firstKeys = new Set(getDocumentIdentityKeys(firstDocument));
  return getDocumentIdentityKeys(secondDocument).some((identityKey) => firstKeys.has(identityKey));
}

function isDocumentDeleted(documentItem = {}, client = "stellantis", section = "quality") {
  const documentPaths = [
    documentItem.path,
    ...(Array.isArray(documentItem.sourcePaths) ? documentItem.sourcePaths : []),
    ...(Array.isArray(documentItem.gallery) ? documentItem.gallery : [])
  ].filter(Boolean);

  if (documentPaths.some((documentPath) => documentDeletedPaths.has(documentPath))) {
    return true;
  }

  const normalizedSection = normalizeDocumentSection(section);
  return documentDeletedDocuments.some((deletedDocument) => {
    const sameLibrary =
      (deletedDocument.client || "stellantis") === (client || "stellantis") &&
      normalizeDocumentSection(deletedDocument.section || "quality") === normalizedSection;
    return sameLibrary && documentSharesIdentity(deletedDocument, documentItem);
  });
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

function getDocumentUploadLimit(file) {
  const fileName = file && file.name ? file.name : "";
  const mediaType = file && file.type ? file.type.toLowerCase() : "";

  if (mediaType.startsWith("video/") || /\.(mp4|webm|ogg|mov)$/i.test(fileName)) {
    return {
      bytes: DOCUMENT_VIDEO_MAX_BYTES,
      errorKey: "documentPageVideoSizeLimit"
    };
  }

  if (mediaType.startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(fileName)) {
    return {
      bytes: DOCUMENT_PHOTO_MAX_BYTES,
      errorKey: "documentPagePhotoSizeLimit"
    };
  }

  return {
    bytes: DOCUMENT_MAX_BYTES,
    errorKey: "documentPageDocumentSizeLimit"
  };
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
  activeDocumentZoom = 1;
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

async function syncAdminSession() {
  if (!canUseServerApi()) {
    setAdminState(false);
    applyRoleUi(document.documentElement.lang || "fr");
    return;
  }

  if (isVisitorAccessMode()) {
    setAdminState(false);
    applyRoleUi(document.documentElement.lang || "fr");
    await clearAdminSessionOnServer();
    return;
  }

  try {
    const response = await fetch("./api/admin/status", {
      credentials: "same-origin"
    });
    if (!response.ok) {
      setAdminState(false);
      applyRoleUi(document.documentElement.lang || "fr");
      return;
    }

    const payload = await response.json();
    if (payload && typeof payload.isAdmin === "boolean") {
      setAdminState(payload.isAdmin);
    }
  } catch {
    setAdminState(false);
  }

  applyRoleUi(document.documentElement.lang || "fr");
}

function closeAdminLoginModal() {
  if (!adminLoginModal) {
    return;
  }

  adminLoginModal.hidden = true;
  adminLoginModal.classList.remove("is-open");
}

function updateAdminPasswordVisibilityLabel(lang = document.documentElement.lang || "fr") {
  if (!adminPasswordToggleBtn || !adminPasswordInput) {
    return;
  }

  const isVisible = adminPasswordInput.type === "text";
  adminPasswordToggleBtn.classList.toggle("is-visible", isVisible);
  adminPasswordToggleBtn.setAttribute("aria-label", getText(lang, isVisible ? "adminPasswordHide" : "adminPasswordShow"));
}

function openAdminLoginModal(lang = document.documentElement.lang || "fr") {
  if (!adminLoginModal) {
    return;
  }

  adminLoginModal.hidden = false;
  adminLoginModal.classList.add("is-open");
  updateAdminLoginStatus(lang);

  if (adminPasswordInput) {
    adminPasswordInput.type = "password";
    adminPasswordInput.value = "";
    adminPasswordInput.placeholder = getText(lang, "adminPasswordPlaceholder");
    window.setTimeout(() => adminPasswordInput.focus(), 20);
  }

  updateAdminPasswordVisibilityLabel(lang);
}

async function handleAdminLogin(password, lang) {
  if (!password) {
    updateAdminLoginStatus(lang, "adminAccessDenied", "error");
    return;
  }

  if (!canUseServerApi()) {
    setAdminState(false);
    updateAdminLoginStatus(lang, "adminAccessDenied", "error");
    applyRoleUi(lang);
    return;
  }

  try {
    const response = await fetch("./api/admin/login", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      setAdminState(false);
      updateAdminLoginStatus(lang, "adminAccessDenied", "error");
      applyRoleUi(lang);
      return;
    }

    const payload = await response.json().catch(() => ({}));
    if (!payload || payload.isAdmin !== true) {
      setAdminState(false);
      updateAdminLoginStatus(lang, "adminAccessDenied", "error");
      applyRoleUi(lang);
      return;
    }

    setAdminState(true);
    unlockLocationGate("admin");
    applyRoleUi(lang);
    updateAdminLoginStatus(lang, "adminAccessGranted", "success");
    window.setTimeout(() => {
      closeAdminLoginModal();
      openClientSelection();
    }, 550);
  } catch {
    setAdminState(false);
    applyRoleUi(lang);
    updateAdminLoginStatus(lang, "adminAccessDenied", "error");
  }
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

function getCurrentIsoWeekKey() {
  return getEntryWeekKey({ createdAt: new Date().toISOString() });
}

function openWeeklyComplaints() {
  window.location.href = "./weekly-complaints.html";
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
  return supportEntries.filter((entry) => !shouldDiscardSupportTestEntry(entry));
}

function shouldDiscardSupportTestEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return false;
  }

  const subject = String(entry.subject || "").trim().toLowerCase();
  const details = String(entry.details || "").trim().toLowerCase();

  return subject === "k" && details === "k";
}

async function loadSupportEntries(lang = document.documentElement.lang || "fr") {
  if (!supportHistoryNode || !canUseServerApi()) {
    return;
  }

  supportEntriesLoading = true;
  renderSupportHistory(lang);

  try {
    const response = await fetch("./api/complaints", {
      credentials: "same-origin"
    });

    if (!response.ok) {
      throw new Error("load_failed");
    }

    const payload = await response.json();
    supportEntries = Array.isArray(payload.complaints) ? payload.complaints : [];
  } catch {
    supportEntries = [];
    updateSupportStatus(lang, "supportStatusLoadFailed", "error");
  } finally {
    supportEntriesLoading = false;
    renderSupportHistory(lang);
  }
}

async function createSupportEntry(entry) {
  const response = await fetch("./api/complaints", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(entry)
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "save_failed");
  }

  return payload.complaint;
}

function setDashboardQuizStatus(lang, key = "", state = "info") {
  if (!dashboardQuizResultsStatusNode) {
    return;
  }

  dashboardQuizResultsStatusNode.hidden = !key;
  dashboardQuizResultsStatusNode.classList.toggle("is-error", state === "error");
  dashboardQuizResultsStatusNode.classList.toggle("is-success", state === "success");
  dashboardQuizResultsStatusNode.textContent = key ? getText(lang, key) : "";
}

function formatDashboardQuizDate(result, lang) {
  if (result.date && result.time) {
    return `${result.date} ${result.time}`;
  }

  if (!result.createdAt) {
    return "";
  }

  try {
    const locale = lang === "ar" ? "ar-MA" : lang === "en" ? "en-US" : "fr-MA";
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(result.createdAt));
  } catch {
    return String(result.createdAt);
  }
}

function getFilteredDashboardQuizResults() {
  const query = String((dashboardQuizResultsSearchNode && dashboardQuizResultsSearchNode.value) || "")
    .trim()
    .toLowerCase();

  if (!query) {
    return dashboardQuizResults;
  }

  return dashboardQuizResults.filter((result) => {
    return [
      result.matricule,
      result.score,
      result.percentage,
      result.date,
      result.time
    ]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

function renderDashboardQuizResults(lang = document.documentElement.lang || "fr") {
  if (!dashboardQuizResultsListNode) {
    return;
  }

  dashboardQuizResultsListNode.innerHTML = "";

  if (!isAdmin()) {
    return;
  }

  if (dashboardQuizResultsLoading) {
    const messageNode = document.createElement("p");
    messageNode.className = "dashboard-quiz-result";
    messageNode.textContent = getText(lang, "dashboardQuizResultsLoading");
    dashboardQuizResultsListNode.appendChild(messageNode);
    return;
  }

  const results = getFilteredDashboardQuizResults();

  if (!results.length) {
    const messageNode = document.createElement("p");
    messageNode.className = "dashboard-quiz-result";
    messageNode.textContent = getText(lang, "dashboardQuizResultsEmpty");
    dashboardQuizResultsListNode.appendChild(messageNode);
    return;
  }

  results.forEach((result) => {
    const itemNode = document.createElement("article");
    itemNode.className = "dashboard-quiz-result";

    const contentNode = document.createElement("div");
    const titleNode = document.createElement("p");
    titleNode.className = "dashboard-quiz-result__title";
    titleNode.textContent = `${getText(lang, "dashboardQuizResultsMatricule")}: ${result.matricule || "-"}`;

    const metaNode = document.createElement("div");
    metaNode.className = "dashboard-quiz-result__meta";
    [
      `${getText(lang, "dashboardQuizResultsScore")}: ${result.score} / ${result.totalQuestions}`,
      `${getText(lang, "dashboardQuizResultsPercentage")}: ${result.percentage ?? result.rate}%`,
      `${getText(lang, "dashboardQuizResultsDate")}: ${formatDashboardQuizDate(result, lang)}`
    ].forEach((value) => {
      const pillNode = document.createElement("span");
      pillNode.textContent = value;
      metaNode.appendChild(pillNode);
    });

    contentNode.append(titleNode, metaNode);

    const deleteNode = document.createElement("button");
    deleteNode.type = "button";
    deleteNode.className = "dashboard-quiz-result__delete";
    deleteNode.textContent = getText(lang, "dashboardQuizResultsDelete");
    deleteNode.addEventListener("click", () => {
      deleteDashboardQuizResult(result.index, lang);
    });

    itemNode.append(contentNode, deleteNode);
    dashboardQuizResultsListNode.appendChild(itemNode);
  });
}

async function loadDashboardQuizResults(lang = document.documentElement.lang || "fr") {
  if (!dashboardQuizResultsListNode || !isAdmin() || !canUseServerApi()) {
    return;
  }

  dashboardQuizResultsLoading = true;
  setDashboardQuizStatus(lang);
  renderDashboardQuizResults(lang);

  try {
    const response = await fetch("./api/quiz-results", {
      credentials: "same-origin"
    });

    if (!response.ok) {
      throw new Error("load_failed");
    }

    const payload = await response.json();
    dashboardQuizResults = Array.isArray(payload.results) ? payload.results : [];
    dashboardQuizResultsLoaded = true;
  } catch {
    dashboardQuizResults = [];
    setDashboardQuizStatus(lang, "dashboardQuizResultsLoadFailed", "error");
  } finally {
    dashboardQuizResultsLoading = false;
    renderDashboardQuizResults(lang);
  }
}

async function deleteDashboardQuizResult(index, lang = document.documentElement.lang || "fr") {
  if (!isAdmin() || index === undefined || index === null || !confirmDeleteAction(lang)) {
    return;
  }

  try {
    const response = await fetch(`./api/quiz-results/${encodeURIComponent(index)}`, {
      method: "DELETE",
      credentials: "same-origin"
    });

    if (!response.ok) {
      throw new Error("delete_failed");
    }

    dashboardQuizResults = dashboardQuizResults.filter((result) => result.index !== index);
    setDashboardQuizStatus(lang, "dashboardQuizResultsDeleted", "success");
    await loadDashboardQuizResults(lang);
  } catch {
    setDashboardQuizStatus(lang, "dashboardQuizResultsDeleteFailed", "error");
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

function getEntryDateKey(entry) {
  if (!entry || !entry.createdAt) {
    return "";
  }

  const dateValue = new Date(entry.createdAt);
  if (Number.isNaN(dateValue.getTime())) {
    return "";
  }

  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getEntryWeekKey(entry) {
  if (!entry || !entry.createdAt) {
    return "";
  }

  const dateValue = new Date(entry.createdAt);
  if (Number.isNaN(dateValue.getTime())) {
    return "";
  }

  const utcDate = new Date(Date.UTC(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate()));
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - (utcDate.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

function doesEntryMatchScheduleFilter(entry, dateFilter = "", weekFilter = "") {
  const matchesDate = !dateFilter || getEntryDateKey(entry) === dateFilter;
  const matchesWeek = !weekFilter || getEntryWeekKey(entry) === weekFilter;
  return matchesDate && matchesWeek;
}

function getSupportUrlParams() {
  return new URLSearchParams(window.location.search);
}

function isWeeklyComplaintsView() {
  return getSupportUrlParams().get("view") === "weekly-complaints";
}

function normalizeSupportPriority(priority = "") {
  if (priority === "communication") {
    return "communication";
  }

  return priority === "informal" ? "informal" : "formal";
}

function getWeeklyComplaintPriorityFilter() {
  const requestedPriority = getSupportUrlParams().get("priority");
  if (requestedPriority === "formal" || requestedPriority === "informal" || requestedPriority === "communication") {
    weeklyComplaintPriorityFilter = requestedPriority;
  }

  return normalizeSupportPriority(weeklyComplaintPriorityFilter);
}

function setWeeklyComplaintPriorityFilter(priority = "formal") {
  weeklyComplaintPriorityFilter = normalizeSupportPriority(priority);

  if (supportPriorityInputNode) {
    supportPriorityInputNode.value = weeklyComplaintPriorityFilter;
    updateSupportPriorityStyle();
  }

  if (window.history && window.history.replaceState) {
    const params = getSupportUrlParams();
    params.set("view", "weekly-complaints");
    params.set("priority", weeklyComplaintPriorityFilter);
    if (supportWeekFilterNode && supportWeekFilterNode.value) {
      params.set("week", supportWeekFilterNode.value);
    }
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }

  renderWeeklyComplaintsDashboard(document.documentElement.lang || "fr");
  renderSupportHistory(document.documentElement.lang || "fr");
}

function getSupportCenterConfig() {
  const params = getSupportUrlParams();
  const weeklyComplaintsView = isWeeklyComplaintsView();
  const client = weeklyComplaintsView ? "versigent" : params.get("client") || getStoredClient();
  const lineValue = weeklyComplaintsView ? "" : getCurrentSupportLineValue();
  const priorityFilter = weeklyComplaintsView ? getWeeklyComplaintPriorityFilter() : "";
  const dateFilter = (supportDateInputNode && supportDateInputNode.value) || "";
  const weekFilter =
    (supportWeekFilterNode && supportWeekFilterNode.value) ||
    params.get("week") ||
    (supportWeekInputNode && supportWeekInputNode.value) ||
    "";
  const entries = getSupportEntries()
    .filter((entry) => {
      if (weeklyComplaintsView) {
        return (
          entry.type === "complaint" &&
          normalizeSupportPriority(entry.priority) === priorityFilter &&
          doesEntryMatchScheduleFilter(entry, dateFilter, weekFilter)
        );
      }

      return (
        entry.client === client &&
        doesEntryMatchSupportLine(entry, lineValue) &&
        doesEntryMatchScheduleFilter(entry, dateFilter, weekFilter)
      );
    })
    .sort((firstEntry, secondEntry) => {
      return new Date(secondEntry.createdAt).getTime() - new Date(firstEntry.createdAt).getTime();
    });

  return {
    client,
    lineValue,
    priorityFilter,
    weeklyComplaintsView,
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

function getSupportPriorityLabelKey(priority = "formal") {
  if (priority === "communication") {
    return "supportPriorityCommunication";
  }

  if (priority === "informal") {
    return "supportPriorityInformal";
  }

  return "supportPriorityFormal";
}

function getSupportStatusLabelKey(status = "pending") {
  if (status === "in_progress") {
    return "complaintStatusInProgress";
  }

  if (status === "resolved") {
    return "complaintStatusResolved";
  }

  return "complaintStatusPending";
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

function openSupportPhotoLightbox(imageUrl = "", imageAlt = "") {
  if (!supportPhotoLightboxNode || !supportPhotoLightboxImageNode || !imageUrl) {
    return;
  }

  supportPhotoLightboxImageNode.src = imageUrl;
  supportPhotoLightboxImageNode.alt = imageAlt || getText(document.documentElement.lang || "fr", "supportFieldPhoto");
  supportPhotoLightboxNode.hidden = false;
  supportPhotoLightboxNode.classList.add("is-open");
  document.body.classList.add("is-support-photo-lightbox-open");

  if (supportPhotoLightboxCloseNode) {
    supportPhotoLightboxCloseNode.focus();
  }
}

function closeSupportPhotoLightbox() {
  if (!supportPhotoLightboxNode || supportPhotoLightboxNode.hidden) {
    return;
  }

  supportPhotoLightboxNode.hidden = true;
  supportPhotoLightboxNode.classList.remove("is-open");
  document.body.classList.remove("is-support-photo-lightbox-open");

  if (supportPhotoLightboxImageNode) {
    supportPhotoLightboxImageNode.removeAttribute("src");
    supportPhotoLightboxImageNode.alt = "";
  }
}

function updateSupportTypeCards(type = "recommendation") {
  if (isWeeklyComplaintsView()) {
    type = "complaint";
  }

  if (supportTypeInputNode) {
    supportTypeInputNode.value = type;
  }

  const isComplaint = type === "complaint";

  supportTypeCardNodes.forEach((card) => {
    const isActive = card.dataset.supportType === type;
    card.classList.toggle("is-active", isActive);
    card.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  if (supportPriorityFieldNode) {
    supportPriorityFieldNode.hidden = !isComplaint;
    supportPriorityFieldNode.closest(".support-form-grid")?.classList.toggle("support-form-grid--priority-hidden", !isComplaint);
  }

  if (supportPriorityInputNode) {
    supportPriorityInputNode.disabled = !isComplaint;
    if (!isComplaint) {
      supportPriorityInputNode.value = "formal";
    }
  }

  updateSupportPriorityStyle();
}

function updateSupportPriorityStyle() {
  if (!supportPriorityInputNode) {
    return;
  }

  supportPriorityInputNode.dataset.priority = supportPriorityInputNode.value || "formal";
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

function formatSupportDateOnly(value, lang) {
  if (!value) {
    return "";
  }

  try {
    const locale = lang === "ar" ? "ar-MA" : lang === "en" ? "en-US" : "fr-MA";
    const dateValue = /^\d{4}-\d{2}-\d{2}$/.test(String(value))
      ? new Date(`${value}T00:00:00`)
      : new Date(value);

    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium"
    }).format(dateValue);
  } catch {
    return value;
  }
}

function formatSupportEntryDisplayDate(entry, lang) {
  if (entry && entry.workDate) {
    return formatSupportDateOnly(entry.workDate, lang);
  }

  if (entry && entry.workWeek) {
    return `${getText(lang, "supportFieldWeek")}: ${entry.workWeek}`;
  }

  return formatSupportDate(entry && entry.createdAt, lang);
}

function buildSupportDraft(client) {
  const weeklyComplaintsView = isWeeklyComplaintsView();
  const lineLabel = weeklyComplaintsView ? "" : getSelectedSupportLineLabel();
  const supportType = weeklyComplaintsView ? "complaint" : (supportTypeInputNode && supportTypeInputNode.value) || "recommendation";
  const draft = {
    name: lineLabel || getText(document.documentElement.lang || "fr", getClientTranslationKey(client)),
    client: weeklyComplaintsView ? (supportClientInputNode && supportClientInputNode.value) || "stellantis" : client,
    line: lineLabel,
    lineValue: weeklyComplaintsView ? "" : selectedSupportLine || (supportLineInputNode && supportLineInputNode.value) || "",
    type: supportType,
    senderPhone: (supportPhoneInputNode && supportPhoneInputNode.value.trim()) || "",
    workDate: (supportDateInputNode && supportDateInputNode.value) || "",
    workWeek: (supportWeekInputNode && supportWeekInputNode.value) || "",
    subject: (supportSubjectInputNode && supportSubjectInputNode.value.trim()) || "",
    details: (supportDetailsInputNode && supportDetailsInputNode.value.trim()) || "",
    images: supportPhotoItems.map((item) => ({
      name: item.name,
      type: item.type,
      dataUrl: item.dataUrl
    })),
    createdAt: new Date().toISOString()
  };

  if (supportType === "complaint") {
    draft.priority = (supportPriorityInputNode && supportPriorityInputNode.value) || "formal";
  }

  return draft;
}
function buildSupportMessage(entry, lang) {
  const translatedLine =
    entry.lineValue && entry.lineValue !== ""
      ? getText(lang, getSupportLineLabelKey(entry.lineValue))
      : entry.line || "";
  const lines = [
    `${getText(lang, "supportLabelClient")}: ${getText(lang, getClientTranslationKey(entry.client || "stellantis"))}`,
    `${getText(lang, "supportLabelType")}: ${getText(lang, getSupportTypeLabelKey(entry.type || "message"))}`
  ];

  if (entry.type === "complaint") {
    lines.push(`${getText(lang, "supportFieldPriority")}: ${getText(lang, getSupportPriorityLabelKey(entry.priority || "formal"))}`);
  }

  if (translatedLine) {
    lines.push(`${getText(lang, "supportFieldLine")}: ${translatedLine}`);
  }

  if (entry.senderPhone) {
    lines.push(`${getText(lang, "supportFieldPhone")}: ${entry.senderPhone}`);
  }

  const imageCount = Array.isArray(entry.imageUrls)
    ? entry.imageUrls.length
    : Array.isArray(entry.images)
      ? entry.images.length
      : 0;

  if (imageCount) {
    lines.push(`${getText(lang, "supportLabelPhotos")}: ${imageCount}`);
  }

  lines.push(`${getText(lang, "supportFieldSubject")}: ${entry.subject || ""}`);
  lines.push(`${getText(lang, "supportFieldDetails")}: ${entry.details || ""}`);

  const displayDate = formatSupportEntryDisplayDate(entry, lang);
  if (displayDate) {
    lines.push(`${getText(lang, "supportLabelDate")}: ${displayDate}`);
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

async function deleteSupportEntry(entryId, lang) {
  if (!entryId) {
    return;
  }

  if (!confirmDeleteAction(lang)) {
    return;
  }

  try {
    const response = await fetch(`./api/complaints/${encodeURIComponent(entryId)}`, {
      method: "DELETE",
      credentials: "same-origin"
    });

    if (!response.ok) {
      throw new Error("delete_failed");
    }

    supportEntries = supportEntries.filter((entry) => entry.id !== entryId);
    renderSupportHistory(lang);
    updateSupportStatus(lang, "supportStatusDeleted", "success");
  } catch {
    updateSupportStatus(lang, "supportStatusDeleteFailed", "error");
  }
}

async function updateSupportEntryStatus(entryId, status, lang) {
  if (!entryId || !status) {
    return;
  }

  try {
    const response = await fetch(`./api/complaints/${encodeURIComponent(entryId)}/status`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload.complaint) {
      throw new Error("status_failed");
    }

    supportEntries = supportEntries.map((entry) => {
      return entry.id === entryId ? payload.complaint : entry;
    });
    renderSupportHistory(lang);
    updateSupportStatus(lang, "supportStatusUpdated", "success");
  } catch {
    updateSupportStatus(lang, "supportStatusUpdateFailed", "error");
    renderSupportHistory(lang);
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
    removeNode.textContent = "Ã—";
    removeNode.addEventListener("click", () => {
      if (!confirmDeleteAction(document.documentElement.lang || "fr")) {
        return;
      }
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
  const selectedFiles = Array.from(fileList || []).filter(Boolean);
  const hasInvalidType = selectedFiles.some((file) => !SUPPORT_ALLOWED_IMAGE_TYPES.includes(file.type));
  const hasOversizedFile = selectedFiles.some((file) => file.size > SUPPORT_IMAGE_MAX_BYTES);
  const files = selectedFiles.filter((file) => SUPPORT_ALLOWED_IMAGE_TYPES.includes(file.type));

  if (!files.length || hasInvalidType) {
    updateSupportStatus(lang, "supportStatusPhotoType", "error");
    if (supportPhotoInputNode) {
      supportPhotoInputNode.value = "";
    }
    return;
  }

  if (hasOversizedFile) {
    updateSupportStatus(lang, "supportStatusPhotoSize", "error");
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

function getWeeklyComplaintDashboardEntries() {
  const dateFilter = (supportDateInputNode && supportDateInputNode.value) || "";
  const weekFilter =
    (supportWeekFilterNode && supportWeekFilterNode.value) ||
    getSupportUrlParams().get("week") ||
    getCurrentIsoWeekKey();

  return getSupportEntries().filter((entry) => {
    return (
      entry.type === "complaint" &&
      doesEntryMatchScheduleFilter(entry, dateFilter, weekFilter)
    );
  });
}

function renderWeeklyComplaintsDashboard(lang) {
  if (!weeklyComplaintsDashboardNode) {
    return;
  }

  const weeklyComplaintsView = isWeeklyComplaintsView();
  weeklyComplaintsDashboardNode.hidden = !weeklyComplaintsView;

  if (!weeklyComplaintsView) {
    return;
  }

  const activePriority = getWeeklyComplaintPriorityFilter();
  const counts = {
    formal: 0,
    informal: 0,
    communication: 0
  };

  getWeeklyComplaintDashboardEntries().forEach((entry) => {
    counts[normalizeSupportPriority(entry.priority)] += 1;
  });

  weeklyComplaintsCountNodes.forEach((node) => {
    const priority = normalizeSupportPriority(node.dataset.weeklyComplaintsCount);
    node.textContent = String(counts[priority] || 0);
  });

  weeklyComplaintsPriorityNodes.forEach((button) => {
    const isActive = normalizeSupportPriority(button.dataset.weeklyComplaintsPriority) === activePriority;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  if (supportPriorityInputNode) {
    supportPriorityInputNode.value = activePriority;
    updateSupportPriorityStyle();
  }
}

function updateSupportLineGate(lang) {
  if (!supportLineSelectNode || !supportContentNode) {
    return;
  }

  const weeklyComplaintsView = isWeeklyComplaintsView();
  selectedSupportLine = weeklyComplaintsView ? "" : supportLineSelectNode.value || "";
  const hasSelectedLine = Boolean(selectedSupportLine) || weeklyComplaintsView;

  if (supportLineInputNode) {
    supportLineInputNode.value = selectedSupportLine;
  }

  if (supportLineStepNode) {
    supportLineStepNode.hidden = weeklyComplaintsView;
    supportLineStepNode.classList.toggle("is-selected", hasSelectedLine);
  }

  supportContentNode.classList.toggle("is-unlocked", hasSelectedLine);
  supportContentNode.setAttribute("aria-hidden", hasSelectedLine ? "false" : "true");

  if (supportLineStatusNode) {
    supportLineStatusNode.textContent = weeklyComplaintsView
      ? getText(lang, "supportWeeklyComplaintsHelper")
      : hasSelectedLine
      ? `${getText(lang, "supportLineSelectedText")}: ${getSelectedSupportLineLabel()}`
      : getText(lang, "supportLineHelper");
  }
}

function renderSupportHistory(lang) {
  if (!supportHistoryNode) {
    return;
  }

  const { entries, weeklyComplaintsView } = getSupportCenterConfig();
  renderWeeklyComplaintsDashboard(lang);
  supportHistoryNode.innerHTML = "";

  if (supportEntriesLoading) {
    const loadingNode = document.createElement("p");
    loadingNode.className = "support-history-empty";
    loadingNode.textContent = getText(lang, "supportStatusLoading");
    supportHistoryNode.appendChild(loadingNode);
    return;
  }

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
    itemNode.setAttribute("role", "listitem");

    const topNode = document.createElement("div");
    topNode.className = "support-history-item__top";

    const badgesNode = document.createElement("div");
    badgesNode.className = "support-history-item__badges";

    const typeBadgeNode = document.createElement("span");
    typeBadgeNode.className = "support-history-item__badge";
    typeBadgeNode.textContent = getText(lang, getSupportTypeLabelKey(entry.type));

    const statusBadgeNode = document.createElement("span");
    statusBadgeNode.className = `support-history-item__badge support-history-item__badge--status support-history-item__badge--${entry.status || "pending"}`;
    statusBadgeNode.textContent = getText(lang, getSupportStatusLabelKey(entry.status));

    badgesNode.appendChild(typeBadgeNode);

    if (entry.type === "complaint") {
      const priorityBadgeNode = document.createElement("span");
      priorityBadgeNode.className = `support-history-item__badge support-history-item__badge--priority support-history-item__badge--priority-${entry.priority || "formal"}`;
      priorityBadgeNode.textContent = getText(lang, getSupportPriorityLabelKey(entry.priority));
      badgesNode.appendChild(priorityBadgeNode);
    }

    badgesNode.appendChild(statusBadgeNode);

    const dateNode = document.createElement("span");
    dateNode.className = "support-history-item__date";
    dateNode.textContent = formatSupportEntryDisplayDate(entry, lang);

    const actionsNode = document.createElement("div");
    actionsNode.className = "support-history-item__actions";

    actionsNode.append(dateNode);

    if (isAdmin()) {
      const statusSelectNode = document.createElement("select");
      statusSelectNode.className = "support-history-item__status";
      statusSelectNode.setAttribute("aria-label", getText(lang, "supportStatusLabel"));

      ["pending", "in_progress", "resolved"].forEach((status) => {
        const optionNode = document.createElement("option");
        optionNode.value = status;
        optionNode.textContent = getText(lang, getSupportStatusLabelKey(status));
        statusSelectNode.appendChild(optionNode);
      });

      statusSelectNode.value = entry.status || "pending";
      statusSelectNode.addEventListener("change", () => {
        updateSupportEntryStatus(entry.id, statusSelectNode.value, document.documentElement.lang || "fr");
      });
      actionsNode.append(statusSelectNode);

      const deleteNode = document.createElement("button");
      deleteNode.type = "button";
      deleteNode.className = "support-history-item__delete";
      deleteNode.textContent = getText(lang, "supportHistoryDelete");
      deleteNode.setAttribute("aria-label", getText(lang, "supportHistoryDelete"));
      deleteNode.addEventListener("click", () => {
        deleteSupportEntry(entry.id, document.documentElement.lang || "fr");
      });
      actionsNode.append(deleteNode);
    }

    topNode.append(badgesNode, actionsNode);

    const subjectNode = document.createElement("h3");
    subjectNode.className = "support-history-item__subject";
    subjectNode.textContent = entry.subject || getText(lang, "supportFieldSubject");

    const detailsNode = document.createElement("p");
    detailsNode.className = "support-history-item__details";
    detailsNode.textContent = entry.details || "";

    const metaValues = [
      weeklyComplaintsView && entry.client ? getText(lang, getClientTranslationKey(entry.client)) : "",
      translatedLine,
      entry.senderPhone
    ].filter(Boolean);

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

    const imageUrls = Array.isArray(entry.imageUrls) ? entry.imageUrls : [];

    if (imageUrls.length) {
      const galleryNode = document.createElement("div");
      galleryNode.className = "support-history-item__gallery";
      galleryNode.setAttribute("aria-label", getText(lang, "supportLabelPhotos"));

      imageUrls.forEach((imageUrl, attachmentIndex) => {
        if (!imageUrl) {
          return;
        }

        const mediaNode = document.createElement("figure");
        mediaNode.className = "support-history-item__media";

        const imageButtonNode = document.createElement("button");
        imageButtonNode.type = "button";
        imageButtonNode.className = "support-history-item__photo-button";
        imageButtonNode.setAttribute("aria-label", `${getText(lang, "supportFieldPhoto")} ${attachmentIndex + 1}`);

        const imageNode = document.createElement("img");
        imageNode.src = imageUrl;
        imageNode.alt = `${getText(lang, "supportFieldPhoto")} ${attachmentIndex + 1}`;
        imageNode.loading = "lazy";
        imageNode.decoding = "async";

        imageButtonNode.addEventListener("click", () => {
          openSupportPhotoLightbox(imageUrl, imageNode.alt);
        });

        imageButtonNode.appendChild(imageNode);
        mediaNode.appendChild(imageButtonNode);
        galleryNode.appendChild(mediaNode);
      });

      if (galleryNode.childElementCount) {
        galleryNode.classList.add(`support-history-item__gallery--count-${Math.min(galleryNode.childElementCount, 3)}`);
        itemNode.appendChild(galleryNode);
      }
    }

    supportHistoryNode.appendChild(itemNode);
  });
}

function updateSupportAccess(lang) {
  const adminActive = isAdmin();

  if (supportFormNode) {
    supportFormNode.querySelectorAll("input, select, textarea, button").forEach((field) => {
      field.disabled = !adminActive;
    });
    supportFormNode.setAttribute("aria-hidden", adminActive ? "false" : "true");
  }

  if (supportCopyButtonNode) {
    supportCopyButtonNode.hidden = !adminActive;
  }

  if (supportPhotoInputNode) {
    supportPhotoInputNode.disabled = !adminActive;
  }

  if (supportPriorityInputNode && supportTypeInputNode && supportTypeInputNode.value !== "complaint") {
    supportPriorityInputNode.disabled = true;
  }

  if (!adminActive && supportStatusNode) {
    updateSupportStatus(lang, "supportViewerReadonly", "info");
  }
}

function updateSupportCenter(lang) {
  if (!supportFormNode) {
    return;
  }

  const { client, weeklyComplaintsView } = getSupportCenterConfig();
  const translatedClientName = getText(lang, getClientTranslationKey(client));
  const currentSupportType = weeklyComplaintsView ? "complaint" : (supportTypeInputNode && supportTypeInputNode.value) || "recommendation";

  document.body.classList.toggle("support-page--weekly-dashboard", weeklyComplaintsView);

  if (!weeklyComplaintsView) {
    localStorage.setItem(CLIENT_STORAGE_KEY, client);
  }
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

  if (supportDateInputNode) {
    supportDateInputNode.min = SUPPORT_MIN_DATE;
  }

  if (supportWeekInputNode) {
    supportWeekInputNode.min = SUPPORT_MIN_WEEK;
  }

  if (supportWeekFilterNode) {
    supportWeekFilterNode.min = SUPPORT_MIN_WEEK;
    const requestedWeek = getSupportUrlParams().get("week");
    if (requestedWeek && !supportWeekFilterNode.value) {
      supportWeekFilterNode.value = requestedWeek;
    }
    if (weeklyComplaintsView && !supportWeekFilterNode.value) {
      supportWeekFilterNode.value = getCurrentIsoWeekKey();
    }
  }

  if (supportWeekInputNode) {
    const requestedWeek = getSupportUrlParams().get("week");
    if (requestedWeek && !supportWeekInputNode.value) {
      supportWeekInputNode.value = requestedWeek;
    }
  }

  if (supportScheduleHintNode) {
    supportScheduleHintNode.textContent = getText(lang, "supportScheduleHint");
  }

  if (supportAdminPanelNode) {
    const formKickerNode = supportAdminPanelNode.querySelector('[data-i18n="supportFormKicker"]');
    const formTitleNode = supportAdminPanelNode.querySelector('[data-i18n="supportFormTitle"]');
    const formTextNode = supportAdminPanelNode.querySelector('[data-i18n="supportFormText"]');

    if (formKickerNode) {
      formKickerNode.textContent = getText(lang, weeklyComplaintsView ? "supportWeeklyAddKicker" : "supportFormKicker");
    }

    if (formTitleNode) {
      formTitleNode.textContent = getText(lang, weeklyComplaintsView ? "supportWeeklyAddTitle" : "supportFormTitle");
    }

    if (formTextNode) {
      formTextNode.textContent = getText(lang, weeklyComplaintsView ? "supportWeeklyAddText" : "supportFormText");
    }
  }

  if (supportClientFieldNode) {
    supportClientFieldNode.hidden = !weeklyComplaintsView;
  }

  if (supportClientInputNode) {
    supportClientInputNode.disabled = !weeklyComplaintsView;
  }

  if (weeklyComplaintsView) {
    setWeeklyComplaintPriorityFilter(getWeeklyComplaintPriorityFilter());
  }

  updateSupportPhotoHelp(lang);
  renderSupportPhotoPreview(lang);
  updateSupportLineGate(lang);
  updateSupportTypeCards(currentSupportType);
  updateSupportPriorityStyle();
  updateSupportAccess(lang);
  renderSupportHistory(lang);
  if (isAdmin()) {
    updateSupportStatus(lang, supportStatusKey, (supportStatusNode && supportStatusNode.dataset.state) || "info");
  }
}

function setupSupportCenter() {
  if (!supportFormNode) {
    return;
  }

  weeklyComplaintsPriorityNodes.forEach((button) => {
    button.addEventListener("click", () => {
      setWeeklyComplaintPriorityFilter(button.dataset.weeklyComplaintsPriority || "formal");
    });
  });

  if (supportLineSelectNode) {
    supportLineSelectNode.addEventListener("change", () => {
      updateSupportCenter(document.documentElement.lang || "fr");
    });
  }

  if (supportDateInputNode) {
    supportDateInputNode.addEventListener("change", () => {
      renderSupportHistory(document.documentElement.lang || "fr");
    });
  }

  if (supportWeekInputNode) {
    supportWeekInputNode.addEventListener("change", () => {
      renderSupportHistory(document.documentElement.lang || "fr");
    });
  }

  if (supportWeekFilterNode) {
    supportWeekFilterNode.addEventListener("change", () => {
      if (isWeeklyComplaintsView() && window.history && window.history.replaceState) {
        const params = getSupportUrlParams();
        params.set("view", "weekly-complaints");
        params.set("priority", getWeeklyComplaintPriorityFilter());
        if (supportWeekFilterNode.value) {
          params.set("week", supportWeekFilterNode.value);
        } else {
          params.delete("week");
        }
        window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
      }
      renderSupportHistory(document.documentElement.lang || "fr");
    });
  }

  if (supportPriorityInputNode) {
    supportPriorityInputNode.addEventListener("change", () => {
      updateSupportPriorityStyle();
      if (isWeeklyComplaintsView()) {
        setWeeklyComplaintPriorityFilter(supportPriorityInputNode.value || "formal");
      }
    });
    updateSupportPriorityStyle();
  }

  if (supportPhotoInputNode) {
    supportPhotoInputNode.addEventListener("change", async (event) => {
      if (!isAdmin()) {
        updateSupportStatus(document.documentElement.lang || "fr", "supportViewerReadonly", "info");
        event.target.value = "";
        return;
      }
      await handleSupportPhotoSelection(event.target.files, document.documentElement.lang || "fr");
    });
  }

  supportTypeCardNodes.forEach((card) => {
    card.addEventListener("click", () => {
      if (!isAdmin()) {
        updateSupportStatus(document.documentElement.lang || "fr", "supportViewerReadonly", "info");
        return;
      }
      updateSupportTypeCards(card.dataset.supportType || "recommendation");
    });
  });

  supportFormNode.addEventListener("submit", async (event) => {
    event.preventDefault();

    const lang = document.documentElement.lang || "fr";
    if (!isAdmin()) {
      updateSupportStatus(lang, "supportViewerReadonly", "info");
      return;
    }
    updateSupportLineGate(lang);
    const weeklyComplaintsView = isWeeklyComplaintsView();

    if (!weeklyComplaintsView && !selectedSupportLine) {
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

    updateSupportStatus(lang, "supportStatusSaving", "info");

    try {
      const savedEntry = await createSupportEntry(entry);
      supportEntries = [savedEntry, ...supportEntries.filter((existingEntry) => existingEntry.id !== savedEntry.id)];
    } catch {
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
      if (!isAdmin()) {
        updateSupportStatus(lang, "supportViewerReadonly", "info");
        return;
      }
      updateSupportLineGate(lang);
      const weeklyComplaintsView = isWeeklyComplaintsView();

      if (!weeklyComplaintsView && !selectedSupportLine) {
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
  updateSupportAccess(document.documentElement.lang || "fr");
  loadSupportEntries(document.documentElement.lang || "fr");
}

function getClientDocuments(client, section = "quality") {
  const normalizedSection = normalizeDocumentSection(section);
  const availableBaseDocuments = getDocumentLibrary(client, normalizedSection);
  const collectionKey = getDocumentCollectionKey(client, normalizedSection);
  const serverDocuments = documentServerDocuments.get(collectionKey) || [];
  const documentsByName = new Map();
  const identityAliases = new Map();

  function upsertDocument(documentItem) {
    const identityKeys = getDocumentIdentityKeys(documentItem);
    const matchedKey = identityKeys.find((identityKey) => identityAliases.has(identityKey));
    const primaryKey = matchedKey
      ? identityAliases.get(matchedKey)
      : identityKeys[0] || documentItem.id || documentItem.path || documentItem.title;

    documentsByName.set(primaryKey, documentItem);
    identityKeys.forEach((identityKey) => {
      identityAliases.set(identityKey, primaryKey);
    });
  }

  availableBaseDocuments
    .filter((documentItem) => !isDocumentDeleted(documentItem, client, normalizedSection))
    .forEach(upsertDocument);

  serverDocuments
    .filter((documentItem) => !isDocumentDeleted(documentItem, client, normalizedSection))
    .forEach(upsertDocument);

  return Array.from(documentsByName.values()).sort(compareDocumentTitles);
}

async function loadServerDocuments(client, section = "quality") {
  if (!canUseServerApi()) {
    return;
  }

  const normalizedSection = normalizeDocumentSection(section);

  try {
    const response = await fetch(`./api/documents?client=${encodeURIComponent(client)}&section=${encodeURIComponent(normalizedSection)}`, {
      credentials: "same-origin",
      cache: "no-store"
    });

    if (!response.ok) {
      return;
    }

    const payload = await response.json();
    const collectionKey = getDocumentCollectionKey(client, normalizedSection);
    const nextDocuments = Array.isArray(payload.documents) ? payload.documents : [];
    documentServerDocuments.set(collectionKey, nextDocuments);

    documentDeletedPaths.clear();
    (payload.deletedPaths || []).forEach((deletedPath) => {
      documentDeletedPaths.add(deletedPath);
    });
    documentDeletedDocuments = Array.isArray(payload.deletedDocuments) ? payload.deletedDocuments : [];
  } catch {
    // Keep base library visible when the Node API is unavailable.
  }
}

function updateDocumentAccess(lang) {
  const adminActive = isAdmin();

  if (documentUploadButtonNode) {
    documentUploadButtonNode.hidden = !adminActive;
  }

  if (!adminActive && documentActionStatusKey && documentActionStatusNode) {
    setDocumentActionStatus(lang);
  }
}

async function uploadDocumentFile(file, client, section, lang) {
  if (!file || !isAdmin()) {
    setDocumentActionStatus(lang, "documentPageViewerReadonly", "info");
    return;
  }

  if (!canUseServerApi()) {
    setDocumentActionStatus(lang, "documentPageServerRequired", "error");
    return;
  }

  const limit = getDocumentUploadLimit(file);
  if (file.size > limit.bytes) {
    setDocumentActionStatus(lang, limit.errorKey, "error");
    return;
  }

  setDocumentActionStatus(lang, "documentPageUploading", "info");

  try {
    const dataUrl = await readFileAsDataUrl(file);
    const response = await fetch("./api/documents", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client,
        section,
        title: file.name,
        mediaType: file.type || "",
        dataUrl
      })
    });

    if (!response.ok) {
      throw new Error("upload_failed");
    }

    const payload = await response.json();
    await loadServerDocuments(client, section);
    setDocumentActionStatus(lang, "documentPageUploadSuccess", "success");
    selectDocument(payload.document?.path || getClientDocuments(client, section).slice(-1)[0]?.path || "", client, section);
  } catch {
    setDocumentActionStatus(lang, "documentPageUploadError", "error");
  }
}

async function deleteDocumentFile(documentItem, client, section, lang) {
  if (!documentItem || !isAdmin()) {
    setDocumentActionStatus(lang, "documentPageViewerReadonly", "info");
    return;
  }

  if (!confirmDeleteAction(lang)) {
    return;
  }

  if (!canUseServerApi()) {
    setDocumentActionStatus(lang, "documentPageServerRequired", "error");
    return;
  }

  try {
    const response = await fetch("./api/documents", {
      method: "DELETE",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client,
        section,
        id: documentItem.id || "",
        path: documentItem.path,
        title: documentItem.title,
        mediaType: documentItem.mediaType,
        sourcePaths: documentItem.sourcePaths || [],
        gallery: documentItem.gallery || [],
        cloudinaryPublicId: documentItem.cloudinaryPublicId || "",
        cloudinaryResourceType: documentItem.cloudinaryResourceType || "",
        cloudinaryGallery: documentItem.cloudinaryGallery || []
      })
    });

    if (!response.ok) {
      throw new Error("delete_failed");
    }

    await loadServerDocuments(client, section);
    const nextDocuments = getClientDocuments(client, section);
    const nextSelectedPath = nextDocuments[0] ? nextDocuments[0].path : "";
    documentSelectionOverride = nextSelectedPath;
    window.history.replaceState({}, "", getDocumentViewerPageUrl(client, nextSelectedPath, section));
    updateDocumentViewer(lang);
    setDocumentActionStatus(lang, "documentPageDeleteSuccess", "success");
  } catch {
    setDocumentActionStatus(lang, "documentPageDeleteError", "error");
  }
}

function updateDocumentActions(client) {
  if (!documentActionNodes.length) {
    return;
  }

  documentActionNodes.forEach((button) => {
    if (button.dataset.docStaticClient === "true") {
      return;
    }

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
  const isComplaintsDocumentSection = section === "complaints-formal" || section === "complaints-informal";

  document.body.classList.toggle("document-viewer-page--weekly-complaints", isComplaintsDocumentSection);
  document.body.classList.toggle("document-viewer-page--complaints-formal", section === "complaints-formal");
  document.body.classList.toggle("document-viewer-page--complaints-informal", section === "complaints-informal");

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

      if (isAdmin()) {
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "document-viewer-doc-delete";
        deleteButton.textContent = getText(lang, "documentPageDelete");
        deleteButton.addEventListener("click", () => {
          deleteDocumentFile(documentItem, client, section, lang);
        });
        item.appendChild(deleteButton);
      }

      documentListNode.appendChild(item);
    });
  }

  const hasDocuments = sortedDocuments.length > 0;
  const hasSelectedDocument = Boolean(documentPath);

  if (documentFullscreenButtonNode) {
    documentFullscreenButtonNode.disabled = !hasSelectedDocument;
  }

  if (documentActionStatusKey) {
    setDocumentActionStatus(lang, documentActionStatusKey, documentActionStatusState);
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
      activeDocumentZoom = 1;
      activeGalleryItems = activeDocument.gallery.slice();
      activeGalleryIndex = 0;
      updatePdfPager();

      if (documentPdfNode) {
        documentPdfNode.hidden = false;
        renderImageGallerySlide(activeGalleryItems[activeGalleryIndex]);
      }
    } else if (isImageDocument(activeDocument, documentPath)) {
      activeDocumentZoom = 1;
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
  if (documentUploadButtonNode && documentUploadInputNode) {
    documentUploadButtonNode.addEventListener("click", () => {
      if (!isAdmin()) {
        setDocumentActionStatus(document.documentElement.lang || "fr", "documentPageViewerReadonly", "info");
        return;
      }

      documentUploadInputNode.click();
    });

    documentUploadInputNode.addEventListener("change", async (event) => {
      const file = event.target.files && event.target.files[0];
      const { client, section } = getDocumentViewerConfig();
      await uploadDocumentFile(file, client, section, document.documentElement.lang || "fr");
      documentUploadInputNode.value = "";
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

  if (documentFrameNode) {
    const { client, section } = getDocumentViewerConfig();
    loadServerDocuments(client, section).finally(() => {
      updateDocumentViewer(document.documentElement.lang || "fr");
      updateDocumentAccess(document.documentElement.lang || "fr");
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

  placeholderNodes.forEach((node) => {
    node.placeholder = getText(lang, node.dataset.i18nPlaceholder);
  });

  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  updateStoredClient(lang);
  updateDocumentViewer(lang);
  updateSupportCenter(lang);
  renderDashboardQuizResults(lang);
  applyRoleUi(lang);
  setVerifyButtonLabel(lang, verifyButtonKey, verifyButtonDisabled);
  if (locationStatusKey) {
    setLocationStatusByKey(lang, locationStatusKey, locationStatusState);
  }

  if (adminPasswordInput) {
    adminPasswordInput.placeholder = getText(lang, "adminPasswordPlaceholder");
  }

  updateAdminPasswordVisibilityLabel(lang);

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
  if (client === "versigent") {
    return "clientVersigent";
  }

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
    "dashboard-client--tesla",
    "dashboard-client--versigent"
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

function unlockLocationGate(mode = "visitor") {
  sessionStorage.setItem(LOCATION_ACCESS_KEY, "granted");
  sessionStorage.setItem(LOCATION_ACCESS_MODE_KEY, mode);

  if (mode === "visitor") {
    sessionStorage.setItem(LOCATION_ACCESS_AT_KEY, String(Date.now()));
  } else {
    sessionStorage.removeItem(LOCATION_ACCESS_AT_KEY);
  }
}

function hasLocationAccess() {
  const granted = sessionStorage.getItem(LOCATION_ACCESS_KEY) === "granted";
  if (!granted) {
    return false;
  }

  if (!isVisitorAccessMode()) {
    return true;
  }

  const grantedAt = Number(sessionStorage.getItem(LOCATION_ACCESS_AT_KEY) || "0");
  if (!grantedAt || Number.isNaN(grantedAt)) {
    sessionStorage.removeItem(LOCATION_ACCESS_KEY);
    sessionStorage.removeItem(LOCATION_ACCESS_MODE_KEY);
    sessionStorage.removeItem(LOCATION_ACCESS_AT_KEY);
    return false;
  }

  const isExpired = Date.now() - grantedAt > VISITOR_ACCESS_DURATION_MS;
  if (isExpired) {
    sessionStorage.removeItem(LOCATION_ACCESS_KEY);
    sessionStorage.removeItem(LOCATION_ACCESS_MODE_KEY);
    sessionStorage.removeItem(LOCATION_ACCESS_AT_KEY);
    setAdminState(false);
    return false;
  }

  return true;
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
    setAdminState(false);
    unlockLocationGate("visitor");
    void clearAdminSessionOnServer();
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
    document.body.classList.contains("document-viewer-page") ||
    document.body.classList.contains("support-page");
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
      setLocationStatusByKey(lang, "locationWaiting", "info");
      setLocationDetail("");
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

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener("click", () => {
      openAdminLoginModal(document.documentElement.lang || "fr");
    });
  }

  if (visitorModeButtonNode) {
    visitorModeButtonNode.addEventListener("click", () => {
      activateVisitorMode();
    });
  }

  if (adminLoginCloseBtn) {
    adminLoginCloseBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeAdminLoginModal();
    });
  }

  if (adminLoginModal) {
    adminLoginModal.addEventListener("click", (event) => {
      if (event.target === adminLoginModal) {
        closeAdminLoginModal();
      }
    });
  }

  if (supportPhotoLightboxCloseNode) {
    supportPhotoLightboxCloseNode.addEventListener("click", () => {
      closeSupportPhotoLightbox();
    });
  }

  if (supportPhotoLightboxNode) {
    supportPhotoLightboxNode.addEventListener("click", (event) => {
      if (event.target === supportPhotoLightboxNode) {
        closeSupportPhotoLightbox();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && supportPhotoLightboxNode && !supportPhotoLightboxNode.hidden) {
      closeSupportPhotoLightbox();
      return;
    }

    if (event.key === "Escape" && adminLoginModal && !adminLoginModal.hidden) {
      closeAdminLoginModal();
    }
  });

  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await handleAdminLogin((adminPasswordInput && adminPasswordInput.value.trim()) || "", document.documentElement.lang || "fr");
    });
  }

  if (adminPasswordToggleBtn && adminPasswordInput) {
    adminPasswordToggleBtn.addEventListener("click", () => {
      adminPasswordInput.type = adminPasswordInput.type === "password" ? "text" : "password";
      updateAdminPasswordVisibilityLabel(document.documentElement.lang || "fr");
    });
  }

  clientCardNodes.forEach((card) => {
    card.addEventListener("click", () => {
      localStorage.setItem(CLIENT_STORAGE_KEY, card.dataset.client || "stellantis");
      openDashboard();
    });
  });

  if (weeklyComplaintsActionNode) {
    weeklyComplaintsActionNode.addEventListener("click", () => {
      openWeeklyComplaints();
    });
  }

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

  if (dashboardQuizResultsRefreshNode) {
    dashboardQuizResultsRefreshNode.addEventListener("click", () => {
      loadDashboardQuizResults(document.documentElement.lang || "fr");
    });
  }

  if (dashboardQuizResultsSearchNode) {
    dashboardQuizResultsSearchNode.addEventListener("input", () => {
      renderDashboardQuizResults(document.documentElement.lang || "fr");
    });
  }

  if (dashboardQuizResultsDownloadNode) {
    dashboardQuizResultsDownloadNode.addEventListener("click", (event) => {
      if (!isAdmin()) {
        event.preventDefault();
      }
    });
  }
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
setAdminState(false);
localStorage.removeItem(ADMIN_STORAGE_KEY);
localStorage.removeItem("sc-training-location-access-persist");
setLanguage(localStorage.getItem(STORAGE_KEY) || "fr");
syncAdminSession();

