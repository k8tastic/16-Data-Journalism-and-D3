var svgWidth = 750;
var svgHeight = 500;

// Margins
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

// Chart area minus margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create and size the SVG container and append, size, and position an SVG group inside
var svg = d3
    .select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

var chartGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function (healthData, error) {
    if (error) return console.warn(error);

    // Parse Data/Cast as numbers
    healthData.forEach(function (d) {
        d.poverty = +d.poverty;
        // d.age = +d.age;
        // d.income = +d.income;
        d.healthcare = +d.healthcare;
        // d.obesity = +d.obesity;
        // d.smokes = +d.smokes;
    });

    console.log(healthData);

    // Create scale functions
    var xLinearScale = d3
        .scaleLinear()
        .domain([
            d3.min(healthData, d => d.poverty) - 0.5,
            d3.max(healthData, d => d.poverty) + 2
        ])
        .range([0, width]);

    var yLinearScale = d3
        .scaleLinear()
        .domain([
            d3.min(healthData, d => d.healthcare) - 0.5,
            d3.max(healthData, d => d.healthcare) + 2
        ])
        .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create axes labels
    chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 30)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("No Healthcare (%)");

    chartGroup
        .append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");

    // Create Circles
    var circlesGroup = chartGroup
        .selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "lightblue")
        .attr("opacity", ".7");

    // Add state abbreviations to circles
    var circlesText = chartGroup
        .selectAll('.label')
        .data(healthData)
        .enter()
        .append('text')
        .text(d => d.abbr)
        .attr('x', d => xLinearScale(d.poverty))
        .attr('y', d => yLinearScale(d.healthcare - 0.2))
        .attr('class', 'label')
        .style('font-size', '10px')
        .style('fill', 'SteelBlue')
        .style('text-anchor', 'middle')
        .classed('fill-text', false);

    // Create the "mouse_over" event listeners with transitions
    circlesGroup
        .on("mouseover", function (d) {
            tip.show(d, this)
        })

        // Create "mouse_out" event listener to hide tooltip
        .on("mouseout", function (d) {
            tip.hide(d, this)
        });

    // Create mouseover event listener to display tooltip
    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function (d) {
            return `<h6>State: ${(d.state)}</h6><h6>Poverty: ${(d.poverty)}%</h6><h6>Healthcare: ${d.healthcare}%</h6>`
        })
    svg.call(tip);

});