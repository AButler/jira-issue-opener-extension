var JiraHelpers = {
  isNumberOnly: function( id ) {
    var numberRegEx = /^[0-9]+$/g;
  
    return !!id.match( numberRegEx );
  },

  generateJiraIssueListUrl( baseUrl ) {
    return `${baseUrl}/issues/`;
  },

  generateJiraIssueUrl: function( baseUrl, id ) {
    return `${baseUrl}/browse/${id}`;
  },

  generateJiraSearchUrl: function( baseUrl, defaultProject, text ) {
    var url = `${baseUrl}/issues/?jql=`;

    if( defaultProject ) {
      url += 'project%20%3D%20"' + encodeURIComponent( defaultProject ) + '"%20and%20';
    }

    url += 'text%20~%20"' + encodeURIComponent( text ) + '"%20order%20by%20created%20DESC';

    return url;
  },

  isJiraId: function( id ) {
    var jiraRegEx = /^((?!([A-Z0-9a-z]{1,10})-?$)[A-Za-z]{1}[A-Z0-9a-z]+-\d+)$/g;
  
    return !!id.match( jiraRegEx );
  }
};