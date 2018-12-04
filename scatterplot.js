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
  const height = 500;
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

  const points = svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => xScale(d["Year"]))
    .attr("cy", (d, i) => yScale(d["Time"]))
    .attr("r", 5)
    .attr("fill", (d, i) => {
      return d.Doping === "" ? "#D4B86B" : "#545A93";
    })
    .style("stroke", "black")
    .style("stroke-width", 0.5);

  // console.log(points);
};
