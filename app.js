import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = 3000;
const apiKey = process.env.OPENWEATHER_API_KEY;



app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs");

app.get("/",(req,res)=>{
  res.render("index");
  
})

app.post("/data", async (req, res) => {
  const countryCode = req.body.countryCode;
  const zipCode = req.body.zipCode;
  const geoApiUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${apiKey}`;

  if (countryCode && zipCode) {
    try {
      // First API call to get latitude and longitude
      const geoResponse = await axios.get(geoApiUrl);
      const lat = geoResponse.data.lat;
      const lon = geoResponse.data.lon;
      console.log(`Latitude: ${lat}, Longitude: ${lon}`);

      // Second API call to get weather data using lat and lon
      const weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=currently,minutely,hourly,alerts&appid=${apiKey}`;
      const weatherResponse = await axios.get(weatherApiUrl);
      let summary = weatherResponse.data.daily[0].summary
      // Replace 'today' with 'tomorrow'
      summary = summary.replace(/today/gi, 'tomorrow'); // Use 'gi' for case-insensitive replacement
      // Log the weather data or send it back in the response
      res.send(summary);
      // res.send(weatherResponse.data.daily[0].weather.main); // or render the data in your view

    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      res.status(500).send("Error fetching data");
    }
  } else {
    console.log("CountryCode or zipCode values not found.");
    res.status(400).send("Country code and zip code are required.");
  }

});





app.listen(PORT,()=>{
  console.log(`Server listening for requests on port ${PORT}`);
})
