// // chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
// //     console.log("onHistoryStateUpdated: " + details.url);
// // });

// // chrome.webNavigation.onDOMContentLoaded.addListener(function (details) {
// //     console.log("onDOMContentLoaded");
// // });

// let observer = new MutationObserver(mutations => {
//     for (let mutation of mutations) {
//         console.log("Mutation", mutation);
//         // for (let addedNode of mutation.addedNodes) {
//         //     if (addedNode.nodeName === "IMG") {
//         //         console.log("Inserted image", addedNode);
//         //     }
//         // }
//     }
// });
// observer.observe(document, { childList: true, subtree: true });

// // const filter = {
// //     url:
// //         [
// //             { hostContains: "example.com" },
// //             { hostPrefix: "developer" }
// //         ]
// // }

// // function logOnDOMContentLoaded(details) {
// //     console.log(`onDOMContentLoaded: ${details.url}`);
// // }
