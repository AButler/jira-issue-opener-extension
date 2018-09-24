# JIRA Issue Opener

Google Chrome Extension to open Jira issues quickly.

## How To Use

### Open via Popup

Click the icon to open the popup, enter a Jira ID and click `Open Jira` to open the issue in a new tab.

### Open via Text Selection

Select a Jira ID on a website and click the icon to open the selected Jira ID in a new tab.

### Search using the Omnibox

Enter `jira` in to the omnibox to start a search followed by your search text. Enter a Jira ID to go straight to that issue (note: numbers will automatically be prefixed by your default project) or enter search text to search for an issue.

## Options

### Jira URL

This is the base URL for your Jira instance. The extension will append `/browse/{Jira ID}` to the end of this URL to open the Jira issue.

### Default Project

This is the project key to use as a default project. If only a number is selected, the extension will prepend this project key before it. It will also populate the popup with this project key by default.

## How to report issues

Create an issue on GitHub for any issues that are found with the extension