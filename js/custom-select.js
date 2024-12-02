//Import the Asyn function displayCountries of the file './main'
import { displayCountries } from './main.js';
//This code es of the page https://www.w3schools.com/howto/howto_custom_select.asp
//was implement for aplicate styke to the custom selected
//from line 48 until the line 58 i modificate the code for shos the region selected
export const filterRegion = countries => {
  // Selecciona todos los elementos `.select-selected` y `.select-items` y elimínalos
  const existingCustomElements = document.querySelectorAll(".select-selected, .select-items");
  existingCustomElements.forEach(el => el.remove()); // Limpia los nodos antiguos

  const x = document.getElementsByClassName("custom-select");
  const l = x.length;

  for (let i = 0; i < l; i++) {
      const selElmnt = x[i].getElementsByTagName("select")[0];
      const ll = selElmnt.length;

      // Creates the parent container if it does not exist
      if (!x[i].querySelector(".select-selected")) {
          const a = document.createElement("DIV");
          a.setAttribute("class", "select-selected");
          a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
          x[i].appendChild(a);

          const b = document.createElement("DIV");
          b.setAttribute("class", "select-items select-hide");

          for (let j = 1; j < ll; j++) {
              const c = document.createElement("DIV");
              c.innerHTML = selElmnt.options[j].innerHTML;
              c.addEventListener("click", function (e) {
                  const s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                  const h = this.parentNode.previousSibling;

                  for (let i = 0; i < s.length; i++) {
                      if (s.options[i].innerHTML == this.innerHTML) {
                          s.selectedIndex = i;
                          h.innerHTML = this.innerHTML;

                          const y = this.parentNode.getElementsByClassName("same-as-selected");
                          for (let k = 0; k < y.length; k++) {
                              y[k].removeAttribute("class");
                          }
                          this.setAttribute("class", "same-as-selected");
                         //Query is equal to the value of the options tha i runs.
                        const query = s.options[i].value;
                        //If query is equal to 'Countries' = tods in Html the custom-select shos allCountries. 
                        if(query === 'Countries'){
                        //The funciont displayCountries show all countries that obtain filterArray.
                        displayCountries(countries);
                        }else{
                        //Filter is equal to countries with that is filtered for items that runs region.
                        const filterArray = countries.filter(item => item.region === query)
                        displayCountries(filterArray);
                       }
                      break;
                      }
                  }
                  h.click(); // Close dropdown menu
              });
              b.appendChild(c);
          }

          x[i].appendChild(b);
          a.addEventListener("click", function (e) {
              e.stopPropagation();
              closeAllSelect(this);
              this.nextSibling.classList.toggle("select-hide");
              this.classList.toggle("select-arrow-active");
          });
      }
  }

  function closeAllSelect(elmnt) {
      const x = document.getElementsByClassName("select-items");
      const y = document.getElementsByClassName("select-selected");
      const arrNo = [];

      for (let i = 0; i < y.length; i++) {
          if (elmnt === y[i]) {
              arrNo.push(i);
          } else {
              y[i].classList.remove("select-arrow-active");
          }
      }

      for (let i = 0; i < x.length; i++) {
          if (!arrNo.includes(i)) {
              x[i].classList.add("select-hide");
          }
      }
  }

  document.addEventListener("click", closeAllSelect);
};
