const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing =require("./models/listing.js");
const path =require("path");const methodOverride = require("method-override");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

async function main(){
  await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

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

//index route
app.get("/listings",async (req,res) =>{
     const allListings=  await Listing.find({});
     res.render("listings/index",{allListings});
      
    });

 //New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
});
 // Show Route 
  app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show", { listing });
});

//Create Route post respnse acept in /listing
app.post("/listings",async(req,res)=>{
const newListing=new Listing(req.body.listing);
await newListing.save();
res.redirect("/listings");
})


//Edit Route
app.get("/listings/:id/edit",async (req,res) =>{
    const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit",{ listing});
});

//Update ROute
app.put("/listings/:id", async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});
//Delete Route 
app.delete("/listings/:id",async(req,res)=>{
    let {id} =req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
})
// app.get("/testListing",async (req,res) =>{
//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location :"Calanguate ,Goa",
//         country:"India",

//     });
        
//     await sampleListing.save();
//       console.log("sample was served");
//       res.send("succesful testing");

// });

app.listen(1222 ,() => {
    console.log("server is listening to port");
});