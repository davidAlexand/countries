//Import the function getAllCountries from the file countryLayer
import { getAllCountries } from './countryLayer.js';
//This is a asincronic function that load the countries from the API  and then saved in the base of data with an aplication post
async function loadAndSaveCountries() {
   //Inside the block try called the function getAllCountries(),as is  an asincronic function ,wait that return the data
    try {
        const countries = await getAllCountries(); // Llama a la API externa
        console.log('Datos obtenidos de la API:', countries);
        //this is for define batch size ,the countries send in groups of 50
        const batchSize = 50; // Define el tamaño del lote
        //i runs through the list of countries for batch of 50,the variable i increase by 50 in every interaction
        for (let i = 0; i < countries.length; i += batchSize) {
        //batch  contains the one batch of countries
        //Whit the method slice  is for obtain a segment of the list of countries 
            const batch = countries.slice(i, i + batchSize); 
        //Send the data to the backend
        const response = await fetch('http://127.0.0.1:5501/saveCountries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(batch),
        });
        if (!response.ok) {
            throw new Error(`Issue to saved the countries. Status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData.message);  
    }
    } catch (error) {
        console.error('Issue to save countries in MOngoDB en MongoDB:', error);
    }
}
//Start load and saved the data of countries
loadAndSaveCountries();
//Function to get countries from the backend
async function getCountriesFromServer() {
    try {
        //aplication Get to backend server in the route /getCountries
        const response = await fetch('http://127.0.0.1:5501/getCountries');
        if (!response.ok) {
            throw new Error(`Er. Status: ${response.status}`);
        }
        const countries = await response.json();
        console.log('Países obtenidos de la API:', countries);  
        return countries;
    } catch (error) {
        console.error('Error al obtener los países desde el servidor:', error);
        return [];
    }
}
// Función para mostrar los países
async function displayCountries() {
    try {
        const countries = await getCountriesFromServer();

        if (countries.length === 0) {
            document.getElementById('countries-container').innerHTML = '<p>No se encontraron países.</p>';
            return;
        }

        const mainGrid = document.querySelector('.grid'); // Get the reference to the grid container

        countries.forEach(country => {
            // Create elements for each country
            const card = document.createElement('div');
            card.classList.add('card'); // Add a class for styling

            const cardContent = document.createElement('div');
            cardContent.classList.add('card-content'); // Add a class for styling

            const countryImage = document.createElement('img');
            countryImage.src = country.flags.png;
            countryImage.alt = `Flag of ${country.name.common}`;
            countryImage.classList.add('img'); // Add a class for styling

            const countryName = document.createElement('h2');
            countryName.textContent = country.name.common;

            const countryDetails = document.createElement('ul'); // Create an unordered list for details

            // Create list items for each country detail
            const capitalItem = document.createElement('p');
            capitalItem.textContent = `Capital:${country.capital}`;
            const regionItem = document.createElement('p');
            regionItem.textContent = `Region:${country.region}`;
            const subregionItem = document.createElement('p');
            subregionItem.textContent = `SubRegion:${country.subregion}`;
            const codeItem = document.createElement('p');
            codeItem.textContent = `Code:${country.cca2}`;
            const areaItem = document.createElement('p');
            areaItem.textContent = `Area:${country.area}`;
            const populationItem = document.createElement('p');
            populationItem.textContent = `Population:${country.population}`;

            // Append details to the unordered list
            countryDetails.appendChild(capitalItem);
            countryDetails.appendChild(regionItem);
            countryDetails.appendChild(subregionItem);
            countryDetails.appendChild(codeItem);
            countryDetails.appendChild(areaItem);
            countryDetails.appendChild(populationItem);

            // Assemble the card structure
            card.appendChild(countryImage);
            cardContent.appendChild(countryName);
            cardContent.appendChild(countryDetails);
            card.appendChild(cardContent);

            // Append the completed card to the grid
            mainGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error al mostrar los países:', error);
    }
}

// Ejecuta la función displayCountries al cargar el DOM
document.addEventListener('DOMContentLoaded', displayCountries);
