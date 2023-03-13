// waitForElement("#objects-body-content").then(async (objectsDiv) => {
//     waitForElement("#reproduction-wrapper").then((reproDiv) => {
//         const findReproButt = $(reproDiv).find("a.saillir");
//         let newImg;

//         if (findReproButt && findReproButt[0]) {
//             let currBut = findReproButt[0];
//             // const spot = $(missionDiv).find(".last");
//             // if (spot && spot[0]) {
//             //     const clone = $(currBut).clone().appendTo($(spot[0]));
//             // }

//             let coverMare = $(currBut).find('span:contains("Cover a mare")');
//             if (coverMare && coverMare[0]) {
//                 // This is a male horse than can make coverings.
//                 $(currBut).on('click', () => {
//                     console.log("Btn clicked!")
//                 });
//             }
//         }
//     })
// });

async function monitorMaleCovers() {
    waitForElement("#reproduction").then(async (value) => {
        const isExtensionEnabled = await getData("extensionEnabled");
        if (!isExtensionEnabled) {
            return;
        }

        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: true, subtree: true, attributeFilter: ['style'] };

        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                // console.log("Mutation is ", mutation)
                if (mutation.type === 'childList') {
                    // Do button checking here?

                } else if (mutation.type === 'attributes') {
                    // console.log(`The ${mutation.attributeName} attribute was modified.`, "Mutation is ", mutation);
                    const classList = mutation.target.classList // this returns an array of all classes
                    const className = mutation.target.className // this returns a string containing all the classes separated with an space
                    const id = mutation.target.id // this returns the id of the element
                    if (id === "reproduction-tab-2") {
                        let target = mutation.target;
                        let style = $(target).attr("style");
                        if (!style || style.includes("display: block")) {
                            autoCoverHorse(target);
                        }
                    }
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(value, config);
    });
}

async function autoCoverHorse(reproDiv) {
    let lists = $(reproDiv).find("ul");
    if (lists && lists[0]) {
        let publicLbl = $(lists[0]).find('input[value="public"]');
        if (publicLbl && publicLbl[0]) {
            $(publicLbl[0]).click();
            let priceLst = $("#formMalePublicPrice");
            if (priceLst && priceLst[0]) {
                $(priceLst[0]).val(500);
            }
        }
    }
}