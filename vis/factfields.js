//////////////////// HANDLE SIZES ////////////////////
const fieldSizes = {
    width: 0.3 * $("#factSVG").width(),
    height: 0.3 * $("#factSVG").height(),
    margin: {
        horizontal: 0.05 * $("#factSVG").width(),
        vertical: 0.05 * $("#factSVG").width()
    }
}


//////////////////// INITIALIZE STRUCTURE ////////////////////
// parent divs
const firstRow = factSVG
    .append("div")
    .style("height", "31%")
    .style("margin-bottom", "1%");

const secondRow = factSVG
    .append("div")
    .style("height", "31%")
    .style("margin-bottom", "1%");

const thirdRow = factSVG
    .append("div")
    .style("height", "31%");

// first row
const gdpField = firstRow
    .append("div")
    .attr("class", "factFieldRight");

const countryField = firstRow
    .append("div")
    .attr("class", "factFieldLeft");

const dateField = firstRow
    .append("div")
    .attr("class", "factFieldCenter");

// second row
const lifeexpectancyField = secondRow
    .append("div")
    .attr("class", "factFieldRight");

const areaField = secondRow
    .append("div")
    .attr("class", "factFieldLeft");

const variable1Field = secondRow
    .append("div")
    .attr("class", "factFieldCenter");

// third row
const medianageField = thirdRow
    .append("div")
    .attr("class", "factFieldRight");

const populationField = thirdRow
    .append("div")
    .attr("class", "factFieldLeft");

const variable2Field = thirdRow
    .append("div")
    .attr("class", "factFieldCenter");


//////////////////// HANDLE DATA PROMISE ////////////////////
// see linechart.js


//////////////////// FILL FUNCTION ////////////////////
function drawFields(data, stats, target1, target2, date, country=null) {

    // default country
    const currentCountry = country===null ? "World" : country;

    // blue or red text
    const highlight = currentCountry=="World" ? false : true;

    // filter correct constant stats
    const countryStats = stats.filter(d => d.location == currentCountry)[0];

    // filter correct current data
    const time = processDate(date).getTime();
    const countryData = data.filter(d => d.country == currentCountry);
    const target1Data = countryData.filter(d => d.variable == target1)[0].data;
    const target2Data = countryData.filter(d => d.variable == target2)[0].data;
    const value1 = target1Data.filter(d => d.date.getTime() == time)[0].target;
    const value2 = target2Data.filter(d => d.date.getTime() == time)[0].target;

    // for thousands separator formating
    const population = Number(countryStats.population);

    // fill fields
    fillField(gdpField,             value=countryStats.gdp_per_capita,              title="GDP / capita", highlight);
    fillField(countryField,         value=currentCountry,                           title="Country", highlight);
    fillField(dateField,            value=date,                                     title="Date", highlight);
    fillField(lifeexpectancyField,  value=countryStats.life_expectancy,             title="Life Expectancy", highlight);
    fillField(populationField,      value=population.toLocaleString("en-US"),       title="Population", highlight);
    fillField(variable1Field,       value=round(+value1, 2),                        title=variableMap.get(target1), highlight);
    fillField(medianageField,       value=countryStats.median_age,                  title="Median Age", highlight);
    fillField(areaField,            value=countryStats.area,                        title="Area (sqkm)", highlight);
    fillField(variable2Field,       value=round(+value2, 2),                        title=variableMap.get(target2), highlight);

}


//////////////////// HELPER FUNCTION ////////////////////
function fillField(div, value, title, highlight=false) {
    
    // remove old content
    div.selectAll("*").remove();

    // add value
    div 
        .append("h2")
        .attr("class", highlight ? "highlightedFactValue" : "factValue")
        .text(value)

    // add title
    div
        .append("p")
        .attr("class", highlight ? "highlightedFactTitle" : "factTitle")
        .text(title);
        
}


//////////////////// REFERENCES ////////////////////
// https://www.youtube.com/watch?v=dNYCrO8w4kg
// https://stackoverflow.com/questions/28784099/css-float-right-moves-element-right-and-down-i-dont-want-down
// https://stackoverflow.com/questions/39716346/why-is-the-containing-div-for-svg-taking-more-space
// https://www.w3schools.com/tags/tryit.asp?filename=tryhtml_div_test
// https://stackoverflow.com/questions/14422198/how-do-i-remove-all-children-elements-from-a-node-and-then-apply-them-again-with
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
// https://stackoverflow.com/questions/51251523/why-do-i-need-a-00-time-zone-offset-to-display-values-correctly-in-d3v4
// https://stackoverflow.com/questions/492994/compare-two-dates-with-javascript
// https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
// https://stackoverflow.com/questions/6003884/how-do-i-check-for-null-values-in-javascript
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
// https://stackoverflow.com/questions/49300485/tolocalestring-is-not-working