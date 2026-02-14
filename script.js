(function () {
  const photosSection = document.getElementById('photosSection');
  const photosContainer = document.getElementById('photosContainer');
  const showPhotosBtn = document.getElementById('showPhotos');

  const VIDEO_EXT = ['.mov', '.mp4', '.webm'];
  function isVideo(filename) {
    const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
    return VIDEO_EXT.includes(ext);
  }

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

  async function loadAndShowPhotos() {
    let list = [];
    const embedded = document.getElementById('media-list');
    if (embedded && embedded.textContent) {
      try { list = JSON.parse(embedded.textContent); } catch (_) {}
    }
    if (list.length === 0) {
      try {
        const res = await fetch('images-list.json');
        if (res.ok) list = await res.json();
      } catch (_) {}
    }

    photosContainer.innerHTML = '';

    if (list.length === 0) {
      photosContainer.innerHTML = [
        '<p class="no-photos">',
        'No photos or videos yet! Add .jpg, .jpeg, .png, .mov, or .mp4 files to the <strong>images</strong> folder, then run<br>',
        '<code>node build-image-list.js</code> and refresh.',
        '</p>',
      ].join('');
    } else {
      // Base for resolution: if URL has no trailing slash and no filename (e.g. .../ValentinesDay), add /
      // so "images/foo" resolves to .../ValentinesDay/images/foo not .../images/foo
      let baseUrl = window.location.href.split('#')[0].split('?')[0];
      if (!baseUrl.endsWith('/') && !/\/[^/]+\.[a-z0-9]+$/i.test(baseUrl)) baseUrl += '/';

      list.forEach((filename, index) => {
        const card = document.createElement('div');
        card.className = 'media-card';
        card.style.animationDelay = (0.05 + index * 0.07) + 's';

        const src = new URL('images/' + encodeURIComponent(filename), baseUrl).href;

        if (isVideo(filename)) {
          const video = document.createElement('video');
          video.src = src;
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          video.setAttribute('preload', 'metadata');
          card.appendChild(video);
          card.classList.add('media-card--video');
          card.addEventListener('mouseenter', function () { video.play(); });
          card.addEventListener('mouseleave', function () { video.pause(); });
          video.play().catch(function () {});
        } else {
          const img = document.createElement('img');
          img.src = src;
          img.alt = '';
          img.loading = 'lazy';
          img.onerror = function () {
            card.classList.add('broken');
            card.style.background = '#ffe4ec';
          };
          card.appendChild(img);
        }
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
