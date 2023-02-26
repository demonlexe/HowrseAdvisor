$("#redirect-but").on("click", function () {
    chrome.tabs.create({
        url: "../html/onboarding.html"
    });
});