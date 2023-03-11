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

    function watchCompTable(table) {
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
    }

    // If divine, use that table; otherwise, use other table
    // setTimeout(() => {
    let isDivin = $("#divin");
    if (isDivin && isDivin.length > 0) {
        watchCompTable(isDivin[0]);
    }
    else {
        waitForElement("#" + compType).then(async (table) => {
            watchCompTable(table);

        });
    }
    // }, 500)


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