// Showing the side navbar when reponsive
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.left === '0px') {
        sidebar.style.left = '-250px';
    } else {
        sidebar.style.left = '0px';
    }
}


// Using the Typed.js famework  
var typed = new Typed("#element", {
    strings: ["Track your Expense,", "Track your Income,", "Set your Budget,", "And many more..."],
    typeSpeed: 50,
    backSpeed: 25,
    loop: true,
    backDelay: 1000,
    startDelay: 500
});
