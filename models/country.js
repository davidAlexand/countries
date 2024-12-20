//mongoose,help manage database operations and define document schemas
const mongoose = require('mongoose');
//Create a new schema of Mongoose with the name SchemaCountry,this schema define the structure of data of countries
const countrySchema = new mongoose.Schema({
    flags: {
    //Unique:true is for,onli rquiere unique data
    png: { type: String, unique: true  },
  },
  name: {
    common: { type: String, required: true ,unique:false },
  },
  capital: [{ type: String, unique: true }],
  region: { type: String, unique: false },
  subregion: { type: String , unique: true},
  cca2: { type: String, unique: true },  
  area: { type: Number, unique: true },
  flag: { type: String,unique: false},
  population: { type: Number, unique: true },
  latlng: { type: Array, unique: true },
  
});
//here is  create a model of moongose called Country based in the countrySchema
const Country = mongoose.model('Country', countrySchema);
module.exports = Country;
