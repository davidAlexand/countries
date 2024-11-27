require('dotenv').config();
//Framework of express used for create framework and API
const express = require('express');
//mongoose is for ease for the interaction with the database of MongoDB
const mongoose = require('mongoose');
//cors allows the server acept get of other domain, frontend with backend with differents ports in this application
const cors = require('cors');
//this model define the structure of the data in the document
const Country = require('./models/country.js');
//App is the object for define the routes and configuration of the server 
const app = express();
//Port is the port where is execute express
const PORT = 5501;
//This is allow the get of the server of the domain http://127.0.0.1:5501
app.use(cors({origin: 'http://127.0.0.1:5501', // Cambia esto al origen de tu cliente
}));
//This set up the middleware of express for process bodies JSON and stablish an limit of data 
//That can send to the body of get
app.use(express.json({ limit: '10mb' }));
const dburi = process.env.DATABASE
//This if for conect with MongoDB Atlas
mongoose.connect('mongodb+srv://david:pr4Ti3rqXaWJFOL3@cluster0.9gdfb.mongodb.net/countries', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conect to MongoDB Atlas'))
.catch(err => console.error('issue of  conexión to  MongoDB:', err));

//Route to save countries
app.post('/saveCountries', async (req, res) => {
    try {
        const countries = req.body;
        //Country is the model of the data for insert several countries
        await Country.insertMany(countries);
        res.status(200).json({ message: 'Countries saved sucesfully' });
    } catch (error) {
        console.error('Error al guardar los países en MongoDB:', error);
        res.status(500).json({ message: 'issue to save countries in MongoDB', error: error.message });
    }
});
//Route to obtain countries
app.get('/getCountries', async (req, res) => {
    try {
        //Obtain all countries
        const countries = await Country.find();
        //Check that the countries are in the log
        console.log('Countries obtained from data of mongoDB:', countries); 
        // Send the response to the client
        res.status(200).json(countries);  
    } catch (error) {
        console.error('Issue to obtain the data of countries:', error);
        res.status(500).json({ message: 'Issue to obtain the data of countries:', error: error.message });
    }
});
//Start the server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://127.0.0.1:${PORT}`);
});


