// Haal alle elementen op uit de pagina die we met code aan gaan passen
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
let controls_none = document.querySelector('[controls-none]');

// Maak een aantal variabelen aan die we later in de code nodig hebben

// Een counter die bijhoud bij welke stelling de gebruiker is
let stellingNum = 0;
// Zet alle stellingen in een variabele.
let stellingen = subjects;
// Maak een lege array aan waar de antwoorden van de gebruiker ingezet gaan worden.
let results = [];
// Maak een lege array voor de lijst van partijen die de gebruiker meegenomen wilt hebben
let partyWeight = [];
// Maak een lege array aan waar de stelllingen in gezet worden die de gebruiker extra belangrijk vind
let stellingWeight = []
// Constante voor de breakpoint die aangeeft vanaf hoeveel zetels een partij gezien word als ee grote partij
const KLEINGROOTBREAKPOINT = 10;

// Roep de functie aan de de eerste stelling op het scherm zet
renderStelling(stellingNum, stellingen);

// Deze functie word aangeroepen als een gebruiker zijn mening invult, wat de mening is word meegegeven als parameter
function nextSlide(stance){
    // Reset de buttone terug naar de originele kleur. Dit is nodig als een button blauw is geweest ivm een vorige pagina
    controls_agree.classList.add('w3-green');
    controls_agree.classList.remove('w3-blue');

    controls_disagree.classList.add('w3-red');
    controls_disagree.classList.remove('w3-blue');

    controls_neutral.classList.add('w3-gray');
    controls_neutral.classList.remove('w3-blue');

    controls_none.classList.add('w3-white');
    controls_none.classList.remove('w3-blue');

    // Sla de mening op in de antwoorden array met het stelling nummer als key
    results[stellingNum] = stance;
    // Als dit niet de laatste steling is laad de volgende stelling in
    if(stellingNum + 1 < stellingen.length){  
        stellingNum++;     
        renderStelling(stellingNum, stellingen);
    } else { // Als dit wel de laatste stelling is laad de pagina die de partij selectie weergeeft
        partySelect();
    }  

    
}

// Functie die de vorige knop afhandeld
function previousSlide(){
    // Als we op het momment niet op de eerste stelling zitten
    if(stellingNum > 0 && stellingNum < stellingen.length){
        // Verlaag de current page tracker
        stellingNum--;     
        // Laad de vorige pagina in
        renderStelling(stellingNum, stellingen);
    } 
}

// Functie die de stellingen op het scherm zet
function renderStelling(count, stellingen){
    // Update de progress counter
    progress.innerHTML = `${count + 1}/${stellingen.length}`;

    // Pas de naam van de stelling aan
    stelling_naam.innerHTML = `${stellingen[count]['title']}`;

    // Pas de context van de stelling aan
    stelling_context.innerHTML = `${stellingen[count]['statement']}`;

    // Remake de context modal doormiddel van de renderContextModal functie
    context_modal_content.innerHTML = renderContextModal(stellingen[count]['parties']);

    // Zet de meer weten link
    meer_weten.href = `https://letmegooglethat.com/?q=${stellingen[count]['title']}`;

    // Als er eerder al een antwoord voor deze pagina is ingevuld maak de gekozen optie blauw
    if(results[count] == 'pro'){
        controls_agree.classList.remove('w3-green');
        controls_agree.classList.add('w3-blue');
    } else if(results[count] == 'contra'){
        controls_disagree.classList.remove('w3-red');
        controls_disagree.classList.add('w3-blue');
    } else if(results[count] == 'none'){
        controls_neutral.classList.remove('w3-gray');
        controls_neutral.classList.add('w3-blue');
    } else if(results[count] == 'geen mening'){
        controls_none.classList.remove('w3-white');
        controls_none.classList.add('w3-blue');
    }
}

// Functie die de content van de context modal maakt, alle standpunten voor de huidige stellingen wordern als parameter meegegeven
function renderContextModal(standpunten){
    let return_text = '';
    // Loop door alle standpunten heen
    for(i = 0; i < standpunten.length; i++){
        // Vul de naam van de partij in
        return_text += `<div class='party_info w3-gray w3-text-white'><h3>${standpunten[i]['name']}</h3>`;
        // Aan de hand van standpunt, vul de juiste tekst en kleur in
        if(standpunten[i]['position'] == 'pro'){
            return_text += `<span class='party_position w3-green w3-round-xxl w3-padding-large'>Eens</span>`;
        } else if (standpunten[i]['position'] == 'contra'){
            return_text += `<span class='party_position w3-red w3-round-xxl w3-padding-large'>Oneens</span>`;
        } else {
            return_text += `<span class='party_position w3-black w3-round-xxl w3-padding-large'>Geen mening</span>`;
        }
        return_text += `</div>`;
        // Voeg de uitleg voor het standpunt toe
        return_text += `<div class='party_opinion'>${standpunten[i]['opinion']}</div>`;
    }

    // Return de content
    return return_text;
}

// Deze functie word aangeroepen door de 'Wat vinden de partijen' knop. Maakt de modal zichtbaar
function show_context(){
    context_modal.style.display = 'grid';
}
// Verbergt de modal. Word aangeroepen door de knop onderaan de modal
function hide_context(){
    context_modal.style.display = 'none';
}

// Functie die de partij keuze pagina op het scherm zet
function partySelect(){
    // Haal de vorige knop en de progress tracker van het scherm af
    previous_question.remove();
    progress.remove();

    // Maak de bovenkant van de pagina aan. Titel, knoppen voor snelle selectie en de Doorgaan knop. Doorgaan knop start disabled
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
    
    // Maak een checkbox aan voor alle partijen
    for(i = 0; i < parties.length; i++){
        content += `<div class='w3-section party-weight-choice'>   
        <label for="${parties[i].name}">   
        <input type="checkbox" id="${parties[i].name}" name="${parties[i].name}" value="${parties[i].name}" class="party-weight-choice-input">
        ${parties[i].name}</label>
        </div>`;
    }
    content += ``;
    // Zet de content op het scherm
    document.querySelector('[logic-container]').innerHTML = content;

    // Luister naar veranderingen in de checkboxes. Wanneer er een checkbox checked is, 'un-disable' de Doorgaan knop
    document.querySelectorAll('.party-weight-choice-input').forEach(item => {
        item.addEventListener('change', event => {
            const button = document.querySelector('[next-step-button]');
            button.disabled = false;
        });
    });
}

// Snelle selectie knoppen functie, welke selectie gemaakt moet worden word doorgegeven als parameter
function selectParties(arg){
    // Haal de checkboxes voor alle partijen op en zet deze om van Nodelist naar een array
    let allParties = document.querySelectorAll('input.party-weight-choice-input');
    allParties = Array.from(allParties);

    // Lege arrays die we met de relevante waardes gaan vullen
    let bigParties = [];
    let smallParties = [];

    let secularParties = [];

    // Als een partij groter of gelijk is aan de breakpoint voeg toe aan de grote partijen array, anders voeg toe aan de kleine partijen array. Check of partij seculair is, zo ja voeg toe aan secular array
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

    // Als de geklikte knop voor alle grote partijen is, check alle grote partijen
    if(arg == 'big'){
        for(i = 0; i < allParties.length; i++){
            allParties[i].checked = false;
            if(bigParties.includes(allParties[i].value)){
                allParties[i].checked = true;
            }         
        }
    // Als de geklikte knop voor alle kleine partijen is, check alle kleine partijen
    } else if (arg == 'small'){
        for(i = 0; i < allParties.length; i++){
            allParties[i].checked = false;
            if(smallParties.includes(allParties[i].value)){
                allParties[i].checked = true;
            }         
        }
    // Als de geklikte knop voor alle secular partijen is, check alle secular partijen
    } else if(arg == 'secular'){
        for(i = 0; i < allParties.length; i++){
            allParties[i].checked = false;
            if(secularParties.includes(allParties[i].value)){
                allParties[i].checked = true;
            }         
        }
    // Als de geklikte knop voor alle partijen is, check alle partijen
    } else {
        for(i = 0; i < allParties.length; i++){
            allParties[i].checked = true;
        }
    }
    
    // 'un-disable' de Doorgaan button
    const button = document.querySelector('[next-step-button]');
    button.disabled = false;
}

// Functie die de pagina voor extra gewicht aan een stelling toevoegen op het scherm zet
function extraWeight(){
    // Voordat we nieuwe dingen op het scherm zetten moeten we eerste de data uit van de selectie ophalen
    getPartyWeight();

    // Voeg kop en doorgaan button toe
    let content = `
    <h2> Zijn er onderwerpen die je extra belangrijk vind?</h2>
    <div class='weight-next-button'>
        <button class='w3-button w3-blue w3-text-white w3-padding-large w3-round-xlarge w3-section' onclick='getResults()'>Volgende stap</button>
    </div>`;
    // Maak een checkbox aan voor alle stellingen 
    for(i = 0; i < stellingen.length; i++){
        content += `<div class='w3-section subject-weight-choice'>      
        <input type="checkbox" id="${stellingen[i].title}" name="${stellingen[i].title}" value="${stellingen[i].title}" class="stelling-weight-choice-input">
        <label for="${stellingen[i].title}">${stellingen[i].title}</label>
        </div>`;
    }
    content += ``;
    // Zet de content op het scherm
    document.querySelector('[logic-container]').innerHTML = content;
}

// Functie die ingevulde waarde voor partij selectie ophaald
function getPartyWeight(){
    // Haal alle checkboxes op en zet deze om in een array
    let allParties = document.querySelectorAll('input.party-weight-choice-input');
    allParties = Array.from(allParties);
    // Als de checkbox checked is voeg de partij toe aan de array die alle gekozen partijen bevat
    for(i = 0; i < allParties.length; i++){
        if(allParties[i].checked == true){
            partyWeight.push(allParties[i].name);
        }
    }
}

// Functie die alle data in resultaten omzet
function getResults(){
    // Haal de data op die ingevuld is bij stelling gewicht voordat we nieuwe dingen op het scherm zetten
    getStellingWeight();

    // Lege array die de score bij gaat houden
    let score_counter = [];
    // Vul de array met een start waarde van de nul en een key die de partij naam is
    for(i = 0; i < parties.length; i++){
        let partyname = parties[i]['name']
        score_counter[partyname] = 0;
    }
    
    // Loop door alle stellingen en de standpunten van de partijen op deze stellingen
    for(i = 0; i < stellingen.length; i++){
        for(j = 0; j < stellingen[i]['parties'].length; j++){
            // Ophalen van de partijnaam
            let partyname = stellingen[i]['parties'][j]['name'];
            // Als de partijnaam is de array van partijkeuzes zit
            if(partyWeight.includes(partyname)){
                // Als de mening van de gebruiker overeen komt met de mening van de partij
                if(results[i] == stellingen[i]['parties'][j]['position']){
                    let stellingName = stellingen[i]['title'];
                    // Als deze stelling ingevuld is als stelling met extra gewicht, tel deze stelling dubbel
                    if(stellingWeight.includes(stellingName)){
                        score_counter[partyname] += 2;
                    } else { // Als deze stelling niet extra bijzonder is, verhoog de score van de partij met 1
                        score_counter[partyname]++;
                    }       
                }
            }
            
        }
    }
    // Roep de functie aan die de resultaten op het scherm zet
    renderResults(score_counter);
}

// Functie die ingevulde waarde voor stelling gewicht ophaald
function getStellingWeight(){
    // Haal de checkboxes voor alle stellingen op en zet deze om in een array
    let allStellingen = document.querySelectorAll('input.stelling-weight-choice-input');
    allStellingen = Array.from(allStellingen);
    // Loop door de checkboxes heen, als de checkbox checked is voeg deze stelling toe aan de array met gewichtige stellingen 
    for(i = 0; i < allStellingen.length; i++){
        if(allStellingen[i].checked == true){
            stellingWeight.push(allStellingen[i].name);
        }
    }
}

// Functie aan die de resultaten op het scherm zet
function renderResults(score_counter){
    // Kop en start van de list
    let newHTML = `
    <h2 class="w3-section">Uw resulaten</h2>
    <ul class="result-list w3-ul w3-margin-top w3-margin-bottom">
    `;

    // Een key value is niet fatsoenlijk sorteerbaar in JS, dus we moeten een aantal dingen doen om het resultaat gesorteerd te krijgen
    let sortable_array = [];

    // Voeg de resultaten toe aan een associative array. Zonder key, de key is nu net als de score een value
    for(var name in score_counter){
        sortable_array.push([name, score_counter[name]]);
    }
    // Sorteer de nieuwe array op de waarde op de tweede positie, in dit geval de score per partij
    sortable_array.sort(function(a, b) {
        return b[1] - a[1];
    });
    // Zet de gesorteerde array weer terug naar een key value array
    let loop_array = [];
    for(i = 0; i < sortable_array.length; i++){
        loop_array[sortable_array[i][0]] = sortable_array[i][1]
    }
    // Loop door alle partij scores heen
    for(var partyname in loop_array){
        // Als deze partij meegenomen moet worden in het resultaat (aan de hand van de keuze die de gebruiker eerder gemaakt heeft)
        if(partyWeight.includes(partyname)){
            // Zet de score om in een percentage op basis van hoeveel punten er gescoort had kunnen worden, dit is nu nog een int
            let num = Math.floor((100 / (stellingen.length + stellingWeight.length)) * loop_array[partyname]);
            // Voeg % teken toe aan de waarde, dit is nu een String
            let percent = `${num}%`;
            // Voeg het resultaat met percent balk toe aan de lijst
            newHTML += `<li class="result-row">${partyname}<span>${percent}<progress class="w3-margin-left" value="${num}" max="100"></progress></span></li>`;
        }
    }
    // Voeg het einde van de lijst toe, en een button die de gebruiker terug brengt naar de homepage
    newHTML += `
    </ul>
    <a href="index.html" class="w3-button w3-blue w3-text-white w3-padding-large w3-round-xlarge w3-section">Terug naar voorpagina</a>
    `;
    // Zet de content op het scherm
    document.querySelector('[logic-container]').innerHTML = newHTML;
}