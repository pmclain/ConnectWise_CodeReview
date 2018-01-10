
const findPotentialTicket = function () {
    const pattern = /\d{6}/;
    const commentBody = document.querySelector('td.comment-body').innerText;
    const branchName = document.querySelector('span.commit-ref.head-ref').title;

    let result = '';
    if (commentBody.match(pattern)) {
        result = commentBody.match(pattern)[0];
    } else if (branchName.match(pattern)) {
        result = branchName.match(pattern)[0];
    }

    return result;
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.action == "getPR") {
        sendResponse({
            title: document.querySelector('span.js-issue-title').innerText,
            ticket: findPotentialTicket()
        });
    } else {
        sendResponse({});
    }
});
