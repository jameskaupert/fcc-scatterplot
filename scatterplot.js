const dataUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const req = new XMLHttpRequest();
req.open("GET", dataUrl, true);
req.send();
req.onload = () => {
  const data = JSON.parse(req.responseText);
  data.forEach(d => {
    let times = d.Time.split(":");
    d.Time = new Date(Date.UTC(1970, 0, 1, 0, times[0], times[1]));
  });
  console.log(data);

  // set up size
  const width = 1000;
  const height = 700;
  const margin = { top: 60, bottom: 60, left: 60, right: 60 };

  // set up axes
  const xMin = d3.min(data, d => d["Year"] - 1);
  const xMax = d3.max(data, d => d["Year"] + 1);
  const xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin.left, width - margin.right]);

  const xAxis = d3
    .axisBottom()
    .scale(xScale)
    .tickFormat(d3.format("d"));

  const yMin = d3.max(data, d => d["Time"]);
  const yMax = d3.min(data, d => d["Time"]);
  const yScale = d3
    .scaleTime()
    .domain([yMin, yMax])
    .range([height - margin.bottom, margin.top]);

  const yAxis = d3
    .axisLeft()
    .scale(yScale)
    .tickFormat(d3.timeFormat("%M:%S"));

  const svg = d3
    .select(".scatterplot")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);

  const tooltip = d3
    .select(".scatterplot")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("z-index", 10)
    .style("display", "none");

  const points = svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => xScale(d["Year"]))
    .attr("cy", (d, i) => yScale(d["Time"]))
    .attr("r", 5)
    .attr("class", "dot")
    .attr("data-xvalue", d => d["Year"])
    .attr("data-yvalue", d => d["Time"])
    .attr("fill", (d, i) => {
      return d.Doping === "" ? "#D4B86B" : "#545A93";
    })
    .style("stroke", "black")
    .style("stroke-width", 0.5)
    .on("mouseover", (d, i) => {
      tooltip
        .style("opacity", "1")
        .style("display", "block")
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px")
        .html(
          '<div class="tooltipWrapper"><p>' +
            d["Year"] +
            " - " +
            d["Name"] +
            " (" +
            d["Time"].getMinutes() +
            ":" +
            d["Time"].getSeconds() +
            ")" +
            "</p><p>" +
            d["Doping"] +
            "</p></div>"
        )
        .attr("data-year", d["Year"]);
    })
    .on("mouseout", (d, i) => {
      tooltip.style("opacity", 0).style("display", "none");
    });

  const legend = svg
    .selectAll(".legend")
    .data([
      { label: "No Doping", color: "#D4B86B" },
      { label: "Doping", color: "#545A93" }
    ])
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("id", "legend")
    .attr("height", 100)
    .attr("width", 100)
    .attr("transform", (d, i) => {
      return `translate(${width - margin.right}, ${height -
        margin.bottom * 5 -
        i * 30})`;
    });

  console.log(legend);

  legend
    .append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", d => d["color"])
    .style("stroke", "black");

  legend
    .append("text")
    .text(d => d["label"])
    .attr("transform", (d, i) => {
      return `translate(${-margin.right * 1.5}, 15)`;
    });
};
