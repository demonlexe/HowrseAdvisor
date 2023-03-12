
import { getData, setData } from "./chrome_store.js";

const settingsDefaults = {
    extensionEnabled: false,
    autoDisplayItemsEnabled: true,
    autoFeedEnabled: true,
    autoMissionEnabled: false,
    autoGroomSleepEnabled: false,
    autoSmartRidesEnabled: false,
    autoNavToNext: false,
    autoECEnabled: false,
    autoCompEnabled: false,
    autoComp_competitionType: "public",
    autoComp_priorityType: "Most Participants",
    autoComp_excludeLowLevelComps: true,
    autoComp_autoParticipate: false,
    preset_type: "none",
}
const bluppingDefaults = {
    extensionEnabled: true,
    autoDisplayItemsEnabled: true,
    autoFeedEnabled: true,
    autoMissionEnabled: false,
    autoGroomSleepEnabled: true,
    autoSmartRidesEnabled: true,
    autoNavToNext: false,
    autoECEnabled: false,
    autoCompEnabled: true,
    autoComp_competitionType: "public",
    autoComp_priorityType: "Lowest Difficulty",
    autoComp_excludeLowLevelComps: true,
    autoComp_autoParticipate: false,
    preset_type: "blupping",
}
const fillerDefaults = {
    extensionEnabled: true,
    autoDisplayItemsEnabled: true,
    autoFeedEnabled: true,
    autoMissionEnabled: false,
    autoGroomSleepEnabled: true,
    autoSmartRidesEnabled: true,
    autoNavToNext: true,
    autoECEnabled: true,
    autoCompEnabled: true,
    autoComp_competitionType: "public",
    autoComp_priorityType: "Most Participants",
    autoComp_excludeLowLevelComps: true,
    autoComp_autoParticipate: false,
    preset_type: "filler",
}
const apFarmingDefaults = {
    extensionEnabled: true,
    autoDisplayItemsEnabled: true,
    autoFeedEnabled: true,
    autoMissionEnabled: true,
    autoGroomSleepEnabled: true,
    autoSmartRidesEnabled: true,
    autoNavToNext: true,
    autoECEnabled: true,
    autoCompEnabled: true,
    autoComp_competitionType: "public",
    autoComp_priorityType: "Most Participants",
    autoComp_excludeLowLevelComps: false,
    autoComp_autoParticipate: true,
    preset_type: "ap-farming",
}

export async function changeSetting(settingName, settingValue) {
    if (!settingName || (settingValue == null)) { return; }
    setData(settingName, settingValue);
}

export async function getSettingEnabled(settingName, flexSwitchId) {
    if (!settingName || !flexSwitchId) { return; }
    const previousSettingEnabled = await getData(settingName);
    // console.log("Previous setting for " + settingName + " was " + previousSettingEnabled);
    if (previousSettingEnabled != null) {
        $('#' + flexSwitchId).prop('checked', previousSettingEnabled);
    }
    else {
        $('#' + flexSwitchId).prop('checked', settingsDefaults[settingName]);
        changeSetting(settingName, settingsDefaults[settingName]);
    }
}

export async function getSettingSelection(settingName, selectionId) {
    if (!settingName || !selectionId) { return; }
    const previousSettingSelection = await getData(settingName);

    if (previousSettingSelection != null) {
        $('#' + selectionId).val(previousSettingSelection);
    }
    else {
        $('#' + selectionId).val(settingsDefaults[settingName]);
        changeSetting(settingName, settingsDefaults[settingName]);
    }
}

export async function checkExtensionEnabled() {
    await getSettingEnabled("extensionEnabled", "flexSwitchExtensionEnabled");
    extensionEnabledBehavior();

    function extensionEnabledBehavior() {
        const isChecked = $('#flexSwitchExtensionEnabled').prop('checked');
        if (isChecked) {
            $('#subSettingsDiv').css("display", "block");
        }
        else {
            $('#subSettingsDiv').css("display", "none");
        }
    }
    $('#flexSwitchExtensionEnabled').on('change', function () {
        const isChecked = $(this).prop('checked');
        changeSetting("extensionEnabled", isChecked);
        extensionEnabledBehavior()
        return;
    });
}

export async function checkAutoCompEnabled() {
    await getSettingEnabled("autoCompEnabled", "competition_flexSwitch");
    autoCompEnabledBehavior();

    function autoCompEnabledBehavior() {
        const isChecked = $('#competition_flexSwitch').prop('checked');
        if (isChecked) {
            $('#autoCompSettingsCard').css("display", "block");
        }
        else {
            $('#autoCompSettingsCard').css("display", "none");
        }
        return;
    };
    $('#competition_flexSwitch').on('change', function () {
        const isChecked = $(this).prop('checked');
        changeSetting("autoCompEnabled", isChecked);
        autoCompEnabledBehavior();
    });
}

export function initSettingElements() {
    checkExtensionEnabled();
    checkAutoCompEnabled();
    getSettingEnabled("autoFeedEnabled", "feed_flexSwitch");
    getSettingEnabled("autoDisplayItemsEnabled", "display_items_flexSwitch")
    getSettingEnabled("autoMissionEnabled", "mission_flexSwitch");
    getSettingEnabled("autoGroomSleepEnabled", "groom_sleep_flexSwitch");
    getSettingEnabled("autoNavToNext", "auto_nav_flexSwitch");
    getSettingEnabled("autoSmartRidesEnabled", "smart_rides_flexSwitch");
    getSettingEnabled("autoECEnabled", "ec_flexSwitch");
    getSettingEnabled("autoComp_excludeLowLevelComps", "elite_flexSwitch");
    getSettingEnabled("autoComp_autoParticipate", "auto_participate_flexSwitch");
    getSettingSelection("autoComp_competitionType", "competition-type-select");
    getSettingSelection("autoComp_priorityType", "competition-priority-select");
    getSettingSelection("preset_type", "preset-type-select");
}

export async function usePresetSettings(preset) {
    console.log("Preset is ", preset);
    switch (preset) {
        case "blupping": {
            for (const key in bluppingDefaults) {
                changeSetting(key, bluppingDefaults[key]);
            }
            initSettingElements();
            break;
        }
        case "ap-farming": {
            for (const key in apFarmingDefaults) {
                changeSetting(key, apFarmingDefaults[key]);
            }
            initSettingElements();
            break;
        }
        case "filler": {
            for (const key in fillerDefaults) {
                changeSetting(key, fillerDefaults[key]);
            }
            initSettingElements();
            break;
        }
        default: {
            console.log("No preset selected");
            changeSetting("preset_type", settingsDefaults["preset_type"]);
        }
    }
}