// Create many "I love you" strips so the heart looks full
const ui = document.getElementById('ui');
const LINES = 140; // increase for denser heart

for (let i = 0; i < LINES; i++) {
  const love = document.createElement('div');
  love.className = 'love';
  love.style.setProperty('--i', i);

  love.innerHTML = `
    <div class="love_horizontal">
      <div class="love_vertical">
        <div class="love_word">I love you</div>
      </div>
    </div>
  `;

  ui.appendChild(love);
}

// Modal open/close logic
const openBtn = document.getElementById('openModalBtn');
const overlay = document.getElementById('modalOverlay');
const closeBtn = document.getElementById('modalClose');
const modalText = document.getElementById('modalText');

function openModal(text) {
  if (text) modalText.textContent = text;
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden', 'false');
  closeBtn.focus();
}

function closeModal() {
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden', 'true');
  openBtn.focus();
}

openBtn.addEventListener('click', () => openModal());
// close button
closeBtn.addEventListener('click', closeModal);
// click outside modal to close
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});
// close with Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('show')) closeModal();
});