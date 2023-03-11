
import { changeSetting, getSettingEnabled, getSettingSelection, usePresetSettings, initSettingElements } from "./settingsObtainer.js";
console.log("onboarding.js loaded");

initSettingElements();

$("#display_items_flexSwitch").on('change', function () {
    const isChecked = $(this).prop('checked');
    changeSetting("autoDisplayItemsEnabled", isChecked); return;
});

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

$('#smart_rides_flexSwitch').on('change', function () {
    const isChecked = $(this).prop('checked');
    changeSetting("autoSmartRidesEnabled", isChecked); return;
});

$('#auto_nav_flexSwitch').on('change', function () {
    const isChecked = $(this).prop('checked');
    changeSetting("autoNavToNext", isChecked); return;
});

$('#ec_flexSwitch').on('change', function () {
    const isChecked = $(this).prop('checked');
    changeSetting("autoECEnabled", isChecked); return;
});

$('#elite_flexSwitch').on('change', function () {
    const isChecked = $(this).prop('checked');
    changeSetting("autoComp_excludeLowLevelComps", isChecked); return;
});

$('#auto_participate_flexSwitch').on('change', function () {
    const isChecked = $(this).prop('checked');
    changeSetting("autoComp_autoParticipate", isChecked); return;
});

$('#competition-type-select').on('change', function () {
    const selectedValue = $(this).val();
    changeSetting("autoComp_competitionType", selectedValue); return;
});
$('#competition-priority-select').on('change', function () {
    const selectedValue = $(this).val();
    changeSetting("autoComp_priorityType", selectedValue); return;
});
$('#preset-type-select').on('change', function () {
    const selectedValue = $(this).val();
    console.log("Changed to ", selectedValue)
    if (selectedValue) {
        usePresetSettings(selectedValue);
    }
});