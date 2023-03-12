let missionValOffsetUninit = [
    { x: 37.40625, y: 17 },
    { x: 78.796875, y: 44 },
    { x: 29.796875, y: 43 },
    { x: 30.796875, y: 35 },
    { x: 59.796875, y: 40 },
    { x: 83.796875, y: 10 },
    { x: 35.796875, y: 43 },
    { x: 48.796875, y: 33 },
    { x: 32.796875, y: 20 },
    { x: 19.796875, y: 47 },
    { x: 42.796875, y: 1 },
];
let sleepValOffsetUninit = [
    { x: 60.5, y: 17 },
    { x: 59.5, y: 22 },
    { x: 36.5, y: 19 },
    { x: 64.5, y: 43 },
    { x: 44.5, y: 1 },
    { x: 44.5, y: 24 },
];
let breedBeachMapping = {
    "Camargue": {
        "I": "galop",
        "D": "trot",
    },
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

const pricePerDayCap = 40;