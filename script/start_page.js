// let element = document.querySelector('[participant-list]');
let output = '';
for(i = 0; i < parties.length; i++){
    output += '<li><a href="https://www.google.com/search?q=' + parties[i]['name'] + '" target="_blank">' + parties[i]['name'] + '</a></li>';
}
document.querySelector('[participant-list]').innerHTML = output;