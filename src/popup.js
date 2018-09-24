'use strict';

let defaultProject = null;
let baseUrl = null;
const enterKeyCode = 13;

function initialize( e ) {
  initializeLocale();

  chrome.storage.sync.get( {
    baseUrl: null,
    defaultProject: null
  }, function( items ) {
    if( !items.baseUrl ) {
      chrome.runtime.openOptionsPage();
      return;
    }

    baseUrl = items.baseUrl;
    defaultProject = items.defaultProject;
  
    chrome.tabs.executeScript( null, { code: 'window.getSelection().toString();'}, onTextSelected );

    document.getElementById( 'submit' ).addEventListener( 'click', onSubmit );
    document.getElementById( 'cancel' ).addEventListener( 'click', onCancel );
    document.getElementById( 'options' ).addEventListener( 'click', onOptionsClick );

    var idField = document.getElementById( 'id' );
    idField.addEventListener( 'keypress', onIdFieldKeypress );
    if( defaultProject ) {
      idField.value = `${defaultProject}-`;
    }
    idField.focus();
  } );
}

function initializeLocale() {
  document.getElementById( 'lblHeader' ).innerText = chrome.i18n.getMessage( "popupHeader" );
  document.getElementById( 'lblId' ).innerText = chrome.i18n.getMessage( "popupIdLabel" );
  document.getElementById( 'options' ).innerText = chrome.i18n.getMessage( "popupOptionsLabel" );
  document.getElementById( 'submit' ).innerText = chrome.i18n.getMessage( "popupSubmitLabel" );
  document.getElementById( 'cancel' ).innerText = chrome.i18n.getMessage( "popupCancelLabel" );
  document.getElementById( 'error' ).innerText = chrome.i18n.getMessage( "popupInvalidJiraMessage" );
}

function onTextSelected( selection ) {
  if( selection && selection.length > 0 ) {
    var handled = handleJiraLink( selection[0] );
    if( handled ) {
      window.close();
      return;
    }
  }
}

function onIdFieldKeypress( e ) {
  if( e.keyCode === enterKeyCode ) {
    onSubmit();
  }
}

function onSubmit() {
  var id = document.getElementById( 'id' ).value;

  var handled = handleJiraLink( id );
  if( handled ) {
    window.close();
    return;
  } 
  
  document.getElementById( 'error' ).classList.remove( 'hidden' );
}

function onCancel() {
  window.close();
}

function onOptionsClick() {
  chrome.runtime.openOptionsPage();
}

function handleJiraLink( id ) {
  if( !id ) {
    return false;
  }
  
  id = id.trim().replace( ' ', '-' );

  if( JiraHelpers.isNumberOnly( id ) && defaultProject ) {
    id = `${defaultProject}-${id}`;
  }

  if( !JiraHelpers.isJiraId( id ) ) {
    return false;
  }

  chrome.tabs.create( { url: JiraHelpers.generateJiraIssueUrl( baseUrl, id ) } );
  return true;
}

document.addEventListener( 'DOMContentLoaded', initialize );