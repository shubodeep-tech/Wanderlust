const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing =require("./models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

async function main(){
  await mongoose.connect(MONGO_URL);
}

main().then(() =>{
    console.log("connected to db");
})
.catch((err)=> {
    console.log(err);
});
//creatnga a basic api
app.get("/",(req,res) =>{
     res.send("Hi,I am a root");
});

app.get("/testListing",async (req,res) =>{
    let sampleListing = new Listing({
        title:"My New Villa",
        description:"By the beach",
        price:1200,
        location :"Calanguate ,Goa",
        country:"India",

    });
        
    await sampleListing.save();
      console.log("sample was served");
      res.send("succesful testing");

});

app.listen(8080 ,() => {
    console.log("server is listening to port");
});