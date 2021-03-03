async function drawScatter() {
  // Access data
  const data = await d3.json("./my_weather_data.json")
  
  const xAccessor = d => d.dewPoint
  const yAccessor = d => d.humidity
  const colorAccessor = d => d.cloudCover
  // console.log(yAccessor(data[0])) CHECK POINT

  // Create chart dimensions

  const width = d3.min([
    window.innerwidth * 0.9, window.innerHeight * 0.9
  ])

  const dimensions = {
    width, 
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    }
  }

  dimensions.boundedWidth = dimensions.width - dimensions.margin.right - dimensions.margin.left
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

// Draw the canvas

  const wrapper = d3.select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    //.style("border", "1px solid") CHECK POINT

  const bounds = wrapper.append("g")
    .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
       dimensions.margin.top
      }px)`)

// Create scales
  const xScale = d3.scaleLinear()
      .domain(d3.extent(data, xAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()

  const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yAccessor))
      .range([dimensions.boundedHeight, 0])
      .nice()

  const colorScale = d3.scaleLinear()
      .domain(d3.extent(data, colorAccessor))
      .range(["skyblue", "darkslategrey"])

// Draw data
/* THIS METHOD IS GOOD, BUT DOESN'T LET YOU ACTUALIZE THE DATA
  data.forEach(d => {
    bounds.append("circle")
    .attr("cx", xScale(xAccessor(d)))
    .attr("cy", yScale(yAccessor(d)))
    .attr("r", 5)
  }) */

  const dots = bounds.selectAll("circle")
    .data(data) //the (first) data is a method
    .enter().append("circle")
        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", d => yScale(yAccessor(d)))
        .attr("r", 10)
        .attr("fill", d => colorScale(colorAccessor(d)))

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${
      dimensions.boundedHeight
    }px`)

  const axisXLabel = xAxis.append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .html("Dew Point")

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(5)

  const yAxis = bounds.append("g")
    .call(yAxisGenerator)

  const axisYLabel = yAxis.append("text")
    .attr("x", -dimensions.boundedHeight/2)
    .attr("y", -dimensions.margin.left +20)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .text("Relative Humidity")
    .style("transform", `rotate(${
      -90
    }deg`)
    .style("text-anchor", "middle") // To pin the rotation in the middle




}

drawScatter()