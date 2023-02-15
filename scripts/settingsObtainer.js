
import { getData, setData } from "./chrome_store.js";
export async function getExtensionEnabled() {
    const previousExtensionEnabled = await getData("extensionEnabled");

    if (previousExtensionEnabled != null) {
        $('#flexSwitchExtensionEnabled').prop('checked', previousExtensionEnabled);
    }

}

export async function setExtensionEnabled(extensionEnabled) {
    setData("extensionEnabled", extensionEnabled);
}