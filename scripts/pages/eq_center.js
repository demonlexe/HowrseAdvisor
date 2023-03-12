async function watchECPage() {
    const isECEnabled = await getData("autoECEnabled");
    if (!isECEnabled) {
        return;
    }

    waitForElement("#centresContent").then(async (value) => {
        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: true, subtree: true, attributeFilter: ['style'] };

        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === 'childList') {
                    // Do button checking here?
                    // console.log("Child list mutation is ", mutation, "added nodes are ", mutation.addedNodes, " removed nodes are ", mutation.removedNodes);
                    if (mutation.removedNodes && mutation.removedNodes.length > 0) {
                        const firstRemoved = mutation.removedNodes[0];
                        if (firstRemoved && firstRemoved.id && firstRemoved.id.includes("table-0")) {
                            statusRef["WAITING_FOR_EC_TABLE"] = true;
                        }
                    }
                    else if (mutation.addedNodes && mutation.addedNodes.length > 0 && statusRef["WAITING_FOR_EC_TABLE"]) {
                        // then the EC table has likely been added now.
                        const triggeredA = $(value).find('a:contains("10 days")').first();
                        if (triggeredA) {
                            const isDescending = checkForAscOrDesc($(triggeredA).parent());
                            if (!isDescending) {
                                statusRef["WAITING_FOR_EC_TABLE"] = false;
                                setTimeout(() => {
                                    doneSortingEC();
                                }, 100)
                            }
                        }
                    }
                } else if (mutation.type === 'attributes') {
                    // console.log(`The ${mutation.attributeName} attribute was modified.`, "Mutation is ", mutation);
                    const classList = mutation.target.classList // this returns an array of all classes
                    const className = mutation.target.className // this returns a string containing all the classes separated with an space
                    const id = mutation.target.id // this returns the id of the element
                    // console.log("Class list is ", classList, " class name is ", className, " id is ", id);
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(value, config);
    });

}
async function sortECTable() {
    waitForElement("#table-0").then(async (value) => {

        const isExtensionEnabled = await getData("extensionEnabled");
        if (!isExtensionEnabled) {
            return;
        }
        const isECEnabled = await getData("autoECEnabled");
        if (!isECEnabled) {
            return;
        }

        setTimeout(() => {
            const aToTrigger = $('a:contains("10 days")')
            if (aToTrigger) {
                const firstA = $(aToTrigger).first();
                if (firstA && firstA[0]) {
                    const isDescending = checkForAscOrDesc($(firstA).parent());
                    if (isDescending == null) {
                        firstA[0].click();
                    };
                }
            }
        }, 500);
    });
}

async function monitorECButton() {
    waitForElement("#cheval-inscription").then(async (value) => {
        const isExtensionEnabled = await getData("extensionEnabled");
        if (!isExtensionEnabled) {
            return;
        }
        const isECEnabled = await getData("autoECEnabled");
        if (!isECEnabled) {
            return;
        }
        const hasHypnos = checkIfHasHypnos();
        if (hasHypnos) {
            // Don't enroll in EC if we have hypnos blanket.
            return;
        };

        // console.log("Element is ", value)
        const jqueryVal = $(value);
        if (value && jqueryVal) {
            const href = jqueryVal.find('a').attr('href');
            if (href) {
                // console.log("Url is ", href)
                window.location = href;

            }
        }
    });

}

function doneSortingEC() {
    setTimeout(() => {
        const oddRows = $("tr.odd.highlight");
        // const firstRow = $(tbody).find('tr').first();
        if (oddRows) {
            const firstRow = $(oddRows).first();
            // console.log("firstRow is ", firstRow)
            const firstRowButtons = $(firstRow).find('button');
            console.log("firstRowButtons is ", firstRowButtons)

            // if (firstRowButtons[1] && !($(firstRowButtons[1]).hasClass("disabled"))) {
            //     // console.log("Going to click firstRowButtons[1]")
            //     firstRowButtons[1].click();
            // }
            // else
            if (firstRowButtons[2] && !($(firstRowButtons[2]).hasClass("disabled"))) {
                // console.log("Going to click firstRowButtons[2]")
                firstRowButtons[2].click();
            }

        }
    }, 100);
}