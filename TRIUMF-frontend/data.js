function fetchData() {
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
      'IOS:BEAMTYPE': null,
      'IOS:BIAS:VOL': 'V',
      'IOS:HALLMB:RDFIELD': 'G',
      'IOS:IG1:RDVAC': 'T',
      'IOS:IG2:RDVAC': 'T',
      'IOS:MB:MASSOVERQ2': 'units',
      'ISAC:IOSBEAMPATH': null,
      'MCIS:BIAS0:VOL': 'V',
      'MCIS:EL1:VOL': 'V',
      'MCIS:IG1:RDVAC': 'T',
      'MCIS:RFS1:AMPL': 'dB',
      'MCIS:RFS1:FREQ': 'GHz',
      'MCIS:RFS2:AMPL': 'dB',
      'MCIS:RFS2:FREQ': 'GHz'
    },
    timestamp: '2022-10-07 11:36:01'
  };
  console.log(data);

  return data;
}

function removeFiller() {
  const fillerTableItems = document.querySelectorAll('.original');
  fillerTableItems.forEach((element) => {
    element.remove();
  });
}

async function mapData(data) {
  removeFiller();
  const listPVDict = Object.entries(await getLocalOlisData());
  const listUnitsDict = Object.entries(data.readUnitsDict);
  const tableBody = document.querySelector('tbody');
  for (const [index, value] of listPVDict.entries()) {
    const row = document.createElement('tr');
    row.className = 'original';
    tableBody.appendChild(row);
    for (const property of value) {
      const tableCell = document.createElement('td');
      tableCell.textContent += property;
      row.appendChild(tableCell);
    }

    const tableCell = document.createElement('td');
    tableCell.textContent += listUnitsDict[index][1];
    row.appendChild(tableCell);
  }
}

async function updateSecondColumnTableValues() {
  const data = await getLocalOlisData();
  const listPVDict = Object.entries(data);
  const tableBody = document.querySelector('tbody');
  const tableRows = tableBody.querySelectorAll('tr');
  tableRows.forEach((row, index) => {
    const tableCell = row.querySelector('td:nth-child(2)');
    tableCell.textContent = listPVDict[index][1];
  });
}

function insertTime() {
  const d = new Date();
  const element = document.querySelector('.time');
  element.textContent = `${d.toTimeString()}`;
}

async function getLocalData() {
  const response = await fetch('http://127.0.0.1:8081/', {
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

insertTime();
//clock goes tick tock
setInterval(() => {
  insertTime();
}, 1000);

mapData(fetchData());

setInterval(() => {
  updateSecondColumnTableValues();
}, 5000);

try {
  getLocalData().then((text) => {
    console.log(text);
  });
  getLocalOlisData().then((text) => {
    console.log(text);
  });
} catch (error) {
  console.log(error);
}
