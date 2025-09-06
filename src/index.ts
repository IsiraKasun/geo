import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { City } from "./types";
import { JSONFilePreset } from 'lowdb/node'
import { Low } from 'lowdb'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "db.json");


const app = express();
const port = 3000;
const citiArray: City[] = [];
let db: Low<{ cities: City[]; }>;

const loadingCities = async () => {
  console.log('Reading DB');
  db = await JSONFilePreset(filePath, { cities: citiArray });
  console.log('Data Loaded');
};

app.get("/cityList", (req: Request, res: Response) => {
  const country = req.query.country as string;


  const cities = db.data.cities;
  const filteredCities = cities.filter((cityObj) => {
    if (country?.toLowerCase() === cityObj.country.toLowerCase()) {
      return cityObj.name;
    }
  });
  const cityNames: string[] = [];
  filteredCities.forEach((cityObj) => {
    cityNames.push(cityObj.name);
  })
  res.send(cityNames);
});

app.get("/countryList", (req: Request, res: Response) => {
  const country = req.query.country as string;

  const cities = db.data.cities;
  const countryNames: string[] = [];
  cities.forEach((cityObj) => {
    if (!countryNames.includes(cityObj.country)) {
      countryNames.push(cityObj.country);
    }

  })
  res.send(countryNames);
});

app.listen(port, () => {
  loadingCities();
  console.log(`Server is running at http://localhost:${port}`);
});
