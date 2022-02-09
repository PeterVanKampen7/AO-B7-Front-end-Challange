// Loop door alle partijen heen die aangeleverd worden en zet deze in een list
let output = '';
for(i = 0; i < parties.length; i++){
    output += '<li><a href="https://www.google.com/search?q=' + parties[i]['name'] + '" target="_blank">' + parties[i]['name'] + '</a></li>';
}
// Zet de gemaakte list op de pagina
document.querySelector('[participant-list]').innerHTML = output;