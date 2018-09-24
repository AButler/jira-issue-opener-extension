var baseUrl, defaultProject;

function initialize() {
  chrome.storage.sync.get( {
    baseUrl: null,
    defaultProject: null
  }, function( items ) {
    baseUrl = items.baseUrl;
    defaultProject = items.defaultProject;
  } );
}

function openUrl( url, disposition ) {
  switch( disposition ) {
    case "currentTab":
      chrome.tabs.update( { url: url } );
      break;
    case "newForegroundTab":
      chrome.tabs.create( { url: url } );
      break;
    case "newBackgroundTab":
      chrome.tabs.create( { url: url, active: false } );
      break;
  }
}

function onOmniboxTextEntered( text, disposition ) {
  if( !baseUrl ) {
    return;
  }

  var url = null;
  var id = text;

  if( id ) {
    id = id.trim().replace( ' ', '-' );

    if( JiraHelpers.isNumberOnly( id ) && defaultProject ) {
      id = `${defaultProject}-${id}`;
    }

    if( JiraHelpers.isJiraId( id ) ) {
      url = JiraHelpers.generateJiraIssueUrl( baseUrl, id );
    } else {
      url = JiraHelpers.generateJiraSearchUrl( baseUrl, defaultProject, text );
    }
  } else {
    url = JiraHelpers.generateJiraIssueListUrl( baseUrl );
  }

  openUrl( url, disposition );
}

chrome.omnibox.onInputEntered.addListener( onOmniboxTextEntered );
initialize();