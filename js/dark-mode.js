//This line selects an HTML element with the class 'btn-dark-mode' and assigns it to the variable `btnDark`.
const btnDark = document.querySelector('.btn-dark-mode');
//This adds a click event listener to the `btnDark` button.
btnDark.addEventListener('click', () =>{
//This line toggles the 'dark-mode' class on the `<body>` element. If the class is present, it removes it; if it's not present, it adds it.
    document.body.classList.toggle('dark-mode')
//This is an if-else statement that checks if the `<body>` element has the class 'dark-mode'.
    if(document.body.className === 'dark-mode'){
        //this code changes the button's content to show a sun icon and "Light Mode" text. This indicates that clicking the button will switch to light mode.
        btnDark.innerHTML = `
            <i class="fas fa-sun"></i>
            Light Mode  `
    }else{
        btnDark.innerHTML = `
            <i class="fas fa-moon"></i>
            Dark Mode
        `
    }
})