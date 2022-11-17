function populateDummyData() {
  // dummy data

  const data = {
    readPvDict: {
      'IOS:BEAMTYPE': '1',
      'IOS:BIAS:RDVOL': '12636.987869077593',
      'IOS:HALLMB:RDFIELD': '34.916000000000054',
      'IOS:IG1:RDVAC': '7.941049439712669e-08',
      'IOS:IG2:RDVAC': '1.9525325860315103e-07',
      'IOS:MB:MASSOVERQ2': '3.9764078010664123',
      'ISAC:IOSBEAMPATH': 'ios-hebt2-dragon',
      'MCIS:BIAS0:VOL': '12637.216754406041',
      'MCIS:EL1:VOL': '0.0',
      'MCIS:IG1:RDVAC': '3.2331256866455076e-07',
      'MCIS:RFS1:AMPL': '18.48680000000001',
      'MCIS:RFS1:FREQ': '13.04530000000061',
      'MCIS:RFS2:AMPL': '17.864000000000004',
      'MCIS:RFS2:FREQ': '13.828357500000033'
    },
    readUnitsDict: {
      // SIS
      'IOS:BIAS:RDVOL': 'V',
      'IOS:IZR:RDCUR': 'A',
      'IOS:IG2:RDVAC	': 'Torr',
      // MWIS
      'IOS:BIAS:RDCUR': 'V',
      'IOS:SSRFS:RDFP': 'W',
      'IOS:IG1:RDVAC': 'Torr',
      // MCIS
      'MCIS:BIAS0:RDVOL': 'V',
      'MCIS:BIAS0:RDCUR': 'uA',
      'MCIS:IG1:RDVAC': 'Torr',
      // MB
      'IOS:MB:MASSOVERQ2': 'A/Q',
      'IOS:MB:RDCUR': 'A',
      'IOS:HALLMB:RDFIELD': 'G'
    },
    timestamp: '2022-10-07 11:36:01'
  };
  return data;
}

// Removes filler dummy data values
function removeFiller() {
  //need filler to stop layout shift
  const fillerTableItems = document.querySelectorAll('.dummyTable');
  fillerTableItems.forEach((element) => {
    element.remove();
  });
}

// converts list of dictionaries into a list of lists
function pvToList(olisVariables) {
  let pv_list = [];

  for (let i = 0; i < olisVariables.length; i++) {
    let subList = [
      Object.keys(olisVariables[i])[0],
      Object.values(olisVariables[i])[0]
    ];
    pv_list.push(subList);
  }
  return pv_list;
}

// this function rounds the PV values
// will also parse values using scientific notation (10.923e-09 -> 10.9e-09)
function roundNum(num) {
  // if value is error

  if (isNaN(num)) {
    return '<ERROR>';
  }

  let eIndex = num.indexOf('e');
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
  const iframe = document.querySelector('#twitter-widget-0');
  const elementList = iframe.contentWindow.document.querySelectorAll(
    '.timeline-Tweet-text'
  );
  for (const node of elementList) {
    node.style.fontSize = '225%';
    node.style.lineHeight = '28px';
  }
}

// Main data function

async function mapData(data) {
  // Removes filler data
  removeFiller();

  // gets a fresh copy of data
  const listPVDict = pvToList(await getLocalOlisData());
  // Reads units from dummy dictionary
  const listUnitsDict = Object.entries(data.readUnitsDict);
  const tableBody = document.querySelector('tbody');

  for (const [index, value] of listPVDict.entries()) {
    const row = document.createElement('tr');

    // assign class based on PV index

    // Simple ion source label
    if (index == 2 || index == 1 || index == 0) {
      row.className = 'original sis';
      if (index == 0) {
        const beamName = document.createElement('td');
        beamName.rowSpan = '3';
        beamName.textContent = 'SIS';
        beamName.className = 'beamName sis-header';
        row.appendChild(beamName);
      }
    }
    // Microwave Ion source labesl
    else if (index == 5 || index == 4 || index == 3) {
      row.className = 'original mws';
      if (index == 3) {
        const beamName = document.createElement('td');
        beamName.rowSpan = '3';
        beamName.textContent = 'MWS';
        beamName.className = 'beamName mws-header';
        row.appendChild(beamName);
      }
    }

    // Multi-charge
    else if (index == 8 || index == 7 || index == 6) {
      row.className = 'original mcis';
      if (index == 6) {
        const beamName = document.createElement('td');
        beamName.rowSpan = '3';
        beamName.textContent = 'MCIS';
        beamName.className = 'beamName mcis-header';
        row.appendChild(beamName);
      }
    }

    // Mag
    else if (index == 9 || index == 10 || index == 11) {
      row.className = 'original mb';
      if (index == 9) {
        const beamName = document.createElement('td');
        beamName.rowSpan = '3';
        beamName.textContent = 'Magnetic Bender';
        beamName.className = 'beamName mb-header';
        row.appendChild(beamName);
      }
    } else {
      row.className = 'original';
    }

    // create table cells

    const nameRow = document.createElement('td');
    const valueRow = document.createElement('td');

    // PV Name
    nameRow.textContent += value[0];

    // actual number
    valueRow.textContent += roundNum(value[1]);

    row.appendChild(nameRow);
    row.appendChild(valueRow);

    // for (const property of value) {
    //   const tableCell = document.createElement("td");
    //   console.log(value);
    //   tableCell.textContent += property;
    //   row.appendChild(tableCell);
    // }

    // table cell for the units
    const tableCell = document.createElement('td');

    // map the units
    tableCell.textContent += listUnitsDict[index][1];
    row.appendChild(tableCell);

    tableBody.appendChild(row);
  }
}

async function updateGraphData() {
  const graphData = await getGraphData();
  const hiddenData = document.querySelector('#graph_data');
  hiddenData.innerHTML = graphData['IOS:FC6:SCALECUR'];
}

async function updateSecondColumnTableValues() {
  const listPVDict = pvToList(await getLocalOlisData());
  const tableBody = document.querySelector('tbody');
  const tableRows = tableBody.querySelectorAll('tr');
  tableRows.forEach((row, index) => {
    const tableCell = row.querySelector('td:nth-last-child(2)');
    tableCell.textContent = roundNum(listPVDict[index][1]);
  });
}

function insertTime() {
  const d = new Date();
  const element = document.querySelector('.time');
  element.textContent = `${d.toTimeString()}`;
}

async function getLaserDirectionData() {
  const response = await fetch('http://127.0.0.1:8081/direction', {
    method: 'GET'
  });
  const freshData = await response.json();
  return freshData;
}

// fetch twitter from backend

async function getTwitterFromExpress() {
  const response = await fetch('http://127.0.0.1:8081/twitter', {
    method: 'GET'
  });
  const freshData = await response.json();
  console.log(freshData);
  return freshData;
}

async function getLocalOlisData() {
  const response = await fetch('http://127.0.0.1:8081/OLIS', {
    method: 'GET'
  });
  const freshData = await response.json();

  return freshData;
}

async function getGraphData() {
  const response = await fetch('http://127.0.0.1:8081/ChartData', {
    method: 'GET'
  });
  const freshData = await response.json();
  return freshData;
}

async function setDiagramLabels() {
  const freshData = await getLaserDirectionData();
  const aData = freshData['IOS:XCB1AW:RDVOL'];
  const bData = freshData['IOS:XCB1AE:RDVOL'];
  const cData = freshData['IOS:PSWXCB1A:STATON'];
  let status = document.querySelector('.diagramLabelBeamStatus');

  // Logic for bean source, Don't ask
  if (aData > 400 && bData > 400 && cData == 1) {
    document.querySelector('.diagram-img').src = './public/graphic_left.svg';
    document.querySelector('.diagramLabelBeamSource').innerHTML =
      'Beam Source: Surface Ion';
    document.querySelector('.diagramLabelBeamStatus').innerHTML =
      'Beam Status: ON';
    return;
  }
  if (aData > 400 && bData > 400 && cData == 0) {
    document.querySelector('.diagram-img').src = './public/graphic_right.svg';
    document.querySelector('.diagramLabelBeamSource').innerHTML =
      'Beam Source: Microwave';
    document.querySelector('.diagramLabelBeamStatus').innerHTML =
      'Beam Status: ON';
    document.querySelector('.diagramLabelBeamStatus');
    return;
  }
  if (aData <= 400 && bData <= 400) {
    document.querySelector('.diagram-img').src = './public/graphic_mid.svg';
    document.querySelector('.diagramLabelBeamSource').innerHTML =
      'Beam Source: Multi-Charge Ion';
    document.querySelector('.diagramLabelBeamStatus').innerHTML =
      'Beam Status: ON';
    return;
  }
  document.querySelector('.diagram-img').src = './public/graphic_none.svg';
  document.querySelector('.diagramLabelBeamSource').innerHTML =
    'Beam Source: None';
  document.querySelector('.diagramLabelBeamStatus').innerHTML =
    'Beam Status: OFF';
  return;
}

// Changes table source header based on current active beam

function activeBeamInfo() {
  const current_beam = document.querySelector(
    '.diagramLabelBeamSource'
  ).innerHTML;

  // Reset the classes, so that only 1 can be active
  let sis = document.querySelector('.sis-header');
  let mws = document.querySelector('.mws-header');
  let mcis = document.querySelector('.mcis-header');

  // Reset the classes, so that only 1 can be active
  sis.classList.remove('activeBeam');
  mws.classList.remove('activeBeam');
  mcis.classList.remove('activeBeam');

  // set classlist based on current beam source, active beam is a blinking border class
  if (current_beam == 'Beam Source: Surface Ion') {
    sis.classList.add('activeBeam');
  } else if (current_beam == 'Beam Source: Microwave') {
    mws.classList.add('activeBeam');
  } else if (current_beam == 'Beam Source: Multi-Charge Ion') {
    mcis.classList.add('activeBeam');
  }
}

function insertTwitterMobile() {
  if (window.innerWidth < 600) {
    const element = document.querySelector('#twitterWidget');
    const twitterHTML = `<a class="twitter-timeline" data-width="360" data-height="420" data-dnt="true" href="https://twitter.com/crjcharles?ref_src=twsrc%5Etfw">Tweets by crjcharles</a>`;
    return element.insertAdjacentHTML('afterbegin', twitterHTML);
  }

  const element = document.querySelector('#twitterWidget');
  const twitterHTML = `<a
        class='twitter-timeline'
        href='https://twitter.com/crjcharles?ref_src=twsrc%5Etfw'
        style='height:100%'
      >
        Tweets by crjcharles
      </a>`;
  return element.insertAdjacentHTML('afterbegin', twitterHTML);
}

function removeChartIfMobile() {
  if (window.innerWidth < 600) {
    const element = document.querySelector('div.chartContainer');
    return element.replaceChildren();
  }
}
insertTwitterMobile();
removeChartIfMobile();
// Nav bar Clock
insertTime();

//clock goes tick tock
setInterval(() => {
  insertTime();
}, 1000);

// Mapping data, 5 second refresh
mapData(populateDummyData());
// Wrapped all(most of) the chart functions in window wrapper
setDiagramLabels();

updateGraphData();

getTwitterFromExpress();
setInterval(() => {
  updateSecondColumnTableValues();
  if (window.innerWidth > 600) {
    setDiagramLabels();
    updateGraphData();
  }
  activeBeamInfo();
}, 5000);
