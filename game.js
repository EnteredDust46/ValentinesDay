(function () {
  const canvas = document.getElementById('gameCanvas');
  const scoreEl = document.getElementById('gameScore');
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  const gameOverScoreEl = document.getElementById('gameOverScore');
  const gameRestartBtn = document.getElementById('gameRestart');
  const gameSection = document.getElementById('gameSection');
  const showGameBtn = document.getElementById('showGame');

  if (!canvas) return;
  if (!gameRestartBtn) return;

  const ctx = canvas.getContext('2d');
  const GRAVITY = 0.68;
  const JUMP_STRENGTH = -6.5;
  const JUMP_HOLD_BOOST = 0.9;
  const JUMP_HOLD_MAX_FRAMES = 14;
  const MAX_UPWARD_VELOCITY = -9;
  const GROUND_Y_RATIO = 0.82;
  const SCROLL_SPEED = 6.3;
  const PLAYER_WIDTH = 72;
  const PLAYER_HEIGHT = 72;
  const PLAYER_HITBOX_SCALE = 0.4;
  const GORILLA_WIDTH_BASE = 68;
  const GORILLA_HEIGHT_BASE = 68;
  const GORILLA_SCALE_MIN = 0.7;
  const GORILLA_SCALE_MAX = 1.1;
  const GORILLA_HITBOX_SCALE = 0.45;
  const BANANA_SIZE_BASE = 44;
  const BANANA_SCALE_MIN = 0.55;
  const BANANA_SCALE_MAX = 1.1;
  const BANANA_HITBOX_SCALE = 0.95;
  const SPAWN_GORILLA_MIN = 32;
  const SPAWN_GORILLA_MAX = 72;
  const SPAWN_BANANA_MIN = 28;
  const SPAWN_BANANA_MAX = 70;
  const PLATFORM_HEIGHT = 14;
  const PLATFORM_LOW_Y_OFF = 88;
  const PLATFORM_HIGH_Y_OFF = 158;
  const SPAWN_PLATFORM_MIN = 48;
  const SPAWN_PLATFORM_MAX = 105;

  let groundY;
  let playerX, playerY, playerVy;
  let gorillas = [];
  let bananas = [];
  let platforms = [];
  let score = 0;
  let nextGorillaIn = 0;
  let nextBananaIn = 0;
  let nextPlatformIn = 0;
  let jumpKeyHeld = false;
  let jumpHoldFrames = 0;
  let gameState = 'idle';
  let animId = null;

  const assets = {
    monkey: null,
    gorilla: null,
    banana: null
  };

  function loadImage(src, key) {
    const img = new Image();
    img.onload = function () { assets[key] = img; };
    img.onerror = function () { assets[key] = null; };
    img.src = src;
  }

  loadImage('GameSprites/GORILLA.png', 'gorilla');
  loadImage('GameSprites/BANANA.png', 'banana');

  var monkeyGifEl = document.getElementById('monkeyGif');
  var monkeyOverlayEl = document.getElementById('monkeyOverlay');
  if (monkeyGifEl) assets.monkey = monkeyGifEl;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(rect.width / 800, rect.height / 400, 1);
    canvas.width = 800;
    canvas.height = 400;
    groundY = canvas.height * GROUND_Y_RATIO;
    if (gameState === 'idle') resetPlayerPos();
  }

  function resetPlayerPos() {
    playerX = 80;
    playerY = groundY - PLAYER_HEIGHT;
    playerVy = 0;
  }

  function resetGame() {
    gorillas = [];
    bananas = [];
    platforms = [];
    score = 0;
    nextGorillaIn = SPAWN_GORILLA_MIN + Math.random() * (SPAWN_GORILLA_MAX - SPAWN_GORILLA_MIN);
    nextBananaIn = SPAWN_BANANA_MIN + Math.random() * (SPAWN_BANANA_MAX - SPAWN_BANANA_MIN);
    nextPlatformIn = SPAWN_PLATFORM_MIN + Math.random() * (SPAWN_PLATFORM_MAX - SPAWN_PLATFORM_MIN);
    jumpKeyHeld = false;
    jumpHoldFrames = 0;
    gameState = 'playing';
    resetPlayerPos();
    scoreEl.textContent = 'Bananas: 0';
    gameOverOverlay.hidden = true;
  }

  function canJump() {
    if (playerY >= groundY - PLAYER_HEIGHT - 2) return true;
    for (var p = 0; p < platforms.length; p++) {
      var plat = platforms[p];
      if (
        playerY + PLAYER_HEIGHT >= plat.y - 4 &&
        playerY + PLAYER_HEIGHT <= plat.y + PLATFORM_HEIGHT + 8 &&
        playerX + PLAYER_WIDTH > plat.x &&
        playerX < plat.x + plat.w
      ) return true;
    }
    return false;
  }

  function jumpStart() {
    if (gameState !== 'playing') return;
    if (canJump()) {
      playerVy = JUMP_STRENGTH;
      jumpHoldFrames = 0;
    }
  }

  function spawnGorilla() {
    var scale = GORILLA_SCALE_MIN + Math.random() * (GORILLA_SCALE_MAX - GORILLA_SCALE_MIN);
    var w = Math.round(GORILLA_WIDTH_BASE * scale);
    var h = Math.round(GORILLA_HEIGHT_BASE * scale);
    var floating = Math.random() < 0.22;
    var y;
    if (floating) {
      if (Math.random() < 0.55) {
        y = groundY - h - 155 - Math.random() * 35;
      } else {
        y = groundY - h - 55 - Math.random() * 25;
      }
    } else {
      y = groundY - h;
    }
    gorillas.push({ x: canvas.width, w: w, h: h, y: y });
  }

  function spawnBanana() {
    var scale = BANANA_SCALE_MIN + Math.random() * (BANANA_SCALE_MAX - BANANA_SCALE_MIN);
    var size = Math.round(BANANA_SIZE_BASE * scale);
    var y = groundY - size - 15 - Math.random() * 200;
    if (y < 40) y = 40;
    bananas.push({
      x: canvas.width,
      y: y,
      w: size,
      h: size
    });
  }

  function spawnPlatform() {
    var w = 85 + Math.random() * 65;
    var r = Math.random();
    var plat;
    if (r < 0.5) {
      plat = { x: canvas.width, y: groundY - PLATFORM_LOW_Y_OFF, w: Math.round(w), h: PLATFORM_HEIGHT };
      platforms.push(plat);
    } else {
      platforms.push({
        x: canvas.width + 115,
        y: groundY - PLATFORM_LOW_Y_OFF,
        w: Math.round(w * 0.9),
        h: PLATFORM_HEIGHT
      });
      plat = { x: canvas.width, y: groundY - PLATFORM_HIGH_Y_OFF, w: Math.round(w), h: PLATFORM_HEIGHT };
      platforms.push(plat);
    }
    if (Math.random() < 0.42 && plat) {
      var gs = GORILLA_SCALE_MIN + Math.random() * (GORILLA_SCALE_MAX - GORILLA_SCALE_MIN);
      var gw = Math.round(GORILLA_WIDTH_BASE * gs);
      var gh = Math.round(GORILLA_HEIGHT_BASE * gs);
      var gx = plat.x + Math.max(0, (plat.w - gw) / 2 + (Math.random() * 20 - 10));
      gorillas.push({ x: gx, w: gw, h: gh, y: plat.y - gh });
    }
  }

  function hitTest(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function playerHitbox() {
    var bw = PLAYER_WIDTH * PLAYER_HITBOX_SCALE;
    var bh = PLAYER_HEIGHT * PLAYER_HITBOX_SCALE;
    return {
      x: playerX + (PLAYER_WIDTH - bw) / 2,
      y: playerY + (PLAYER_HEIGHT - bh) / 2,
      w: bw,
      h: bh
    };
  }

  function gorillaHitbox(g) {
    var bw = g.w * GORILLA_HITBOX_SCALE;
    var bh = g.h * GORILLA_HITBOX_SCALE;
    return {
      x: g.x + (g.w - bw) / 2,
      y: g.y + (g.h - bh) / 2,
      w: bw,
      h: bh
    };
  }

  function bananaHitbox(b) {
    var bw = b.w * BANANA_HITBOX_SCALE;
    var bh = b.h * BANANA_HITBOX_SCALE;
    return {
      x: b.x + (b.w - bw) / 2,
      y: b.y + (b.h - bh) / 2,
      w: bw,
      h: bh
    };
  }

  function update() {
    if (gameState !== 'playing') return;

    playerVy += GRAVITY;
    if (
      playerVy <= 0 &&
      jumpKeyHeld &&
      jumpHoldFrames < JUMP_HOLD_MAX_FRAMES
    ) {
      playerVy -= JUMP_HOLD_BOOST;
      jumpHoldFrames++;
      if (playerVy < MAX_UPWARD_VELOCITY) playerVy = MAX_UPWARD_VELOCITY;
    }
    playerY += playerVy;

    if (playerY >= groundY - PLAYER_HEIGHT) {
      playerY = groundY - PLAYER_HEIGHT;
      playerVy = 0;
      jumpHoldFrames = 0;
    } else {
      for (var p = 0; p < platforms.length; p++) {
        var plat = platforms[p];
        if (
          playerVy >= 0 &&
          playerY + PLAYER_HEIGHT >= plat.y - 4 &&
          playerY + PLAYER_HEIGHT <= plat.y + PLATFORM_HEIGHT + 8 &&
          playerX + PLAYER_WIDTH > plat.x &&
          playerX < plat.x + plat.w
        ) {
          playerY = plat.y - PLAYER_HEIGHT;
          playerVy = 0;
          jumpHoldFrames = 0;
          break;
        }
      }
    }

    nextGorillaIn--;
    if (nextGorillaIn <= 0) {
      spawnGorilla();
      nextGorillaIn = SPAWN_GORILLA_MIN + Math.random() * (SPAWN_GORILLA_MAX - SPAWN_GORILLA_MIN);
    }
    nextBananaIn--;
    if (nextBananaIn <= 0) {
      spawnBanana();
      nextBananaIn = SPAWN_BANANA_MIN + Math.random() * (SPAWN_BANANA_MAX - SPAWN_BANANA_MIN);
    }
    nextPlatformIn--;
    if (nextPlatformIn <= 0) {
      spawnPlatform();
      nextPlatformIn = SPAWN_PLATFORM_MIN + Math.random() * (SPAWN_PLATFORM_MAX - SPAWN_PLATFORM_MIN);
    }

    for (var i = platforms.length - 1; i >= 0; i--) {
      platforms[i].x -= SCROLL_SPEED;
      if (platforms[i].x + platforms[i].w < 0) platforms.splice(i, 1);
    }

    var player = playerHitbox();

    for (var i = gorillas.length - 1; i >= 0; i--) {
      gorillas[i].x -= SCROLL_SPEED;
      if (gorillas[i].x + gorillas[i].w < 0) gorillas.splice(i, 1);
      else if (hitTest(player, gorillaHitbox(gorillas[i]))) {
        gameState = 'over';
        gameOverScoreEl.textContent = 'You collected ' + score + ' banana' + (score !== 1 ? 's' : '') + '!';
        gameOverOverlay.hidden = false;
        return;
      }
    }

    for (var i = bananas.length - 1; i >= 0; i--) {
      bananas[i].x -= SCROLL_SPEED;
      if (bananas[i].x + bananas[i].w < 0) bananas.splice(i, 1);
      else if (hitTest(player, bananaHitbox(bananas[i]))) {
        bananas.splice(i, 1);
        score++;
        scoreEl.textContent = 'Bananas: ' + score;
      }
    }
  }

  function drawSky() {
    const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    g.addColorStop(0, '#87CEEB');
    g.addColorStop(0.6, '#B0E0E6');
    g.addColorStop(1, '#E0F4FF');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawGround() {
    const g = ctx.createLinearGradient(0, groundY, 0, canvas.height);
    g.addColorStop(0, '#8B7355');
    g.addColorStop(0.3, '#6B5344');
    g.addColorStop(1, '#5C4033');
    ctx.fillStyle = g;
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
    ctx.fillStyle = '#4A3728';
    ctx.fillRect(0, groundY, canvas.width, 4);
  }

  function updateMonkeyOverlay() {
    if (!monkeyOverlayEl || !monkeyGifEl) return;
    var cw = canvas.clientWidth || 800;
    var ch = canvas.clientHeight || 400;
    var sx = cw / 800;
    var sy = ch / 400;
    monkeyGifEl.style.left = (playerX * sx) + 'px';
    monkeyGifEl.style.top = (playerY * sy) + 'px';
    monkeyGifEl.style.width = (PLAYER_WIDTH * sx) + 'px';
    monkeyGifEl.style.height = (PLAYER_HEIGHT * sy) + 'px';
    monkeyOverlayEl.hidden = gameState !== 'playing';
  }

  function drawGorillas() {
    gorillas.forEach(function (g) {
      if (assets.gorilla) {
        ctx.drawImage(assets.gorilla, g.x, g.y, g.w, g.h);
      } else {
        ctx.fillStyle = '#2F2F2F';
        ctx.fillRect(g.x, g.y, g.w, g.h);
      }
    });
  }

  function drawBananas() {
    bananas.forEach(function (b) {
      if (assets.banana) {
        ctx.drawImage(assets.banana, b.x, b.y, b.w, b.h);
      } else {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(b.x + b.w / 2, b.y + b.h / 2, b.w / 2.5, b.h / 2, 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  function drawPlatforms() {
    platforms.forEach(function (plat) {
      ctx.fillStyle = '#6B5344';
      ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
      ctx.fillStyle = '#8B7355';
      ctx.fillRect(plat.x, plat.y, plat.w, 4);
    });
  }

  function draw() {
    drawSky();
    drawGround();
    drawPlatforms();
    drawGorillas();
    drawBananas();
    updateMonkeyOverlay();
  }

  function loop() {
    update();
    draw();
    if (gameState === 'playing' || gameState === 'over') {
      animId = requestAnimationFrame(loop);
    }
  }

  function startGame() {
    if (animId != null) cancelAnimationFrame(animId);
    resize();
    resetGame();
    loop();
  }

  canvas.addEventListener('keydown', function (e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      jumpKeyHeld = true;
      jumpStart();
    }
  });
  window.addEventListener('keyup', function (e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') jumpKeyHeld = false;
  });
  canvas.addEventListener('click', jumpStart);
  gameRestartBtn.addEventListener('click', startGame);

  if (showGameBtn && gameSection) {
    showGameBtn.addEventListener('click', function () {
      gameSection.hidden = false;
      gameSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      canvas.focus();
      if (gameState !== 'playing') startGame();
    });
  } else {
    canvas.focus();
    startGame();
  }

  window.addEventListener('resize', function () {
    if (gameState === 'playing' || gameState === 'over') return;
    resize();
  });

  resize();
  if (!showGameBtn) gameState = 'playing';
  else gameState = 'idle';
})();
