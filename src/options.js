function initialize() {
  initializeLocale();

  document.getElementById("submit").addEventListener("click", onSubmit);
  document.getElementById("cancel").addEventListener("click", onCancel);

  chrome.storage.sync.get(
    {
      baseUrl: "https://",
      defaultProject: null,
    },
    function (items) {
      document.getElementById("baseUrl").value = items.baseUrl;
      document.getElementById("defaultProject").value = items.defaultProject;
    }
  );
}

function initializeLocale() {
  document.getElementById("lblBaseUrl").innerText = chrome.i18n.getMessage(
    "optionsBaseUrlLabel"
  );
  document.getElementById("lblDefaultProject").innerText =
    chrome.i18n.getMessage("optionsDefaultProjectLabel");
  document.getElementById("baseUrl").placeholder = chrome.i18n.getMessage(
    "optionsBaseUrlPlaceholder"
  );
  document.getElementById("defaultProject").placeholder =
    chrome.i18n.getMessage("optionsDefaultProjectPlaceholder");
  document.getElementById("submit").innerText =
    chrome.i18n.getMessage("optionsSubmitLabel");
  document.getElementById("cancel").innerText =
    chrome.i18n.getMessage("optionsCancelLabel");
}

function onSubmit() {
  let baseUrl = document.getElementById("baseUrl").value.trim();
  const defaultProject = document.getElementById("defaultProject").value.trim();

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.substring(0, baseUrl.length - 1);
  }

  chrome.storage.sync.set(
    {
      baseUrl: baseUrl,
      defaultProject: defaultProject,
    },
    function () {
      window.close();
    }
  );
}

function onCancel() {
  window.close();
}

document.addEventListener("DOMContentLoaded", initialize);
