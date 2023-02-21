
import { getData, setData } from "./chrome_store.js";

const settingsDefaults = {
    extensionEnabled: false,
    autoDisplayItemsEnabled: true,
    autoFeedEnabled: true,
    autoMissionEnabled: false,
    autoGroomSleepEnabled: false,
    autoECEnabled: false,
    autoCompEnabled: false,
    autoComp_competitionType: "race",
    autoComp_priorityType: "Participants",
    autoComp_excludeLowLevelComps: true,
    autoComp_autoParticipate: false,
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