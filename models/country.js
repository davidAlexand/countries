//mongoose,help manage database operations and define document schemas
const mongoose = require('mongoose');
//Create a new schema of Mongoose with the name SchemaCountry,this schema define the structure of data of countries
const countrySchema = new mongoose.Schema({
    flags: {
    png: { type: String },
  },
  name: {
    common: { type: String, required: true },
  },
  capital: [{ type: String }],
  region: { type: String },
  subregion: { type: String },
  cca2: { type: String },  
  area: { type: Number },
  flag: { type: String },
  population: { type: Number },
  
});
//here is  create a model of moongose called Country based in the countrySchema
const Country = mongoose.model('Country', countrySchema);
module.exports = Country;
