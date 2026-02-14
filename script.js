(function () {
  const photosSection = document.getElementById('photosSection');
  const photosContainer = document.getElementById('photosContainer');
  const showPhotosBtn = document.getElementById('showPhotos');

  // Spawn extra floating hearts in the background
  function addFloatingHearts() {
    const bg = document.querySelector('.hearts-bg');
    if (!bg) return;
    const symbols = ['♥', '💕', '💖'];
    for (let i = 0; i < 12; i++) {
      const el = document.createElement('span');
      el.textContent = symbols[i % symbols.length];
      el.setAttribute('aria-hidden', 'true');
      el.style.cssText = [
        'position:absolute',
        'font-size:' + (0.8 + Math.random() * 1) + 'rem',
        'opacity:' + (0.08 + Math.random() * 0.12),
        'left:' + Math.random() * 100 + '%',
        'top:' + Math.random() * 100 + '%',
        'color:' + (Math.random() > 0.5 ? '#e91e63' : '#d81b60'),
        'animation: float ' + (6 + Math.random() * 6) + 's ease-in-out infinite',
        'animation-delay:' + -Math.random() * 5 + 's',
      ].join(';');
      bg.appendChild(el);
    }
  }

  addFloatingHearts();

  // Load image list and render photos
  async function loadAndShowPhotos() {
    let list = [];
    try {
      const res = await fetch('images-list.json');
      if (res.ok) list = await res.json();
    } catch (_) {
      console.warn('Could not load images-list.json. Run: node build-image-list.js');
    }

    photosContainer.innerHTML = '';

    if (list.length === 0) {
      photosContainer.innerHTML = [
        '<p class="no-photos">',
        'No photos yet! Add images to the <strong>images</strong> folder, then run<br>',
        '<code>node build-image-list.js</code> and refresh.',
        '</p>',
      ].join('');
    } else {
      list.forEach((filename) => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        const img = document.createElement('img');
        img.src = 'images/' + encodeURIComponent(filename);
        img.alt = '';
        img.loading = 'lazy';
        img.onerror = function () {
          card.classList.add('broken');
          card.style.background = '#ffe4ec';
        };
        card.appendChild(img);
        photosContainer.appendChild(card);
      });
    }
  }

  showPhotosBtn.addEventListener('click', async () => {
    showPhotosBtn.disabled = true;
    showPhotosBtn.textContent = 'Loading...';
    await loadAndShowPhotos();
    showPhotosBtn.hidden = true;
    photosSection.hidden = false;
    photosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
