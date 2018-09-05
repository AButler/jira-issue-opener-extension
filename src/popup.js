'use strict';

let defaultProject = null;
let baseUrl = null;
const enterKeyCode = 13;

function initialize( e ) {
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

  if( isNumberOnly( id ) && defaultProject ) {
    id = `${defaultProject}-${id}`;
  }

  if( !isJiraId( id ) ) {
    return false;
  }

  chrome.tabs.create( { url: generateUrl( id ) } );
  return true;
}

function generateUrl( id ) {
  return `${baseUrl}/browse/${id}`;
}

function isNumberOnly( id ) {
  var numberRegEx = /^[0-9]+$/g;

  return !!id.match( numberRegEx );
}

function isJiraId( id ) {
  var jiraRegEx = /^((?!([A-Z0-9a-z]{1,10})-?$)[A-Z]{1}[A-Z0-9]+-\d+)$/g;

  return !!id.match( jiraRegEx );
}

document.addEventListener( 'DOMContentLoaded', initialize );