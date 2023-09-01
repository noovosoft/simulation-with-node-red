const dummy = []
for ( let i = 0; i < 60; i++ ) {
    dummy.push ((Math.random () * (45 - 30) + 30).toFixed (0))
}


class plot {
    constructor (points, svg, chartNumber) {
        this.chartNumber = chartNumber
        this.svg = svg
        this.batchPoints = points;
        this.upperControlLimit = Math.max (...this.batchPoints)
        this.lowerControlLimit = Math.min (...this.batchPoints)
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

    axes () {
        // x-axis
        drawLine (this.svg, {
            x1 : this.xAxisPxStart,
            y1 : this.xAxisPadding,
            x2 : this.xAxisPxLength,
            y2 : this.yAxisPxLength,
            id : "x-axis"
        });
        // y-axis
        drawLine (this.svg, {
            x1 : this.yAxisPxStart,
            y1 : this.yAxisPadding,
            x2 : this.yAxisPxStart,
            y2 : this.yAxisPxLength,
            id : "y-axis"
        });
    }

    ticksLabel (sec = [], min = [], hours = []) {

        //y-axis
        for ( let i = 1; i <= this.yAxisCount; i++ ) {
            const yAxisNum = (this.upperControlLimit + this.rangeVariance) - (i - 1) * 1
            //axis ticks
            drawLine (this.svg, {
                x1 : this.yAxisPxStart - 4,
                y1 : this.yAxisPadding + this.yAxisGap * (i - 1),
                x2 : this.yAxisPxStart,
                y2 : this.yAxisPadding + this.yAxisGap * (i - 1)
            });
            //labels
            drawText (this.svg, {
                x : 20,
                y : 25 + this.yAxisGap * (i - 1),
                text : yAxisNum,
                id : "x-axis" + this.chartNumber + i
            });
        }
        //x-axis
        for ( let i = 1; i <= this.batchPoints.length; i++ ) {
            //grid
            drawLine (this.svg, {
                x1 : parseInt (this.xAxisPxStart + 20 + this.xAxisGap * (i - 1)),
                y1 : parseInt (this.yAxisPadding),
                x2 : parseInt (this.xAxisPxStart + 20 + this.xAxisGap * (i - 1)),
                y2 : parseInt (this.xAxisPadding),
                stroke : '#ccc'
            });

            drawText (this.svg,
                {
                    x : this.xAxisPxStart - 5 + this.xAxisGap * i,
                    y : this.xAxisPadding + 20,
                    text : sec[i - 1] + " ",
                    id : "y-axis-sec" + this.chartNumber + i
                });

            drawText (this.svg,
                {
                    x : this.xAxisPxStart - 5 + this.xAxisGap * i,
                    y : this.xAxisPadding + 40,
                    text : min[i - 1] + " ",
                    id : "y-axis-min" + this.chartNumber + i
                });

            drawText (this.svg,
                {
                    x : this.xAxisPxStart - 5 + this.xAxisGap * i,
                    y : this.xAxisPadding + 60,
                    text : hours[i - 1] + " ",
                    id : "y-axis-hour" + this.chartNumber + i
                });

        }

    }

    drawLineID (svg, {
        x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0,
        stroke = 'black',
        strokeWidth = 1,
        strokeType = 'solid',
        id = null
    }) {
        // id = "line"
        let element = id ? document.getElementById (id) : null;

        if (!element) {
            element = document.createElementNS (svgNS, 'line');
        }

        if (id) {
            element.setAttributeNS (null, 'id', (id));
        }
        element.setAttributeNS (null, 'x1', x1.toString ());
        element.setAttributeNS (null, 'y1', y1.toString ());
        element.setAttributeNS (null, 'x2', x2.toString ());
        element.setAttributeNS (null, 'y2', y2.toString ());
        element.setAttributeNS (null, 'stroke', stroke.toString ());
        element.setAttributeNS (null, 'stroke-width', strokeWidth.toString ());
        element.setAttributeNS (null, 'shape-rendering', 'crispEdges');

        if (strokeType === 'dashed') {
            element.setAttributeNS (null, 'stroke-dasharray', '4');
        }

        svg.appendChild (element);
    }

    plotPoints (batchPoints, color = 'green') {
        batchPoints.forEach ((value, i) => {
            drawCircle (this.svg, {
                cx : this.xAxisPxStart + this.yAxisPadding + (i * this.xAxisGap),
                cy : this.yAxisPxLength - ((value - (this.lowerControlLimit - this.rangeVariance)) * this.yAxisGap),
                r : 2,
                fill : color,
                id : "circle" + color + this.chartNumber + i
            });

        })
        batchPoints.forEach ((value, i) => {
            if (i > 0) {
                this.drawLineID (this.svg, {
                    x1 : this.xAxisPxStart + this.yAxisPadding + (i * this.xAxisGap),
                    y1 : this.yAxisPxLength - ((value - (this.lowerControlLimit - this.rangeVariance)) * this.yAxisGap),
                    x2 : this.xAxisPxStart + this.yAxisPadding + ((i - 1) * this.xAxisGap),
                    y2 : this.yAxisPxLength - ((batchPoints[i - 1] - (this.lowerControlLimit - this.rangeVariance)) * this.yAxisGap),
                    id : "line" + color + this.chartNumber + i,
                    stroke : color
                })

            }
        })
    }

    timeTexts (svg) {

        drawText (svg, {
            x : 10,
            y : 380 + 20,
            text : "seconds"
        })
        drawText (svg, {
            x : 10,
            y : 400 + 20,
            text : "mins"
        })
        drawText (svg, {
            x : 10,
            y : 420 + 20,
            text : "hours"
        })
    }

    drawControlPlot (color = "transparent") {
        this.axes ()
        this.plotPoints (this.batchPoints, color)

    }
}


const svg3 = document.getElementById ('svg3');
const svg4 = document.getElementById ('svg4');
const svg5 = document.getElementById ('svg5');


const temperatureVoltage = new plot (dummy.slice (-60), svg3, 3)
temperatureVoltage.drawControlPlot ();
temperatureVoltage.timeTexts (svg3);

const voltageObj = new plot (dummy.slice (-60), svg4, 4)
voltageObj.drawControlPlot ();
voltageObj.timeTexts (svg4);

const temperatureObj = new plot (dummy.slice (-60), svg5, 5)
temperatureObj.drawControlPlot ();
temperatureObj.timeTexts (svg5)

