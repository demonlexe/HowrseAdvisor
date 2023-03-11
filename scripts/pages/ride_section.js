function changeIncreaseSlider(value, presetIncrease) {
    let increaseSliderLbl = $(value).find('strong:contains("improve")');
    let increaseSliderParent = $(increaseSliderLbl).parent();
    let increaseSlider = $(increaseSliderParent).find("select").first();
    if (presetIncrease && increaseSlider) {
        increaseSlider.val(presetIncrease);
    }
}
function changeDecreaseSlider(value, presetDecrease) {
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

    waitForElement("#walk-body-content").then(async (value) => {
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
                    if (id === "walk-tab-balade-plage") {
                        changeIncreaseSlider(value, presetIncrease);
                        changeDecreaseSlider(value, presetDecrease);
                        // Walk button was clicked for beach.
                    }
                    // console.log(`The ${mutation.attributeName} attribute was modified.`, "Mutation is ", mutation, "Class list is ", classList, " class name is ", className, " id is ", id);
                }
            }
        };
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(value, config);
    });
}