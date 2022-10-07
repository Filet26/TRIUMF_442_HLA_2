async function fetchData() {
  const data = await fetch('https://beta.hla.triumf.ca/jaya/get', {
    method: 'GET'
  });
  console.log(data);
  return data;
}
fetchData();
