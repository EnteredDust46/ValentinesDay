(function () {
  var DATING_START = new Date(2023, 3, 17);
  var HIS_BIRTHDAY = new Date(2005, 11, 24);
  var HER_BIRTHDAY = new Date(2006, 7, 15);

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

    var together = diffYMD(DATING_START, now);
    var el = document.getElementById('timeTogether');
    if (el) el.textContent = together.years + ' year' + (together.years !== 1 ? 's' : '') + ', ' + together.months + ' month' + (together.months !== 1 ? 's' : '') + ', ' + together.days + ' day' + (together.days !== 1 ? 's' : '');

    var totalDays = daysBetween(DATING_START, now);
    var nextAnn = nextOccurrence(now, 3, 17);
    var nextHis = nextOccurrence(now, 11, 24);
    var nextHers = nextOccurrence(now, 7, 15);
    var cdEl = document.getElementById('countdowns');
    if (cdEl) {
      cdEl.innerHTML =
        '<li><strong>Next anniversary (April 17):</strong> ' + daysBetween(now, nextAnn) + ' days</li>' +
        '<li><strong>Your next birthday (Dec 24):</strong> ' + daysBetween(now, nextHis) + ' days</li>' +
        '<li><strong>Meaghan\'s next birthday (Aug 15):</strong> ' + daysBetween(now, nextHers) + ' days</li>';
    }

    var hisAge = diffYMD(HIS_BIRTHDAY, now);
    var herAge = diffYMD(HER_BIRTHDAY, now);
    var agesEl = document.getElementById('agesText');
    if (agesEl) agesEl.textContent = 'You: ' + hisAge.years + ' years old (Dec 24, 2005) · Meaghan: ' + herAge.years + ' years old (Aug 15, 2006)';

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
      var mins = totalDays * 24 * 60 + now.getHours() * 60 + now.getMinutes();
      var sunsets = totalDays;
      var next1000 = totalDays < 1000 ? ' (in ' + (1000 - totalDays) + ' days!)' : '';
      var next2000 = totalDays < 2000 ? ' (in ' + (2000 - totalDays) + ' days)' : '';
      factsEl.innerHTML =
        '<li>That\'s about <strong>' + totalDays + '</strong> days together.</li>' +
        '<li>Roughly <strong>' + (hours >= 1000 ? (hours / 1000).toFixed(1) + 'k' : hours) + '</strong> hours.</li>' +
        '<li>Over <strong>' + (mins >= 1000000 ? (mins / 1000000).toFixed(1) + ' million' : (mins / 1000).toFixed(0) + 'k') + '</strong> minutes.</li>' +
        '<li>You\'ve seen about <strong>' + sunsets + '</strong> sunsets together.</li>' +
        (totalDays >= 1000 ? '<li>You hit 1000 days together! 🎉</li>' : '<li>Next milestone: 1000 days together' + next1000 + '</li>') +
        (totalDays >= 2000 ? '<li>2000 days together! 💕</li>' : '<li>Then: 2000 days' + next2000 + '</li>');
    }

    var eventsEl = document.getElementById('worldEvents');
    if (eventsEl) {
      eventsEl.innerHTML =
        '<li>May 2023 — Coronation of King Charles III</li>' +
        '<li>2023 — Barbenheimer summer</li>' +
        '<li>2023–2024 — Multiple lunar missions (Artemis, lunar landers)</li>' +
        '<li>2024 — Total solar eclipse across North America</li>' +
        '<li>2024 — Paris Olympics</li>' +
        '<li>2025 — AI and tech kept changing the world</li>' +
        '<li>… and through it all, you two have been together 💕</li>';
    }
  }

  update();
  setInterval(update, 60000);
})();
