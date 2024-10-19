const express = require("express")
const app = express();
const mongoose = require("mongoose");
const ejsmate = require("ejs-mate");
const path = require("path");
var methodOverride = require("method-override")
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'))
app.set("view engine","ejs");
app.engine("ejs",ejsmate);
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));


const listing = require("./models/listing.js");

main().then(() => console.log("connected to database")).catch(err=>console.log(err));
async function main() {
    const mongourl = 'mongodb://127.0.0.1:27017/accomodation';
    await mongoose.connect(mongourl)
}


app.delete("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    let list= await listing.findByIdAndDelete(id);
    console.log(list);
    res.redirect("/listings");
    
});


app.patch("/listings/:id",  async (req,res)=>{
   let {id} = req.params;
    let data = req.body;
    await listing.findByIdAndUpdate(id,{...data});
    res.redirect(`/listings/${id}`);

});

app.get("/listings/:id/edit", async (req,res)=>{
   let {id} = req.params;
   let data = await listing.findById(id);
   res.render("listings/edit.ejs",{data});
});


app.post("/listings", async (req,res)=>{
    let {title,description,image,price,location,country}=req.body;
    let postlisting =  new listing({
        title:title,description:description,image:image,price:price,location:location,country:country
    })
   await postlisting.save().then(()=>{console.log("succesfully saved in db")}).catch(err=>console.log(err));
   res.redirect("/listings");
});
app.get("/listings/new",(req,res)=>{
   res.render("listings/new.ejs");
})
app.get("/listings/:id",async (req,res)=>{
   let {id} = req.params;
   const showdata = await listing.findById(id);
   res.render("listings/show.ejs",{showdata});
});

app.get("/listings", async (req,res)=>{
    const alllistings = await listing.find();
    res.render("listings/index.ejs",{alllistings});
});

app.get("/", (req, res) => {
    res.send("hi! i am raot");
})

app.listen(8080, () => {
    console.log("server working fine");
})



























































// app.get("/testinit",async (req,res)=>{
//     let samplelisting = new listing({
//         title:"jack sparrow the mysterious pirate",
//         description:"jack is a pirate in the abondoned ocean where he finds the lost treasures thet were lost in the void period",
//         image:"",
//         price:2100,
//         location:"tel-aviv",
//         country:"israel"
//     })

//      await samplelisting.save().then(()=>{console.log("saved in db")});
//      res.send("saved in  db");
// })