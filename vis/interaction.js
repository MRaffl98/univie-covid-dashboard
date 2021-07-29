//////////////////// VARIABLE 1 SELECTOR ////////////////////
d3.select("#variable1Selector")
    .on("change", () => {

        // extract current selector values
        const target1 = d3.select("#variable1Selector").node().value;
        const target2 = d3.select("#variable2Selector").node().value;
        const date = d3.select("#dateSelector").node().value;

        // update plots
        drawLine(lineData, target1, globalCountry);
        drawMap(geoData, mapData, date, target1, globalCountry);
        drawScatter(mapData, date,  target2, target1, globalCountry);
        drawFields(lineData, stats, target1, target2, date, globalCountry);

        // update axis labels
        const newLabel = variableMap.get(target1);
        yLabelScatter.text(newLabel);
        yLabelLine.text(newLabel);
        titleMap.text(`${newLabel} (${date})`);

    });


//////////////////// VARIABLE 2 SELECTOR ////////////////////
d3.select("#variable2Selector")
    .on("change", () => {

        // extract current selector values
        const target1 = d3.select("#variable1Selector").node().value;
        const target2 = d3.select("#variable2Selector").node().value;
        const date = d3.select("#dateSelector").node().value;

        // update plots
        drawScatter(mapData, date,  target2, target1, globalCountry);
        drawFields(lineData, stats, target1, target2, date, globalCountry);

        // update axis labels
        xLabelScatter.text(variableMap.get(target2));

    });


//////////////////// DATE SELECTOR ////////////////////
d3.select("#dateSelector")
    .on("change", () => {

        // extract current selector values
        const date = d3.select("#dateSelector").node().value;
        const target1 = d3.select("#variable1Selector").node().value;
        const target2 = d3.select("#variable2Selector").node().value;

        // update plots
        drawMap(geoData, mapData, date, target1, globalCountry);
        drawScatter(mapData, date,  target2, target1, globalCountry);
        drawFields(lineData, stats, target1, target2, date, globalCountry);

        // update axis labels
        titleScatter.text(date);
        titleMap.text(`${variableMap.get(target1)} (${date})`);

        // update date line
        const newX = lineSizes.padding.left + scaleDate(processDate(date));
        console.log(newX);
        dateLine
            .attr("x1", newX)
            .attr("x2", newX);

    });


//////////////////// HIGHLIGHT COUNTRY ////////////////////
function highlightCountry(country) {

    // extract current selector values
    const date = d3.select("#dateSelector").node().value;
    const target1 = d3.select("#variable1Selector").node().value;
    const target2 = d3.select("#variable2Selector").node().value;

    // update plots
    drawLine(lineData, target1, country);
    drawMap(geoData, mapData, date, target1, country);
    drawScatter(mapData, date, target2, target1, country);
    drawFields(lineData, stats, target1, target2, date, country);
}


//////////////////// UNHIGHLIGHT COUNTRY ////////////////////
function unhighlightCountry() {

    // extract current selector values
    const target1 = d3.select("#variable1Selector").node().value;
    const target2 = d3.select("#variable2Selector").node().value;
    const date = d3.select("#dateSelector").node().value;

    // update plots
    drawLine(lineData, target1);
    drawMap(geoData, mapData, date, target1);
    drawScatter(mapData, date,  target2, target1);
    drawFields(lineData, stats, target1, target2, date);
}


//////////////////// CLICK ////////////////////
function onClick(country) {
    isClicked = true;
    globalCountry = country;
    highlightCountry(country);
} 

//////////////////// MOUSEOVER ////////////////////
function onMouseover(country) {
    if (isClicked == false) {
        highlightCountry(country);
    }
}


//////////////////// MOUSEOUT ////////////////////
function onMouseout() {
    if (isClicked == false) {
        unhighlightCountry();
    }
}


//////////////////// UNDO CLICK ////////////////////
lineSVG
    .on("click", () => {

        const elementClass = event.target.className.baseVal;
        if (elementClass != "line" && elementClass != "highlightedLined") {
            isClicked = false;
            globalCountry = null;
            unhighlightCountry();

        }
    })

mapSVG
    .on("click", () => {

        const elementClass = event.target.className.baseVal;
        if (elementClass != "mapPath") {
            isClicked = false;
            globalCountry = null;
            unhighlightCountry();

        }
    })

corrSVG
    .on("click", () => {

        const elementClass = event.target.className.baseVal;
        if (elementClass != "point" && elementClass != "highlightedPoint") {
            isClicked = false;
            globalCountry = null;
            unhighlightCountry();

        }
    })