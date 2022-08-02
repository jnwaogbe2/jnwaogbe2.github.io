var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = window.innerWidth - margin.left - margin.right, 
    height = window.innerHeight - margin.top - margin.bottom; 

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

    var xScale = d3.scaleTime().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0])
    xScale.domain(d3.extent(data, function (d) { return d.Year; }));
    yScale.domain([0, 0.80]);


    var line = d3.line()
        .x(function (d, i) { return xScale(d.Year); }) 
        .y(function (d) { return yScale(d.Acousticness); }) 
        .curve(d3.curveMonotoneX) 

    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); 

    svg2.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); 

    svg2.append("path")
        .datum(data) 
        .attr("class", "line") 
        .attr("d", line); 

    svg2.selectAll(".dot")
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
                label: "AutoTune was invented in 1997. It was originally created to correct off-key inaccuracies. Because of the robotic sound it adds to vocals, it became one of the most used effects in pop music. The first song published using Auto-Tune\n on the vocals was the 1998 song \"Believe\" by Cher.",
                title: "Creation of AutoTune",
                wrap: 10,
                wrapSplitter: /\n/
            },
            dy: 40,
            dx: -350,
            x: xScale(parseTime("1997")),
            y: yScale(0.60),
            subject: {
                x1: xScale(parseTime("1997")),
                y1: 0,
                x2: xScale(parseTime("1997")),
                y2: height,
            }
        }
    ]

    const makeAnnotations2 = d3.annotation()
        .type(d3.annotationXYThreshold)
        .on('noteclick', function (annotation) {
            
            // svg2.selectAll(".annotation-note-content")
            //     .append('div')
            //     .attr('class', 'annotation-note-label')
            //     .text(annotation.note.label)
            //     .attr('text-anchor', 'middle')
            //     .attr('y', '20')
            //     .attr('x', '15')
            //     .style('display', 'block')

            svg2.selectAll(".annotation-note-content")
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
            // svg2.selectAll(".annotation-note-label")
            //     .attr("width", 40)
            //     .attr("y", 20)
            //     .classed("visible", true)
            
//             var path = d3.path();
//             path.lineTo(225,0);
//             path.closePath();
            
//             svg2.selectAll(".note-line")
//                 .attr("d", path);
            
            // svg.selectAll(".annotation-note-label.visible")
            //     .classed("visible", false)
        })
        .annotations(annotations2);



    svg2.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations2);
});
