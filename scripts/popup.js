
import { changeSetting, getSettingEnabled } from "./settingsObtainer.js";
console.log("popup.js loaded");

async function checkExtensionEnabled() {
    await getSettingEnabled("extensionEnabled", "flexSwitchExtensionEnabled");
    extensionEnabledBehavior();

    function extensionEnabledBehavior() {
        const isChecked = $('#flexSwitchExtensionEnabled').prop('checked');
        if (isChecked) {
            $('#subSettingsCard').css("display", "block");
        }
        else {
            $('#subSettingsCard').css("display", "none");
        }
    }
    $('#flexSwitchExtensionEnabled').on('change', function () {
        const isChecked = $(this).prop('checked');
        changeSetting("extensionEnabled", isChecked);
        extensionEnabledBehavior()
        return;
    });
}

checkExtensionEnabled();
getSettingEnabled("autoFeedEnabled", "feed_flexSwitch");
getSettingEnabled("autoMissionEnabled", "mission_flexSwitch");
getSettingEnabled("autoGroomSleepEnabled", "groom_sleep_flexSwitch");
getSettingEnabled("autoECEnabled", "ec_flexSwitch");


$('#feed_flexSwitch').on('change', function () {
    const isChecked = $(this).prop('checked');
    changeSetting("autoFeedEnabled", isChecked); return;
});

$('#mission_flexSwitch').on('change', function () {
    const isChecked = $(this).prop('checked');
    changeSetting("autoMissionEnabled", isChecked); return;
});

$('#groom_sleep_flexSwitch').on('change', function () {
    const isChecked = $(this).prop('checked');
    changeSetting("autoGroomSleepEnabled", isChecked); return;
});

$('#ec_flexSwitch').on('change', function () {
    const isChecked = $(this).prop('checked');
    changeSetting("autoECEnabled", isChecked); return;
});

