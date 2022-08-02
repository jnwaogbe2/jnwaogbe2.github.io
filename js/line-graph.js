var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = window.innerWidth - margin.left - margin.right, 
    height = window.innerHeight - margin.top - margin.bottom; 

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

    data = data.filter(function (d) {
        return d.Year >= parseTime("1960") && d.Year <= parseTime("1980")
    })

    var xScale = d3.scaleTime().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0])
    xScale.domain(d3.extent(data, function (d) { return d.Year; }));
    yScale.domain([0, 0.80]);


    var line = d3.line()
        .x(function (d, i) { return xScale(d.Year); }) 
        .y(function (d) { return yScale(d.Acousticness); }) 
        .curve(d3.curveMonotoneX) 

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); 

    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); 

    svg.append("path")
        .datum(data)  
        .attr("class", "line")
        .attr("d", line); 

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle") 
        .attr("class", "dot") 
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

    // svg.append("line")
    //     .attr("x1", xScale(parseTime("1964")))  //<<== change your code here
    //     .attr("y1", 0)
    //     .attr("x2", xScale(parseTime("1964")))  //<<== and here
    //     .attr("y2", height)
    //     .attr("class", "baseline axis")
    //     .style("stroke", "#E8336D")
    //     .style("stroke-width", 3);

    const annotations = [
        {
            note: {
                label: "Moog synthesizers are electronic musical instruments that have the capability of \n producing a wide variety of electronic sounds. It was introduced \
                by Bill Moog in 1964 in response to producers wanting more affordable and more practical music equipment.",
                bgPadding: { "top": 15, "left": 10, "right": 10, "bottom": 10 },
                title: "Debut of the Moog Synthesizer",
                wrapSplitter: "/\n/",
                wrap: 300
            },
            className: "show-bg",
            dy: 200,
            dx: 100,
            x: xScale(parseTime("1964")),
            y: yScale(0.5506),
            subject: {
                x1: xScale(parseTime("1964")),
                y1: 0,
                x2: xScale(parseTime("1964")),
                y2: height
              }
        }
    ]

    const makeAnnotations = d3.annotation()
        .type(d3.annotationXYThreshold)
        .on('noteclick', function (annotation) {
            svg.selectAll(".annotation-note-content")
                .append("foreignObject")
                .attr("x", 0)
                .attr("y", 5) 
                .attr("width", 300) // replace with width you want 
                .attr("height", 300)// replace with height you want
                .append("xhtml:div")// replace with html element you want
                .append("p")
                .attr('class', 'annotation-note-label')
                .style('color', "#E8336D")
                .text(annotation.note.label)
                .style('display', 'block');

            // svg.selectAll(".annotation-note-label")
            //     .classed("visible", true)

            // svg.selectAll(".annotation-note-label.visible")
            //     .classed("visible", false)
        })

        .annotations(annotations);



    svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
});