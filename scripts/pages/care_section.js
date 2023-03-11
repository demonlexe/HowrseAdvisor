async function mappingTestPoints() {
    missionValArr = await getData("missionButtonMappings") || missionValOffsetUninit;
    sleepValArr = await getData("sleepButtonMappings") || sleepValOffsetUninit;

    calcMeanAndStandardDeviation(missionValArr, "mission");
    calcMeanAndStandardDeviation(sleepValArr, "sleep");

    // console.log("Means and standard deviation", locStruct);

    // console.log("Value arrays are ", missionValArr, sleepValArr)
    waitForElement("#boutonMissionEquus").then(async (but) => { // Case for lesson mission
        if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }
        const isMissionsEnabled = await getData("autoMissionEnabled");
        if (isMissionsEnabled) {
            // don't collect data from automated clicks
            return;
        }

        but.onclick = function (e) {
            // e = Mouse click event.
            var rect = e.target.getBoundingClientRect();
            var x = e.clientX - rect.left; //x position within the element.
            var y = e.clientY - rect.top;  //y position within the element.
            console.log("Left? : " + x + " ; Top? : " + y + ".");
            let combinedPos = {
                x: x,
                y: y
            }
            missionValArr.push(combinedPos);
            setData("missionButtonMappings", missionValArr);
        }

    });
    waitForElement("#boutonMissionForet").then(async (but) => { // Case for wood mission
        if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }
        const isMissionsEnabled = await getData("autoMissionEnabled");
        if (isMissionsEnabled) {
            // don't collect data from automated clicks
            return;
        }

        but.onclick = function (e) {
            // e = Mouse click event.
            var rect = e.target.getBoundingClientRect();
            var x = e.clientX - rect.left; //x position within the element.
            var y = e.clientY - rect.top;  //y position within the element.
            console.log("Left? : " + x + " ; Top? : " + y + ".");
            let combinedPos = {
                x: x,
                y: y
            }
            missionValArr.push(combinedPos);
            setData("missionButtonMappings", missionValArr);
        }
    });
    waitForElement("#boutonMissionMontagne").then(async (but) => { // Case for iron mission
        const isMissionsEnabled = await getData("autoMissionEnabled");
        if (isMissionsEnabled) {
            // don't collect data from automated clicks
            return;
        }
        if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }

        but.onclick = function (e) {
            // e = Mouse click event.
            var rect = e.target.getBoundingClientRect();
            var x = e.clientX - rect.left; //x position within the element.
            var y = e.clientY - rect.top;  //y position within the element.
            console.log("Left? : " + x + " ; Top? : " + y + ".");
            let combinedPos = {
                x: x,
                y: y
            }
            missionValArr.push(combinedPos);
            setData("missionButtonMappings", missionValArr);
        }
    });
    waitForElement("#boutonMissionPlage").then(async (but) => { // Case for desert mission

        const isMissionsEnabled = await getData("autoMissionEnabled");
        if (isMissionsEnabled) {
            // don't collect data from automated clicks
            return;
        }
        if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }
        but.onclick = function (e) {
            // e = Mouse click event.
            var rect = e.target.getBoundingClientRect();
            var x = e.clientX - rect.left; //x position within the element.
            var y = e.clientY - rect.top;  //y position within the element.
            console.log("Left? : " + x + " ; Top? : " + y + ".");
            let combinedPos = {
                x: x,
                y: y
            }
            missionValArr.push(combinedPos);
            setData("missionButtonMappings", missionValArr);
        }
    });
}
async function mappingTestPointsSleep() {
    waitForElement("#boutonCoucher").then(async (but) => {
        const isSleepEnabled = await getData("autoGroomSleepEnabled");
        if (isSleepEnabled) {
            // don't collect data from automated clicks
            return;
        }
        if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }
        but.onclick = function (e) {
            // e = Mouse click event.
            var rect = e.target.getBoundingClientRect();
            var x = e.clientX - rect.left; //x position within the element.
            var y = e.clientY - rect.top;  //y position within the element.
            console.log("Left? : " + x + " ; Top? : " + y + ".");
            let combinedPos = {
                x: x,
                y: y
            }
            sleepValArr.push(combinedPos);
            setData("sleepButtonMappings", sleepValArr);
        }
    })
}

async function checkButtonsConnected(buttonCase) {
    const isExtensionEnabled = await getData("extensionEnabled");

    if (!isExtensionEnabled) {
        return;
    }

    switch (buttonCase) {
        case "ALL": {
            // if (!statusRef["GROOM_BUTTON_PENDING"]) {
            //     waitForElement("#boutonNourrir").then(async (but) => {
            //         // Cleanup function. If this is clicked, we want to click groom.
            //         // console.log("Value is ", value);
            //         const jqueryVal = $(but);
            //         if (jqueryVal && jqueryVal.hasClass("nourrir-entame")) {
            //             clickGroom();
            //         }
            //     });
            // }

            waitForElement("#boutonPanser").then(async (but) => {
                const jqueryVal = $(but);
                if (jqueryVal && jqueryVal.hasClass("action-disabled")) {
                    clickSleep();
                }
            });

            // Click mission button if horse has been fed

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
async function monitorCareTabButtons() {
    waitForElement("#boutonNourrir").then(async (feedBut) => {
        $(feedBut).on('click', () => { presetHayAndOats(); });

    });
    checkButtonsConnected("ALL");
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



    waitForElement("#care-tab-feed").then((careTab) => {
        let findSliderVal;
        const isUnderWeight = $(careTab).find('span:contains("underweight")').first();
        const isOverWeight = $(careTab).find('span:contains("too fat")').first();

        waitForElement("#haySlider").then((value) => {
            const parent = $(value).parent();
            const hayQuantity = $(parent).find('span.section-fourrage-quantity').first().text();
            // console.log("hayQuantity is ", hayQuantity)
            const quantities = hayQuantity.split('/');
            const hayQuantityNumber = parseInt(quantities[0]);
            const hayQuantityMax = parseInt(quantities[1]);
            const hayToGive = hayQuantityMax - hayQuantityNumber;
            // console.log("hayToGive is ", hayToGive)
            if (isUnderWeight && isUnderWeight[0]) {
                findSliderVal = $(value).find('li[data-number="' + 20 + '"]')
            }
            else if (isOverWeight && isOverWeight[0]) {
                findSliderVal = $(value).find('li[data-number="' + 0 + '"]')
            }
            else {
                findSliderVal = $(value).find('li[data-number="' + hayToGive + '"]')
            }

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
    })

}

async function watchFeedButton() {
    const isExtensionEnabled = await getData("extensionEnabled");
    if (!isExtensionEnabled) {
        return;
    }
    waitForElement("#feed-button").then(async (value) => {
        $(value).on('click', () => {
            // clickGroom();
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
        mappingTestPointsSleep();
        return;
    }

    if (!statusRef["SLEEP_BUTTON_PENDING"]) {
        statusRef["SLEEP_BUTTON_PENDING"] = true;
        setTimeout(() => {
            waitForElement("#boutonCoucher").then((but) => {
                if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }

                $(but).on('click', () => {
                    setTimeout(() => {
                        statusRef["SLEEP_BUTTON_PENDING"] = false;
                    }, 100);
                    setTimeout(async () => {
                        const doAutoNav = await getData("autoNavToNext");
                        if (!doAutoNav) {
                            return;
                        }
                        let navNext = document.getElementById("nav-next");
                        navNext.click();
                    }, 500)

                }); // end debounce after click registered
                // Create a synthetic click MouseEvent
                clickOverride(but, "sleep")
            });
        }, 250);
    }

}
// async function clickGroom() {
//     const isExtensionEnabled = await getData("extensionEnabled");
//     if (!isExtensionEnabled) {
//         return;
//     }
//     const isGroomEnabled = await getData("autoGroomSleepEnabled");
//     if (!isGroomEnabled) {
//         return;
//     }

//     statusRef["GROOM_BUTTON_PENDING"] = true;
//     setTimeout(() => {
//         waitForElement("#boutonPanser").then((but) => {
//             if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }

//             $(but).on('click', () => { statusRef["GROOM_BUTTON_PENDING"] = false; }); // end debounce after click registered
//             but.click();
//         });
//     }, 100);
// }

async function clickMission() {
    const isExtensionEnabled = await getData("extensionEnabled");
    if (!isExtensionEnabled) {
        return;
    }

    const isMissionsEnabled = await getData("autoMissionEnabled");
    if (!isMissionsEnabled) {
        return;
    }

    if (!statusRef["MISSION_BUTTON_PENDING"]) {
        statusRef["MISSION_BUTTON_PENDING"] = true;
        setTimeout(() => {
            waitForElement("#boutonMissionEquus").then((but) => { // Case for lesson mission
                if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }
                const hasEnoughEnergy = checkEnergyForMission("lessons");
                if (!hasEnoughEnergy) {
                    return;
                };

                $(but).on('click', () => { statusRef["MISSION_BUTTON_PENDING"] = false; }); // end debounce after click registered
                clickOverride(but, "mission")
            });
        }, 100);
        setTimeout(() => {
            waitForElement("#boutonMissionForet").then((but) => { // Case for wood mission
                if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }
                const hasEnoughEnergy = checkEnergyForMission("wood");
                if (!hasEnoughEnergy) {
                    return;
                };

                $(but).on('click', () => { statusRef["MISSION_BUTTON_PENDING"] = false; }); // end debounce after click registered
                clickOverride(but, "mission")
            });
        }, 100);
        setTimeout(() => {
            waitForElement("#boutonMissionMontagne").then((but) => { // Case for iron mission
                if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }
                const hasEnoughEnergy = checkEnergyForMission("iron");
                if (!hasEnoughEnergy) {
                    return;
                };


                $(but).on('click', () => { statusRef["MISSION_BUTTON_PENDING"] = false; }); // end debounce after click registered
                clickOverride(but, "mission")
            });
        }, 100);
        setTimeout(() => {
            waitForElement("#boutonMissionPlage").then((but) => { // Case for desert mission
                if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }
                const hasEnoughEnergy = checkEnergyForMission("sand");
                if (!hasEnoughEnergy) {
                    return;
                };


                $(but).on('click', () => { statusRef["MISSION_BUTTON_PENDING"] = false; }); // end debounce after click registered
                clickOverride(but, "mission")
            });
        }, 100);
    }

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