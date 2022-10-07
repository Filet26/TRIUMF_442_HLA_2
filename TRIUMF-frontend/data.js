export async function fetchData() {
  const data = await fetch('https://beta.hla.triumf.ca/jaya/get', {
    credentials: 'omit',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0',
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Accept-Language': 'en-CA,en-US;q=0.7,en;q=0.3',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin'
    },
    referrer: 'https://beta.hla.triumf.ca/high-level-apps/olis',
    body: '{"readPvList":["IOS:BIAS:VOL","IOS:IG1:RDVAC","IOS:EE:VOL","IOS:MB:MASSOVERQ2","IOS:RFS:RDFP","IOS:RFS:RDRP","MCIS:BIAS0:VOL","MCIS:IG1:RDVAC","MCIS:EL1:VOL","IOS:MB:MASSOVERQ2","MCIS:RFS1:FREQ","MCIS:RFS1:AMPL","MCIS:RFS2:FREQ","MCIS:RFS2:AMPL","ALGA:RDGAINA","IOS:BIAS:VOL","IOS:IG2:RDVAC","IOS:EESS:VOL","IOS:MB:MASSOVERQ2","IOS:IZR:POWER","IOS:OVEN:POWER","ISAC:IOSBEAMPATH","IOS:MB:MASSOVERQ2","IOS:HALLMB:RDFIELD","IOS:BEAMTYPE"],"readUnits":true}',
    method: 'POST',
    mode: 'cors'
  });
  console.log(data);
  return data;
}
