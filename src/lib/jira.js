const JiraHelpers = {
  isNumberOnly: (id) => {
    var numberRegEx = /^[0-9]+$/g;

    return !!id.match(numberRegEx);
  },

  generateJiraIssueListUrl: (baseUrl) => {
    return `${baseUrl}/issues/`;
  },

  generateJiraIssueUrl: (baseUrl, id) => {
    return `${baseUrl}/browse/${id}`;
  },

  generateJiraSearchUrl: (baseUrl, defaultProject, text) => {
    let url = `${baseUrl}/issues/?jql=`;

    if (defaultProject) {
      url +=
        'project%20%3D%20"' + encodeURIComponent(defaultProject) + '"%20and%20';
    }

    url +=
      'text%20~%20"' +
      encodeURIComponent(text) +
      '"%20order%20by%20created%20DESC';

    return url;
  },

  isJiraId: (id) => {
    const jiraRegEx =
      /^((?!([A-Z0-9a-z]{1,10})-?$)[A-Za-z]{1}[A-Z0-9a-z]+-\d+)$/g;

    return !!id.match(jiraRegEx);
  },
};
