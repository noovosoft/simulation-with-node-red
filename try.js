
        const rangeVariance = 0
        const yAxisCount = 50 / 5
        const yAxisActualLength = 360
        const yAxisGap = 360 / yAxisCount
        const xAxisPxLength = 1180
        const xAxisPxStart = 40
        const yAxisPxStart = 40
        const yAxisPxLength = 380
        const xAxisPadding = 380
        const yAxisPadding = 20
        const batchPoints = [1, 2]
        const xAxisGap = (xAxisPxLength - xAxisPxStart) / batchPoints.length
    axes (svg)
    {
        // x-axis
        drawLine (svg, {x1 : xAxisPxStart, y1 : xAxisPadding, x2 : xAxisPxLength, y2 : yAxisPxLength});
        // y-axis
        drawLine (svg, {x1 : yAxisPxStart, y1 : yAxisPadding, x2 : yAxisPxStart, y2 : yAxisPxLength});
    }



    ticksLabel (svg, totalBatches)
    {
        //y-axis
        for ( let i = 0; i <= yAxisCount; i++ ) {
            const yAxisNum = 55 - (i * 5);
            //grid line
            //axis ticks
            drawLine (svg, {
                x1 : yAxisPxStart - 4,
                y1 : yAxisPadding + yAxisGap * (i - 1),
                x2 : yAxisPxStart,
                y2 : yAxisPadding + yAxisGap * (i - 1)
            });
            //labels
            drawText (svg, {x : 20, y : 25 + yAxisGap * (i - 1), text : yAxisNum});
        }
        //x-axis
        for ( let i = 1; i <= 60; i++ ) {
            //ticks
            drawLine (svg, {
                x1 : xAxisPxStart + xAxisGap * i,
                y1 : xAxisPadding,
                x2 : xAxisPxStart + xAxisGap * i,
                y2 : xAxisPadding + 4
            });
            //label
            drawText (svg, {x : xAxisPxStart - 5 + xAxisGap * i, y : xAxisPadding + 20, text : i});
        }
    }
    plotPoints (svg, batchPoints)
    {
        batchPoints.forEach ((value, i) => {
            drawCircle (svg, {
                cx : xAxisPxStart + yAxisPadding + (i * xAxisGap),
                cy : yAxisPxLength - ((value - (0 - rangeVariance)) * yAxisGap),
                r : 2,
                fill : 'green',
                id : "circle" + i
            });
        })
    }

    drawControlPlot (svg)
    {
        const obj = new plot (svg3);
        obj.axes (svg)
        obj.ticksLabel (svg, batchPoints.length)
        obj.plotPoints (svg, batchPoints)
    }


const svg3 = document.getElementById('svg3');
drawControlPlot(svg3);




