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

function getHorseBreed() {
    let breedElem = $('a[href*="/dossiers/race?"]');
    if (breedElem.length > 0) {
        let breed = $(breedElem[0]).text();
        return breed;
    };
    return null;
}

function checkIfHasHypnos() {
    // setTimeout(() => {
    let itemsTable = $("#objects-body-content");
    let hypnos = $(itemsTable).find('img[alt*="hypnos"]');
    if (hypnos && hypnos[0]) {
        return true;
    };
    return false;
    // }, 1000);
}

function checkEnergyForMission(missionType) {
    let currentEnergy = document.getElementById("energie").innerText;
    let avgMissionCost = 27;
    if (missionType == "wood") {
        avgMissionCost = 27;
    }
    else if (missionType == "iron") {
        avgMissionCost = 39;
    }
    else if (missionType == "lessons") {
        avgMissionCost = 30;
    }
    else if (missionType == "sand") {
        avgMissionCost = 27;
    }
    let energyAfterMission = currentEnergy - avgMissionCost;
    console.log("Estimated energy after mission is ", energyAfterMission);
    if (energyAfterMission < 20) {
        return false;
    }
    else {
        return true;
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
        })
        waitForElement("#image-body-content").then(async (value) => {
            // const tableClone = $(objectsDiv).clone().appendTo($(value));
            const objectElements = $(objectsDiv).find("a");
            // console.log("Object elements are ", objectElements);
            for (let step = 0; step < objectElements.length; step++) {
                let clone = $(objectElements[step]).clone().appendTo($(value));
                // .append($(value));
            }
        });

    });

}

