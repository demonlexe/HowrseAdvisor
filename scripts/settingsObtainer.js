
import { getData, setData } from "./chrome_store.js";

const settingsDefaults = {
    extensionEnabled: true,
    autoFeedEnabled: true,
    autoMissionEnabled: false,
    autoGroomSleepEnabled: true,
    autoECEnabled: false
}

export async function changeSetting(settingName, settingValue) {
    setData(settingName, settingValue);
}

export async function getSettingEnabled(settingName, flexSwitchId) {
    const previousSettingEnabled = await getData(settingName);

    if (previousSettingEnabled != null) {
        $('#' + flexSwitchId).prop('checked', previousSettingEnabled);
    }
    else {
        $('#' + flexSwitchId).prop('checked', settingsDefaults[settingName]);
        changeSetting(settingName, settingsDefaults[settingName]);
    }
}