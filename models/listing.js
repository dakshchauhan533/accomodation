const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingschema = new Schema({
    title:String,
    description:String,
    image:{
        type:String
    },
    price:Number,
    location:String,
    country:String
})

const listing = mongoose.model("listing",listingschema);
module.exports  = listing;