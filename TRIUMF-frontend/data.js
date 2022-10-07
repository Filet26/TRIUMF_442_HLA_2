function fetchData() {
  const data = {
    readPvDict: {
      'ALGA:RDGAINA': '"51.0"',
      'IOS:BEAMTYPE': '1',
      'IOS:BIAS:VOL': '12636.987869077593',
      'IOS:EE:VOL': '863.121',
      'IOS:EESS:VOL': '2977.3',
      'IOS:HALLMB:RDFIELD': '34.916000000000054',
      'IOS:IG1:RDVAC': '7.941049439712669e-08',
      'IOS:IG2:RDVAC': '1.9525325860315103e-07',
      'IOS:IZR:POWER': '0.0',
      'IOS:MB:MASSOVERQ2': '3.9764078010664123',
      'IOS:OVEN:POWER': '0.0',
      'IOS:RFS:RDFP': '0.0',
      'IOS:RFS:RDRP': '0.0',
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
      'ALGA:RDGAINA': null,
      'IOS:BEAMTYPE': null,
      'IOS:BIAS:VOL': 'V',
      'IOS:EE:VOL': 'V',
      'IOS:EESS:VOL': 'V',
      'IOS:HALLMB:RDFIELD': 'G',
      'IOS:IG1:RDVAC': 'T',
      'IOS:IG2:RDVAC': 'T',
      'IOS:IZR:POWER': 'W',
      'IOS:MB:MASSOVERQ2': 'units',
      'IOS:OVEN:POWER': 'W',
      'IOS:RFS:RDFP': 'W',
      'IOS:RFS:RDRP': 'W',
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

function mapData(data) {
  const tableBody = document.querySelector('tbody');
  for (const [key, value] of Object.entries(data['readPvDict'])) {
    const row = document.createElement('tr');
    const tableCell1 = document.createElement('td');
    const tableCell2 = document.createElement('td');
    tableCell1.textContent += key;
    tableCell2.textContent += value;
    tableBody.appendChild(row);
    row.appendChild(tableCell1);
    row.appendChild(tableCell2);
  }
}

mapData(fetchData());
