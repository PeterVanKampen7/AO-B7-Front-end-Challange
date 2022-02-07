// let element = document.querySelector('[participant-list]');
let output = '';
for(i = 0; i < parties.length; i++){
    output += '<li>' + parties[i]['name'] + '</li>';
}
document.querySelector('[participant-list]').innerHTML = output;