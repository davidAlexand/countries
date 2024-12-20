//Import the function getAllCountries from the file countryLayer
import { getAllCountries } from './countryLayer.js';
import { formClient } from './form.js';
import {filterRegion} from './custom-select.js'
//We select the modal and the iframe
//Function to open the modal and show the Google map
const modal = document.getElementById('mapModal');
const span = document.getElementsByClassName('close')[0];
const googleMap = document.getElementById('googleMap');
//This is a asincronic function that load the countries from the API  and then saved in the base of data with an aplication post
async function loadAndSaveCountries() {
   //Inside the block try called the function getAllCountries(),as is  an asincronic function ,wait that return the data
    try {
        const countries = await getAllCountries(); // Llama a la API externa
        formClient(countries);
        filterRegion(countries);
         // Muestra todos los países al inicio
         displayCountries(countries);
        //this is for define batch size ,the countries send in groups of 50
        const batchSize = 250;
        //i runs through the list of countries for batch of 250,the variable i increase by 250 in every interaction
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
//this variable is used  for saved the list of countries obtained of server.
//if the countries  are load ,this variable contain the data ,for not do again a request fo countries.
let cachedCountries = null;
//This variable is used for indicate if already an request for obtain the countries.
//this help avoid multuply request
let isFetching = false;
//Async function to get countries from the backend
async function getCountriesFromServer() {
//this verify if 'cahedCountries' is not null, if the data not is null ,return the data
    if (cachedCountries) {
        console.log('Returning cached countries');
        return cachedCountries;
    }
//Indicate that alareayd do the request of the countries
    if (isFetching) {
        console.log('Already fetching countries, please wait...');
        return [];
    }
    try {
    //isFetching is set to true, indicating that a request is being made to get the countries.
        isFetching = true;
    //Fetch is used to make an HTTP GET request to the specified URL.    
        console.log('Fetching countries from server...');
        const response = await fetch('http://127.0.0.1:5501/getCountries');
        
        if (!response.ok) {
            throw new Error(`Error. Status: ${response.status}`);
        }
        const countries = await response.json();
     //It checks if the result obtained (countries) is an array.
        if (!Array.isArray(countries)) {
            throw new Error('Received data is not an array');
        }
        console.log(`Received ${countries.length} countries from API`);
    //This for verify the lenght of the array if is more that 300 data show the message.
    //This is for avoid the duplicate data
        if (countries.length > 250) {  
            console.warn('Received more countries than expected. Might be duplicate data.');
        }
     //Here asing the array countries to the variable cachedCountries for load the data of the cached.
     //for load the data of cachedCountries so not agaian do request of the data 
        cachedCountries = countries;
        return countries;
    } catch (error) {
        console.error('Error fetching countries from server:', error);
        return [];
    } finally {
        //Indicate that the request is finalized ,isFetching = false --> is for do future request
        isFetching = false;
    }
}
///////////////////////////////////////
function showMap(lat, lng) {
    //Building Google Map URL
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&z=6&output=embed`;
    //We assign the URL to the map iframe
    googleMap.src = mapUrl;
    //Show the modal
    modal.style.display = 'block';
}
//Close the modal wuen the user ,click the button of close  
span.onclick = () => {
    modal.style.display = 'none';
    googleMap.src = ''; //Clear the iframe to avoid loading the map unnecessarily
};
//When you click outside the modal, it also closes
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        googleMap.src = ''; //Clear el iframe
    }
};
/////////////////////////////////////
let currentPage = 1; //Actual page
const countriesPerPage = 50; //Number of countries per page
//Define an export an Asynchronous function, with async we can use await to manage promises
export async function displayCountries(countriesToDisplay) {
    try {
        //This line declares a variable called `countries` without initializing it. 
        //`let` is used instead of `const` because the value of `countries` will be assigned later and could change.
        let countries;
        //This line check if countriesToDisplay exist.
        if (countriesToDisplay) {
        //If countriesToDisplay exists is asigned to countries.
        //this happens when  the function displayCountries called with an array of countries filtered    
            countries = countriesToDisplay;
        } else {
        //if countriesToDisplay no exist,call getCountriesFromServer() for obtain all countries of the API
            countries = await getCountriesFromServer();
        //When is load all countries of server is called the function  formClient() for pass the arry of the all the countries.   
            formClient(countries);
        //When is load all countries of server is called the function  filterRegion() for pass the array of the countrie for region.   
            filterRegion(countries);
        }
        if (countries.length === 0) {
            document.getElementById('countries-container').innerHTML = '<p>No se encontraron países.</p>';
            return;
        }
        //Calculate the total number of pages
        //Countries.length: Gets the total number of countries in the countries list.
        //CountriesPerPage: Defines how many countries will be displayed on each page.
        //countries.length / countries Per Page: Divide the total number of countries by the number of countries per page to get how many full pages are needed.
        const totalPages = Math.ceil(countries.length / countriesPerPage);
        //currentPage: This is the current page selected.
        //CurrentPage - 1: We subtract 1 to get the pages in terms of an index starting from 0.
        //CountriesPerPage: Multiplies the index of the current page by the number of countries per page to calculate the first country index that corresponds to this page.
        const startIndex = (currentPage - 1) * countriesPerPage;
        const endIndex = startIndex + countriesPerPage;
        const paginatedCountries = countries.slice(startIndex, endIndex);
        const mainGrid = document.querySelector('.grid');
        mainGrid.innerHTML = '';      
        paginatedCountries.forEach(country => {
            const card = document.createElement('div');
            card.classList.add('card');
            const cardContent = document.createElement('div');
            cardContent.classList.add('card-content');
            const countryImage = document.createElement('img');
            countryImage.src = country.flags.png;
            countryImage.alt = `Flag of ${country.name.common}`;
            countryImage.classList.add('img');
            const countryName = document.createElement('h2');
            countryName.textContent = country.name.common;
            //event onclick
            countryImage.onclick = () => {
                const latlng = country.latlng; // latlng contains the geographic coordinates
                if (latlng) {
                    showMap(latlng[0], latlng[1]); 
                }
            };
            const countryDetails = document.createElement('ul');
            const details = [
                { label: 'Capital', value: country.capital },
                { label: 'Region', value: country.region },
                { label: 'SubRegion', value: country.subregion },
                { label: 'Code', value: country.cca2 },
                { label: 'Area', value: country.area },
                { label: 'Population', value: country.population }
            ];
            details.forEach(detail => {
                const item = document.createElement('p');
                item.innerHTML = `<b>${detail.label}:</b> ${detail.value}`;
                countryDetails.appendChild(item);
            });
            card.appendChild(countryImage);
            cardContent.appendChild(countryName);
            cardContent.appendChild(countryDetails);
            card.appendChild(cardContent);
            mainGrid.appendChild(card);
        });
        //FUncion for do pages every 50 countries
        renderPagination(totalPages);
    } catch (error) {
        console.error('issue to show the countries:', error);
    }
}
//Function to render pagination buttons
function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = ''; // Clean the container    
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = 'pagination-button'; // Agrega una clase a cada botón
        
        pageButton.onclick = () => {
            currentPage = i;
            displayCountries(); // Call the function to display the countries on the new page
        };
       
        paginationContainer.appendChild(pageButton);
    }
}
// Execute the displayCountries function when the DOM loads
document.addEventListener('DOMContentLoaded', () => displayCountries());