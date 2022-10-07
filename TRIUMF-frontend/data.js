export async function fetchData() {
  const data = await fetch('https://beta.hla.triumf.ca/jaya/get');
  console.log(data);
  return data;
}
