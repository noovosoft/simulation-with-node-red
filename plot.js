const upperControlLimit = 43
const upperZoneAHigh = 43
const upperZoneALow = 42
const upperZoneBHigh = 42
const upperZoneBLow = 41
const upperZoneCHigh = 41
const upperZoneCLow = 40
const target = 40
const lowerZoneCHigh = 40
const lowerZoneCLow = 39
const lowerZoneBHigh = 39
const lowerZoneBLow = 38
const lowerZoneAHigh = 38
const lowerZoneALow = 37
const lowerControlLimit = 37
const rangeVariance = 3
const yAxisCount = (upperControlLimit - lowerControlLimit) + (rangeVariance * 2)
const yAxisActualLength = 360
const yAxisGap = 360 / yAxisCount
const xAxisPxLength = 1180
const xAxisPxStart = 40
const yAxisPxStart = 40
const yAxisPxLength = 380
const xAxisPadding = 380
const yAxisPadding = 20
const batchPoints = calculateAverage()
const xAxisGap = (xAxisPxLength - xAxisPxStart) / batchPoints.length
function axes(svg) {
    // x-axis
    drawLine(svg, {x1: xAxisPxStart, y1: xAxisPadding, x2: xAxisPxLength, y2: yAxisPxLength});
    // y-axis
    drawLine(svg, {x1: yAxisPxStart, y1: yAxisPadding, x2: yAxisPxStart, y2: yAxisPxLength});
}

function calculateAverage() {
    let batchPoints = []
    let batchFrequency = []
    samples.forEach((round)=> {
        batchPoints[round.batch - 1] = batchPoints[round.batch - 1] === undefined ? round.value : batchPoints[round.batch - 1] + round.value
        batchFrequency[round.batch - 1] = batchFrequency[round.batch - 1] === undefined ? 1 : batchFrequency[round.batch - 1] + 1
    })
    for(let i = 1; i <= batchPoints.length; i++) {
        batchPoints[i - 1] = (batchPoints[i - 1] / batchFrequency[i - 1]).toFixed(2)
    }
    return batchPoints
}

function yAxisColor(yAxisNum) {
    let grid_line_color = "transparent"
    if(yAxisNum === upperZoneAHigh || yAxisNum === lowerZoneALow) {
        grid_line_color = "red"
    }else if(yAxisNum === upperZoneBHigh || yAxisNum === lowerZoneBLow) {
        grid_line_color = "orange"
    }else if(yAxisNum === upperZoneCHigh || yAxisNum === lowerZoneCLow) {
        grid_line_color = "yellow"
    }else if(yAxisNum === target) {
        grid_line_color = "black"
    }
    return grid_line_color
}

function ticksLabel(svg, totalBatches) {
    //y-axis
    for(let i = 1; i <= yAxisCount; i++) {
        const yAxisNum = (upperControlLimit + rangeVariance) - (i - 1)
        let grid_line_color = yAxisColor(yAxisNum)
        //grid line
        drawLine(svg, {x1: yAxisPxStart, y1: yAxisPadding + yAxisGap * (i - 1), x2: xAxisPxLength, y2: yAxisPadding + yAxisGap * (i - 1), stroke: grid_line_color, strokeType: "dashed"});
        //axis ticks
        drawLine(svg, {x1: yAxisPxStart - 4, y1: yAxisPadding + yAxisGap * (i - 1), x2: yAxisPxStart, y2: yAxisPadding + yAxisGap * (i - 1)});
        //labels
        drawText(svg, {x: 20, y: 25 + yAxisGap * (i - 1), text: yAxisNum});
    }
    //x-axis
    for(let i = 1; i <= totalBatches; i++) {
        //ticks
        drawLine(svg, {x1: xAxisPxStart + xAxisGap * i, y1: xAxisPadding, x2: xAxisPxStart + xAxisGap * i, y2: xAxisPadding + 4});
        //label
        drawText(svg, {x: xAxisPxStart - 5 + xAxisGap * i, y: xAxisPadding + 20, text: i});
    }
}

function plotPoints(svg, batchPoints) {
    batchPoints.forEach((value, i) => {
        drawCircle(svg, {
            cx: xAxisPxStart + yAxisPadding + (i * xAxisGap),
            cy: yAxisPxLength - ((value - (lowerControlLimit - rangeVariance)) * yAxisGap),
            r: 2,
            fill: 'green',
            id: "circle" + i
        });
    })
}

function drawControlPlot(svg) {
    axes(svg)
    ticksLabel(svg, batchPoints.length)
    plotPoints(svg, batchPoints)
}

const svg3 = document.getElementById('svg3');
drawControlPlot(svg3)

function changeCircleColor(index, color) {
    document.getElementById("circle" + index).setAttribute("fill", color);
}
function rule1() {
    batchPoints.forEach((value, i) => {
        if(value > upperControlLimit || value < lowerControlLimit) {
            changeCircleColor(i, "red")
        }
    })
}

function rule2() {
    let count = 0
    let decreasing = false
    for(let i = 1; i < batchPoints.length; i++) {
        if(batchPoints[i] < batchPoints[i - 1] && decreasing === false) {
            count = 1
            decreasing = true
        }else if(batchPoints[i] > batchPoints[i - 1] && decreasing === true) {
            count = 1
            decreasing = false
        }
        count++
        if(count > 5) {
            count = 0
            for(let j = i; j > (i - 5); j--) {
                changeCircleColor(j, "red")
            }
        }
    }
}
function markRed(index, totalPoints) {
    while(totalPoints--) {
        changeCircleColor(index - totalPoints, "red")
    }
}

function rule3() {
    let redPoints = []
    let upper = 0
    let lower = 0
    batchPoints.forEach((value, i, array) => {
        if(value < target) {
            upper = 0
            lower++
        }else if(value > target) {
            lower = 0
            upper++
        }
        if(upper > 5 || lower > 5) {
            lower = 0; upper = 0;
            redPoints.push(i)
        }
    })
    redPoints.forEach((value) => {
        markRed(value, 5)
    })
}

function rule4() {
    let flag = (batchPoints[0] > target)
    let count = 0
    for(let i = 1; i < batchPoints.length; i++) {
        if(batchPoints[i] < target && flag === true) {
            flag = false
            count++
        }else if (batchPoints[i] > target && flag === false) {
            flag = true
            count++
        }else {
            count = 0
        }
        if(count === 14) {
            markRed(i, 14)
        }
    }
}

function clearRules() {
    batchPoints.forEach((value, i) => {
        changeCircleColor(i, "green")
    })
}
function checkPoints(index, totalPoints, count, upperLimit, lowerLimit) {
    let upperCount = 0, lowerCount = 0
    for(let i = index - 1; i >= index - totalPoints; i--) {
        if(batchPoints[i] > upperLimit) {
            upperCount++
        } else if(batchPoints[i] < lowerLimit) {
            lowerCount++
        }
    }
    return (upperCount >= count || lowerCount >= count)
}
function rule5TO6(totalPoints, count, upperLimit, lowerLimit) {
    for(let i = totalPoints - 1; i < batchPoints.length; i++) {
        if(checkPoints(i, totalPoints, count, upperLimit, lowerLimit)) {
            markRed(i, totalPoints)
            i += totalPoints - 1
        }
    }
}
function check15Points(index, totalPoints) {
    for(let i = index; i <  index + totalPoints; i++) {
        if(batchPoints[i] > upperZoneCHigh || batchPoints[i] < lowerZoneCLow) {
            return  false
        }
    }
    return true
}
function rule7(totalPoints) {
    for(let i = 0; i < batchPoints.length - totalPoints; i++) {
        if(check15Points(i, totalPoints)) {
            markRed((i + totalPoints - 1), totalPoints)
        }
    }
}
document.getElementById('rule1').addEventListener("click", () => rule1());

document.getElementById('rule2').addEventListener("click", () => rule2());
document.getElementById('rule3').addEventListener("click", () => rule3());
document.getElementById('rule4').addEventListener("click", () => rule4());
document.getElementById('rule5').addEventListener("click", () => rule5TO6(3, 2, upperZoneALow, lowerZoneAHigh));
document.getElementById('rule6').addEventListener("click", () => rule5TO6(5, 4, upperZoneBLow, lowerZoneBHigh));
document.getElementById('rule7').addEventListener("click", () => rule7(15));

document.getElementById('clear').addEventListener("click", () => clearRules());