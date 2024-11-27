//URL OF API countryLAYER
const BASE_URL = " https://restcountries.com/v3.1";
//URL the key is import of the archive config.js
//function for get all countryes
export async function getAllCountries() {
    //fetch is used for aplication HTTP and all return all countryes
    //all?access_key=${API_KEY} is a parametre  of consultation
    //await  is using for wit the promise fetch = the code wait until recive the answer API 
    const response = await fetch(`${BASE_URL}/all?fields`);
    console.log(response);
  //This is using for drive answers http and issues
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
  // Obtén los datos JSON de la respuesta
  const countries = await response.json();
  return countries;
}
