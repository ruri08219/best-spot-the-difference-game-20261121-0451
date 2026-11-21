/* Twin Tales — tiny WebAudio synth. No audio files, everything is generated. */
(function () {
  'use strict';
  var ctx = null;
  var muted = false;

  function ac() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, at, dur, type, vol) {
    var c = ac();
    if (!c || muted) return;
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, c.currentTime + at);
    g.gain.setValueAtTime(0.0001, c.currentTime + at);
    g.gain.exponentialRampToValueAtTime(vol || 0.16, c.currentTime + at + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + at + dur);
    o.connect(g); g.connect(c.destination);
    o.start(c.currentTime + at);
    o.stop(c.currentTime + at + dur + 0.05);
  }

  window.TwinAudio = {
    click: function () { tone(520, 0, 0.07, 'triangle', 0.08); },
    correct: function () { tone(659, 0, 0.12, 'sine', 0.18); tone(988, 0.09, 0.22, 'sine', 0.18); },
    wrong: function () { tone(160, 0, 0.18, 'sawtooth', 0.10); tone(110, 0.05, 0.22, 'sawtooth', 0.08); },
    hint: function () { tone(440, 0, 0.1, 'sine', 0.12); tone(587, 0.08, 0.16, 'sine', 0.12); },
    levelWin: function () {
      [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.11, 0.22, 'triangle', 0.16); });
    },
    gameWin: function () {
      [523, 659, 784, 1047, 784, 1047, 1319].forEach(function (f, i) { tone(f, i * 0.12, 0.26, 'triangle', 0.16); });
    },
    toggleMute: function () {
      muted = !muted;
      return muted;
    },
    isMuted: function () { return muted; }
  };
})();
