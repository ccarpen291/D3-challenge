
var ccWidth = 1000;
var Heights = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var leftmargin = margin.left
var topmargin = margin.top
var rightmartin = margin.right
var bottommargin = margin.bottom

var width = ccWidth - leftmargin - rightmartin;
var height = Heights - topmargin - bottommargin;

var svg = d3.select("body")
  .append("svg")
  .attr("width", ccWidth)
  .attr("height", Heights);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${leftmargin}, ${topmargin})`);

d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

d3.csv("/data/data.csv", function(err, healthData) {
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  var xLinearScale = d3.scaleLinear().range([0, width]);
  var yLinearScale = d3.scaleLinear().range([height, 0]);
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var xMin;
  var xMax;
  var yMin;
  var yMax;
  
  xMin = d3.min(healthData, function(data) {
      return data.healthcare;
  });
  
  xMax = d3.max(healthData, function(data) {
      return data.healthcare;
  });
  
  yMin = d3.min(healthData, function(data) {
      return data.poverty;
  });
  
  yMax = d3.max(healthData, function(data) {
      return data.poverty;
  });
  
  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([yMin, yMax]);
  console.log(xMin);
  console.log(yMax);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
  .data(healthData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.healthcare +1.5))
  .attr("cy", d => yLinearScale(d.poverty +0.3))
  .attr("r", "12")
  .attr("fill", "blue")
  .attr("opacity", .5)
  .on("mouseout", function(data, index) {
    toolTip.hide(data);
  });
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([100, -60])
    .html(function(d) {
      return (abbr + '%');
      });

  chartGroup.call(toolTip);

  circlesGroup.on("click", function(data) {
    toolTip.show(data);
  })
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  chartGroup.append("text")
  .style("font-size", "12px")
  .selectAll("tspan")
  .data(healthData)
  .enter()
  .append("tspan")
      .attr("x", function(data) {
          return xLinearScale(data.healthcare +1.3);
      })
      .attr("y", function(data) {
          return yLinearScale(data.poverty +.1);
      })
      .text(function(data) {
          return data.abbr
      });

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - leftmargin + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Healtcare Limited(%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, 470)`)
    .attr("class", "axisText")
    .text("Poverty Percentage (%)");
});
