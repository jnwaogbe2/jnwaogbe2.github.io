var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = window.innerWidth - margin.left - margin.right, // Use the window's width
    height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

var svg = d3.selectAll("#line-graph1").append("svg")
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

    data = data.filter(function(d) {
        if (currentSlide == 1) {
          return d.Year >= parseTime("1960") && d.Year <= parseTime("1980")
        }
        if (currentSlide == 2) {
            return d.Year >= parseTime("1980") && d.Year <= parseTime("2000")
        }
        if (currentSlide == 3) {
            return d.Year >= parseTime("2000") && d.Year <= parseTime("2020")
        }
      })

    // 5. X scale will use the index of our data
    var xScale = d3.scaleTime().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0])
    xScale.domain(d3.extent(data, function(d) { return d.Year; }));
    yScale.domain([0, d3.max(data, function(d) { return d.Acousticness; })]);


    var line = d3.line()
        .x(function (d, i) { return xScale(d.Year); }) // set the x values for the line generator
        .y(function (d) { return yScale(d.Acousticness); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    // 3. Call the x axis in a group tag
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    // 9. Append the path, bind the data, and call the line generator 
    svg.append("path")
        .datum(data) // 10. Binds data to the line 
        .attr("class", "line") // Assign a class for styling 
        .attr("d", line); // 11. Calls the line generator 

    // 12. Appends a circle for each datapoint 
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function (d, i) { return xScale(d.Year); })
        .attr("cy", function (d) { return yScale(d.Acousticness);})
        .attr("r", 5)
        // .on("mouseover", function (a, b, c) {
        //     console.log(a)
        //     d3.select(this).attr('class', 'focus')
        // })
        // .on("mouseout", function () { 
        //     d3.select(this).attr('class', '')
        // });
});