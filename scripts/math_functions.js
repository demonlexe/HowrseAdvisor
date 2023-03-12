function calcMeanAndStandardDeviation(ValArr, strName) {
    let XTot = 0;
    let YTot = 0;
    let ct = 0;

    // Calculate mean
    for (let i = 0; i < ValArr.length; i++) {
        if (ValArr[i]) {
            if (ValArr[i]["x"]) {
                XTot += ValArr[i]["x"];
            }
            if (ValArr[i]["y"]) {
                YTot += ValArr[i]["y"];
            }
            ct++;
        }
    }
    let MeanX = XTot / ct;
    let MeanY = YTot / ct;

    // Calculate standard deviation
    let NumeratorX = 0;
    let NumeratorY = 0;
    for (let i = 0; i < ValArr.length; i++) {
        if (ValArr[i]) {
            if (ValArr[i]["x"]) {
                let top = Math.pow((ValArr[i]["x"] - MeanX), 2)
                NumeratorX += top;
            }
            if (ValArr[i]["y"]) {
                let top = Math.pow((ValArr[i]["y"] - MeanY), 2)
                NumeratorY += top;
            }
            ct++;
        }
    }

    let StandardDevX = Math.sqrt(NumeratorX / (ct - 1));
    let StandardDevY = Math.sqrt(NumeratorY / (ct - 1));

    locStruct[strName] = {
        "xMean": MeanX,
        "yMean": MeanY,
        "xDev": StandardDevX,
        "yDev": StandardDevY
    };
}