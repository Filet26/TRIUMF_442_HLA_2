import express from "express";
import fetch from "node-fetch";
import convert from "xml-js";
import cors from "cors";
import { parse_xml, parse_xml_list } from "./parse.js";
import { getUserTweets } from "./twitter.js";
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
let twitterData;
getAllData();

// gets all the data
async function getAllData() {
  graph_data = await getGraphData();
  laserDirectionVariables = await getLaserDirectionVariables();
  olisVariables = await getOlisVariables();
  twitterData = await getUserTweets();
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
  // Root URL for data fetching
  const rooturl = "https://beta.hla.triumf.ca/jaya-isac/";

  // List of PV's for table, will be displayed in order, MAX is 12 PV's
  const PVDict = {
    1: "IOS:BIAS:RDVOL",
    2: "IOS:IZR:RDCUR",
    3: "IOS:IG2:RDVAC",
    4: "IOS:BIAS:RDVOL",
    5: "IOS:SSRFS:RDFP",
    6: "IOS:IG1:RDVAC",
    7: "MCIS:BIAS0:RDVOL",
    8: "MCIS:BIAS0:RDCUR",
    9: "MCIS:IG1:RDVAC",
    10: "IOS:MB:MASSOVERQ2",
    11: "IOS:MB:RDCUR",
    12: "IOS:HALLMB:RDFIELD",
  };

  const options = {
    method: "GET",
  };
  let response = await fetch(
    rooturl + Object.values(PVDict).join("+"),
    options
  );
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
    res.status(500).json({
      msg: `Internal Server Error.`,
    });
  }
});

// MAIN route
app.get("/Dashboard", (req, res) => {
  res.sendFile(path.resolve("../TRIUMF-frontend/index.html"));
});

app.get("/twitter", (req, res) => {
  try {
    res.json(twitterData);
  } catch (error) {
    console.log("twitter broke");
  }
});

// PVs used for our table
app.get("/OLIS", async function (req, res) {
  try {
    const xmlObject = JSON.parse(convert.xml2json(olisVariables));
    let data = parse_xml(xmlObject);
    let test_data = parse_xml_list(xmlObject);
    // res.status(200).json(data[0]);
    res.json(test_data);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: `Internal Server Error.`,
    });
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
    res.status(500).json({
      msg: `Internal Server Error.`,
    });
  }
});

// Initiate Application
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
