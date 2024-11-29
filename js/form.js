//Import display countries from the filed main.js
import { displayCountries } from './main.js';
//This line get the references of the elemnts DOM 'form' and 'inputForm'
const form = document.getElementById('form');
const inputForm = document.getElementById('inputForm');
//This line define  and export a function called formClient that take a parameter countries
export const formClient = (countries) => {
    form.addEventListener('input', (e) => {
        e.preventDefault();
        //This line get the text writed for the user
        const letterClient = inputForm.value.toLowerCase();
        // Filter countries based on the text entered
        const arrayFilter = countries.filter(item => {
            const letterApi = item.name.common.toLowerCase();
            return letterApi.includes(letterClient);
        });
        //Call displayCountries to display the filtered countries
        displayCountries(arrayFilter);
    });
};