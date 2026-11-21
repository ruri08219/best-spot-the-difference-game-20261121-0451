/* Twin Tales — three hand-drawn scenes, painted fresh with Canvas 2D.
   Every scene is fixed art (no randomness, no images, no network): the left
   picture is draw(ctx, 0) and the right picture is draw(ctx, 1), which hides
   exactly seven changes. A difference is { x, y, r, name } in panel pixels
   (the panels are 596 x 360). */
(function () {
  'use strict';

  function circle(g, x, y, r, fill) {
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = fill; g.fill();
  }
  function ellipse(g, x, y, rx, ry, fill) {
    g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fillStyle = fill; g.fill();
  }
  function rect(g, x, y, w, h, fill) {
    g.fillStyle = fill; g.fillRect(x, y, w, h);
  }
  function rr(g, x, y, w, h, r, fill) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r);
    g.closePath(); g.fillStyle = fill; g.fill();
  }
  function poly(g, pts, fill) {
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.closePath(); g.fillStyle = fill; g.fill();
  }
  function line(g, x1, y1, x2, y2, color, w) {
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2);
    g.strokeStyle = color; g.lineWidth = w || 2; g.stroke();
  }
  function cloud(g, x, y, s) {
    g.fillStyle = '#ffffff';
    g.beginPath();
    g.arc(x, y, 16 * s, 0, Math.PI * 2);
    g.arc(x + 18 * s, y - 8 * s, 20 * s, 0, Math.PI * 2);
    g.arc(x + 40 * s, y, 16 * s, 0, Math.PI * 2);
    g.fill();
  }
  function tulip(g, x, y, color) {
    line(g, x, y, x, y + 26, '#2e7d32', 3);
    ellipse(g, x - 9, y + 30, 12, 4, '#2e7d32');
    ellipse(g, x + 9, y + 30, 12, 4, '#2e7d32');
    circle(g, x, y - 4, 9, color);
    poly(g, [[x - 9, y - 4], [x - 5, y - 14], [x, y - 8], [x + 5, y - 14], [x + 9, y - 4]], color);
  }
  function bird(g, x, y, s, color) {
    g.beginPath();
    g.arc(x - 7 * s, y, 7 * s, Math.PI * 1.1, Math.PI * 1.9);
    g.arc(x + 7 * s, y, 7 * s, Math.PI * 1.1, Math.PI * 1.9);
    g.strokeStyle = color || '#333333'; g.lineWidth = 2.5; g.stroke();
  }

  /* ------------------------------------------------------------------ */
  /* Level 1 — Sunny Garden                                              */
  /* ------------------------------------------------------------------ */
  function drawGarden(g, v) {
    var sky = g.createLinearGradient(0, 0, 0, 360);
    sky.addColorStop(0, '#7ec3ee'); sky.addColorStop(1, '#d9f1ff');
    rect(g, 0, 0, 596, 360, sky);
    // sun (difference 1: sunglasses in B)
    g.fillStyle = '#ffd93b';
    for (var i = 0; i < 8; i++) {
      var a = i * Math.PI / 4;
      line(g, 70 + Math.cos(a) * 42, 62 + Math.sin(a) * 42,
           70 + Math.cos(a) * 54, 62 + Math.sin(a) * 54, '#ffd93b', 4);
    }
    circle(g, 70, 62, 34, '#ffd93b');
    circle(g, 60, 56, 4, '#7a4a12'); circle(g, 80, 56, 4, '#7a4a12');
    g.beginPath(); g.arc(70, 68, 12, 0.15 * Math.PI, 0.85 * Math.PI);
    g.strokeStyle = '#7a4a12'; g.lineWidth = 3; g.stroke();
    if (v === 1) {
      rr(g, 48, 50, 18, 13, 5, '#222222'); rr(g, 74, 50, 18, 13, 5, '#222222');
      line(g, 66, 56, 74, 56, '#222222', 3);
    }
    // clouds (difference 2: the middle cloud is gone in B)
    cloud(g, 200, 48, 1); if (v === 0) cloud(g, 428, 55, 0.9); cloud(g, 520, 92, 0.7);
    // hills
    ellipse(g, 130, 400, 260, 90, '#7ec850'); ellipse(g, 480, 410, 280, 100, '#68b545');
    // house
    rect(g, 428, 190, 130, 95, '#f6e3c0');
    poly(g, [[415, 192], [493, 138], [571, 192]], '#c65b4e');
    rect(g, 478, 232, 34, 53, '#8a5a2b');
    circle(g, 506, 260, 3, '#ffd166');
    rect(g, 440, 205, 30, 30, '#bfe3f2'); line(g, 455, 205, 455, 235, '#8a5a2b', 2); line(g, 440, 220, 470, 220, '#8a5a2b', 2);
    rect(g, 520, 205, 30, 30, '#bfe3f2'); line(g, 535, 205, 535, 235, '#8a5a2b', 2); line(g, 520, 220, 550, 220, '#8a5a2b', 2);
    // tree with apples (difference 4: two apples missing in B)
    rect(g, 292, 170, 16, 70, '#7a4a12');
    circle(g, 300, 130, 46, '#3f9e4d'); circle(g, 262, 155, 34, '#57b368'); circle(g, 340, 155, 34, '#2f8f3e');
    var apples = [[278, 140], [322, 128], [300, 162], [262, 168], [338, 168]];
    apples.forEach(function (p, i) { if (v === 1 && i >= 3) return; circle(g, p[0], p[1], 6, '#e23b3b'); });
    // butterfly (difference 5: gone in B)
    if (v === 0) {
      ellipse(g, 292, 112, 9, 13, '#ff8fd1'); ellipse(g, 308, 112, 9, 13, '#ff8fd1');
      ellipse(g, 294, 126, 7, 9, '#c86bff'); ellipse(g, 306, 126, 7, 9, '#c86bff');
      line(g, 300, 106, 300, 132, '#333333', 2);
    }
    // fence (difference 6: one picket missing in B; difference 7: cat gone in B)
    rect(g, 20, 296, 556, 8, '#a9743f');
    for (var fx = 28; fx <= 560; fx += 24) {
      if (v === 1 && fx === 244) continue;
      rect(g, fx, 268, 14, 36, '#c08a4e');
      poly(g, [[fx, 268], [fx + 7, 256], [fx + 14, 268]], '#c08a4e');
    }
    if (v === 0) { // cat asleep on the fence
      ellipse(g, 352, 282, 20, 12, '#5a5a5a');
      circle(g, 370, 274, 9, '#5a5a5a');
      poly(g, [[364, 266], [367, 258], [371, 266]], '#5a5a5a');
      poly(g, [[372, 266], [376, 258], [378, 267]], '#5a5a5a');
      line(g, 334, 286, 322, 280, '#5a5a5a', 4);
    }
    // tulips along the grass (difference 3: the third tulip turns yellow in B)
    tulip(g, 90, 322, '#e23b3b');
    tulip(g, 150, 326, v === 1 ? '#ffd93b' : '#e23b3b');
    tulip(g, 205, 320, '#ff8fd1');
    tulip(g, 405, 324, '#ff8fd1');
    tulip(g, 470, 322, '#e23b3b');
    // path stones
    ellipse(g, 300, 348, 26, 7, '#e8dcc0'); ellipse(g, 340, 340, 22, 6, '#e8dcc0');
  }

  /* ------------------------------------------------------------------ */
  /* Level 2 — Harbor at Dusk                                            */
  /* ------------------------------------------------------------------ */
  function drawHarbor(g, v) {
    var sky = g.createLinearGradient(0, 0, 0, 220);
    sky.addColorStop(0, '#2c2a4a'); sky.addColorStop(0.7, '#7a4a72'); sky.addColorStop(1, '#e8825a');
    rect(g, 0, 0, 596, 220, sky);
    // stars (difference 2: the bright star by the moon is gone in B)
    [[60, 30], [150, 60], [250, 28], [350, 55], [450, 32]].forEach(function (p) {
      circle(g, p[0], p[1], 2.5, '#ffffff');
    });
    if (v === 0) {
      circle(g, 520, 48, 3.5, '#ffffff');
      line(g, 512, 48, 528, 48, '#ffffff', 1.5); line(g, 520, 40, 520, 56, '#ffffff', 1.5);
    }
    // moon
    circle(g, 505, 60, 26, '#f7ead0');
    circle(g, 497, 54, 6, '#e0cba0'); circle(g, 514, 68, 4, '#e0cba0');
    // sea
    rect(g, 0, 220, 596, 140, '#2e5f7a');
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2;
    [240, 265, 292, 320].forEach(function (y, i) {
      g.beginPath();
      for (var x = 0; x <= 596; x += 8) g.lineTo(x, y + Math.sin((x + i * 40) / 40) * 3);
      g.stroke();
    });
    // lighthouse (difference 1: its beam is off in B)
    rect(g, 66, 90, 48, 130, '#f3e9d2');
    rect(g, 66, 118, 48, 14, '#c65b4e'); rect(g, 66, 152, 48, 14, '#c65b4e'); rect(g, 66, 186, 48, 14, '#c65b4e');
    rect(g, 76, 66, 28, 26, '#333333');
    circle(g, 90, 79, 9, v === 0 ? '#ffe27a' : '#8a8a8a');
    if (v === 0) {
      g.fillStyle = 'rgba(255, 226, 122, .35)';
      poly(g, [[104, 74], [300, 40], [300, 108]], 'rgba(255, 226, 122, .35)');
    }
    // dock with crate / barrel (difference 5: crate in A, barrel in B)
    rect(g, 130, 300, 170, 14, '#8a5a2b');
    rect(g, 140, 314, 10, 46, '#6e4520'); rect(g, 280, 314, 10, 46, '#6e4520');
    if (v === 0) {
      rect(g, 168, 272, 30, 28, '#b5763a');
      line(g, 168, 281, 198, 281, '#8a5a2b', 2); line(g, 168, 290, 198, 290, '#8a5a2b', 2);
      line(g, 178, 272, 178, 300, '#8a5a2b', 2); line(g, 188, 272, 188, 300, '#8a5a2b', 2);
    } else {
      g.fillStyle = '#7a4a72';
      g.beginPath(); g.ellipse(183, 286, 15, 15, 0, 0, Math.PI * 2); g.fill();
      rect(g, 168, 278, 30, 16, '#7a4a72');
      line(g, 168, 282, 198, 282, '#5a3656', 2); line(g, 168, 290, 198, 290, '#5a3656', 2);
    }
    // big boat with sail (difference 3: red sail in A, blue in B;
    // difference 7: flag on the mast in A, gone in B)
    poly(g, [[300, 128], [300, 200], [352, 200]], v === 1 ? '#4a7ec2' : '#c65b4e');
    poly(g, [[292, 140], [292, 200], [252, 200]], '#f3e9d2');
    line(g, 300, 118, 300, 205, '#5a3a1a', 4);
    if (v === 0) poly(g, [[300, 118], [322, 124], [300, 132]], '#ffd93b');
    poly(g, [[240, 205], [368, 205], [348, 228], [260, 228]], '#8a5a2b');
    // small boat
    poly(g, [[452, 218], [452, 238], [478, 238]], '#e8dcc0');
    poly(g, [[440, 242], [492, 242], [478, 258], [454, 258]], '#6e4520');
    // seagulls (difference 4: the third gull is gone in B)
    bird(g, 350, 70, 1, '#f3e9d2'); bird(g, 395, 52, 0.8, '#f3e9d2');
    if (v === 0) bird(g, 430, 80, 0.9, '#f3e9d2');
    // fish jumping (difference 6: gone in B)
    if (v === 0) {
      g.beginPath(); g.ellipse(385, 296, 14, 6, -0.5, 0, Math.PI * 2);
      g.fillStyle = '#c9d6df'; g.fill();
      poly(g, [[372, 290], [362, 284], [366, 296]], '#c9d6df');
      circle(g, 396, 292, 2, '#222222');
    }
    // sun setting on the horizon
    circle(g, 548, 214, 22, '#ffb347');
  }

  /* ------------------------------------------------------------------ */
  /* Level 3 — Cozy Kitchen                                              */
  /* ------------------------------------------------------------------ */
  function drawKitchen(g, v) {
    rect(g, 0, 0, 596, 300, '#f2d8a7');
    rect(g, 0, 300, 596, 60, '#b07a4a');
    line(g, 0, 300, 596, 300, '#8a5a2b', 3);
    // window with curtains (difference 5: left curtain closed in B)
    rect(g, 60, 60, 130, 130, '#bfe3f2');
    circle(g, 120, 100, 22, '#ffd93b');
    cloud(g, 150, 80, 0.55);
    rect(g, 60, 60, 130, 130, 'rgba(0,0,0,0)');
    g.strokeStyle = '#8a5a2b'; g.lineWidth = 5; g.strokeRect(60, 60, 130, 130);
    line(g, 125, 60, 125, 190, '#8a5a2b', 4); line(g, 60, 125, 190, 125, '#8a5a2b', 4);
    poly(g, [[52, 52], [72, 52], [66, 196], [48, 196]], '#c65b4e');
    if (v === 0) {
      poly(g, [[198, 52], [178, 52], [184, 196], [202, 196]], '#c65b4e');
    } else {
      rect(g, 118, 52, 74, 144, '#c65b4e');
      rect(g, 118, 52, 74, 10, '#a84a3e');
    }
    // clock (difference 3: 3 o'clock in A, 5 o'clock in B)
    circle(g, 300, 62, 30, '#fbf3dd');
    g.strokeStyle = '#7a4a12'; g.lineWidth = 4;
    g.beginPath(); g.arc(300, 62, 30, 0, Math.PI * 2); g.stroke();
    circle(g, 300, 62, 3, '#7a4a12');
    line(g, 300, 62, 300, 40, '#7a4a12', 3);
    if (v === 0) line(g, 300, 62, 320, 62, '#7a4a12', 3);
    else line(g, 300, 62, 314, 76, '#7a4a12', 3);
    // picture on the wall (difference 7: sun in A, moon in B)
    rect(g, 470, 55, 66, 52, '#8a5a2b');
    rect(g, 476, 61, 54, 40, '#bfe3f2');
    if (v === 0) { circle(g, 503, 80, 11, '#ffd93b'); }
    else { circle(g, 503, 80, 11, '#f7ead0'); circle(g, 498, 77, 9, '#bfe3f2'); }
    poly(g, [[482, 98], [500, 88], [520, 98]], '#3f9e4d');
    // shelf with jars
    rect(g, 250, 150, 180, 10, '#8a5a2b');
    rr(g, 270, 118, 26, 32, 4, '#7fb069'); rr(g, 310, 112, 26, 38, 4, '#e8a100');
    rr(g, 350, 120, 26, 30, 4, '#4a7ec2'); rr(g, 390, 116, 26, 34, 4, '#c65b4e');
    // table
    rect(g, 150, 250, 320, 16, '#8a5a2b');
    rect(g, 170, 266, 14, 94, '#6e4520'); rect(g, 436, 266, 14, 94, '#6e4520');
    // teapot with steam (difference 2: steam gone in B)
    ellipse(g, 205, 222, 26, 20, '#4a7ec2');
    poly(g, [[228, 210], [248, 200], [244, 216]], '#4a7ec2');
    circle(g, 205, 200, 6, '#35608f');
    rect(g, 178, 208, 8, 20, '#35608f');
    if (v === 0) {
      g.strokeStyle = 'rgba(120,120,120,.7)'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(198, 192); g.quadraticCurveTo(192, 172, 200, 158); g.stroke();
      g.beginPath(); g.moveTo(212, 192); g.quadraticCurveTo(218, 174, 210, 160); g.stroke();
    }
    // mug (difference 6: blue in A, green in B)
    rr(g, 268, 232, 30, 26, 4, v === 1 ? '#3f9e4d' : '#4a7ec2');
    g.strokeStyle = v === 1 ? '#3f9e4d' : '#4a7ec2'; g.lineWidth = 4;
    g.beginPath(); g.arc(300, 245, 8, -Math.PI / 2, Math.PI / 2); g.stroke();
    // fruit bowl (difference 4: red apple in A, orange in B)
    g.beginPath(); g.ellipse(352, 250, 34, 12, 0, 0, Math.PI); g.fillStyle = '#c65b4e'; g.fill();
    circle(g, 336, 240, 9, '#e23b3b'); circle(g, 352, 236, 9, '#e8a100');
    circle(g, 368, 240, 9, v === 1 ? '#ff8c1a' : '#e23b3b');
    line(g, 368, 232, 372, 226, '#2e7d32', 2);
    // chair with cat (difference 1: cat gone in B)
    rect(g, 470, 250, 90, 12, '#6e4520');
    rect(g, 478, 262, 10, 98, '#6e4520'); rect(g, 542, 262, 10, 98, '#6e4520');
    rect(g, 550, 210, 10, 52, '#6e4520');
    if (v === 0) {
      ellipse(g, 508, 240, 24, 14, '#e8a100');
      circle(g, 530, 230, 10, '#e8a100');
      poly(g, [[524, 222], [527, 212], [531, 221]], '#e8a100');
      poly(g, [[533, 221], [537, 212], [539, 222]], '#e8a100');
      line(g, 486, 246, 470, 238, '#e8a100', 5);
    }
    // rug
    ellipse(g, 300, 348, 150, 12, '#c65b4e');
    ellipse(g, 300, 348, 110, 8, '#e8a100');
  }

  window.TwinScenes = [
    {
      id: 'garden', name: 'Sunny Garden', tagline: 'A cottage garden on a bright morning.',
      diffs: [
        { x: 70, y: 62, r: 26, name: 'The sun wears sunglasses' },
        { x: 428, y: 55, r: 30, name: 'A cloud went missing' },
        { x: 150, y: 322, r: 15, name: 'A tulip changed colour' },
        { x: 300, y: 150, r: 30, name: 'Two apples vanished' },
        { x: 300, y: 118, r: 18, name: 'The butterfly flew away' },
        { x: 251, y: 282, r: 13, name: 'A fence picket is missing' },
        { x: 352, y: 280, r: 20, name: 'The cat left the fence' }
      ],
      draw: drawGarden
    },
    {
      id: 'harbor', name: 'Harbor at Dusk', tagline: 'Boats coming home as the light fades.',
      diffs: [
        { x: 150, y: 90, r: 30, name: 'The lighthouse beam went out' },
        { x: 520, y: 48, r: 11, name: 'A bright star disappeared' },
        { x: 300, y: 175, r: 26, name: 'The sail changed colour' },
        { x: 430, y: 80, r: 14, name: 'A seagull flew off' },
        { x: 183, y: 286, r: 22, name: 'The crate became a barrel' },
        { x: 385, y: 296, r: 16, name: 'The jumping fish is gone' },
        { x: 308, y: 124, r: 14, name: 'The boat lost its flag' }
      ],
      draw: drawHarbor
    },
    {
      id: 'kitchen', name: 'Cozy Kitchen', tagline: 'Tea is brewing and the cat is napping.',
      diffs: [
        { x: 508, y: 238, r: 22, name: 'The cat left its chair' },
        { x: 205, y: 172, r: 16, name: 'The teapot stopped steaming' },
        { x: 300, y: 62, r: 20, name: 'The clock shows a new time' },
        { x: 368, y: 240, r: 14, name: 'An apple turned into an orange' },
        { x: 155, y: 124, r: 24, name: 'The curtain slid shut' },
        { x: 283, y: 245, r: 14, name: 'The mug changed colour' },
        { x: 503, y: 80, r: 18, name: 'The picture shows the moon now' }
      ],
      draw: drawKitchen
    }
  ];
})();
