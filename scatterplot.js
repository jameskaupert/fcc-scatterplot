const dataUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const req = new XMLHttpRequest();
req.open("GET", dataUrl, true);
req.send();
req.onload = () => {
  const json = JSON.parse(req.responseText);
  console.log(json);
};
