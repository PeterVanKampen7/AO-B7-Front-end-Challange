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

renderStelling(stellingNum, stellingen);

function nextSlide(stance){
    results[stellingNum] = stance;
    console.log(stellingen.length);
    if(stellingNum + 1 < stellingen.length){  
        stellingNum++;     
        renderStelling(stellingNum, stellingen);
    } else {
        console.log(results)
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