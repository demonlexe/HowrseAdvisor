const pricePerDayCap = 40;
let statusRef = {
    // "GROOM_BUTTON_PENDING": false,
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

let competitionMapping = {
    "Kitty": 3,
    "Difficulty": 4,
    "Participants": 5,
}

const locStruct = {
    mission: {
        // mean
        // strd Dev
    },
    sleep: {
        // mean
        // strd DEv
    }
}
let missionValArr = [];
let sleepValArr = [];

const winPath = window.location.pathname;
console.log(winPath);
if (winPath) {
    if (winPath.includes("elevage/chevaux/cheval")) {
        console.log("Inside case ", "elevage/chevaux/cheval")
        mappingTestPoints();
        monitorCareTab();
        monitorECButton();
        presetHayAndOats();
        monitorCareTabButtons();
        displayItemsAtTop();
        console.log("Done inside case ", "elevage/chevaux/cheval")
    }
    else if (winPath.includes("elevage/chevaux/centreInscription")) {
        console.log("Inside case ", "elevage/chevaux/centreInscription")
        sortECTable();
        watchECPage();
        console.log("Done inside case ", "elevage/chevaux/centreInscription")
    }
    else if (winPath.includes("elevage/competition/")) {
        console.log("Inside case ", "elevage/competition/");
        watchCompetitionPage();
        chooseBestCompetition();
        console.log("Done inside case ", "elevage/competition/");
    }
    else if (winPath.includes("/chevaux/choisirNoms")) {
        console.log("Inside case ", "/chevaux/choisirNoms");
        chooseSampleName();
        console.log("Done inside case ", "/chevaux/choisirNoms");
    }
}

function calcMeanAndStandardDeviation(ValArr, strName) {
    let XTot = 0;
    let YTot = 0;
    let ct = 0;

    // Calculate mean
    for (let i = 0; i < ValArr.length; i++) {
        if (ValArr[i]) {
            if (ValArr[i]["x"]) {
                XTot += ValArr[i]["x"];
            }
            if (ValArr[i]["y"]) {
                YTot += ValArr[i]["y"];
            }
            ct++;
        }
    }
    let MeanX = XTot / ct;
    let MeanY = YTot / ct;

    // Calculate standard deviation
    let NumeratorX = 0;
    let NumeratorY = 0;
    for (let i = 0; i < ValArr.length; i++) {
        if (ValArr[i]) {
            if (ValArr[i]["x"]) {
                let top = Math.pow((ValArr[i]["x"] - MeanX), 2)
                NumeratorX += top;
            }
            if (ValArr[i]["y"]) {
                let top = Math.pow((ValArr[i]["y"] - MeanY), 2)
                NumeratorY += top;
            }
            ct++;
        }
    }

    let StandardDevX = Math.sqrt(NumeratorX / (ct - 1));
    let StandardDevY = Math.sqrt(NumeratorY / (ct - 1));

    locStruct[strName] = {
        "xMean": MeanX,
        "yMean": MeanY,
        "xDev": StandardDevX,
        "yDev": StandardDevY
    };
}

async function mappingTestPoints() {
    missionValArr = await getData("missionButtonMappings") || [];
    sleepValArr = await getData("sleepButtonMappings") || [];

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

function clickOverride(element, locStructKey) {
    var rect = element.getBoundingClientRect();

    if (locStruct && locStruct[locStructKey] && locStruct[locStructKey]["xMean"]) {

        let xMin = locStruct[locStructKey]["xMean"] - locStruct[locStructKey]["xDev"];
        let xMax = locStruct[locStructKey]["xMean"] + locStruct[locStructKey]["xDev"];
        let yMin = locStruct[locStructKey]["yMean"] - locStruct[locStructKey]["yDev"];
        let yMax = locStruct[locStructKey]["yMean"] + locStruct[locStructKey]["yDev"];
        let randomX = Math.random() * (xMax - xMin) + xMin;
        let randomY = Math.random() * (yMax - yMin) + yMin;
        if (randomX > 0 && randomY > 0) {
            let evt = new MouseEvent("click", {
                clientX: rect.left + randomX,
                clientY: rect.top + randomY,
                offsetX: randomX,
                offsetY: randomY,
                view: window,
            });

            // Send the event to the sleep button element
            element.dispatchEvent(evt);
        }
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

async function allowCompetitions() {
    const isExtensionEnabled = await getData("extensionEnabled");
    if (!isExtensionEnabled) {
        return false;
    }
    const isAutoCompEnabled = await getData("autoCompEnabled");
    if (!isAutoCompEnabled) {
        return false;
    }
    return true;
};

async function watchCompetitionPage() {
    const proceed = await allowCompetitions();
    if (!proceed) {
        return;
    }
    waitForElement("#competitionsContent").then(async (competitionDiv) => {
        const config = { attributes: true, childList: true, subtree: true, attributeFilter: ['style'] };

        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === 'childList') {
                    // Do button checking here?
                    // console.log("Child list mutation is ", mutation, "added nodes are ", mutation.addedNodes, " removed nodes are ", mutation.removedNodes);
                    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                        chooseBestCompetition();
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
        observer.observe(competitionDiv, config);

    });
}

async function postProcessCompetitionPage(table) {
    const isExtensionEnabled = await getData("extensionEnabled");
    if (!isExtensionEnabled) {
        return false;
    }
    const excludeLowLevelComps = await getData("autoComp_excludeLowLevelComps");
    if (!excludeLowLevelComps) {
        doneSortingCompetitions(table);
        return false;
    }

    const eliteCheck = $("#elite");
    if (eliteCheck && eliteCheck.length > 0) {
        const input = eliteCheck[0];
        function loopUntilValue() {
            setTimeout(() => {
                if (input.value != 0) {
                    input.click();
                    loopUntilValue();
                }
                else {
                    doneSortingCompetitions(table);
                }

            }, 300)

        }
        loopUntilValue();
    }
    else {
        doneSortingCompetitions(table);
    }
}

async function chooseBestCompetition() {
    const proceed = await allowCompetitions();
    if (!proceed) {
        return;
    }
    const compType = await getData("autoComp_competitionType");
    if (!compType) {
        return;
    }
    let priority = await getData("autoComp_priorityType");
    if (!priority) {
        return;
    }

    // Determine if we want to be ascending or descending
    let wantAscending = true;
    if (priority.includes("Highest Difficulty")) {
        wantAscending = false;
    }
    else if (priority.includes("Most Participants")) {
        wantAscending = false;
    }
    else if (priority.includes("Highest Kitty")) {
        wantAscending = false;
    }

    // Clean up priority
    if (priority.includes("Difficulty")) {
        priority = "Difficulty";
    }
    else if (priority.includes("Participants")) {
        priority = "Participants";
    }
    else if (priority.includes("Kitty")) {
        priority = "Kitty";
    }

    waitForElement("#" + compType).then(async (table) => {
        setTimeout(() => {
            const aToTrigger = $(table).find(`a:contains("${priority}")`)
            if (aToTrigger) {
                const firstA = $(aToTrigger).first();
                if (firstA && firstA[0]) {
                    let switchAgain = helperCheckSort(firstA);
                    if (!switchAgain) {
                        postProcessCompetitionPage(table);
                    }
                    // console.log("Result of switchAgain is ", switchAgain);
                }
            }
        }, 100);
    });
    function helperCheckSort(firstA) {

        let isDescending = checkForAscOrDesc(firstA);
        // console.log("Is descending is ", isDescending, " want ascending is ", wantAscending);
        if (isDescending == wantAscending || isDescending == null) {
            // Click if we want ascending and it's descending, or vice versa
            // Or if we don't want ascending and it's not descending
            firstA[0].click();
            return true;
        }
        else {
            return false;
        }


    }
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

async function displayItemsAtTop() {
    const isExtensionEnabled = await getData("extensionEnabled");
    if (!isExtensionEnabled) {
        return;
    }

    const isDisplayItemsAtTopEnabled = await getData("autoDisplayItemsEnabled");
    if (!isDisplayItemsAtTopEnabled) {
        return;
    }

    waitForElement("#objects-body-content").then(async (objectsDiv) => {
        waitForElement("#reproduction-wrapper").then((reproDiv) => {
            const findReproButt = $(reproDiv).find("a.saillir");
            let newImg;

            if (findReproButt && findReproButt[0]) {
                let currBut = findReproButt[0];
                // const spot = $(missionDiv).find(".last");
                // if (spot && spot[0]) {
                //     const clone = $(currBut).clone().appendTo($(spot[0]));
                // }
                const butHref = $(currBut).attr("href");
                if (butHref && butHref.includes("rechercherMale")) {
                    newImg = document.createElement("img");
                    newImg.src = "media/equideo/image/components/actionconsole/saillir.png"
                    // newImg.style.margin = "2px 3px 2px 0";
                    newImg.style.width = "15%";
                    newImg.style.height = "auto";
                    // newImg.classList.add("float-right");
                }

            }

            waitForElement("#module-2").then(async (value) => {
                if (newImg) {
                    let nameHdr = $(value).find("h1.horse-name");
                    if (nameHdr && nameHdr[0]) {
                        $(newImg).appendTo(($(nameHdr[0])));
                    }
                }
            });

            waitForElement("#image-body-content").then(async (value) => {
                // const tableClone = $(objectsDiv).clone().appendTo($(value));
                const objectElements = $(objectsDiv).find("a");
                // console.log("Object elements are ", objectElements);
                for (let step = 0; step < objectElements.length; step++) {
                    let clone = $(objectElements[step]).clone().appendTo($(value));
                    // .append($(value));
                }
            });

        })

    });

}

async function monitorCareTabButtons() {
    waitForElement("#boutonNourrir").then(async (feedBut) => {
        $(feedBut).on('click', () => { presetHayAndOats(); });

    });
    checkButtonsConnected("ALL");
}

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



    waitForElement("#care-tab-feed").then((careTab) => {
        let findSliderVal;
        const isUnderWeight = $(careTab).find('span:contains("underweight")').first();
        const isOverWeight = $(careTab).find('span:contains("overweight")').first();

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

                $(but).on('click', () => { statusRef["MISSION_BUTTON_PENDING"] = false; }); // end debounce after click registered
                clickOverride(but, "mission")
            });
        }, 100);
        setTimeout(() => {
            waitForElement("#boutonMissionForet").then((but) => { // Case for wood mission
                if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }

                $(but).on('click', () => { statusRef["MISSION_BUTTON_PENDING"] = false; }); // end debounce after click registered
                clickOverride(but, "mission")
            });
        }, 100);
        setTimeout(() => {
            waitForElement("#boutonMissionMontagne").then((but) => { // Case for iron mission
                if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }

                $(but).on('click', () => { statusRef["MISSION_BUTTON_PENDING"] = false; }); // end debounce after click registered
                clickOverride(but, "mission")
            });
        }, 100);
        setTimeout(() => {
            waitForElement("#boutonMissionPlage").then((but) => { // Case for desert mission
                if (!but || !$(but) || $(but).hasClass("action-disabled")) { return; }

                $(but).on('click', () => { statusRef["MISSION_BUTTON_PENDING"] = false; }); // end debounce after click registered
                clickOverride(but, "mission")
            });
        }, 100);
    }

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

async function doneSortingCompetitions(tableId) {
    let autoParticipate = await getData("autoComp_autoParticipate");

    if (autoParticipate && autoParticipate == true) {
        const rows = $(tableId).find("tr.odd");
        if (rows) {
            const firstRow = $(rows).first();
            // console.log("firstRow is ", firstRow.get())
            const firstRowButtons = $(firstRow).find('button');
            if (firstRowButtons[0]) {
                // console.log("Going to click firstRowButtons[0]", firstRowButtons[0])
                setTimeout(() => {
                    firstRowButtons[0].click();
                }, 100)

            }
        }
    }

}

async function chooseSampleName() {
    const isExtensionEnabled = await getData("extensionEnabled");
    if (!isExtensionEnabled) {
        return;
    }

    waitForElement("#page-contents").then((val) => {
        let genPot = "";
        let gender = "M";
        const strongGenPotText = $(val).find('strong:contains("Genetic potential")').first();
        if (strongGenPotText) {
            let holder = $(strongGenPotText).parent();
            if (holder) {
                genPot = $(holder).find('span').first()?.text();
            }
        }
        const findFemaleImg = $(val).find('[src|="/media/equideo/image/fonctionnels/20/femelle.png"]')
        console.log("Female img is ", findFemaleImg)
        if (findFemaleImg && findFemaleImg[0]) { gender = "F" }

        let newName = gender + " " + genPot;
        let nameInput = $("#poulain-1");
        if (nameInput) {
            nameInput.val(newName);
        }

    })
}