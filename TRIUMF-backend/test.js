function parse_xml(xml_object) {
  let elements = {};
  let time = xml_object["elements"][0]["attributes"]["timestamp"];
  let data = xml_object["elements"][0]["elements"];

  for (let i = 0; i < data.length; i++) {
    elements[data[i]["attributes"]["pv"]] = data[i]["attributes"]["value"];
  }

  // returns an array with
  return [elements, time];
}

export { parse_xml };
