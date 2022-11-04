function fetchData() {
  // dummy data
  const data = {
    readPvDict: {
      'IOS:BEAMTYPE': '1',
      'IOS:BIAS:VOL': '12636.987869077593',
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
      'IOS:BIAS:VOL': 'V',
      'IOS:BIAS:RDCUR': 'mA',
      'IOS:IZR:RDVOL': 'V',
      'MCIS:BIAS0:RDVOL': 'V',
      'MCIS:BIAS0:RDCUR': 'uA',
      'MCIS:RFS2:FREQ': 'GHz',
      'IOS:MB:MASSOVERQ2': '',
      'IOS:MB:RDCUR': 'A',
      'IOS:HALLMB:RDFIELD': 'G',
      'IOS:IG1:RDVAC': 'T',
      'IOS:IG2:RDVAC': 'T',
      'MCIS:IG1:RDVAC': 'T',
      'MCIS:RFS2:AMPL': 'dB',
      'MCIS:RFS2:FREQ': 'GHz'
    },
    timestamp: '2022-10-07 11:36:01'
  };
  return data;
}

function removeFiller() {
  //need filler to stop layout shift
  const fillerTableItems = document.querySelectorAll('.dummyTable');
  fillerTableItems.forEach((element) => {
    element.remove();
  });
}

// this function rounds the PV values
// will also parse values using scientific notation (10.923e-09 -> 10.9e-09)
function roundNum(num) {
  let eIndex = num.indexOf('e');
  if (eIndex == -1) {
    return Number(num).toPrecision(4);
  } else {
    let convertedNum = Number(num.substring(0, eIndex)).toPrecision(4);
    let notation = num.substring(eIndex);
    return convertedNum + notation;
  }
}

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

async function mapData(data) {
  removeFiller();
  const listPVDict = Object.entries(await getLocalOlisData());
  const listUnitsDict = Object.entries(data.readUnitsDict);
  const tableBody = document.querySelector('tbody');

  //

  for (const [index, value] of listPVDict.entries()) {
    const row = document.createElement('tr');
    // assign class based on PV index

    if (index == 2 || index == 1 || index == 0) {
      row.className = 'original sis';
      if (index == 0) {
        const beamName = document.createElement('td');
        beamName.rowSpan = '3';
        beamName.textContent = 'SIS/MWIS';
        beamName.className = 'beamName';
        row.appendChild(beamName);
      }
    } else if (index == 5 || index == 4 || index == 3) {
      row.className = 'original mcis';
      if (index == 3) {
        const beamName = document.createElement('td');
        beamName.rowSpan = '3';
        beamName.textContent = 'MCIS';
        beamName.className = 'beamName';
        row.appendChild(beamName);
      }
    } else if (index == 8 || index == 7 || index == 6) {
      row.className = 'original aq';
      if (index == 6) {
        const beamName = document.createElement('td');
        beamName.rowSpan = '3';
        beamName.textContent = 'A/Q';
        beamName.className = 'beamName';
        row.appendChild(beamName);
      }
    } else if (index == 9 || index == 10 || index == 11) {
      row.className = 'original vacuum';
      if (index == 9) {
        const beamName = document.createElement('td');
        beamName.rowSpan = '3';
        beamName.textContent = 'Vacuum';
        beamName.className = 'beamName';
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
  const data = await getLocalOlisData();
  const listPVDict = Object.entries(data);
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

insertTime();
//clock goes tick tock
setInterval(() => {
  insertTime();
  updateTwitterFontSize();
}, 1000);

mapData(fetchData());
setDiagramLabels();
updateGraphData();
setInterval(() => {
  updateSecondColumnTableValues();
  setDiagramLabels();
  updateGraphData();
}, 5000);
