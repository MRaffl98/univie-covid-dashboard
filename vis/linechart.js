//////////////////// HANDLE SIZES ////////////////////
// plot sizes
const lineSizes = {
    width: 0.92 * $("#lineSVG").width(),
    height: 0.80 * $("#lineSVG").height(),
    padding: {
        left: 0.07 * $("#lineSVG").width(),
        right: 0.01 * $("#lineSVG").width(),
        top : 0.07 * $("#lineSVG").height(),
        bottom: 0.13 * $("#lineSVG").height()
    }
}

// y-axis label position
const lineAxisPositions = {
    x: 0.3*lineSizes.padding.left,
    y: lineSizes.padding.top + lineSizes.height / 2
}


//////////////////// INITIALIZE SCALERS ////////////////////
// scale date
const scaleDate = d3.scaleTime()
    .range([0, lineSizes.width]);

// scale targets
const scaleTargetLine = d3.scaleLinear()
    .range([lineSizes.height, 0]);


//////////////////// INITIALIZE AXES ////////////////////
// x-axis
const xAxisGroupLine = lineSVG
    .append("g")
    .attr("transform", `translate(${lineSizes.padding.left}, ${lineSizes.height + lineSizes.padding.top})`);

// y-axis
const yAxisGroupLine = lineSVG
    .append("g")
    .attr("transform", `translate(${lineSizes.padding.left}, ${lineSizes.padding.top})`);

// x-axis
const xAxisLine = d3.axisBottom()
    .ticks(7) 
    .tickFormat(d3.timeFormat("%Y-%m-%d"));
    
// y-axis
const yAxisLine = d3.axisLeft()
    .ticks(5);


//////////////////// INITIALIZE AXIS LABEL ////////////////////
const yLabelLine = lineSVG
    .append("text")
    .attr("class", "axisLabel")
    .attr("id", "yLabelLine")
    .attr("transform", `rotate(-90, ${lineAxisPositions.x}, ${lineAxisPositions.y})`)
    .attr("x", lineAxisPositions.x)
    .attr("y", lineAxisPositions.y)
    .text(variableMap.get(d3.select("#variable1Selector").node().value));


//////////////////// INITIALIZE DATE LINE ////////////////////
const dateLine = lineSVG
    .append("line")
    .attr("class", "dateLine");


//////////////////// INITIALIZE DATA OBJECTS ////////////////////
let lineData = null; // time series data
let stats = null; // constant data for fact fields


//////////////////// HANDLE DATA PROMISE ////////////////////
d3.csv("data/line_chart_data.csv")
    .then(data => {

        // transform for linechart
        lineData = data.map(row => extractRowData(row));

        // finish date scaler
        const dateExtent = d3.extent(lineData[0].data, d => d.date);
        scaleDate.domain([dateExtent[0], dateExtent[1]]);

        // initial draw
        const target = d3.select("#variable1Selector").node().value; 
        drawLine(lineData, target, globalCountry);

        // draw date line
        dateLine
            .attr("x1", lineSizes.padding.left + scaleDate(processDate(d3.select("#dateSelector").node().value)))
            .attr("x2", lineSizes.padding.left + scaleDate(processDate(d3.select("#dateSelector").node().value)))
            .attr("y1", lineSizes.padding.top)
            .attr("y2", lineSizes.padding.top + lineSizes.height);

        // add date axis
        xAxisLine.scale(scaleDate);
        xAxisGroupLine.call(xAxisLine);

        // get facts data for fact fields
        d3.csv("data/fact_fields_data.csv")
            .then(facts => {

                // save data
                stats = facts;

                // initial draw
                drawFields(lineData, stats, 
                           d3.select("#variable1Selector").node().value, 
                           d3.select("#variable2Selector").node().value,
                           d3.select("#dateSelector").node().value,
                           globalCountry);


            })
            .catch(error => {
                console.log(error);
            })


    })
    .catch(error => {
        console.log(error);
    });


//////////////////// DRAW LINE FUNCTION ////////////////////
// draws und updates line according to enter-update-exit scheme
function drawLine(lineData, target, country = null) {

    // finish target scaler
    let dataMax = getMaximum(lineData, target);    
    scaleTargetLine.domain([0, dataMax]);

    // update line generator
    const lineGenerator = d3.line()
        .x(d => scaleDate(d.date) + lineSizes.padding.left)
        .y(d => scaleTargetLine(d.target) +  lineSizes.padding.top);

    // filter data
    let currentData = lineData.filter(d => d.variable == target);

    // reorder data so that highlighted country is on top
    if (country !== null) {
        const countryData = currentData.filter(d => d.country == country);
        const otherData = currentData.filter(d => d.country != country);
        currentData = countryData.length > 0 ? otherData.concat(countryData) : otherData;
    }

    // bind data
    const lineAppending = lineSVG
        .selectAll(".line,.highlightedLine")
        .data(currentData);
    
    // enter    
    const lineEnter = lineAppending
        .enter()
        .append("svg:path"); 
    
    // update
    lineAppending.merge(lineEnter)
        .attr("class", d => d.country == country ? "highlightedLine" : "line")
        .attr("d", d => lineGenerator(d.data))
        .on("mouseover", d => onMouseover(d.country))
        .on("mouseout", d => onMouseout())
        .on("click", d => onClick(d.country));


    // exit
    lineAppending.exit().remove();

    // enter target axis
    yAxisLine.scale(scaleTargetLine);
    yAxisGroupLine.call(yAxisLine);

}


//////////////////// REFERENCES ////////////////////
// --- tutorial
// --- https://stackoverflow.com/questions/17721929/date-format-in-d3-js/17726247
// --- https://bl.ocks.org/d3noob/ecf9e1ddeb48d0c4fbb29d03c08660bb
// --- https://stackoverflow.com/questions/19710174/how-do-i-get-the-width-of-an-svg-element-using-d3js
// --- https://programmer.group/get-pixel-width-of-d3.js-svg-element-created-with-width-as-percentage.html
// --- https://www.w3schools.com/js/js_loop_for.asp
// --- https://bl.ocks.org/d3noob/8dc93bce7e7200ab487d
// --- https://observablehq.com/@d3/multi-line-chart
// --- https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89
// --- https://bl.ocks.org/d3noob/ecf9e1ddeb48d0c4fbb29d03c08660bb
// --- https://stackoverflow.com/questions/40173533/customize-the-d3-month-or-year-tick-format/40175517
// --- https://stackoverflow.com/questions/16549868/d3-remove-comma-delimiters-for-thousands
// --- https://www.w3schools.com/js/js_functions.asp
// --- https://stackoverflow.com/questions/45616574/d3-selectall-multiple-classes-and-or-or
// --- https://stackoverflow.com/questions/2422946/javascript-check-for-not-null
// --- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length
// --- https://www.w3schools.com/jsref/jsref_concat_array.asp#:~:text=The%20concat()%20method%20is,values%20of%20the%20joined%20arrays.
// --- https://observablehq.com/@d3/d3-extent