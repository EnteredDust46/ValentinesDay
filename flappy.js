(function () {
  var canvas = document.getElementById('flappyCanvas');
  var scoreEl = document.getElementById('flappyScore');
  var gameOverEl = document.getElementById('flappyGameOver');
  var gameOverScoreEl = document.getElementById('flappyGameOverScore');
  var restartBtn = document.getElementById('flappyRestart');
  var monkeyWrap = document.getElementById('flappyMonkeyWrap');
  var monkeyGif = document.getElementById('flappyMonkeyGif');

  if (!canvas || !restartBtn) return;

  var ctx = canvas.getContext('2d');
  var GRAVITY = 0.5;
  var FLAP_STRENGTH = -7.5;
  var SCROLL_SPEED = 3.75;
  var PIPE_WIDTH = 64;
  var GAP_HEIGHT = 128;
  var PIPE_SPAWN_INTERVAL = 105;
  var MONKEY_SIZE = 44;
  var MONKEY_HITBOX_SCALE = 0.5;
  var BANANA_SIZE = 36;
  var BANANA_HITBOX_SCALE = 0.9;
  var GORILLA_TILE = 48;

  var monkeyX, monkeyY, monkeyVy;
  var pipes = [];
  var score = 0;
  var nextPipeIn = 0;
  var gameState = 'idle';
  var hasHadFirstInput = false;
  var animId = null;
  var gorillaImg = null;
  var bananaImg = null;

  var gorilla = new Image();
  gorilla.onload = function () { gorillaImg = gorilla; };
  gorilla.src = 'GameSprites/GORILLA.png';
  var banana = new Image();
  banana.onload = function () { bananaImg = banana; };
  banana.src = 'GameSprites/BANANA.png';

  function resize() {
    canvas.width = 400;
    canvas.height = 600;
  }

  function resetGame() {
    monkeyX = 70;
    monkeyY = canvas.height / 2 - MONKEY_SIZE / 2;
    monkeyVy = 0;
    pipes = [];
    score = 0;
    nextPipeIn = 80;
    gameState = 'playing';
    hasHadFirstInput = false;
    scoreEl.textContent = 'Bananas: 0';
    gameOverEl.hidden = true;
  }

  function flap() {
    if (gameState !== 'playing') return;
    if (!hasHadFirstInput) hasHadFirstInput = true;
    monkeyVy = FLAP_STRENGTH;
  }

  function spawnPipe() {
    var margin = 55;
    var minCenter = margin + GAP_HEIGHT / 2;
    var maxCenter = canvas.height - margin - GAP_HEIGHT / 2;
    var gapCenter = minCenter + Math.random() * (maxCenter - minCenter);
    var gapTop = gapCenter - GAP_HEIGHT / 2;
    var gapBottom = gapCenter + GAP_HEIGHT / 2;
    pipes.push({
      x: canvas.width,
      gapTop: gapTop,
      gapBottom: gapBottom,
      gapCenter: gapCenter,
      bananaCollected: false
    });
  }

  function monkeyHitbox() {
    var w = MONKEY_SIZE * MONKEY_HITBOX_SCALE;
    var h = MONKEY_SIZE * MONKEY_HITBOX_SCALE;
    return {
      x: monkeyX + (MONKEY_SIZE - w) / 2,
      y: monkeyY + (MONKEY_SIZE - h) / 2,
      w: w,
      h: h
    };
  }

  function hitTest(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function update() {
    if (gameState !== 'playing') return;
    if (!hasHadFirstInput) return;

    monkeyVy += GRAVITY;
    monkeyY += monkeyVy;

    if (monkeyY + MONKEY_SIZE > canvas.height || monkeyY < 0) {
      gameState = 'over';
      gameOverScoreEl.textContent = 'Bananas: ' + score;
      gameOverEl.hidden = false;
      if (monkeyWrap) monkeyWrap.hidden = true;
      return;
    }

    nextPipeIn--;
    if (nextPipeIn <= 0) {
      spawnPipe();
      nextPipeIn = PIPE_SPAWN_INTERVAL;
    }

    var m = monkeyHitbox();

    for (var i = pipes.length - 1; i >= 0; i--) {
      var p = pipes[i];
      p.x -= SCROLL_SPEED;

      var topPipe = { x: p.x, y: 0, w: PIPE_WIDTH, h: p.gapTop };
      var bottomPipe = { x: p.x, y: p.gapBottom, w: PIPE_WIDTH, h: canvas.height - p.gapBottom };

      if (hitTest(m, topPipe) || hitTest(m, bottomPipe)) {
        gameState = 'over';
        gameOverScoreEl.textContent = 'Bananas: ' + score;
        gameOverEl.hidden = false;
        if (monkeyWrap) monkeyWrap.hidden = true;
        return;
      }

      var bananaX = p.x + PIPE_WIDTH / 2 - BANANA_SIZE / 2;
      var bananaY = p.gapCenter - BANANA_SIZE / 2;
      if (!p.bananaCollected && m.x + m.w > bananaX && m.x < bananaX + BANANA_SIZE) {
        var bh = BANANA_SIZE * BANANA_HITBOX_SCALE;
        var bw = BANANA_SIZE * BANANA_HITBOX_SCALE;
        var br = { x: bananaX + (BANANA_SIZE - bw) / 2, y: bananaY + (BANANA_SIZE - bh) / 2, w: bw, h: bh };
        if (hitTest(m, br)) {
          p.bananaCollected = true;
          score++;
          scoreEl.textContent = 'Bananas: ' + score;
        }
      }

      if (p.x + PIPE_WIDTH < 0) pipes.splice(i, 1);
    }
  }

  function drawPipe(p) {
    var tile = GORILLA_TILE;
    if (gorillaImg) {
      for (var y = 0; y < p.gapTop; y += tile) {
        var h = Math.min(tile, p.gapTop - y);
        ctx.drawImage(gorillaImg, p.x, y, PIPE_WIDTH, h);
      }
      for (var y = p.gapBottom; y < canvas.height; y += tile) {
        var h = Math.min(tile, canvas.height - y);
        ctx.drawImage(gorillaImg, p.x, y, PIPE_WIDTH, h);
      }
    } else {
      ctx.fillStyle = '#2F2F2F';
      ctx.fillRect(p.x, 0, PIPE_WIDTH, p.gapTop);
      ctx.fillRect(p.x, p.gapBottom, PIPE_WIDTH, canvas.height - p.gapBottom);
    }
  }

  function drawBananaInGap(p) {
    if (p.bananaCollected) return;
    var bx = p.x + PIPE_WIDTH / 2 - BANANA_SIZE / 2;
    var by = p.gapCenter - BANANA_SIZE / 2;
    if (bx + BANANA_SIZE < 0) return;
    if (bananaImg) {
      ctx.drawImage(bananaImg, bx, by, BANANA_SIZE, BANANA_SIZE);
    } else {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.ellipse(bx + BANANA_SIZE / 2, by + BANANA_SIZE / 2, BANANA_SIZE / 2.5, BANANA_SIZE / 2, 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function draw() {
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, canvas.height - 24, canvas.width, 24);

    pipes.forEach(function (p) {
      drawPipe(p);
      drawBananaInGap(p);
    });

    updateMonkeyOverlay();
  }

  function updateMonkeyOverlay() {
    if (!monkeyWrap || !monkeyGif) return;
    monkeyWrap.hidden = gameState !== 'playing';
    var cw = canvas.clientWidth || 400;
    var ch = canvas.clientHeight || 600;
    var sx = cw / 400;
    var sy = ch / 600;
    monkeyGif.style.left = (monkeyX * sx) + 'px';
    monkeyGif.style.top = (monkeyY * sy) + 'px';
    monkeyGif.style.width = (MONKEY_SIZE * sx) + 'px';
    monkeyGif.style.height = (MONKEY_SIZE * sy) + 'px';
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
    if (monkeyWrap) monkeyWrap.hidden = false;
    loop();
  }

  canvas.addEventListener('keydown', function (e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      flap();
    }
  });
  canvas.addEventListener('click', flap);
  restartBtn.addEventListener('click', startGame);

  canvas.focus();
  resize();
  startGame();
})();
