
let statusRef = {
    // "GROOM_BUTTON_PENDING": false,
    "SLEEP_BUTTON_PENDING": false,
    "FEED_BUTTON_PENDING": false,
    "MISSION_BUTTON_PENDING": false,
    "WAITING_FOR_EC_TABLE": false,
};


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
        watchRidesDiv();
        monitorECButton();
        presetHayAndOats();
        monitorCareTabButtons();
        displayItemsAtTop();
        monitorMaleCovers();
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