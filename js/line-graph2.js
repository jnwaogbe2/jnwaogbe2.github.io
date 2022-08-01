var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = window.innerWidth - margin.left - margin.right, // Use the window's width
    height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

var svg2 = d3.selectAll("#line-graph2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("/data/average_acoust_by_year.json").then(function (data) {
    parseTime = d3.timeParse("%Y");

    data.forEach(function (d) {
        d.Year = parseTime(d.Year)
        d.Acousticness = d.Acousticness;
    });

    data = data.filter(function (d) {
        return d.Year >= parseTime("1980") && d.Year <= parseTime("2000");
    })

    // 5. X scale will use the index of our data
    var xScale = d3.scaleTime().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0])
    xScale.domain(d3.extent(data, function (d) { return d.Year; }));
    yScale.domain([0, 0.80]);


    var line = d3.line()
        .x(function (d, i) { return xScale(d.Year); }) // set the x values for the line generator
        .y(function (d) { return yScale(d.Acousticness); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    // 3. Call the x axis in a group tag
    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg2.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    // 9. Append the path, bind the data, and call the line generator 
    svg2.append("path")
        .datum(data) // 10. Binds data to the line 
        .attr("class", "line") // Assign a class for styling 
        .attr("d", line); // 11. Calls the line generator 

    // 12. Appends a circle for each datapoint 
    svg2.selectAll(".dot")
        .data(data)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function (d, i) { return xScale(d.Year); })
        .attr("cy", function (d) { return yScale(d.Acousticness); })
        .attr("r", 5)
    // .on("mouseover", function (a, b, c) {
    //     console.log(a)
    //     d3.select(this).attr('class', 'focus')
    // })
    // .on("mouseout", function () { 
    //     d3.select(this).attr('class', '')
    // });

    // svg2.append("line")
    //     .attr("x1", xScale(parseTime("1997")))  //<<== change your code here
    //     .attr("y1", 0)
    //     .attr("x2", xScale(parseTime("1997")))  //<<== and here
    //     .attr("y2", height)
    //     .attr("class", "baseline axis")
    //     .style("stroke", "#E8336D")
    //     .style("stroke-width", 3);

    const annotations2 = [
        {
            note: {
                label: "AutoTune was invented in 1997. The first song published using Auto-Tune on the vocals was the 1998 song \"Believe\" by Cher.",
                title: "Creation of AutoTune",
                wrap: 10
            },
            //can use x, y directly instead of data
            className: "show-bg",
            dy: -400,
            dx: -200,
            x: xScale(parseTime("1997")),
            y: yScale(0.1696),
            subject: {
                x1: xScale(parseTime("1997")),
                y1: 0,
                x2: xScale(parseTime("1997")),
                y2: height,
                text: 'C',
                y: 'bottom'
              }
        }
    ]

    const makeAnnotations2 = d3.annotation()
        .type(d3.annotationXYThreshold)
        .on('noteclick', function (annotation) {
            svg2.selectAll(".annotation-note-label")
                .classed("visible", true)

            // svg.selectAll(".annotation-note-label.visible")
            //     .classed("visible", false)
        })
        .annotations(annotations2);



    svg2.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations2);
});