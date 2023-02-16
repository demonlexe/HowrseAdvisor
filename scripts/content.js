const pricePerDayCap = 40;

// This is for if we were loaded from https://us.howrse.com/elevage/chevaux/cheval

const winPath = window.location.pathname;
console.log(winPath);
if (winPath) {
    if (winPath.search("elevage/chevaux/cheval")) {
        console.log("Inside case ", "elevage/chevaux/cheval")
        monitorCareTab();
        monitorECButton();
        presetHayAndOats();
        monitorCareTabButtons();
        console.log("Done inside case ", "elevage/chevaux/cheval")
    }
    else if (winPath.search("elevage/chevaux/centreInscription")) {
        console.log("Inside case ", "elevage/chevaux/centreInscription")
        sortECTable();
        console.log("Done inside case ", "elevage/chevaux/centreInscription")
    }
}

function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function monitorCareTabButtons() {
    waitForElement("#boutonNourrir").then(async (value) => {
        $(value).on('click', () => { presetHayAndOats(); });

    });

    waitForElement("#boutonPanser").then(async (value) => {
        const isExtensionEnabled = await getData("extensionEnabled");

        if (!isExtensionEnabled) {
            return;

        }
        // Cleanup function. If this is clicked, we want to click sleep.
        // console.log("Value is ", value);
        const jqueryVal = $(value);
        if (jqueryVal && jqueryVal.hasClass("action-disabled")) {
            setTimeout(() => {
                waitForElement("#boutonCoucher").then((value) => {
                    if (value) {
                        value.click();
                    }
                });
            }, 500);
        }

    });
    waitForElement("#boutonCoucher").then(async (value) => {
        const isExtensionEnabled = await getData("extensionEnabled");

        if (!isExtensionEnabled) {
            return;

        }
        // Cleanup function. If this is clicked, we want to click sleep.
        // console.log("Value is ", value);
        const jqueryVal = $(value);
        if (jqueryVal && jqueryVal.hasClass("action-disabled")) {
            setTimeout(() => {
                waitForElement("#boutonPanser").then((value) => {
                    if (value) {
                        value.click();
                    }
                });
            }, 500);
        }

    });

}

async function sortECTable() {
    waitForElement("#table-0").then(async (value) => {

        const isExtensionEnabled = await getData("extensionEnabled");

        if (!isExtensionEnabled) {
            return;

        }


        setTimeout(() => {
            const aToTrigger = $('a:contains("10 days")')
            if (aToTrigger) {
                const firstA = $(aToTrigger).first();
                if (firstA && firstA[0]) {
                    // console.log("firstA is ", firstA)

                    firstA[0].click()
                    setTimeout(() => {
                        doneSorting();
                    }, 1000); // Wait for the columns to load, give enough time for person to decide
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

async function monitorCareTab() {
    waitForElement("#care").then(async (value) => {
        const isExtensionEnabled = await getData("extensionEnabled");

        if (!isExtensionEnabled) {
            return;

        }

        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: true, subtree: true, attributeFilter: ['style'] };

        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === 'childList') {
                    // // console.log('A child node has been added or removed. Mutation is ', mutation);
                    // const newNodes = mutation.addedNodes;
                    // if (newNodes && newNodes.length > 0) {
                    //     for (let i = 0; i < newNodes.length; i++) {
                    //         if (newNodes[i].id && newNodes[i].id == "care-wrapper") {
                    //             console.log("Care wrapper modified! ", newNodes[i]);
                    //         }
                    //     };
                    // }
                } else if (mutation.type === 'attributes') {
                    // console.log(`The ${mutation.attributeName} attribute was modified.`, "Mutation is ", mutation);
                    const classList = mutation.target.classList // this returns an array of all classes
                    const className = mutation.target.className // this returns a string containing all the classes separated with an space
                    const id = mutation.target.id // this returns the id of the element
                    if (id == "care-tab-main") {

                        // console.log("classList is ", classList, "className is ", className, "id is ", id)
                        presetHayAndOats();
                        const style = mutation.target.style;
                        let displayType = style.display;
                        // console.log("displayType is ", displayType);
                        if ((displayType && displayType == "block") || !displayType) {
                            // console.log("making request to click groom and sleep");
                            // clickGroom();
                        }
                    }
                    else if (id == "care-tab-feed") {
                        const style = mutation.target.style;
                        let displayType = style.display;
                        // console.log("displayType is ", displayType);
                        if (displayType != "none") {
                            watchFeedButton();
                        }
                        // if ((displayType && displayType == "block") || !displayType) {
                        //     console.log("making request to click groom and sleep");
                        //     clickGroom();
                        // }
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

async function presetHayAndOats() {
    const isExtensionEnabled = await getData("extensionEnabled");

    if (!isExtensionEnabled) {
        return;

    }

    waitForElement("#haySlider").then((value) => {
        const parent = $(value).parent();
        const hayQuantity = $(parent).find('span.section-fourrage-quantity').first().text();
        // console.log("hayQuantity is ", hayQuantity)
        const quantities = hayQuantity.split('/');
        const hayQuantityNumber = parseInt(quantities[0]);
        const hayQuantityMax = parseInt(quantities[1]);
        const hayToGive = hayQuantityMax - hayQuantityNumber;
        // console.log("hayToGive is ", hayToGive)
        const findSliderVal = $(value).find('li[data-number="' + hayToGive + '"]')
        // console.log("findSliderVal is ", findSliderVal)
        if (findSliderVal) {
            const firstSlider = $(findSliderVal).first();
            if (firstSlider && firstSlider[0]) {
                // console.log("firstSlider is ", firstSlider)
                firstSlider[0].click();
            }
        }
    });

    waitForElement("#oatsSlider").then((value) => {
        const parent = $(value).parent();
        const oatsQuantity = $(parent).find('span.section-avoine-quantity').first().text();
        // console.log("oatsQuantity is ", oatsQuantity)
        const quantities = oatsQuantity.split('/');
        const oatsQuantityNumber = parseInt(quantities[0]);
        const oatsQuantityMax = parseInt(quantities[1]);
        const oatsToGive = oatsQuantityMax - oatsQuantityNumber;
        // console.log("oatsToGive is ", oatsToGive)
        const findSliderVal = $(value).find('li[data-number="' + oatsToGive + '"]')
        // console.log("findSliderVal is ", findSliderVal)
        if (findSliderVal) {
            const firstSlider = $(findSliderVal).first();
            if (firstSlider && firstSlider[0]) {
                // console.log("firstSlider is ", firstSlider)
                firstSlider[0].click();
            }
        }
    });

}

async function watchFeedButton() {
    const isExtensionEnabled = await getData("extensionEnabled");

    if (!isExtensionEnabled) {
        return;

    }
    waitForElement("#feed-button").then(async (value) => {
        $(value).on('click', () => { clickGroom(); });

    });
}

async function clickGroom() {
    const isExtensionEnabled = await getData("extensionEnabled");

    if (!isExtensionEnabled) {
        return;

    }
    setTimeout(() => {

        waitForElement("#boutonPanser").then((value) => {
            if (value) {
                value.click();
            }
        });
        setTimeout(() => {
            waitForElement("#boutonCoucher").then((value) => {
                if (value) {
                    value.click();
                }
            });
        }, 500);

    }, 500);
}

function doneSorting() {
    const oddRows = $("tr.odd.highlight");
    // const firstRow = $(tbody).find('tr').first();
    if (oddRows) {
        const firstRow = $(oddRows).first();
        // console.log("firstRow is ", firstRow)
        const firstRowButtons = $(firstRow).find('button');
        // console.log("firstRowButtons is ", firstRowButtons)
        if (firstRowButtons[1]) {
            firstRowButtons[1].click();
        }
        else if (firstRowButtons[2]) {
            firstRowButtons[2].click();
        }
        else if (firstRowButtons[3]) {
            firstRowButtons[3].click();
        }
    }

}