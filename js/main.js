console.log("JS file connected");
// ******* An interactive Svg section *******
const recordPlayer = document.querySelector("#recordPlayer");
const playButton = document.querySelector("#playButton");
let isMusicPlaying = false;
let vinylAngle = 0;

function setupRecordPlayer() {
    const tonearm = recordPlayer.contentDocument.getElementById("Tone_arm");
    tonearm.style.transition = "transform 0.5s ease";
    tonearm.style.transformOrigin = "505px 95px";
}

function handleClickPlay(){
    if(isMusicPlaying) {
        pause();
        return;
    }
    play();
}

function play(){
    isMusicPlaying = true;
    insertMusicDisc();
    changePlayButtonIcon("pause");
    setTimeout(() => { 
        moveTonearm(30);
        startSpinningVinyl();
},700);
}

function pause(){
    isMusicPlaying = false;
    changePlayButtonIcon("play");
    setTimeout(() => { 
        removeMusicDisc();
        moveTonearm(0);
},400);
}

function insertMusicDisc() {
    const musicDisc = document.querySelector("#musicDisc");
    musicDisc.classList.remove("translate-x-[145px]");
    musicDisc.classList.add("translate-x-[80px]");
}

function removeMusicDisc() {
    setTimeout(() => {
        const musicDisc = document.querySelector("#musicDisc");
        musicDisc.classList.remove("translate-x-[80px]");
        musicDisc.classList.add("translate-x-[145px]");
    }, 400);
}

function moveTonearm(angle) {
    const tonearm = recordPlayer.contentDocument.getElementById("Tone_arm");
    tonearm.style.transform = `rotate(${angle}deg)`;
}

function startSpinningVinyl() {
    setTimeout(() => {
    spinVinyl();
    }, 600);
}

function spinVinyl() {
    if (!isMusicPlaying) return;

    const vinyl = recordPlayer.contentDocument.getElementById("Vinyl");
    vinylAngle += 1;
    vinyl.setAttribute("transform", `rotate(${vinylAngle} 250 225)`);

    requestAnimationFrame(spinVinyl);
}

function changePlayButtonIcon(icon) {
    const playButtonIcon = playButton.querySelector("img");
    playButtonIcon.src = `images/${icon}.png`;
    playButtonIcon.alt = icon;
}


recordPlayer.addEventListener("load", setupRecordPlayer);
playButton.addEventListener("click", handleClickPlay);


// ******* Drag and drop instruments section *******
const puzzleBoard = document.querySelector('.mixer-board');
const dropZone = document.querySelectorAll('.drop-zone'); 
const instrumentsContainer = document.querySelector('.instruments');
const instruments = document.querySelectorAll('.instruments img');
let draggedPiece;

function handleStartDrag() {
    console.log('started dragging this piece: ', this);
    draggedPiece = this;
}

function handleDragOver(e) {
    e.preventDefault();
    console.log('you dragged over me');
}

function handleDrop(e){
    e.preventDefault();
    if (this.children.length === 0) {
        this.appendChild(draggedPiece);
        console.log('dropped something on me');
        playAudio(draggedPiece.id, this);
    }
}

// !!!!!!!!!! Damn bugs
function handleClickBack() {
    if (
        this.parentElement != null && this.parentElement.classList.contains("drop-zone")
    ) {
        instrumentsContainer.appendChild(this);
        console.log('started clicking this piece back to the container: ', this);
    }
}
// !!!!!!!!!! Problem
function playAudio (selectedInstrument, selectedDropZone) {
    let instrument = document.createElement('audio');
    instrument.src = `assets/${selectedInstrument}.mp3`;
    instrument.load();
    selectedDropZone.appendChild(instrument);
    instrument.loop = true;
    instrument.play();
}

instruments.forEach(icon => {
    icon.addEventListener('dragstart', handleStartDrag);
    icon.addEventListener('click', handleClickBack);
});

dropZone.forEach(zone => zone.addEventListener('dragover', handleDragOver));
dropZone.forEach(zone => zone.addEventListener('drop',handleDrop));