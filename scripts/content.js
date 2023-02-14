console.log("I made it");
const pricePerDayCap = 40;

// This is for if we were loaded from https://us.howrse.com/elevage/chevaux/cheval

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

waitForElement("#care").then((value) => {
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true, attributeFilter: ['style'] };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                // console.log('A child node has been added or removed. Mutation is ', mutation);
            } else if (mutation.type === 'attributes') {
                // console.log(`The ${mutation.attributeName} attribute was modified.`, "Mutation is ", mutation);
                const classList = mutation.target.classList // this returns an array of all classes
                const className = mutation.target.className // this returns a string containing all the classes separated with an space
                const id = mutation.target.id // this returns the id of the element
                if (id == "care-tab-main") {

                    // console.log("classList is ", classList, "className is ", className, "id is ", id)
                    presetHayAndOats();
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(value, config);
});

waitForElement("#cheval-inscription").then((value) => {
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

waitForElement("#table-0").then((value) => {

    setTimeout(() => {
        const aToTrigger = $('a:contains("10 days")')
        if (aToTrigger) {
            const firstA = $(aToTrigger).first();
            if (firstA) {
                // console.log("firstA is ", firstA)

                firstA[0].click()
                setTimeout(() => {
                    doneSorting();
                }, 1000); // Wait for the columns to load, give enough time for person to decide
            }
        }
    }, 500);
});
presetHayAndOats();

waitForElement("#boutonNourrir").then((value) => {
    $(value).on('click', () => { presetHayAndOats(); });

});

function presetHayAndOats() {
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
            if (firstSlider) {
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
            if (firstSlider) {
                // console.log("firstSlider is ", firstSlider)
                firstSlider[0].click();
            }
        }
    });
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