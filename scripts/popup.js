
import { changeSetting, getSettingEnabled, getSettingSelection } from "./settingsObtainer.js";
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

async function checkAutoCompEnabled() {
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

checkExtensionEnabled();
checkAutoCompEnabled();
getSettingEnabled("autoFeedEnabled", "feed_flexSwitch");
getSettingEnabled("autoMissionEnabled", "mission_flexSwitch");
getSettingEnabled("autoGroomSleepEnabled", "groom_sleep_flexSwitch");
getSettingEnabled("autoECEnabled", "ec_flexSwitch");
getSettingEnabled("autoComp_excludeLowLevelComps", "elite_flexSwitch");
getSettingSelection("autoComp_competitionType", "competition-type-select");
getSettingSelection("autoComp_priorityType", "competition-priority-select");


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

$('#elite_flexSwitch').on('change', function () {
    const isChecked = $(this).prop('checked');
    changeSetting("autoComp_excludeLowLevelComps", isChecked); return;
});

$('#competition-type-select').on('change', function () {
    const selectedValue = $(this).val();
    console.log(selectedValue);
    changeSetting("autoComp_competitionType", selectedValue); return;
});
$('#competition-priority-select').on('change', function () {
    const selectedValue = $(this).val();
    console.log(selectedValue);
    changeSetting("autoComp_priorityType", selectedValue); return;
});