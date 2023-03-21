"use strict";

let defaultProject = null;
let baseUrl = null;
const enterKeyCode = 13;

function getSelection() {
  return window.getSelection().toString();
}

async function getSettings() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(
      {
        baseUrl: null,
        defaultProject: null,
      },
      function (items) {
        resolve({
          baseUrl: items.baseUrl,
          defaultProject: items.defaultProject,
        });
      }
    );
  });
}

async function initialize(e) {
  initializeLocale();

  const settings = await getSettings();

  if (!settings.baseUrl) {
    chrome.runtime.openOptionsPage();
    return;
  }

  baseUrl = settings.baseUrl;
  defaultProject = settings.defaultProject;

  const tab = await getActiveTab();

  chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      func: getSelection,
    })
    .then((results) => {
      onTextSelected(results[0].result);
    });

  document.getElementById("submit").addEventListener("click", onSubmit);
  document.getElementById("cancel").addEventListener("click", onCancel);
  document.getElementById("options").addEventListener("click", onOptionsClick);

  var idField = document.getElementById("id");
  idField.addEventListener("keypress", onIdFieldKeypress);
  idField.focus();
}

function initializeLocale() {
  document.getElementById("lblHeader").innerText =
    chrome.i18n.getMessage("popupHeader");
  document.getElementById("lblId").innerText =
    chrome.i18n.getMessage("popupIdLabel");
  document.getElementById("options").innerText =
    chrome.i18n.getMessage("popupOptionsLabel");
  document.getElementById("submit").innerText =
    chrome.i18n.getMessage("popupSubmitLabel");
  document.getElementById("cancel").innerText =
    chrome.i18n.getMessage("popupCancelLabel");
  document.getElementById("error").innerText = chrome.i18n.getMessage(
    "popupInvalidJiraMessage"
  );
}

async function getActiveTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function onTextSelected(selection) {
  if (selection && selection.length > 0) {
    var handled = handleJiraLink(selection);
    if (handled) {
      window.close();
      return;
    }
  }
}

function onIdFieldKeypress(e) {
  if (e.keyCode === enterKeyCode) {
    onSubmit();
  }
}

function onSubmit() {
  var id = document.getElementById("id").value;

  var handled = handleJiraLink(id);
  if (handled) {
    window.close();
    return;
  }

  document.getElementById("error").classList.remove("hidden");
}

function onCancel() {
  window.close();
}

function onOptionsClick() {
  chrome.runtime.openOptionsPage();
}

function handleJiraLink(id) {
  if (!id) {
    return false;
  }

  id = id.trim().replace(" ", "-");

  if (JiraHelpers.isNumberOnly(id) && defaultProject) {
    id = `${defaultProject}-${id}`;
  }

  if (id.startsWith(`${defaultProject}-${defaultProject}-`)) {
    id = id.substring(defaultProject.length + 1);
  }

  if (!JiraHelpers.isJiraId(id)) {
    return false;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let index = 0;
    if (tabs && tabs.length) {
      index = tabs[0].index + 1;
    }

    chrome.tabs.create({
      index: index,
      url: JiraHelpers.generateJiraIssueUrl(baseUrl, id),
    });
  });

  return true;
}

document.addEventListener("DOMContentLoaded", initialize);
