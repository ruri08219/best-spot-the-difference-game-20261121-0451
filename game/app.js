/* Twin Tales — game logic: click the differences, count them down, beat the clock.
   Works with mouse and keyboard, no network, no storage beyond a best score. */
(function () {
  'use strict';

  var SCENES = window.TwinScenes;
  var DIFFS_PER_LEVEL = 7;

  var canvasA = document.getElementById('canvasA');
  var canvasB = document.getElementById('canvasB');
  var ctxA = canvasA.getContext('2d');
  var ctxB = canvasB.getContext('2d');
  var counterEl = document.getElementById('counter');
  var timerEl = document.getElementById('timer');
  var scoreEl = document.getElementById('score');
  var hintBtn = document.getElementById('hintBtn');
  var muteBtn = document.getElementById('muteBtn');
  var tabsEl = document.getElementById('levelTabs');
  var overlay = document.getElementById('overlay');
  var overlayCard = document.getElementById('overlayCard');
  var footNote = document.querySelector('#foot span');

  var levelIndex = 0;
  var found = SCENES.map(function () { return new Set(); });
  var done = SCENES.map(function () { return false; });
  var levelScore = SCENES.map(function () { return 0; });
  var levelTime = SCENES.map(function () { return 0; });
  var mistakes = 0;
  var hintsUsed = 0;
  var totalScore = 0;
  var startedAt = null;      // ms timestamp when the current level started
  var elapsedBase = 0;       // seconds banked before a pause
  var playing = false;       // false while an overlay is up
  var hintAt = null;         // { index, until } pulsing hint
  var wrongMarks = [];       // { x, y, panel, until } fading red X marks
  var shotMode = null;

  function scene() { return SCENES[levelIndex]; }
  function foundCount() { return found[levelIndex].size; }
  function remaining() { return DIFFS_PER_LEVEL - foundCount(); }

  function fmtTime(sec) {
    sec = Math.max(0, Math.floor(sec));
    var m = Math.floor(sec / 60), s = sec % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }
  function elapsed() {
    if (shotMode) return elapsedBase;
    if (!startedAt) return elapsedBase;
    return elapsedBase + (Date.now() - startedAt) / 1000;
  }
  function pauseTimer() {
    if (startedAt) { elapsedBase = elapsed(); startedAt = null; }
  }
  function resumeTimer() {
    if (playing && !startedAt) startedAt = Date.now();
  }

  function updateHud() {
    counterEl.textContent = 'Found ' + foundCount() + ' of ' + DIFFS_PER_LEVEL +
      ' · ' + remaining() + ' remaining';
    counterEl.classList.toggle('hot', remaining() <= 2 && remaining() > 0);
    timerEl.textContent = fmtTime(elapsed());
    scoreEl.textContent = 'Score ' + totalScore;
    hintBtn.disabled = !playing || remaining() === 0;
    tabsEl.querySelectorAll('.tab').forEach(function (tab, i) {
      tab.classList.toggle('active', i === levelIndex);
      tab.classList.toggle('done', done[i]);
    });
  }

  function drawMarkers(g) {
    var t = performance.now() / 1000;
    found[levelIndex].forEach(function (i) {
      var d = scene().diffs[i];
      g.beginPath(); g.arc(d.x, d.y, d.r + 4, 0, Math.PI * 2);
      g.strokeStyle = '#2fbf4a'; g.lineWidth = 4; g.stroke();
      g.beginPath(); g.arc(d.x, d.y, d.r + 4, 0, Math.PI * 2);
      g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 1.5; g.stroke();
      g.beginPath();
      g.moveTo(d.x - 7, d.y); g.lineTo(d.x - 1, d.y + 6); g.lineTo(d.x + 8, d.y - 6);
      g.strokeStyle = '#2fbf4a'; g.lineWidth = 4; g.lineCap = 'round'; g.stroke();
    });
    if (hintAt && hintAt.index != null) {
      var d2 = scene().diffs[hintAt.index];
      var pulse = 6 + Math.sin(t * 6) * 3;
      g.beginPath(); g.arc(d2.x, d2.y, d2.r + pulse, 0, Math.PI * 2);
      g.strokeStyle = '#ffd166'; g.lineWidth = 4;
      g.setLineDash([8, 6]); g.stroke(); g.setLineDash([]);
    }
    var now = performance.now();
    wrongMarks = wrongMarks.filter(function (m) { return m.until > now; });
    wrongMarks.forEach(function (m) {
      if (m.panel !== (g === ctxA ? 'A' : 'B')) return;
      g.beginPath();
      g.moveTo(m.x - 9, m.y - 9); g.lineTo(m.x + 9, m.y + 9);
      g.moveTo(m.x + 9, m.y - 9); g.lineTo(m.x - 9, m.y + 9);
      g.strokeStyle = '#e4572e'; g.lineWidth = 4; g.lineCap = 'round'; g.stroke();
    });
  }

  function render() {
    scene().draw(ctxA, 0);
    scene().draw(ctxB, 1);
    drawMarkers(ctxA);
    drawMarkers(ctxB);
  }

  function loop() {
    render();
    if (playing) timerEl.textContent = fmtTime(elapsed());
    requestAnimationFrame(loop);
  }

  function showOverlay(html) {
    overlayCard.innerHTML = html;
    overlay.classList.add('show');
    playing = false;
    pauseTimer();
  }
  function hideOverlay() {
    overlay.classList.remove('show');
    playing = true;
    resumeTimer();
  }

  function titleScreen() {
    showOverlay(
      '<h1>Twin Tales</h1>' +
      '<p class="big">🔍</p>' +
      '<p>Two pictures hang side by side. They look the same — but <b>seven tiny things</b> ' +
      'changed between them. Find them all before the clock embarrasses you.</p>' +
      '<div class="howto">' +
      '<b>How to play</b><br>' +
      '· Click a difference on either picture — it gets a green ring.<br>' +
      '· Wrong clicks cost 25 points. Hints cost 25 points too.<br>' +
      '· Finish all three scenes to win. Fewer mistakes, more stars.' +
      '</div>' +
      '<div class="row">' +
      '<button class="btn" id="startBtn">Start — Sunny Garden</button>' +
      '</div>' +
      '<p class="dim">Three scenes · 21 differences · keyboard: H hint, R restart, 1/2/3 scenes</p>'
    );
    document.getElementById('startBtn').addEventListener('click', function () {
      window.TwinAudio.click();
      hideOverlay();
    });
  }

  function starsFor() {
    if (mistakes === 0 && hintsUsed === 0) return 3;
    if (mistakes <= 2 && hintsUsed <= 1) return 2;
    return 1;
  }

  function levelComplete() {
    done[levelIndex] = true;
    var secs = Math.round(elapsed());
    var bonus = Math.max(0, 200 - secs * 2);
    var stars = starsFor();
    levelScore[levelIndex] = foundCount() * 100 + bonus;
    levelTime[levelIndex] = secs;
    totalScore += levelScore[levelIndex];
    window.TwinAudio.levelWin();
    var next = levelIndex + 1;
    var starRow = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    showOverlay(
      '<h2>' + scene().name + ' — complete!</h2>' +
      '<div class="stars">' + starRow + '</div>' +
      '<p class="score-line">Level score ' + levelScore[levelIndex] +
      ' &nbsp;·&nbsp; time ' + fmtTime(secs) + ' &nbsp;·&nbsp; mistakes ' + mistakes + '</p>' +
      '<p>' + (stars === 3 ? 'Flawless! Not a single wrong click.' :
        stars === 2 ? 'Sharp eyes! One or two slips, nothing more.' :
        'Done! The next scene is waiting — steady hands this time.') + '</p>' +
      '<div class="row">' +
      (next < SCENES.length
        ? '<button class="btn" id="nextBtn">Next — ' + SCENES[next].name + ' (N)</button>'
        : '<button class="btn" id="nextBtn">See your final score (N)</button>') +
      '<button class="btn ghost" id="againBtn">Replay this scene</button>' +
      '</div>'
    );
    document.getElementById('nextBtn').addEventListener('click', function () {
      window.TwinAudio.click();
      if (next < SCENES.length) selectLevel(next); else victoryScreen();
    });
    document.getElementById('againBtn').addEventListener('click', function () {
      window.TwinAudio.click();
      restartLevel();
    });
    updateHud();
  }

  function victoryScreen() {
    var totalTime = levelTime.reduce(function (a, b) { return a + b; }, 0);
    var best = 0;
    try {
      best = parseInt(window.localStorage.getItem('twin-tales-best') || '0', 10) || 0;
      if (totalScore > best) window.localStorage.setItem('twin-tales-best', String(totalScore));
    } catch (e) { /* storage unavailable: best score is just not kept */ }
    var isBest = totalScore > best;
    window.TwinAudio.gameWin();
    showOverlay(
      '<h1>You found them all!</h1>' +
      '<p class="big">🏆</p>' +
      '<p class="score-line">Total score ' + totalScore + ' &nbsp;·&nbsp; total time ' + fmtTime(totalTime) + '</p>' +
      '<p>' + (isBest ? 'A new best score — the sharpest eyes in the house!' :
        'Best score so far: ' + Math.max(best, totalScore) + '. Play again to beat it!') + '</p>' +
      '<p class="dim">' + SCENES.map(function (s, i) {
        return s.name + ': ' + levelScore[i] + ' pts · ' + fmtTime(levelTime[i]);
      }).join('<br>') + '</p>' +
      '<div class="row">' +
      '<button class="btn" id="againAllBtn">Play again (R)</button>' +
      '</div>'
    );
    document.getElementById('againAllBtn').addEventListener('click', function () {
      window.TwinAudio.click();
      restartAll();
    });
  }

  function restartLevel() {
    found[levelIndex] = new Set();
    mistakes = 0; hintsUsed = 0; hintAt = null; wrongMarks = [];
    elapsedBase = 0; startedAt = null;
    footNote.textContent = scene().tagline;
    hideOverlay();
    updateHud();
  }
  function restartAll() {
    found = SCENES.map(function () { return new Set(); });
    done = SCENES.map(function () { return false; });
    levelScore = SCENES.map(function () { return 0; });
    levelTime = SCENES.map(function () { return 0; });
    totalScore = 0; levelIndex = 0;
    restartLevel();
  }
  function selectLevel(i) {
    if (i === levelIndex && playing) return;
    levelIndex = i;
    mistakes = 0; hintsUsed = 0; hintAt = null; wrongMarks = [];
    elapsedBase = 0; startedAt = null;
    footNote.textContent = scene().tagline;
    hideOverlay();
    updateHud();
  }

  function giveHint() {
    if (!playing || remaining() === 0) return;
    for (var i = 0; i < DIFFS_PER_LEVEL; i++) {
      if (!found[levelIndex].has(i)) {
        hintAt = { index: i, until: performance.now() + 3000 };
        setTimeout(function () { hintAt = null; }, 3000);
        break;
      }
    }
    hintsUsed++;
    totalScore = Math.max(0, totalScore - 25);
    window.TwinAudio.hint();
    footNote.textContent = 'Hint: ' + scene().diffs[hintAt.index].name + '… (−25 pts)';
    updateHud();
  }

  function onBoardClick(e, panel) {
    if (!playing) return;
    var canvas = panel === 'A' ? canvasA : canvasB;
    var r = canvas.getBoundingClientRect();
    var x = e.clientX - r.left, y = e.clientY - r.top;
    var d = scene().diffs;
    for (var i = 0; i < d.length; i++) {
      var dx = x - d[i].x, dy = y - d[i].y;
      if (dx * dx + dy * dy <= (d[i].r + 8) * (d[i].r + 8)) {
        if (found[levelIndex].has(i)) {
          window.TwinAudio.click();
          footNote.textContent = 'Already found: ' + d[i].name + '.';
          return;
        }
        found[levelIndex].add(i);
        totalScore += 100;
        window.TwinAudio.correct();
        footNote.textContent = 'Found: ' + d[i].name + '! (' + foundCount() + ' of ' + DIFFS_PER_LEVEL + ')';
        if (remaining() === 0) { updateHud(); levelComplete(); return; }
        updateHud();
        return;
      }
    }
    mistakes++;
    totalScore = Math.max(0, totalScore - 25);
    window.TwinAudio.wrong();
    wrongMarks.push({ x: x, y: y, panel: panel, until: performance.now() + 700 });
    var el = document.getElementById(panel === 'A' ? 'panelA' : 'panelB');
    el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong');
    setTimeout(function () { el.classList.remove('wrong'); }, 350);
    footNote.textContent = 'Not a difference — that one costs 25 points. Look closer!';
    updateHud();
  }

  function buildTabs() {
    SCENES.forEach(function (s, i) {
      var b = document.createElement('button');
      b.className = 'tab';
      b.textContent = (i + 1) + ' · ' + s.name;
      b.title = s.tagline;
      b.addEventListener('click', function () { window.TwinAudio.click(); selectLevel(i); });
      tabsEl.appendChild(b);
    });
  }

  function bindKeys() {
    document.addEventListener('keydown', function (e) {
      var k = e.key.toLowerCase();
      if (k === 'h') giveHint();
      else if (k === 'm') {
        var muted = window.TwinAudio.toggleMute();
        muteBtn.textContent = muted ? 'Sound: off' : 'Sound: on';
      } else if (k === 'r') {
        if (overlay.classList.contains('show')) restartAll(); else restartLevel();
      } else if (k === '1' || k === '2' || k === '3') selectLevel(parseInt(k, 10) - 1);
      else if (k === 'n' || k === 'enter') {
        var nextBtn = document.getElementById('nextBtn');
        if (nextBtn) nextBtn.click();
        else if (overlay.classList.contains('show')) {
          var startBtn = document.getElementById('startBtn');
          var againBtn = document.getElementById('againAllBtn');
          if (startBtn) startBtn.click();
          else if (againBtn) againBtn.click();
        }
      }
    });
  }

  /* Screenshot mode (?shot=start|play|play2|end): a fixed, deterministic
     mid-game state so the screenshots show the game as it really plays. */
  function applyShot() {
    var q = new URLSearchParams(window.location.search);
    shotMode = q.get('shot');
    if (!shotMode) return false;
    if (shotMode === 'start') {
      titleScreen();
    } else if (shotMode === 'play') {
      levelIndex = 0;
      [0, 1, 2].forEach(function (i) { found[0].add(i); });
      totalScore = 300; elapsedBase = 47;
      playing = true;
      footNote.textContent = 'Found: The butterfly flew away! (3 of 7)';
    } else if (shotMode === 'play2') {
      levelIndex = 1;
      [0, 1].forEach(function (i) { found[1].add(i); });
      totalScore = 200; elapsedBase = 32;
      playing = true;
      footNote.textContent = 'Found: A bright star disappeared! (2 of 7)';
    } else if (shotMode === 'end') {
      levelIndex = 0;
      for (var i = 0; i < 7; i++) found[0].add(i);
      totalScore = 700; elapsedBase = 88;
      mistakes = 0; hintsUsed = 0;
      done[0] = true;
      levelScore[0] = 700 + Math.max(0, 200 - 88 * 2);
      levelTime[0] = 88;
      totalScore = levelScore[0];
      var starRow = '★★★';
      showOverlay(
        '<h2>Sunny Garden — complete!</h2>' +
        '<div class="stars">' + starRow + '</div>' +
        '<p class="score-line">Level score ' + levelScore[0] +
        ' &nbsp;·&nbsp; time 01:28 &nbsp;·&nbsp; mistakes 0</p>' +
        '<p>Flawless! Not a single wrong click.</p>' +
        '<div class="row"><button class="btn">Next — Harbor at Dusk (N)</button>' +
        '<button class="btn ghost">Replay this scene</button></div>'
      );
    }
    updateHud();
    return true;
  }

  buildTabs();
  bindKeys();
  canvasA.addEventListener('click', function (e) { onBoardClick(e, 'A'); });
  canvasB.addEventListener('click', function (e) { onBoardClick(e, 'B'); });
  hintBtn.addEventListener('click', giveHint);
  muteBtn.addEventListener('click', function () {
    var muted = window.TwinAudio.toggleMute();
    muteBtn.textContent = muted ? 'Sound: off' : 'Sound: on';
  });
  footNote.textContent = scene().tagline;
  if (!applyShot()) {
    playing = false;
    titleScreen();
  }
  updateHud();
  requestAnimationFrame(loop);
})();
