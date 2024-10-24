const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsmate = require("ejs-mate");
const path = require("path");
var methodOverride = require("method-override");
const {listingschema} = require("./schema.js");
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.engine("ejs", ejsmate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

const expresserror = require("./utils/expresserror.js");
const wrapasync = require("./utils/errorwrap");
const listing = require("./models/listing.js");

main().then(() => console.log("Connected to database")).catch(err => console.log(err));

async function main() {
    const mongourl = 'mongodb://127.0.0.1:27017/accomodation';
    await mongoose.connect(mongourl);
}

app.delete("/listings/:id", wrapasync(async (req, res, next) => {
    let { id } = req.params;
    let list = await listing.findByIdAndDelete(id);
    console.log(list);
    if (!list) {
        return next(new expresserror("Listing not found", 404));
    }
    res.redirect("/listings");
}));

app.patch("/listings/:id", wrapasync(async (req, res, next) => {
    let { id } = req.params;
    let data = req.body;
    let updatedListing = await listing.findByIdAndUpdate(id, { ...data });
    if (!updatedListing) {
        return next(new expresserror("Listing not found", 404));
    }
    res.redirect(`/listings/${id}`);
}));

app.get("/listings/:id/edit", wrapasync(async (req, res, next) => {
    let { id } = req.params;
    let data = await listing.findById(id);
    if (!data) {
        return next(new expresserror("Listing not found", 404));
    }
    res.render("listings/edit.ejs", { data });
}));

app.post("/listings", wrapasync(async (req, res, next) => {
   let newlisting = new listing(req.body.listing);
   console.log(req.body);
   let result = listingschema.validate(req.body);
   console.log(result);
    try {
        await newlisting.save();
        console.log("Successfully saved in DB");
        res.redirect("/listings");
    } catch (err) {
        next(err);  // Pass any errors to your error handler
    }
}));

app.get("/listings/new", wrapasync((req, res, next) => {
    res.render("listings/new.ejs");
}));

app.get("/listings/:id", wrapasync(async (req, res, next) => {
    let { id } = req.params;
    const showdata = await listing.findById(id);
    if (!showdata) {
        return next(new expresserror("Listing not found", 404));
    }
    res.render("listings/show.ejs", { showdata });
}));

app.get("/listings", wrapasync(async (req, res, next) => {
    const alllistings = await listing.find();
    res.render("listings/index.ejs", { alllistings });
}));

app.get("/err",(req,res)=>{
    abcd = abcd;
})
app.get("/", (req, res) => {
    res.send("Hi! I am Raot");
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    if (err.name === 'CastError') {
        err.message = 'Not Found';
        err.status = 400;
    }
    let { message, status } = err;
    res.render("listings/error.ejs",{err});
});

app.all("*", (req, res) => {
    res.send("The route you are requesting is not available");
});

app.listen(8080, () => {
    console.log("Server working fine");
});


























































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











