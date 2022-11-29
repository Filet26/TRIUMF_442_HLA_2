const readUnitsDict = {
  readUnitsDict: {
    //dict for units in table, Name of PV, and Units
    // SIS
    "IOS:BIAS:RDVOL": "V",
    "IOS:IZR:RDCUR": "A",
    "IOS:IG2:RDVAC	": "Torr",
    // MWIS
    "IOS:BIAS:RDCUR": "V",
    "IOS:SSRFS:RDFP": "W",
    "IOS:IG1:RDVAC": "Torr",
    // MCIS
    "MCIS:BIAS0:RDVOL": "V",
    "MCIS:BIAS0:RDCUR": "uA",
    "MCIS:IG1:RDVAC": "Torr",
    // MB
    "IOS:MB:MASSOVERQ2": "A/Q",
    "IOS:MB:RDCUR": "A",
    "IOS:HALLMB:RDFIELD": "G",
  },
};

// Removes filler dummy data values
function removeFiller() {
  //need filler to stop table layout shift
  const fillerTableItems = document.querySelectorAll(".dummyTable");
  fillerTableItems.forEach((element) => {
    element.remove();
  });
}

// this function rounds the PV values
// will also parse values using scientific notation (10.923e-09 -> 10.9e-09)
function roundNum(num) {
  // if value is error

  if (isNaN(num)) {
    return "<ERROR>";
  }

  let eIndex = num.indexOf("e");
  if (eIndex == -1) {
    return Number(num).toPrecision(4);
  } else {
    let convertedNum = Number(num.substring(0, eIndex)).toPrecision(4);
    let notation = num.substring(eIndex);
    return convertedNum + notation;
  }
}

// updates the font size of our twitter widget
async function updateTwitterFontSize() {
  const iframe = document.querySelector("#twitter-widget-0");
  const elementList = iframe.contentWindow.document.querySelectorAll(
    ".timeline-Tweet-text"
  );
  for (const node of elementList) {
    node.style.fontSize = "225%";
    node.style.lineHeight = "28px";
  }
}

// Main data function

async function mapData(data) {
  // Removes filler data
  removeFiller();

  // gets a fresh copy of data
  const listPVDict = await getLocalOlisData();
  // Reads units from dummy dictionary
  const listUnitsDict = Object.entries(data.readUnitsDict);
  const tableBody = document.querySelector("tbody");
  for (const [index, value] of listPVDict.entries()) {
    const row = document.createElement("tr");

    // assign class based on PV index

    // Simple ion source label
    if (index == 2 || index == 1 || index == 0) {
      row.className = "original sis";
      if (index == 0) {
        const beamName = document.createElement("td");
        beamName.rowSpan = "3";
        beamName.textContent = "SIS";
        beamName.className = "beamName sis-header";
        row.appendChild(beamName);
      }
    }
    // Microwave Ion source labesl
    else if (index == 5 || index == 4 || index == 3) {
      row.className = "original mws";
      if (index == 3) {
        const beamName = document.createElement("td");
        beamName.rowSpan = "3";
        beamName.textContent = "MWS";
        beamName.className = "beamName mws-header";
        row.appendChild(beamName);
      }
    }

    // Multi-charge
    else if (index == 8 || index == 7 || index == 6) {
      row.className = "original mcis";
      if (index == 6) {
        const beamName = document.createElement("td");
        beamName.rowSpan = "3";
        beamName.textContent = "MCIS";
        beamName.className = "beamName mcis-header";
        row.appendChild(beamName);
      }
    }

    // Mag
    else if (index == 9 || index == 10 || index == 11) {
      row.className = "original mb";
      if (index == 9) {
        const beamName = document.createElement("td");
        beamName.rowSpan = "3";
        beamName.textContent = "Magnetic Bender";
        beamName.className = "beamName mb-header";
        row.appendChild(beamName);
      }
    } else {
      row.className = "original";
    }

    // create table cells

    const nameRow = document.createElement("td");
    const valueRow = document.createElement("td");

    // PV Name
    nameRow.textContent += Object.keys(listPVDict[index]);

    // actual number
    valueRow.textContent += roundNum(value);

    row.appendChild(nameRow);
    row.appendChild(valueRow);

    // table cell for the units
    const tableCell = document.createElement("td");

    // map the units
    tableCell.textContent += listUnitsDict[index][1];
    row.appendChild(tableCell);

    tableBody.appendChild(row);
  }
}

async function updateGraphData() {
  const graphData = await getGraphData();
  const hiddenData = document.querySelector("#graph_data");
  hiddenData.innerHTML = graphData["IOS:FC6:SCALECUR"];
}

async function updateSecondColumnTableValues() {
  const listPVDict = await getLocalOlisData();
  const tableBody = document.querySelector("tbody");
  const tableRows = tableBody.querySelectorAll("tr");
  tableRows.forEach((row, index) => {
    const tableCell = row.querySelector("td:nth-last-child(2)");
    tableCell.textContent = roundNum(Object.values(listPVDict[index]));
  });
}

function insertTime() {
  const d = new Date();
  const element = document.querySelector(".time");
  element.textContent = `${d.toTimeString()}`;
}

// fetch data from backend

async function fetchData(url) {
  const response = await fetch(url, {
    method: "GET",
  });
  const freshData = await response.json();
  return freshData;
}

// TODO: Change links to deployed URL, eg. www.site.com/direction
async function getLaserDirectionData() {
  return fetchData("http://127.0.0.1:8081/direction");
}

// TODO: Change links to deployed URL, eg. www.site.com/olis
async function getLocalOlisData() {
  return fetchData("http://127.0.0.1:8081/OLIS");
}

// TODO: Change links to deployed URL, eg. www.site.com/chartdata
async function getGraphData() {
  return fetchData("http://127.0.0.1:8081/ChartData");
}

async function setDiagramLabels() {
  const freshData = await getLaserDirectionData();
  const aData = freshData["IOS:XCB1AW:RDVOL"];
  const bData = freshData["IOS:XCB1AE:RDVOL"];
  const cData = freshData["IOS:PSWXCB1A:STATON"];
  let statusElement = document.querySelector(".diagramLabelBeamStatus");
  let sourceElement = document.querySelector(".diagramLabelBeamSource");
  let diagramImageElement = document.querySelector(".diagram-img");

  // Logic for bean source, ask dr C
  if (aData > 400 && bData > 400 && cData == 1) {
    diagramImageElement.src = "./public/graphic_left.svg";
    sourceElement.innerHTML = "Beam Source: Surface Ion";
    statusElement.innerHTML = "Beam Status: ON";
    return;
  }
  if (aData > 400 && bData > 400 && cData == 0) {
    diagramImageElement.src = "./public/graphic_right.svg";
    sourceElement.innerHTML = "Beam Source: Microwave";
    statusElement.innerHTML = "Beam Status: ON";
    return;
  }
  if (aData <= 400 && bData <= 400) {
    diagramImageElement.src = "./public/graphic_mid.svg";
    sourceElement.innerHTML = "Beam Source: Multi-Charge Ion";
    statusElement.innerHTML = "Beam Status: ON";
    return;
  }
  diagramImageElement.src = "./public/graphic_none.svg";
  sourceElement.innerHTML = "Beam Source: None";
  statusElement.innerHTML = "Beam Status: OFF";
  return;
}

// Changes table source header based on current active beam

function activeBeamInfo() {
  const current_beam = document.querySelector(
    ".diagramLabelBeamSource"
  ).innerHTML;

  // Reset the classes, so that only 1 can be active
  let sis = document.querySelector(".sis-header");
  let mws = document.querySelector(".mws-header");
  let mcis = document.querySelector(".mcis-header");

  // Reset the classes, so that only 1 can be active
  sis.classList.remove("activeBeam");
  mws.classList.remove("activeBeam");
  mcis.classList.remove("activeBeam");

  // set classlist based on current beam source, active beam is a blinking border class
  if (current_beam == "Beam Source: Surface Ion") {
    sis.classList.add("activeBeam");
  } else if (current_beam == "Beam Source: Microwave") {
    mws.classList.add("activeBeam");
  } else if (current_beam == "Beam Source: Multi-Charge Ion") {
    mcis.classList.add("activeBeam");
  }
}

function insertTwitterMobile() {
  if (window.innerWidth < 600) {
    const element = document.querySelector("#twitterWidget");
    const twitterHTML = `<a class="twitter-timeline" data-width="360" data-height="420" data-dnt="true" href="https://twitter.com/crjcharles?ref_src=twsrc%5Etfw">Tweets by crjcharles</a>`;
    return element.insertAdjacentHTML("afterbegin", twitterHTML);
  }

  const element = document.querySelector("#twitterWidget");
  const twitterHTML = `<a
        class='twitter-timeline'
        href='https://twitter.com/crjcharles?ref_src=twsrc%5Etfw'
        style='height:100%'
      >
        Tweets by crjcharles
      </a>`;
  return element.insertAdjacentHTML("afterbegin", twitterHTML);
}

function responsiveElements() {
  const chartElement = document.querySelector("div.chartContainer");
  const twitterElement = document.querySelector("div.smallContainer");
  const twitterContainer = document.querySelector("div.twitter-timeline");
  const twitterIFrame = document.querySelector("iframe#twitter-widget-0");
  if (window.innerWidth < 600) {
    twitterElement.style.height = "80vh";
    twitterElement.style.width = "90vw";
    twitterElement.style.overflowY = "auto";
    return (chartElement.style.display = "none");
  }
  {
    twitterElement.style.height = "100%";
    twitterElement.style.width = "100%";
    twitterIFrame.style.height = "100%";
    twitterContainer.style.height = "100%";
    twitterElement.style.overflowY = "hidden";
    return (chartElement.style.display = "inline-block");
  }
}

addEventListener("resize", (event) => {
  responsiveElements();
});

insertTwitterMobile();
// Nav bar Clock
insertTime();

//clock goes tick tock
setInterval(() => {
  insertTime();
}, 1000);

// Mapping data, 5 second refresh
mapData(readUnitsDict);
// Wrapped all(most of) the chart functions in window wrapper
setDiagramLabels();

updateGraphData();
updateSecondColumnTableValues();

setInterval(() => {
  updateSecondColumnTableValues();
  if (window.innerWidth > 600) {
    setDiagramLabels();
    updateGraphData();
  }
  activeBeamInfo();
}, 5000);
