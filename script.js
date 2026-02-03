/* 
  Dean Cheng, Matthew Chow, Stephen Chen
  11/8/2023 - 11/13/2023
  TEJ3MProgramming Project
  This is the script.js file for our programming project.
*/

// call
openPopup();

// Characters
let defaultP = { name: `Default`, HP: `N/A`, ATK: `N/A`, hitRate: `N/A`, parryRate: `N/A`}; // default
let sTier = [{ // 5% chance
  name: `MumenRider`,
  HP: 550,
  ATK: 150,
  hitRate: 85,
  parryRate: 70,
},
{
  name: `Gojo`,
  HP: 400,
  ATK: 170,
  hitRate: 95,
  parryRate: 80,
}
];

let aTier = [{ // 10% chance
  name: `Zoro`,
  HP: 450,
  ATK: 120,
  hitRate: 90,
  parryRate: 70,
},
{
  name: `Saber`,
  HP: 425,
  ATK: 135,
  hitRate: 85,
  parryRate: 75,
},
{
  name: `Ichigo`,
  HP: 430,
  ATK: 125,
  hitRate: 95,
  parryRate: 65,
}
];

let bTier = [{ // 35% chance
  name: `Eren`,
  HP: 370,
  ATK: 110,
  hitRate: 80,
  parryRate: 50,
},
{
  name: `Hisoka`,
  HP: 365,
  ATK: 140,
  hitRate: 70,
  parryRate: 70,
},
{
  name: `Erza`,
  HP: 360,
  ATK: 130,
  hitRate: 80,
  parryRate: 50,
}
];

let cTier = [{ // 50% chance
  name: `RoyMustang`,
  HP: 275,
  ATK: 100,
  hitRate: 85,
  parryRate: 70,
},
{
  name: `Sogeking`,
  HP: 250,
  ATK: 95,
  hitRate: 85,
  parryRate: 70,
},
{
  name: `Megumin`,
  HP: 200,
  ATK: 1000,
  hitRate: 10,
  parryRate: 60,
  ability,
  // ACTIVE - Bet on Hakari: Sets her HP to 1 but makes her next attack a guaranteed hit.
}
];

// Opponents
let opponents = [{
  name: `Choso`,
  HP: 350,
  ATK: 160,
  hitRate: 60,
  parryRate: 75,
},
{
  name: `Pain`,
  HP: 450,
  ATK: 120,
  hitRate: 85,
  parryRate: 70,
},
{
  name: `Doflamingo`,
  HP: 600,
  ATK: 130,
  hitRate: 60,
  parryRate: 60,
},
{
  name: `Aizen`,
  HP: 400,
  ATK: 220,
  hitRate: 70,
  parryRate: 90,
}
];



// set defualt characters
let chosenOpponent;
let opponent = defaultP;
let currentCharacter = defaultP;
$('#currentStats').html(`
  <span class="hp">HP: ${currentCharacter.HP}</span>,
  <span class="atk">ATK: ${currentCharacter.ATK}</span>,
  <span class="hit">Hit: ${currentCharacter.hitRate}%</span>,
  <span class="parry">Parry: ${currentCharacter.parryRate}%</span>
`);

$(`#home`).click(function() { // home button
  home();
});

// battle button
$("#battle").click(function() {
  if (currentCharacter === defaultP) {
    alert(`Please get a character first. (Top Right)`);
    return;
  } else if (opponents.length === 0) {
    alert(`You have beat everyone.`);
    return;
  }
  chosenOpponent = Math.floor(Math.random() * opponents.length); 
  opponent = opponents[chosenOpponent]; // choose a random opponent from the list
  // show character and opponent images
  $(`.battleImages`).show();
  $(`#characterPicture`).html(`<img src="charImg/${currentCharacter.name}.png" alt="${currentCharacter.name}" class="character-image">`);
  $(`#opponentPicture`).html(`<img src="charImg/oppImg/${opponent.name}.png" alt="${opponent.name}" class="character-image">`);
  $(".menu").hide(); // hide menu
  // show opponent information
  $(`.opponentStats`).show();
  $(`#opponent`).html(opponent.name);
  $('#currentOpponentStats').html(`
  <span class="hp">HP: ${opponent.HP}</span>,
  <span class="atk">ATK: ${opponent.ATK}</span>,
  <span class="hit">Hit: ${opponent.hitRate}%</span>,
  <span class="parry">Parry: ${opponent.parryRate}%</span>
`);
  /* wip yet to be implemented
  if (currentCharacter.hasOwnProperty(`ability`)) {
    $(`#ability`).show();
  }
  */
  $(`.battle`).show(); // show battle options
});

// attack option
$("#attack").click(function() {
  if (hit(currentCharacter)) { // if hit
    processPlayerTurn(); // processes everything
    opponent.HP -= currentCharacter.ATK;
    dmgDealt += currentCharacter.ATK; // log for resetting later
    updateStats(); // update stats before
    $(`.battle`).hide(); // hide actions for opponent turn
  } else {
    // for if they miss
    $(`#actionText`).html(`You missed. ☠️`); // show result
    $(`.battle`).hide(); // hide actions for opponent turn, note i actually CANT just slot this in opponentTurn since theres no timers in opponentTurn and the processing in it is instant, and most of the idle time is spent in processPlayerTurn, the button would just dissapear and reappear immediately
    setTimeout(opponentTurn, 2500); // nothing to process to skip processPlayerTurn
  }
});

// calculate hit, works for player and opponent AI
function hit(character) {
  let x = Math.floor(Math.random() * 100) + 1;
  console.log(x); // debugging
  if (x <= character.hitRate) {
    return true;
  } else {
    return false;
  }
}


let parried = false; // set default value

// parry option
$("#parry").click(function() {
  if (parry()) {
    $(`#actionText`).html(`Parried!`); // show result
    opponent.HP -= currentCharacter.ATK;
    $(`.battle`).hide(); // hide actions for opponent turn
    parried = true; // IMPORANT so when deadCheck is ran during processPlayerTurn it doesn't go to opponents turn🤔🤔💭💭💯💯
    setTimeout(processPlayerTurn, 2500);
  } else {
    $(`#actionText`).html(`Parry Unsuccessful.`); // show result
    $(`.battle`).hide(); // hide actions for opponent turn
    setTimeout(opponentTurn, 2500);  // nothing to process to skip processPlayerTurn
  }
});

// calculate parry, works for player only (for now), opponent implementation should be feasible
function parry() {
  let x = Math.floor(Math.random() * 100) + 1;
  console.log(x); // debugging
  if (x <= (currentCharacter.parryRate*(100-opponent.hitRate))/100) { // (character parry% * opponent doesnt hit%)
    return true;
  } else {
    return false;
  }
}

// DISPLAYS PLAYER DAMAGE, UPDATES STATS, CHECKS IF OPPONENT IS DEAD, AND RUNS OPPONENT TURN (probably could've made all of this a lot better but wtv "if it works dont touch it") also probably should've documented this earlier to make debugging less confusing
function processPlayerTurn() {
  $(`#actionText`).html(`${currentCharacter.name} dealt ${currentCharacter.ATK} damage!`);
  $(`.battle`).show(); // only used for parry success i think
  updateStats(); // update stats
  setTimeout(deadCheck, 2500); // dead check
}

// checks if opponent/player is dead AND starts opponents turn
function deadCheck() {
  if (opponent.HP <= 0 ) {
    $(`#actionText`).html(`${opponent.name} has been slain.`); // show result
    opponents.splice(chosenOpponent, 1); // remove opponent if killed
    console.log("After removal:", opponents); // debug
    setTimeout(home, 2500); // go home
  } else if (parried) {
    parried = false; // reset for next turn
  } else {
    opponentTurn(); // opponent turn
  }
}



// this is honestly written so bad but all good
// updates stats
function updateStats() {
  console.log("Before removal:", opponents); // debug thing
  $('#currentStats').html(`
  <span class="hp">HP: ${currentCharacter.HP}</span>,
  <span class="atk">ATK: ${currentCharacter.ATK}</span>,
  <span class="hit">Hit: ${currentCharacter.hitRate}%</span>,
  <span class="parry">Parry: ${currentCharacter.parryRate}%</span>
`);
  $('#currentOpponentStats').html(`
  <span class="hp">HP: ${opponent.HP}</span>,
  <span class="atk">ATK: ${opponent.ATK}</span>,
  <span class="hit">Hit: ${opponent.hitRate}%</span>,
  <span class="parry">Parry: ${opponent.parryRate}%</span>
`);
  if (currentCharacter.HP <= 0) { // if player is dead
    $(`#actionText`).html(`You died.`); // show result
    setTimeout(home, 2500); // go home
    $(`.battle`).hide(); // hide actions
  } 
}

// OPPONENT TURN FUNCTION
function opponentTurn() {
  if (hit(opponent)) { // if hit
    currentCharacter.HP -= opponent.ATK;
    dmgReceived += opponent.ATK;
    $(`#actionText`).html(`${opponent.name} dealt ${opponent.ATK} damage!`); // show result
    updateStats();
    if (currentCharacter.HP > 0) { // only show actions if player is still alive
      $(`.battle`).show(); // player turn
    }
  } else { // if miss
    $(`#actionText`).html(`${opponent.name} missed.`); // show result
    $(`.battle`).show(); // player turn
  }
}

// default values
let dmgDealt = 0;
let dmgReceived = 0;

// reset all damage taken
function resetDmg() {
  currentCharacter.HP += dmgReceived;
  opponent.HP += dmgDealt;
  dmgReceived = 0;
  dmgDealt = 0;
}


$("#gacha").click(function() { // gacha button
  $(".menu").hide();
  $(".gacha").show();
});

$(`#single`).click(function() { // roll single
  currentCharacter = single();
  $(`#actionText`).html(`You rolled ${currentCharacter.name}!!`);
  $('#currentStats').html(`
  <span class="hp">HP: ${currentCharacter.HP}</span>,
  <span class="atk">ATK: ${currentCharacter.ATK}</span>,
  <span class="hit">Hit: ${currentCharacter.hitRate}%</span>,
  <span class="parry">Parry: ${currentCharacter.parryRate}%</span>
`);
  $(`#currentCharacter`).html(currentCharacter.name);
  $(`#gachaPicture`).show();
  $(`#gachaPicture`).html(`<img src="charImg/${currentCharacter.name}.png" alt="${currentCharacter.name}" class="character-gacha"`);
})

// GAMBLE 🤑🤑🤑🤑🤑 //PASSION //HOBBY
function single() {
  let x = Math.floor(Math.random() * 100) + 1;
  console.log(x); // debugging
  if (x > 50) {
    return cTier[Math.floor(Math.random() * cTier.length)];
  } else if (x > 15 && x <= 50) {
    return bTier[Math.floor(Math.random() * bTier.length)];
  } else if (x > 5 && x <= 15) {
    return aTier[Math.floor(Math.random() * aTier.length)];
  } else {
    return sTier[Math.floor(Math.random() * sTier.length)];
  }
}

// function to go home
function home() {
  resetDmg();
  $(`.menu`).show();
  $(`.battle`).hide();
  $(`.gacha`).hide();
  $(`.stats`).show();
  $("#ability").hide();
  $(`.opponentStats`).hide();
  $(`.battleImages`).hide();
  updateStats();
  $(`#actionText`).html(`...`);
  if (opponents.length === 0) {
    endScreen();
  }
}

// wipe everything lol
function endScreen () {
  document.write(`Congratulations! After a long hard fought tournament, you have come out as the new Maphean Champion! Until next time Champ :)`);
}



// popup for introduction
function openPopup() {
  $('#popup-container').show();
  $('#overlay').show();
}

function closePopup() {
  $('#popup-container').hide();
   $('#overlay').hide();
}

$('#overlay, #close-btn').on('click', function () {
  closePopup();
});



