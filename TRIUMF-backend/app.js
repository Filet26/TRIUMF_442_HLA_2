import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import convert from "xml-js";
import cors from "cors";
import { parse_xml } from "./test.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 8081;

app.use(cors());

// directory stuff for serving html file
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// for CSS
app.use(express.static(path.resolve("../TRIUMF-frontend/")));

// pre-initialized variables
let laserDirectionVariables;
let olisVariables;
let graph_data;
getAllData();

// gets all the data
async function getAllData() {
  graph_data = await getGraphData();
  laserDirectionVariables = await getLaserDirectionVariables();
  olisVariables = await getOlisVariables();
}

// GET request to jaya microservice, returns data in XML format
async function getLaserDirectionVariables() {
  const url =
    "https://beta.hla.triumf.ca/jaya-isac/IOS:XCB1AW:RDVOL+IOS:XCB1AE:RDVOL+IOS:PSWXCB1A:STATON";
  const options = {
    method: "GET",
  };
  let response = await fetch(url, options);
  return await response.text();
}

// Main data fetcher
async function getOlisVariables() {
  const url =
    "https://beta.hla.triumf.ca/jaya-isac/IOS:BIAS:RDVOL+IOS:IZR:RDCUR+IOS:IG2:RDVAC+IOS:BIAS:RDVOL+IOS:SSRFS:RDFP+IOS:IG1:RDVAC+MCIS:BIAS0:RDVOL+MCIS:BIAS0:RDCUR+MCIS:IG1:RDVAC+IOS:MB:MASSOVERQ2+IOS:MB:RDCUR+IOS:HALLMB:RDFIELD";
  const options = {
    method: "GET",
  };
  let response = await fetch(url, options);
  return await response.text();
}

// data for our graph
async function getGraphData() {
  const url = "https://beta.hla.triumf.ca/jaya-isac/IOS:FC6:SCALECUR";
  const options = {
    method: "GET",
  };
  let response = await fetch(url, options);
  return await response.text();
}

// Poll fresh data every 5 seconds
setInterval(async () => {
  laserDirectionVariables = await getLaserDirectionVariables();
  olisVariables = await getOlisVariables();
  graph_data = await getGraphData();
}, 5000);

// Direction variables, for internal use
app.get("/direction", async function (req, res) {
  try {
    const xmlObject = JSON.parse(convert.xml2json(laserDirectionVariables));
    let data = parse_xml(xmlObject);
    res.status(200).json(data[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: `Internal Server Error.` });
  }
});

// MAIN route
app.get("/Dashboard", (req, res) => {
  res.sendFile(path.resolve("../TRIUMF-frontend/index.html"));
});

app.get("/OLIS", async function (req, res) {
  try {
    const xmlObject = JSON.parse(convert.xml2json(olisVariables));
    let data = parse_xml(xmlObject);
    res.status(200).json(data[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: `Internal Server Error.` });
  }
});

// Returns data for our graph,
app.get("/ChartData", async function (req, res) {
  try {
    const xmlObject = JSON.parse(convert.xml2json(graph_data));
    let data = parse_xml(xmlObject);
    res.status(200).json(data[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: `Internal Server Error.` });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
