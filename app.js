import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";


const app = express();
const PORT = 3000;
const apiKey = process.env.OPENWEATHER_API_KEY;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs");

app.get("/",(req,res)=>{
  res.render("index");
  
})

app.post("/data",(req,res)=>{
  if(req.body.countryCode && req.body.zipCode ){
    console.log(req.body.countryCode + " " + req.body.zipCode);
    }
    res.redirect("/");
})




app.listen(PORT,()=>{
  console.log(`Server listening for requests on port ${PORT}`);
})
