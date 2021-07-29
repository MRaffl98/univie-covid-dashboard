// processes the data for the linechart/factfields
function extractRowData(row) {

    // split the row into a string "team" and an 
    // object "values" with key-value pairs where keys are years and values are percentages
    const { location, variable, ...values } = row;
    
    // read keys (years) and values (percentages) from the object "values"
    //const processDate = d3.timeParse("%Y-%m-%d");
    const dates = Object.keys(values).map(date => processDate(date));
    const targets = asNumbers(Object.values(values));

    // transform the object "values" to an array "data"
    // "data" has the structure [{year, percentage}, {year, percentage}...]
    const data = [];
    const numDates = dates.length;
    for(let i=0; i<numDates; ++i){
        const date = dates[i];
        const target = targets[i];
        const d = { date: date, target: target };
        data.push(d);
    }

    // return an object with two properties:
    // team -> the team name
    // data -> the array of year/percentage pairs
    return {
        country: location,
        variable: variable,
        data: data
    };

};


// converts all elements of an array to numbers
function asNumbers(arr) {
    return arr.map(Number);
}


// like seq function in R
function seq(from=0, to=1, lengthOut=5) {
    
    let seq = [from];
    step = (to-from) / (lengthOut-1)
    for (let i = 1; i < (lengthOut-1); i++) {
        seq.push(from + i*step);
    }
    seq.push(to);

    return seq;
}


// rounds to 'decimals' decimals
function round(value, decimals=0) {
    multiplier = Math.pow(10, decimals);
    return Math.round(value*multiplier) / multiplier;
}


// extracts the maximum of some variable for the scale of the linechart
function getMaximum(lineData, target) {
    let dataMax = 0;
    for (let i = 0; i < lineData.length; i++) {
        if (lineData[i].variable == target) {
            tempMax = d3.max(lineData[i].data, d => d.target)
            if (tempMax > dataMax) {
                dataMax = tempMax;
            }
        }
    }
    
    return dataMax;
}


//////////////////// REFERENCES ////////////////////
// --- Q&A session
// --- https://www.codegrepper.com/code-examples/javascript/javascript+Convert+an+array+of+strings+to+numbers
// --- https://stackoverflow.com/questions/3751520/how-to-generate-sequence-of-numbers-chars-in-javascript
// --- https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
// --- https://medium.com/swlh/how-to-round-to-a-certain-number-of-decimal-places-in-javascript-ed74c471c1b8#:~:text=For%20example%2C%20if%20you%20want,by%20100%20to%20get%200.23.
