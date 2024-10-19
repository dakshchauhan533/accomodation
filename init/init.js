const mongoose = require("mongoose");
const indata = require("./data.js");
const listing = require("../models/listing.js");


const mongourl = 'mongodb://127.0.0.1:27017/accomodation';

async function main(){
    await mongoose.connect(mongourl);
}
main().then(()=>{
    console.log("connected to db");
}).catch(err=>console.log(err));

const initdb = async ()=>{
    await listing.deleteMany();
    await listing.insertMany(indata.data);
    console.log("saved in db");
}
initdb();