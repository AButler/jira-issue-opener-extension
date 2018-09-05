function initialize() {
  document.getElementById( 'submit' ).addEventListener( 'click', onSubmit );
  document.getElementById( 'cancel' ).addEventListener( 'click', onCancel );

  chrome.storage.sync.get( {
    baseUrl: 'https://',
    defaultProject: null
  }, function( items ) {
    document.getElementById( 'baseUrl' ).value = items.baseUrl;
    document.getElementById( 'defaultProject' ).value = items.defaultProject;
  } );
}

function onSubmit() {
  var baseUrl = document.getElementById( 'baseUrl' ).value.trim();
  var defaultProject = document.getElementById( 'defaultProject' ).value.trim();

  if( baseUrl.endsWith( '/' ) ) {
    baseUrl = baseUrl.substring( 0, baseUrl.length - 1 );
  }

  chrome.storage.sync.set( {
    baseUrl: baseUrl,
    defaultProject: defaultProject
  }, function() {
    window.close();
  } );
}

function onCancel() {
  window.close();
}

document.addEventListener( 'DOMContentLoaded', initialize );