const pricePerDayCap = 40;
let statusRef = {
    "GROOM_BUTTON_PENDING": false,
    "SLEEP_BUTTON_PENDING": false,
    "FEED_BUTTON_PENDING": false,
    "MISSION_BUTTON_PENDING": false,
    "WAITING_FOR_EC_TABLE": false,
};

// TABLE OF DEFINITIONS
let definitions = {
    "boutonCoucher": "sleep",
    "boutonPanser": "groom",
    "boutonNourrir": "feed",
    "boutonMissionEquus": "missions",
    "nourrir-entame": "Done feeding",
    "nourrir": "Yet to be fed"
}

// This is for if we were loaded from https://us.howrse.com/elevage/chevaux/cheval

const winPath = window.location.pathname;
console.log(winPath);
if (winPath) {
    if (winPath.includes("elevage/chevaux/cheval")) {
        console.log("Inside case ", "elevage/chevaux/cheval")
        monitorCareTab();
        monitorECButton();
        presetHayAndOats();
        monitorCareTabButtons();
        console.log("Done inside case ", "elevage/chevaux/cheval")
    }
    else if (winPath.includes("elevage/chevaux/centreInscription")) {
        console.log("Inside case ", "elevage/chevaux/centreInscription")
        sortECTable();
        watchECPage();
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


function checkForAscOrDesc(aElement) {
    let firstA_img = $(aElement).find("img");
    if (firstA_img && firstA_img[0]) {
        let firstA_img_src = $(firstA_img).attr("src");
        if (firstA_img_src && firstA_img_src.includes("desc")) {
            return true;
        }
        else if (firstA_img_src && firstA_img_src.includes("asc")) {
            return false;
        }
    }
    return null;
}

async function checkButtonsConnected(buttonCase) {
    const isExtensionEnabled = await getData("extensionEnabled");

    if (!isExtensionEnabled) {
        return;
    }

    switch (buttonCase) {
        case "ALL": {
            if (!statusRef["GROOM_BUTTON_PENDING"]) {
                waitForElement("#boutonNourrir").then(async (but) => {
                    // Cleanup function. If this is clicked, we want to click groom.
                    // console.log("Value is ", value);
                    const jqueryVal = $(but);
                    if (jqueryVal && jqueryVal.hasClass("nourrir-entame")) {
                        clickGroom();
                    }
                });
            }

            if (!statusRef["SLEEP_BUTTON_PENDING"]) {
                waitForElement("#boutonNourrir").then(async (but) => {
                    // Cleanup function. If this is clicked, we want to click groom.
                    // console.log("Value is ", value);
                    const jqueryVal = $(but);
                    if (jqueryVal && jqueryVal.hasClass("nourrir-entame")) {
                        clickSleep();
                    }
                });
            }

            if (!statusRef["MISSION_BUTTON_PENDING"]) {
                waitForElement("#boutonNourrir").then(async (but) => {
                    // Cleanup function. If this is clicked, we want to click groom.
                    // console.log("Value is ", value);
                    const jqueryVal = $(but);
                    if (jqueryVal && jqueryVal.hasClass("nourrir-entame")) {
                        clickMission();
                    }
                });
            }
        }
    }
}

async function monitorCareTabButtons() {
    waitForElement("#boutonNourrir").then(async (feedBut) => {
        $(feedBut).on('click', () => { presetHayAndOats(); });

    });
    checkButtonsConnected("ALL");
}

async function watchECPage() {

    waitForElement("#centresContent").then(async (value) => {
        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: true, subtree: true, attributeFilter: ['style'] };

        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                // console.log("Mutation is ", mutation)
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
                // console.log("Mutation is ", mutation)
                if (mutation.type === 'childList') {
                    // Do button checking here?
                    checkButtonsConnected("ALL");
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
    const isFeedEnabled = await getData("autoFeedEnabled");
    if (!isFeedEnabled) {
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
        $(value).on('click', () => {
            clickGroom();
            clickMission();
        });

    });
}

async function clickSleep() {
    const isExtensionEnabled = await getData("extensionEnabled");
    if (!isExtensionEnabled) {
        return;
    }
    const isSleepEnabled = await getData("autoGroomSleepEnabled");
    if (!isSleepEnabled) {
        return;
    }

    statusRef["SLEEP_BUTTON_PENDING"] = true;
    setTimeout(() => {
        waitForElement("#boutonCoucher").then((but) => {
            if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }

            $(but).on('click', () => { statusRef["SLEEP_BUTTON_PENDING"] = false; }); // end debounce after click registered
            but.click();

        });
    }, 100);
}

async function clickGroom() {
    const isExtensionEnabled = await getData("extensionEnabled");
    if (!isExtensionEnabled) {
        return;
    }
    const isGroomEnabled = await getData("autoGroomSleepEnabled");
    if (!isGroomEnabled) {
        return;
    }

    statusRef["GROOM_BUTTON_PENDING"] = true;
    setTimeout(() => {
        waitForElement("#boutonPanser").then((but) => {
            if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }

            $(but).on('click', () => { statusRef["GROOM_BUTTON_PENDING"] = false; }); // end debounce after click registered
            but.click();
        });
    }, 100);
}

async function clickMission() {
    const isExtensionEnabled = await getData("extensionEnabled");
    if (!isExtensionEnabled) {
        return;
    }

    const isMissionsEnabled = await getData("autoMissionEnabled");
    if (!isMissionsEnabled) {
        return;
    }

    statusRef["MISSION_BUTTON_PENDING"] = true;
    setTimeout(() => {
        waitForElement("#boutonMissionEquus").then((but) => { // Case for lesson mission
            if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }

            $(but).on('click', () => { statusRef["MISSION_BUTTON_PENDING"] = false; }); // end debounce after click registered
            but.click();
        });
    }, 100);
    setTimeout(() => {
        waitForElement("#boutonMissionForet").then((but) => { // Case for wood mission
            if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }

            $(but).on('click', () => { statusRef["MISSION_BUTTON_PENDING"] = false; }); // end debounce after click registered
            but.click();
        });
    }, 100);
    setTimeout(() => {
        waitForElement("#boutonMissionMontagne").then((but) => { // Case for iron mission
            if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }

            $(but).on('click', () => { statusRef["MISSION_BUTTON_PENDING"] = false; }); // end debounce after click registered
            but.click();
        });
    }, 100);

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

        if (firstRowButtons[1]) {
                // console.log("Going to click firstRowButtons[1]")
            firstRowButtons[1].click();
        }
        else if (firstRowButtons[2]) {
                // console.log("Going to click firstRowButtons[2]")
            firstRowButtons[2].click();
        }
        else if (firstRowButtons[3]) {
                // console.log("Going to click firstRowButtons[3]")
            firstRowButtons[3].click();
        }

        }
    }, 100);
    }

}