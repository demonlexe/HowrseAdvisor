
import { getExtensionEnabled, setExtensionEnabled } from "./settingsObtainer.js";
console.log("popup.js loaded");

getExtensionEnabled();

$('#flexSwitchExtensionEnabled').on('change', function () {
    console.log("flexSwitchExtensionEnabled changed");
    const isChecked = $(this).prop('checked');
    console.log("isChecked is ", isChecked);
    setExtensionEnabled(isChecked); return;
});