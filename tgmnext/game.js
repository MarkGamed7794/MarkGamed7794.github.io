const piece_names = ["Z", "L", "O", "S", "I", "J", "T"];

const normal_ui = document.getElementById("normal-ui");
const score_element = document.getElementById("score");
const best_element = document.getElementById("best");

const SPRINT_THRESHOLD = 100;

const sprint_ui = document.getElementById("sprint-ui");
sprint_ui.style.display = "none";
const sprint_score_element = document.getElementById("sprintscore");
sprint_score_element.innerHTML = `0/${SPRINT_THRESHOLD}`
const sprint_time_element = document.getElementById("time");

let audio = {};
let buttons = {};

function loadAudio() {
    for(let name of ["Z", "L", "O", "S", "I", "J", "T", "gameover", "win"]) {
        audio[name] = new Audio(`./se/${name}.wav`);
    }
}

let mode = "normal";
let world_rule = true;
let current_piece = "";
let piece_history = [];
let score = 0;
let best = 0;

let starttime = null;
let besttime = Infinity;

function formatTime(s) {
    let min = Math.floor(s / 60)
    let sec = Math.floor(s) % 60
    let cs = Math.floor(s * 10) % 10

    return `${min}:${sec < 10 ? "0" : ""}${sec}.${cs}`
}

function playSound(name) {
    let this_audio = audio[name];
    this_audio.pause();
    this_audio.currentTime = 0;
    this_audio.play();
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
            if(mode == "normal") {
                score ++;
                score_element.innerHTML = score.toString();
                nextPiece();
            } else {
                score ++;
                sprint_score_element.innerHTML = score.toString() + `/${SPRINT_THRESHOLD}`;
                if(score >= SPRINT_THRESHOLD) {
                    playSound("win");
                    gameover();
                } else {
                    nextPiece();
                }
            }
        }
    }
}

function nextPiece() {
    piece_history.push(current_piece)
    if(piece_history.length > 3) piece_history.shift();

    let attempts = 0;
    do {
        current_piece = piece_names[Math.floor(Math.random() * piece_names.length)];
        attempts ++;
        console.log(current_piece)
    } while (attempts <= 3 && piece_history.indexOf(current_piece) >= 0)
    playSound(current_piece);
}

function newGame() {
    nextPiece();
    score_element.innerHTML = "0";
    sprint_score_element.innerHTML = `0/${SPRINT_THRESHOLD}`;
    score = 0;
    for(let name of ["Z", "L", "O", "S", "I", "J", "T", "Replay"]) {
        buttons[name].disabled = false;
        buttons[name].classList.remove("shown-incorrect");
    }
    document.getElementById("buttonToggleMode").disabled = true;
    if(mode == "sprint") {
        starttime = new Date();
    }
}

function gameover() {
    for(let name of ["Z", "L", "O", "S", "I", "J", "T", "Replay"]) {
        buttons[name].disabled = true;
    }
    if(mode === "normal") {
        if(score > best) best = score;
    } else {
        if(score >= SPRINT_THRESHOLD) {
            let time = (new Date() - starttime) / 1000
            if(time < besttime) {
                besttime = time;
                document.getElementById("time").innerHTML = formatTime(time);
                document.getElementById("sprintbest").innerHTML = formatTime(time);
            }
        }
        starttime = null;
    }
    best_element.innerHTML = best.toString();

    document.getElementById("buttonToggleMode").disabled = false;
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

function toggleMode() {
    mode = (mode === "normal" ? "sprint" : "normal");

    sprint_ui.style.display = (mode === "normal" ? "none" : "block");
    normal_ui.style.display = (mode === "normal" ? "block" : "none");
    document.getElementById("buttonToggleMode").innerHTML = (mode === "normal" ? "Normal Mode" : "Sprint Mode");
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

window.setInterval(() => {
    if(starttime == null) return;
    sprint_time_element.innerHTML = formatTime((new Date() - starttime) / 1000);
}, 1000/60)