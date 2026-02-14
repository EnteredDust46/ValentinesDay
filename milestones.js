(function () {
  var DATING_START = new Date(2023, 3, 17);
  var ADAM_BIRTHDAY = new Date(2005, 11, 24);
  var MEAGHAN_BIRTHDAY = new Date(2006, 7, 15);

  function diffYMD(earlier, later) {
    var y = later.getFullYear() - earlier.getFullYear();
    var m = later.getMonth() - earlier.getMonth();
    var d = later.getDate() - earlier.getDate();
    if (d < 0) { m--; d += new Date(later.getFullYear(), later.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    return { years: y, months: m, days: d };
  }

  function daysBetween(a, b) {
    var ms = b.getTime() - a.getTime();
    return Math.floor(ms / (24 * 60 * 60 * 1000));
  }

  function nextOccurrence(refDate, month, day) {
    var n = new Date(refDate.getFullYear(), month, day);
    if (n <= refDate) n = new Date(refDate.getFullYear() + 1, month, day);
    return n;
  }

  function update() {
    var now = new Date();
    var totalDays = daysBetween(DATING_START, now);

    var together = diffYMD(DATING_START, now);
    var el = document.getElementById('timeTogether');
    if (el) el.textContent = together.years + ' year' + (together.years !== 1 ? 's' : '') + ', ' + together.months + ' month' + (together.months !== 1 ? 's' : '') + ', ' + together.days + ' day' + (together.days !== 1 ? 's' : '');

    var nextAnn = nextOccurrence(now, 3, 17);
    var nextAdam = nextOccurrence(now, 11, 24);
    var nextMeaghan = nextOccurrence(now, 7, 15);
    var cdEl = document.getElementById('countdowns');
    if (cdEl) {
      cdEl.innerHTML =
        '<li><strong>Next anniversary (April 17):</strong> ' + daysBetween(now, nextAnn) + ' days</li>' +
        '<li><strong>Adam\'s next birthday (Dec 24):</strong> ' + daysBetween(now, nextAdam) + ' days</li>' +
        '<li><strong>Meaghan\'s next birthday (Aug 15):</strong> ' + daysBetween(now, nextMeaghan) + ' days</li>';
    }

    var adamAge = diffYMD(ADAM_BIRTHDAY, now);
    var meaghanAge = diffYMD(MEAGHAN_BIRTHDAY, now);
    var agesEl = document.getElementById('agesText');
    if (agesEl) agesEl.textContent = 'Adam: ' + adamAge.years + ' years old (Dec 24, 2005) · Meaghan: ' + meaghanAge.years + ' years old (Aug 15, 2006)';

    var startYear = DATING_START.getFullYear();
    var endYear = now.getFullYear();
    var valentines = 0, christmas = 0, newYear = 0, thanksgiving = 0, halloween = 0;
    for (var y = startYear; y <= endYear; y++) {
      var v = new Date(y, 1, 14);
      if (v >= DATING_START && v <= now) valentines++;
      var c = new Date(y, 11, 25);
      if (c >= DATING_START && c <= now) christmas++;
      var ny = new Date(y, 0, 1);
      if (ny >= DATING_START && ny <= now) newYear++;
      var nov1 = new Date(y, 10, 1);
      var th = new Date(y, 10, 22 + (4 - nov1.getDay() + 7) % 7);
      if (th >= DATING_START && th <= now) thanksgiving++;
      var ha = new Date(y, 9, 31);
      if (ha >= DATING_START && ha <= now) halloween++;
    }
    var holEl = document.getElementById('holidaysList');
    if (holEl) {
      holEl.innerHTML =
        '<li>Valentine\'s Days: ' + valentines + '</li>' +
        '<li>Christmases: ' + christmas + '</li>' +
        '<li>New Years: ' + newYear + '</li>' +
        '<li>Thanksgivings: ' + thanksgiving + '</li>' +
        '<li>Halloweens: ' + halloween + '</li>';
    }

    var factsEl = document.getElementById('funFacts');
    if (factsEl) {
      var hours = Math.floor(totalDays * 24 + (now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600));
      var mins = Math.floor(totalDays * 24 * 60 + now.getHours() * 60 + now.getMinutes());
      var sunsets = totalDays;
      factsEl.innerHTML =
        '<li>That\'s <strong>' + totalDays + '</strong> days together.</li>' +
        '<li>Roughly <strong>' + (hours >= 1000 ? (hours / 1000).toFixed(1) + 'k' : hours) + '</strong> hours.</li>' +
        '<li>Over <strong>' + (mins >= 1000000 ? (mins / 1000000).toFixed(1) + ' million' : (mins / 1000).toFixed(0) + 'k') + '</strong> minutes.</li>' +
        '<li>We\'ve seen about <strong>' + sunsets + '</strong> sunsets together.</li>' +
        '<li>That\'s <strong>' + Math.floor(totalDays / 7) + '</strong> weeks (and counting!).</li>';
    }

    var milestones = [100, 250, 500, 750, 1000, 1500, 2000, 2500];
    var dayHtml = '';
    for (var i = 0; i < milestones.length; i++) {
      var m = milestones[i];
      if (totalDays >= m) {
        dayHtml += '<li>We hit <strong>' + m + ' days</strong> together! 🎉</li>';
      } else {
        dayHtml += '<li>Next: <strong>' + m + ' days</strong> (in ' + (m - totalDays) + ' days)</li>';
      }
    }
    var dayEl = document.getElementById('dayMilestones');
    if (dayEl) dayEl.innerHTML = dayHtml;

    var flewEl = document.getElementById('timeFlewList');
    if (flewEl) {
      flewEl.innerHTML =
        '<div class="then-now"><strong>Then (April 2023):</strong> Taylor Swift\'s Eras Tour had just started. <strong>Now:</strong> Multiple record-breaking legs and a cultural reset.</div>' +
        '<div class="then-now"><strong>Then:</strong> Ariana Grande hadn\'t released "yes, and?" or starred in Wicked. <strong>Now:</strong> Both out and huge.</div>' +
        '<div class="then-now"><strong>Then:</strong> ChatGPT had just gone mainstream. <strong>Now:</strong> AI is everywhere.</div>' +
        '<div class="then-now"><strong>Then:</strong> King Charles III hadn\'t been crowned yet (May 2023). <strong>Now:</strong> Coronation done, new reign underway.</div>' +
        '<div class="then-now"><strong>Then:</strong> Paris 2024 Olympics were still a year away. <strong>Now:</strong> Already in the history books.</div>' +
        '<div class="then-now"><strong>Then:</strong> Total solar eclipse across North America hadn\'t happened (April 2024). <strong>Now:</strong> Done — next one years out.</div>' +
        '<div class="then-now"><strong>Then:</strong> Artemis and commercial moon missions were still in the pipeline. <strong>Now:</strong> Lunar landings and new space milestones.</div>';
    }

    var eventsEl = document.getElementById('worldEvents');
    if (eventsEl) {
      eventsEl.innerHTML =
        '<li>May 2023 — Coronation of King Charles III</li>' +
        '<li>2023 — Taylor Swift\'s Eras Tour became a global phenomenon</li>' +
        '<li>2023–2024 — Lunar missions (Artemis, commercial landers)</li>' +
        '<li>April 2024 — Total solar eclipse across North America</li>' +
        '<li>Summer 2024 — Paris Olympics</li>' +
        '<li>2024 — Ariana Grande\'s "yes, and?" and Wicked</li>' +
        '<li>2024–2025 — AI, elections, and a whole lot of life</li>';
    }
  }

  update();
  setInterval(update, 60000);
})();
