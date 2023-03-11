async function chooseSampleName() {
    const isExtensionEnabled = await getData("extensionEnabled");
    if (!isExtensionEnabled) {
        return;
    }

    waitForElement("#page-contents").then((val) => {
        let genPot = "";
        let gender = "M";
        const strongGenPotText = $(val).find('strong:contains("Genetic potential")').first();
        if (strongGenPotText) {
            let holder = $(strongGenPotText).parent();
            if (holder) {
                genPot = $(holder).find('span').first()?.text();
            }
        }
        const findFemaleImg = $(val).find('[src|="/media/equideo/image/fonctionnels/20/femelle.png"]')
        console.log("Female img is ", findFemaleImg)
        if (findFemaleImg && findFemaleImg[0]) { gender = "F" }

        let newName = gender + " " + genPot;
        let nameInput = $("#poulain-1");
        if (nameInput) {
            nameInput.val(newName);
        }

    })
}