const pages = [...document.querySelectorAll('.page')];
const previousButton = document.getElementById('previous-page');
const nextButton = document.getElementById('next-page');
const pageCount = document.getElementById('page-count');
const dotsContainer = document.getElementById('page-dots');
const book = document.getElementById('book');
const song = document.getElementById('our-song');
const musicButton = document.getElementById('music-button');
const musicLabel = document.getElementById('music-label');
const heartButton = document.getElementById('heart-button');
const hearts = document.getElementById('hearts');
const videoPage = document.querySelector('.video-page');
const video = videoPage.querySelector('video');

let currentPage = 0;
let isTurning = false;
let touchStartX = 0;
let touchStartY = 0;

pages.forEach((page, index) => {
  page.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
  const dot = document.createElement('span');
  dot.className = index === 0 ? 'dot active' : 'dot';
  dotsContainer.appendChild(dot);
});

const dots = [...dotsContainer.children];

function updateControls() {
  previousButton.disabled = currentPage === 0;
  pageCount.textContent = `${currentPage + 1} / ${pages.length}`;
  nextButton.innerHTML = currentPage === pages.length - 1 ? 'again &#8634;' : 'next &#8594;';
  dots.forEach((dot, index) => dot.classList.toggle('active', index === currentPage));
}

function finishTurn(oldPage, newPage) {
  oldPage.className = oldPage.className.replace(/\s*(is-active|is-under|is-over|turning-out)/g, '');
  newPage.classList.remove('is-under', 'is-over', 'turning-out');
  newPage.classList.add('is-active');
  pages.forEach((page, index) => page.setAttribute('aria-hidden', index === currentPage ? 'false' : 'true'));
  isTurning = false;
  updateControls();
  leaveVideoBehind();
}

function goForward() {
  if (isTurning) return;

  if (currentPage === pages.length - 1) {
    currentPage = 0;
    pages.forEach((page) => {
      page.classList.remove('is-active', 'is-under', 'is-over', 'turning-out');
      page.setAttribute('aria-hidden', 'true');
    });
    pages[0].classList.add('is-active');
    pages[0].setAttribute('aria-hidden', 'false');
    updateControls();
    leaveVideoBehind();
    return;
  }

  isTurning = true;
  const oldPage = pages[currentPage];
  const newPage = pages[currentPage + 1];
  newPage.classList.add('is-under');
  oldPage.classList.add('turning-out');
  currentPage += 1;

  oldPage.addEventListener('animationend', () => finishTurn(oldPage, newPage), { once: true });
}

function goBack() {
  if (isTurning || currentPage === 0) return;
  isTurning = true;

  const oldPage = pages[currentPage];
  const newPage = pages[currentPage - 1];
  currentPage -= 1;
  newPage.classList.add('is-over');

  newPage.addEventListener('animationend', () => finishTurn(oldPage, newPage), { once: true });
}

nextButton.addEventListener('click', goForward);
previousButton.addEventListener('click', goBack);

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === ' ') goForward();
  if (event.key === 'ArrowLeft') goBack();
});

book.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].clientX;
  touchStartY = event.changedTouches[0].clientY;
}, { passive: true });

book.addEventListener('touchend', (event) => {
  const changeX = event.changedTouches[0].clientX - touchStartX;
  const changeY = event.changedTouches[0].clientY - touchStartY;
  if (Math.abs(changeX) < 48 || Math.abs(changeY) > Math.abs(changeX)) return;
  if (changeX < 0) goForward();
  if (changeX > 0) goBack();
}, { passive: true });

song.addEventListener('play', () => {
  musicButton.setAttribute('aria-pressed', 'true');
  musicLabel.textContent = 'pause song';
});

song.addEventListener('pause', () => {
  musicButton.setAttribute('aria-pressed', 'false');
  musicLabel.textContent = 'play song';
});

function playSong() {
  const started = song.play();
  return started ? started.then(() => true, () => false) : Promise.resolve(true);
}

function toggleSong() {
  if (!song.paused) {
    song.pause();
    return;
  }
  songWaitingOnVideo = false;
  playSong().then((started) => {
    if (!started) musicLabel.textContent = 'tap again';
  });
}

musicButton.addEventListener('click', toggleSong);

const wakeEvents = ['pointerdown', 'keydown', 'touchstart'];

function wakeSong(event) {
  wakeEvents.forEach((name) => document.removeEventListener(name, wakeSong));
  if (musicButton.contains(event.target)) return;
  playSong();
}

playSong().then((started) => {
  if (started) return;
  wakeEvents.forEach((name) => document.addEventListener(name, wakeSong, { passive: true }));
});

let songWaitingOnVideo = false;

video.addEventListener('play', () => {
  if (song.paused) return;
  songWaitingOnVideo = true;
  song.pause();
});

function leaveVideoBehind() {
  if (pages[currentPage] === videoPage) return;
  video.pause();
  if (!songWaitingOnVideo) return;
  songWaitingOnVideo = false;
  playSong();
}

function makeHearts() {
  heartButton.textContent = 'I love you';
  for (let index = 0; index < 34; index += 1) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = index % 3 === 0 ? '♡' : '♥';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${10 + Math.random() * 18}px`;
    heart.style.opacity = `${.35 + Math.random() * .55}`;
    heart.style.setProperty('--speed', `${3.5 + Math.random() * 3}s`);
    heart.style.setProperty('--drift', `${-40 + Math.random() * 80}px`);
    heart.style.animationDelay = `${Math.random() * 1.3}s`;
    hearts.appendChild(heart);
    window.setTimeout(() => heart.remove(), 8000);
  }
  window.setTimeout(() => { heartButton.textContent = 'tap me'; }, 3000);
}

heartButton.addEventListener('click', makeHearts);
updateControls();
