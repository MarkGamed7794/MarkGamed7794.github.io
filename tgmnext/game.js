const piece_names = ["Z", "L", "O", "S", "I", "J", "T"];

const score_element = document.getElementById("score");
const best_element = document.getElementById("best");

let audio = {}
let buttons = {}

function loadAudio() {
    for(let name of ["Z", "L", "O", "S", "I", "J", "T", "gameover"]) {
        audio[name] = new Audio(`./se/${name}.wav`);
    }
}

let world_rule = true;
let current_piece = "";
let score = 0;
let best = 0;

function playSound(name) {
    let this_audio = audio[name];
    this_audio.pause();
    this_audio.currentTime = 0;
    this_audio.play();
}

function gameover() {
    for(let name of ["Z", "L", "O", "S", "I", "J", "T", "Replay"]) {
        buttons[name].disabled = true;
    }
    if(score > best) best = score;
    best_element.innerHTML = best.toString();
}

function buttonClick(button) {
    if(piece_names.indexOf(button) !== -1) {
        // Is a piece
        if(current_piece !== button) {
            // Game over
            playSound("gameover");
            gameover();

            // Show which one you got wrong
            buttons[current_piece].classList.add("shown-incorrect");
        } else {
            // Keep going
            score ++;
            score_element.innerHTML = score.toString();
            nextPiece();
        }
    }
}

function nextPiece() {
    current_piece = piece_names[Math.floor(Math.random() * piece_names.length)];
    playSound(current_piece);
}

function newGame() {
    nextPiece();
    score_element.innerHTML = "0";
    score = 0;
    for(let name of ["Z", "L", "O", "S", "I", "J", "T", "Replay"]) {
        buttons[name].disabled = false;
        buttons[name].classList.remove("shown-incorrect");
    }
}

function replaySound() {
    playSound(current_piece);
}

function toggleColour() {
    world_rule = !world_rule
    for(let name of ["Z", "L", "O", "S", "I", "J", "T"]) {
        buttons[name].style.backgroundColor = `var(--col-${world_rule ? "world" : "classic"})`
    }
    document.getElementById("buttonToggleColour").innerHTML = world_rule ? "World Rule" : "Classic Rule"
}

addEventListener("DOMContentLoaded", () => {
    loadAudio();
    for(let name of ["Z", "L", "O", "S", "I", "J", "T", "NewGame", "Replay"]) {
        let button = document.getElementById(`button${name}`);
        buttons[name] = button;
        button.disabled = (name != "NewGame");
        if(piece_names.indexOf(name) >= 0) button.style.backgroundColor = "var(--col-world)"
    }
})