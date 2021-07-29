//////////////////// HANDLE SIZES ////////////////////
// plot sizes
const mapSizes = {
    width: 1 * $("#mapSVG").width(),
    height: 1 * $("#mapSVG").height(),
    padding: {
        left: 0 * $("#mapSVG").width(),
        right: 0 * $("#mapSVG").width(),
        top : 0 * $("#mapSVG").height(),
        bottom: 0 * $("#mapSVG").height()
    }
}

// position of the map header (variable + date)
const mapTitlePositions = {
    x: mapSizes.padding.left + mapSizes.width / 2,
    y: 0.04*mapSizes.height
}


//////////////////// DEFINE COLOR SCALE ////////////////////
const scaleColor = d3
    .scalePow()
    .exponent(0.5)
    .range(["#002455", "#7cf9ff"]);
    //.scaleQuantize()
    //.range(["#002455", "#103F6A", "#1F5980", "#2F7495", "#3E8FAA", "#4EA9BF", "5DC4D5", "6DDEEA", "7CF9FF"]);
    //.range(["#002455", "#154771", "#296B8E", "#3E8FAA", "#53B2C6", "#67D6E3", "#7CF9FF"]);
    //.range(["#002455", "#1F5980", "#3E8FAA", "#5DC4D5", "#7CF9FF"]);


//////////////////// INITIALIZE COLOR LEGEND (NOT IMPLEMENTED) ////////////////////
// const mapLegend = mapSVG
//     .append("g");

// const scaleLegend = d3.scaleLinear()
//     .range([])


//////////////////// INITIALIZE MAP ////////////////////
const projectMap = d3
    .geoRobinson()
    .translate(([mapSizes.width / 2, mapSizes.height / 2]))
    .scale(window.innerHeight / 6.6);

const mapPath = d3.geoPath(projectMap);


//////////////////// INITIALIZE TITLE ////////////////////
const titleMap = mapSVG
    .append("text")
    .attr("class", "axisLabel")
    .attr("id", "titleMap")
    .attr("x", mapTitlePositions.x)
    .attr("y", mapTitlePositions.y)
    .text(`${variableMap.get(d3.select("#variable1Selector").node().value)} (${d3.select("#dateSelector").node().value})`);


//////////////////// INITIALIZE DATA OBJECTS ////////////////////
let geoData = null; // world countries data
let mapData = null; // actual covid data


//////////////////// HANDLE DATA PROMISE ////////////////////
d3.json("data/world_countries.json")
    .then(world => {

        // save coordinate data
        geoData = world;

        d3.csv("data/map_data.csv")
            .then(data => {

                // save map data
                mapData = data;

                // initial draw
                drawMap(geoData, mapData, d3.select("#dateSelector").node().value, d3.select("#variable1Selector").node().value, globalCountry);
                drawScatter(mapData, d3.select("#dateSelector").node().value, d3.select("#variable2Selector").node().value, d3.select("#variable1Selector").node().value, globalCountry);

            })

    })
    .catch(error => {
        console.log(error);
    });


//////////////////// DRAW MAP FUNCTION ////////////////////
function drawMap(geoData, mapData, date, target, country = null) {

    ///// PREPARATION /////
    // assure that date is character
    date = String(date);

    // filter data for chosen date
    const currentData = mapData.filter(d => d.date == date);

    // create country -> target mapping
    const currentMap = new Map();
    currentData.forEach(d => {
        currentMap.set(d.location, +d[target]);
    });

    // finish color scaler (relative to current date!)
    const currentMax = Math.max(...currentMap.values());
    scaleColor.domain([0, currentMax]);

    ///// DRAW MAP /////
    // bind data
    const mapAppending = mapSVG
        .selectAll(".mapPath")
        .data(geoData.features);
    
    // enter    
    const mapEnter = mapAppending
        .enter()
        .append("path"); 
    
    // update
    mapAppending.merge(mapEnter)
        .attr("d", mapPath)
        .attr("class", "mapPath")
        .attr("fill", d => d.properties.name == country ? "red" : scaleColor(currentMap.get(d.properties.name)))
        .on("mouseover", d => onMouseover(d.properties.name))
        .on("mouseout", d => onMouseout())
        .on("click", d => onClick(d.properties.name));

    // exit
    mapAppending.exit().remove();

}


//////////////////// REFERENCES ////////////////////
// http://bl.ocks.org/denisemauldin/cb870e6f439864a5ae74d4fc561ac46f
// https://github.com/d3/d3-geo-projection
// http://bl.ocks.org/micahstubbs/535e57a3a2954a129c13701fe61c681d
// https://github.com/jdamiani27/Data-Visualization-and-D3/blob/master/lesson4/world_countries.json (world_countries.json)
// https://stackoverflow.com/questions/51690146/javascript-finding-highest-value-in-map-vs-object
// https://colorbrewer2.org/#type=sequential&scheme=Reds&n=3
// https://bl.ocks.org/denisemauldin/3436a3ae06f73a492228059a515821fe (color legend)
// https://stackoverflow.com/questions/62954628/how-to-create-scalethreshold-legend-in-d3-v5 (color legend)
// https://codepen.io/Christian-Paul/pen/GELxjQ?editors=1010 (color legend, zoom)
// https://helpcodenow.com/2019/06/19/choropleth-map-with-d3-js/ (color legend)
// https://mycolor.space/?hex=%2320BEFF&sub=1 (color generator)
// https://blockbuilder.org/denisemauldin/3436a3ae06f73a492228059a515821fe
// https://observablehq.com/@d3/color-schemes
// https://github.com/d3/d3-scale#sequential-scales
// https://bl.ocks.org/d3indepth/30d31098b607b669a7874bf4ab3c9595
// https://www.d3indepth.com/scales/
// https://stackoverflow.com/questions/41848677/how-to-make-a-color-scale-in-d3-js-to-use-in-fill-attribute
// https://coolors.co/gradient-palette/002455-7cf9ff?number=5
// https://books.google.at/books?id=lkBPDwAAQBAJ&pg=PA154&lpg=PA154&dq=d3+georobinson+scale&source=bl&ots=bpJXVLodyW&sig=ACfU3U00zTuCogkgIFaAKqwHxYkDUXrsFg&hl=en&sa=X&ved=2ahUKEwiB_ar00KjxAhWGhv0HHSklBTwQ6AEwCXoECBQQAw#v=onepage&q=d3%20georobinson%20scale&f=false
// https://stackoverflow.com/questions/46611481/center-and-rotate-projection-in-d3-v4