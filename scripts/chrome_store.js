let dev = false; //FIXME DON'T COMMIT AS TRUE
let devInfo = {
}

function getData(key) {
    if (!key && key == null) { return null; }
    if (dev == true) {
        console.log(devInfo);
        return devInfo[key];
    }

    const getDataPromise = new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(key, (result) => {
                // console.log("Fetching data: returning ",result[key]);
                let res = result[key];
                // console.log("Response is ", res)
                resolve(res);
            });
        }
        catch (err) {
            console.log("Error getting data: " + err);
            reject(false);
        }
    });

    return getDataPromise;
}
function setData(key, value) {
    if ((!key && key == null) || (!value && value == null)) { return false; }
    if (dev == true) {
        devInfo[key] = value;
        console.log(devInfo);
        return true;
    }

    const setDataPromise = new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.set({ [key]: value }, function () {
                // console.log(key,' is set succesfully to ',value);
                resolve(true);
            });
        }
        catch (err) {
            console.log("Error setting data: " + err);
            reject(false);
        }
    });

    return setDataPromise;
}

export { getData, setData }