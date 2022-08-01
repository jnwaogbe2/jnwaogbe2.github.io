var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = window.innerWidth - margin.left - margin.right, // Use the window's width
    height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

var svg3 = d3.selectAll("#line-graph3").append("svg")
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
        return d.Year >= parseTime("2000") && d.Year <= parseTime("2020")
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
    svg3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg3.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    // 9. Append the path, bind the data, and call the line generator 
    svg3.append("path")
        .datum(data) // 10. Binds data to the line 
        .attr("class", "line") // Assign a class for styling 
        .attr("d", line); // 11. Calls the line generator 

    // 12. Appends a circle for each datapoint 
    svg3.selectAll(".dot")
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

    const annotations3 = [
        {
            note: {
                label: "GarageBand is a software released by Apple that allowed for amateur producers to make music without a studio.",
                title: "Release of GarageBand",
                wrap: 10
            },
            dy: -200,
            dx: 100,
            x: xScale(parseTime("2004")),
            y: yScale(0.50),
            subject: {
                x1: xScale(parseTime("2004")),
                y1: 0,
                x2: xScale(parseTime("2004")),
                y2: height
            }
        }
    ]

    const makeAnnotations3 = d3.annotation()
        .type(d3.annotationXYThreshold)
        .on('noteclick', function (annotation) {
            svg3.selectAll(".annotation-note-label")
                .attr("y", 20)
                .classed("visible", true)

            // svg.selectAll(".annotation-note-label.visible")
            //     .classed("visible", false)
        })
        .annotations(annotations3);



    svg3.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations3);
});
