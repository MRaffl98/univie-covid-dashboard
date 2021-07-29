//////////////////// HANDLE SIZES ////////////////////
// plot sizes
const scatterSizes = {
    width: 0.8 * $("#corrSVG").width(),
    height: 0.8 * $("#corrSVG").height(),
    padding: {
        left: 0.1 * $("#corrSVG").width(),
        right: 0.1 * $("#corrSVG").width(),
        top : 0.1 * $("#corrSVG").height(),
        bottom: 0.1 * $("#corrSVG").height()
    }
}

// positions of axis labels and date
const scatterAxisPositions = {
    xAxis: {
        x: scatterSizes.padding.left + scatterSizes.width / 2,
        y: scatterSizes.padding.top + scatterSizes.height + 0.8*scatterSizes.padding.bottom
    },
    yAxis: {
        x: 0.4*scatterSizes.padding.left,
        y: scatterSizes.padding.top + scatterSizes.height / 2
    },
    title: {
        x: scatterSizes.padding.left + scatterSizes.width / 2,
        y: 0.4*scatterSizes.padding.top
    }
}


//////////////////// INITIALIZE SCALERS ////////////////////
// scale date
const scaleScatter1 = d3.scaleLinear()
    .range([0, scatterSizes.width]);

// scale targets
const scaleScatter2 = d3.scaleLinear()
    .range([scatterSizes.height, 0]);


//////////////////// INITIALIZE AXES ////////////////////
// x-axis
const xAxisGroupScatter = corrSVG
    .append("g")
    .attr("transform", `translate(${scatterSizes.padding.left}, ${scatterSizes.height + scatterSizes.padding.top})`);

// y-axis
const yAxisGroupScatter = corrSVG
    .append("g")
    .attr("transform", `translate(${scatterSizes.padding.left}, ${scatterSizes.padding.top})`);

// x-axis
const xAxisScatter = d3.axisBottom()
    .ticks(7);
    
// y-axis
const yAxisScatter = d3.axisLeft()
    .ticks(7);


//////////////////// INITIALIZE AXIS TEXT ////////////////////
// x-axis label
const xLabelScatter = corrSVG
    .append("text")
    .attr("class", "axisLabel")
    .attr("id", "xLabelScatter")
    .attr("x", scatterAxisPositions.xAxis.x)
    .attr("y", scatterAxisPositions.xAxis.y)
    .text(variableMap.get(d3.select("#variable2Selector").node().value));

// y-axis label
const yLabelScatter = corrSVG
    .append("text")
    .attr("class", "axisLabel")
    .attr("id", "yLabelScatter")
    .attr("transform", `rotate(-90, ${scatterAxisPositions.yAxis.x}, ${scatterAxisPositions.yAxis.y})`)
    .attr("x", scatterAxisPositions.yAxis.x)
    .attr("y", scatterAxisPositions.yAxis.y)
    .text(variableMap.get(d3.select("#variable1Selector").node().value));

// title, i.e. date    
const titleScatter = corrSVG
    .append("text")
    .attr("class", "axisLabel")
    .attr("id", "titleScatter")
    .attr("x", scatterAxisPositions.title.x)
    .attr("y", scatterAxisPositions.title.y)
    .text(d3.select("#dateSelector").node().value);


//////////////////// INITIALIZE DATA OBJECT ////////////////////
// data from map


//////////////////// HANDLE DATA PROMISE ////////////////////
// promise from map


//////////////////// DRAW SCATTER FUNCTION ////////////////////
function drawScatter(scatterData, date, target1, target2, country = null) {

    ///// PREPARATION /////
    // assure that date is character
    date = String(date);

    // filter data
    let currentData = scatterData.filter(d => d.date == date);

    // finish target scaler
    const maxTarget1 = d3.max(currentData, d => +d[target1]);
    const minTarget1 = d3.min(currentData, d => +d[target1]);
    const maxTarget2 = d3.max(currentData, d => +d[target2]);
    const minTarget2 = d3.min(currentData, d => +d[target2]);
    scaleScatter1.domain([minTarget1, maxTarget1]);
    scaleScatter2.domain([minTarget2, maxTarget2]);

    // reorder data to have highlighted country on top
    if (country !== null) {
        const countryData = currentData.filter(d => d.location == country);
        const otherData = currentData.filter(d => d.location != country);
        currentData = countryData.length > 0 ? otherData.concat(countryData) : otherData;
    }
    

    ///// DRAW SCATTERPLOT /////
    // bind data
    const scatterAppending = corrSVG
        .selectAll(".point,.highlightedPoint")
        .data(currentData);

    // enter
    const scatterEnter = scatterAppending
        .enter()
        .append("svg:circle");
    
    // update
    scatterAppending.merge(scatterEnter)
        .attr("class", d => d.location == country ? "highlightedPoint" : "point")
        .attr("cx", d => scaleScatter1(d[target1]) + scatterSizes.padding.left)
        .attr("cy", d => scaleScatter2(d[target2]) + scatterSizes.padding.top)
        .on("mouseover", d => onMouseover(d.location))
        .on("mouseout", d => onMouseout())
        .on("click", d => onClick(d.location));

    
    // exit 
    scatterAppending.exit().remove();

    // enter axes
    xAxisScatter.scale(scaleScatter1);
    xAxisGroupScatter.call(xAxisScatter);
    yAxisScatter.scale(scaleScatter2);
    yAxisGroupScatter.call(yAxisScatter);
    
}

//////////////////// REFERENCES ////////////////////
// https://bl.ocks.org/d3noob/a44d21b304b9f7260a284b1883232002
// https://stackoverflow.com/questions/30874617/d3-max-didnt-get-the-correct-value
// https://bl.ocks.org/d3noob/9a84fa008c5a0e77cd8c2ed7fb7a2a8e
// http://www.softouch.on.ca/svg/rotate1.html