// DEFINE OUTER CONTAINERS
const canvas = d3
    .select("body")
    .append("div")
    .attr("id", "canvas");

const leftCanvas = canvas
    .append("div")
    .attr("id", "leftCanvas");

const rightCanvas = canvas
    .append("div")
    .attr("id", "rightCanvas");


// DEFINE SVG ELEMENTS
const lineSVG = leftCanvas
    .append("svg")
    .attr("id", "lineSVG");

 const mapSVG = leftCanvas
    .append("svg")
    .attr("id", "mapSVG");

 const factSVG = rightCanvas
    .append("div")
    .attr("id", "factSVG");

 const corrSVG = rightCanvas
    .append("svg")
    .attr("id", "corrSVG");


// GLOBAL OBJECTS
const processDate = d3.timeParse("%Y-%m-%d");

// GLOBAL INTERACTION VARIABLES
let isClicked = false;
let globalCountry = null;

// VARIABLE NAME MAPPING
let variableMap = new Map();
variableMap.set("new_cases_smoothed_per_million", "new cases / mio")
variableMap.set("total_cases_per_million", "total cases / mio")
variableMap.set("new_vaccinations_smoothed_per_million", "new vaccinations / mio")
variableMap.set("total_vaccinations_per_hundred", "total vaccinations / 100")
variableMap.set("new_deaths_smoothed_per_million", "new deaths / mio")
variableMap.set("total_deaths_per_million", "total deaths / mio")
variableMap.set("hospital_beds_per_thousand", "hospital beds / 1000")
variableMap.set("diabetes_prevalence", "diabetes prevalence")
variableMap.set("male_smokers", "male smokers")
variableMap.set("handwashing_facilities", "handwashing facilities")
variableMap.set("cardiovasc_death_rate", "cardio death rate")
variableMap.set("female_smokers", "female smokers")

// REFERENCES 
// https://www.w3schools.com/html/tryit.asp?filename=tryhtml_layout_float
// https://www.youtube.com/watch?v=dNYCrO8w4kg
// https://www.youtube.com/watch?v=jx5jmI0UlXU
// https://stackoverflow.com/questions/526035/how-can-i-position-my-div-at-the-bottom-of-its-container
// https://github.com/d3/d3-time-format/blob/v3.0.0/README.md#locale_parse
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map