const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const volumeRange = player.querySelectorAll('.player__slider');
const ranges = player.querySelectorAll('.player__slider');
const playbackText = player.querySelector('.playback-rate');
const volumeButton = player.querySelector('.volume-btn');
const fullscreenButton = player.querySelector('.fullscreen');

function togglePlay(){
    video[video.paused ? 'play' : 'pause']();
}

function updateButton(){
    const icon = video.paused ? 'play' : 'pause';
    toggle.innerHTML = `<i class="fa-solid fa-${icon}"></i>`;
}

function skip(time){

    const skipTime = typeof(time) == 'number' ? time : parseFloat(this.dataset.skip);
    video.currentTime += skipTime;
}

function handleRangeUpdate(event) {
    video[event.target.name] = event.target.value;

    if (event.target.name === 'playbackRate') {
        playbackText.textContent = `${event.target.value}x`;
    }
    handleVolumeUpdate();
}

function handleVolumeUpdate() {
    const icon = video.volume > 0.3 ? 'high' : video.volume > 0 ? 'low' : 'xmark';
    volumeButton.innerHTML = `<i class="fa-solid fa-volume-${icon}"></i>`;
}

function mute() {
  if (video.volume === 0) {
    video.volume = video.dataset.previousVolume || 1;
  } else {
    video.dataset.previousVolume = video.volume;
    video.volume = 0;
  }

  handleVolumeUpdate();
}

function handleProgress(){
    const currentPercentage = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${currentPercentage}%`
}

function scrub(e){
    const scrubTime = (e.offsetX / progress.offsetWidth ) * video.duration;
    video.currentTime = scrubTime;
}

function fullscreen(){
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) { 
        video.msRequestFullscreen();
    }
}

function handleKeyboard(e){
    e.preventDefault();
    if(e.key == ' ')
        togglePlay();
    if(e.key == 'ArrowRight')
        skip(10);
    if(e.key == 'ArrowLeft')
        skip(-10);
    if(e.key == 'ArrowUp'){
        video.volume += video.volume < 1 ? .1 : 1;
        ranges.forEach(range => {
            if(range.name == 'volume')
                range.value = video.volume;
        });
    }
    if(e.key == 'ArrowDown'){
        video.volume -= video.volume > 0 ? .1 : 0;
        ranges.forEach(range => {
            if(range.name == 'volume')
                range.value = video.volume;
        });
    }

}

toggle.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('pause', updateButton);
video.addEventListener('play', updateButton);
video.addEventListener('timeupdate', handleProgress);
document.addEventListener('keydown', handleKeyboard);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('input', handleRangeUpdate))
volumeButton.addEventListener('click', mute);

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
progress.addEventListener('mouseout', () => mousedown = false);

fullscreenButton.addEventListener('click', fullscreen);