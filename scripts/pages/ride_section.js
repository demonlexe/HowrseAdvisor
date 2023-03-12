function changeIncreaseSlider(value, presetIncrease) {
    if (!value || !presetIncrease) { return; }
    let increaseSliderLbl = $(value).find('strong:contains("improve")');
    let increaseSliderParent = $(increaseSliderLbl).parent();
    let increaseSlider = $(increaseSliderParent).find("select").first();
    if (presetIncrease && increaseSlider) {
        increaseSlider.val(presetIncrease);
    }
}
function changeDecreaseSlider(value, presetDecrease) {
    if (!value || !presetDecrease) { return; }
    let decreaseSliderLbl = $(value).find('strong:contains("decrease")');
    let decreaseSliderParent = $(decreaseSliderLbl).parent();
    let decreaseSlider = $(decreaseSliderParent).find("select").first();
    if (presetDecrease && decreaseSlider) {
        decreaseSlider.val(presetDecrease);
    }
}

async function watchRidesDiv() {
    const isExtensionEnabled = await getData("extensionEnabled");
    if (!isExtensionEnabled) {
        return;
    }

    const isSmartWalkEnabled = await getData("autoSmartRidesEnabled");
    if (!isSmartWalkEnabled) {
        return;
    }

    waitForElement("#walk-body-content").then(async (walkBodyContent) => {
        let breed = getHorseBreed();
        let presetIncrease = null;
        let presetDecrease = null;
        if (breed && breedBeachMapping[breed]) {
            presetIncrease = breedBeachMapping[breed].I;
            presetDecrease = breedBeachMapping[breed].D;
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
                    handleWalkTab(id, walkBodyContent, presetIncrease, presetDecrease);
                    // console.log(`The ${mutation.attributeName} attribute was modified.`, "Mutation is ", mutation, "Class list is ", classList, " class name is ", className, " id is ", id);
                }
            }
        };
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(walkBodyContent, config);
    });
}

function getWalkHrs(energyPerHr) {
    if (energyPerHr) {
        let walkHrs = getHorseRideMaxHrs(energyPerHr ? energyPerHr : undefined);
        return walkHrs;
    }
    return undefined;
}

async function handleWalkTab(id, walkBodyContent, presetIncrease, presetDecrease) {
    // mountain: walk-tab-balade-montagne
    // beach: walk-tab-balade-plage
    // forest: walk-tab-balade-foret

    let sliderKey;
    let energyKey;
    if (id === "walk-tab-balade-montagne") {
        sliderKey = "#walkmontagneSlider";
        energyKey = "#walk-montagne-energie";
    }
    else if (id === "walk-tab-balade-foret") {
        sliderKey = "#walkforetSlider";
        energyKey = "#walk-foret-energie";
    }
    else if (id === "walk-tab-balade-plage") {
        sliderKey = "#walkplageSlider";
        energyKey = "#walk-plage-energie";
        changeIncreaseSlider(walkBodyContent, presetIncrease);
        changeDecreaseSlider(walkBodyContent, presetDecrease);
    }

    if (!sliderKey || !energyKey) { return; }

    waitForElement(sliderKey).then(async (value) => {
        let firstVal = $(value).find('li[data-number="' + 1 + '"]');
        if (firstVal && firstVal[0]) {
            firstVal[0].click();
            setTimeout(() => {
                let energyCost = $(energyKey)?.text() || 9; // 9 as backup incase we didn't wait long enough.
                let walkHrs = getWalkHrs(Math.abs(energyCost));
                let sliderVal = $(value).find('li[data-number="' + (walkHrs * 2) + '"]');
                if (value && walkHrs && sliderVal) {
                    const firstSlider = $(sliderVal).first();
                    if (firstSlider && firstSlider[0]) {
                        firstSlider[0].click();
                    }
                }
            }, 100) // wait for update
        }

    });
}