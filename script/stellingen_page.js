let progress = document.querySelector('[progress-counter]');
let previous_question = document.querySelector('[previous]');
let stelling_naam = document.querySelector('[stelling-naam]');
let stelling_context = document.querySelector('[stelling-context]');
let context_modal = document.querySelector('[context-modal]');
let context_modal_content = document.querySelector('[context-modal-content]');
let meer_weten = document.querySelector('[meer-weten]');
let controls_disagree = document.querySelector('[controls-disagree]');
let controls_neutral = document.querySelector('[controls-neutral]');
let controls_agree = document.querySelector('[controls-agree]');


let stellingNum = 0;
let stellingen = subjects;
let results = [];
let partyWeight = [];
let stellingWeight = []
const KLEINGROOTBREAKPOINT = 10;

renderStelling(stellingNum, stellingen);

function nextSlide(stance){
    results[stellingNum] = stance;
    if(stellingNum + 1 < stellingen.length){  
        stellingNum++;     
        renderStelling(stellingNum, stellingen);
    } else {
        partySelect();
    }  
}

function previousSlide(){
    if(stellingNum > 0 && stellingNum < stellingen.length){

        stellingNum--;     
        renderStelling(stellingNum, stellingen);

    } 
}

function renderStelling(count, stellingen){
    progress.innerHTML = `${count + 1}/${stellingen.length}`;

    stelling_naam.innerHTML = `${stellingen[count]['title']}`;

    stelling_context.innerHTML = `${stellingen[count]['statement']}`;

    context_modal_content.innerHTML = renderContextModal(stellingen[count]['parties']);

    meer_weten.href = `https://letmegooglethat.com/?q=${stellingen[count]['title']}`;
}

function renderContextModal(standpunten){
    let return_text = '';
    for(i = 0; i < standpunten.length; i++){
        return_text += `<div class='party_info w3-gray w3-text-white'><h3>${standpunten[i]['name']}</h3>`;
        if(standpunten[i]['position'] == 'pro'){
            return_text += `<span class='party_position w3-green w3-round-xxl w3-padding-large'>Eens</span>`;
        } else if (standpunten[i]['position'] == 'contra'){
            return_text += `<span class='party_position w3-red w3-round-xxl w3-padding-large'>Oneens</span>`;
        } else {
            return_text += `<span class='party_position w3-black w3-round-xxl w3-padding-large'>Geen mening</span>`;
        }
        return_text += `</div>`;
        return_text += `<div class='party_opinion'>${standpunten[i]['opinion']}</div>`;
    }


    return return_text;
}

function show_context(){
    context_modal.style.display = 'grid';
}
function hide_context(){
    context_modal.style.display = 'none';
}

function partySelect(){
    previous_question.remove();
    progress.remove();

    let content = `
    <h2>Welke partijen wilt u meenemen in uw resultaat? </h2>
    <div class='party-select-controls'>
        <div class='party-select-left-controls'>
            <button class='w3-button w3-blue w3-text-white w3-round-xlarge w3-section' onclick='selectParties("all")'>Alle partijen</button>
            <button class='w3-button w3-blue w3-text-white w3-round-xlarge w3-section' onclick='selectParties("big")'>Grote partijen</button>
            <button class='w3-button w3-blue w3-text-white w3-round-xlarge w3-section' onclick='selectParties("small")'>Kleine partijen</button>
            <button class='w3-button w3-blue w3-text-white w3-round-xlarge w3-section' onclick='selectParties("secular")'>Seculaire partijen</button>
        </div>
        <button class='w3-button w3-blue w3-text-white w3-padding-large w3-round-xlarge w3-section' disabled onclick='extraWeight()' next-step-button>Volgende stap</button>  
    </div>`;
    for(i = 0; i < parties.length; i++){
        content += `<div class='w3-section party-weight-choice'>   
        <label for="${parties[i].name}">   
        <input type="checkbox" id="${parties[i].name}" name="${parties[i].name}" value="${parties[i].name}" class="party-weight-choice-input">
        ${parties[i].name}</label>
        </div>`;
    }
    content += ``;
    document.querySelector('[logic-container]').innerHTML = content;

    document.querySelectorAll('.party-weight-choice-input').forEach(item => {
        item.addEventListener('change', event => {
            console.log('tetetet');
            const button = document.querySelector('[next-step-button]');
            button.disabled = false;
        });
    });
}

function selectParties(arg){
    let allParties = document.querySelectorAll('input.party-weight-choice-input');
    allParties = Array.from(allParties);

    let bigParties = [];
    let smallParties = [];

    let secularParties = [];

    for(i = 0; i < parties.length; i++){
        if(parties[i]['size'] >= KLEINGROOTBREAKPOINT){
            bigParties.push(parties[i]['name']);
        } else {
            smallParties.push(parties[i]['name']);
        }

        if(parties[i]['secular'] == true){
            secularParties.push(parties[i]['name']);
        }
    }

    if(arg == 'big'){
        for(i = 0; i < allParties.length; i++){
            allParties[i].checked = false;
            if(bigParties.includes(allParties[i].value)){
                allParties[i].checked = true;
            }         
        }
    } else if (arg == 'small'){
        for(i = 0; i < allParties.length; i++){
            allParties[i].checked = false;
            if(smallParties.includes(allParties[i].value)){
                allParties[i].checked = true;
            }         
        }
    } else if(arg == 'secular'){
        for(i = 0; i < allParties.length; i++){
            allParties[i].checked = false;
            if(secularParties.includes(allParties[i].value)){
                allParties[i].checked = true;
            }         
        }
    } else {
        for(i = 0; i < allParties.length; i++){
            allParties[i].checked = true;
        }
    }
    
    const button = document.querySelector('[next-step-button]');
    button.disabled = false;
}

function extraWeight(){
    getPartyWeight();

    let content = `
    <h2> Zijn er onderwerpen die je extra belangrijk vind?</h2>
    <div class='weight-next-button'>
        <button class='w3-button w3-blue w3-text-white w3-padding-large w3-round-xlarge w3-section' onclick='getResults()'>Volgende stap</button>
    </div>`;
    for(i = 0; i < stellingen.length; i++){
        content += `<div class='w3-section subject-weight-choice'>      
        <input type="checkbox" id="${stellingen[i].title}" name="${stellingen[i].title}" value="${stellingen[i].title}" class="stelling-weight-choice-input">
        <label for="${stellingen[i].title}">${stellingen[i].title}</label>
        </div>`;
    }
    content += ``;
    document.querySelector('[logic-container]').innerHTML = content;
}

function getPartyWeight(){
    let allParties = document.querySelectorAll('input.party-weight-choice-input');
    allParties = Array.from(allParties);
    for(i = 0; i < allParties.length; i++){
        if(allParties[i].checked == true){
            partyWeight.push(allParties[i].name);
        }
    }
}

function getResults(){
    getStellingWeight();

    let score_counter = [];
    for(i = 0; i < parties.length; i++){
        let partyname = parties[i]['name']
        score_counter[partyname] = 0;
    }
    
    for(i = 0; i < stellingen.length; i++){
        for(j = 0; j < stellingen[i]['parties'].length; j++){
            let partyname = stellingen[i]['parties'][j]['name'];
            if(partyWeight.includes(partyname)){
                if(results[i] == stellingen[i]['parties'][j]['position']){
                    let stellingName = stellingen[i]['title'];
                    if(stellingWeight.includes(stellingName)){
                        score_counter[partyname] += 2;
                    } else {
                        score_counter[partyname]++;
                    }       
                }
            }
            
        }
    }
    renderResults(score_counter);
}

function getStellingWeight(){
    let allStellingen = document.querySelectorAll('input.stelling-weight-choice-input');
    allStellingen = Array.from(allStellingen);
    for(i = 0; i < allStellingen.length; i++){
        if(allStellingen[i].checked == true){
            stellingWeight.push(allStellingen[i].name);
        }
    }
}

function renderResults(score_counter){
    let newHTML = '<ul class="w3-ul w3-margin-top w3-margin-bottom">';
    for(i = 0; i < parties.length; i++){
        let partyname = parties[i]['name']
        if(partyWeight.includes(partyname)){
            let num = Math.floor((100 / (stellingen.length + stellingWeight.length)) * score_counter[partyname]);
            let percent = `${num}%`;
            newHTML += `<li class="result-row">${partyname}<span>${percent}<progress class="w3-margin-left" value="${num}" max="100"></progress></span></li>`;
        }      
    }
    newHTML += '</ul>';
    document.querySelector('[logic-container]').innerHTML = newHTML;
}