const dummy = []
for(let i = 0; i < 60; i++) {
    dummy.push((Math.random() * (45 - 30) + 30).toFixed(0))
}


class plot {
    constructor(points, svg, chartNumber) {
        this.chartNumber = chartNumber
        this.svg = svg
        this.batchPoints = points;
        this.upperControlLimit = Math.max(...this.batchPoints)
        this.lowerControlLimit = Math.min(...this.batchPoints)
        this.rangeVariance = 3
        this.yAxisCount = (((this.upperControlLimit - this.lowerControlLimit) + (this.rangeVariance * 2)) / 1) + 1
        this.yAxisGap = 360 / this.yAxisCount
        this.xAxisPxLength = 1180 //default
        this.xAxisPxStart = 40 //default
        this.yAxisPxStart = 40 //default
        this.yAxisPxLength = 380 //default
        this.xAxisPadding = 380 //default
        this.yAxisPadding = 20 //default
        this.xAxisGap = (this.xAxisPxLength - this.xAxisPxStart) / this.batchPoints.length
    }
    axes() {
        // x-axis
        drawLine(this.svg, {x1: this.xAxisPxStart, y1: this.xAxisPadding, x2: this.xAxisPxLength, y2: this.yAxisPxLength, id: "x-axis"});
        // y-axis
        drawLine(this.svg, {x1: this.yAxisPxStart, y1: this.yAxisPadding, x2: this.yAxisPxStart, y2: this.yAxisPxLength, id: "y-axis"});
    }
    ticksLabel() {
        //y-axis
        for (let i = 1; i <= this.yAxisCount; i++) {

            const yAxisNum = (this.upperControlLimit + this.rangeVariance) - (i - 1) * 1
            //grid line
            //drawLine(svg, {x1: yAxisPxStart, y1: yAxisPadding + yAxisGap * (i - 1), x2: xAxisPxLength, y2: yAxisPadding + yAxisGap * (i - 1), strokeType: "dashed"});
            //axis ticks
            drawLine(this.svg, {
                x1: this.yAxisPxStart - 4,
                y1: this.yAxisPadding + this.yAxisGap * (i - 1),
                x2: this.yAxisPxStart,
                y2: this.yAxisPadding + this.yAxisGap * (i - 1)
            });
            //labels
            drawText(this.svg, {x: 20, y: 25 + this.yAxisGap * (i - 1), text: yAxisNum, id: "x-axis" + i});
        }
        //x-axis
        for (let i = 1; i <= this.batchPoints.length; i++) {
            //grid
            drawLine(this.svg, {
                x1: parseInt(this.xAxisPxStart+ 20 + this.xAxisGap * (i - 1)),
                y1: parseInt(this.yAxisPadding),
                x2: parseInt(this.xAxisPxStart + 20 + this.xAxisGap * (i - 1)),
                y2: parseInt(this.xAxisPadding),
                stroke: '#ccc'
            });
            //ticks
            // drawLine(this.svg, {
            //     x1: parseInt(this.xAxisPxStart + this.xAxisGap * i),
            //     y1: parseInt(this.xAxisPadding),
            //     x2: parseInt(this.xAxisPxStart + this.xAxisGap * i),
            //     y2: parseInt(this.xAxisPadding + 4)
            // });
            //label
            drawText(this.svg, {x: this.xAxisPxStart - 5 + this.xAxisGap * i, y: this.xAxisPadding + 20, text: i, id: "y-axis" + i});
        }
    }
    plotPoints(batchPoints, color = 'green') {
        batchPoints.forEach((value, i) => {
            drawCircle(this.svg, {
                cx: this.xAxisPxStart + this.yAxisPadding + (i * this.xAxisGap),
                cy: this.yAxisPxLength - ((value - (this.lowerControlLimit - this.rangeVariance)) * this.yAxisGap),
                r: 2,
                fill: color,
                id: "circle"+ color + this.chartNumber + i
            });
        })
    }

    drawControlPlot(color = "transparent") {
        this.axes()
        this.ticksLabel()
        this.plotPoints(this.batchPoints, color)
        console.log(this.batchPoints)

    }
}
const svg3 = document.getElementById('svg3');
const svg4 = document.getElementById('svg4');
const svg5 = document.getElementById('svg5');

const temperatureVoltage = new plot(dummy.slice(-60), svg3, 3)
temperatureVoltage.drawControlPlot();

const voltageObj = new plot(dummy.slice(-60), svg4, 4)
voltageObj.drawControlPlot();

const temperatureObj = new plot(dummy.slice(-60), svg5, 5)
temperatureObj.drawControlPlot();
//drawControlPlot(svg = svg3)
