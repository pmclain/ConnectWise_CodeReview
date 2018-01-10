# Toggl Code Review Chrome Extension
Create Toggl time entries with pull request information.

Toggl descriptions are pushed with the following format by default:  
`Code Review: {PR_TITLE} (#{CW_TICKET})`  

The extension attempts pulling the ConnectWise Ticket:  
1. First 6 digit number in pull request comment body  
2. First 6 digit number in branch name  

### Installation
 * Navigate to chrome://extensions/ in Chrome
 * Enable Developer Mode
 * Click "Load unpacked extension..."
 * Locate directory continaing `manifest.json`

### License
MIT