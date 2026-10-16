// 스킬이 실행 직전에 아래 두 자리표시자를 JSON으로 바꿔 넣는다
var BRAND  = __BRAND__;
var SLIDES = __SLIDES__;

// ─── Colors ──────────────────────────────────────────────────────────────────
// 대표색 하나(BRAND.accent)에서 나머지 톤을 계산한다
function hex(h) {
  h = h.replace('#', '');
  return { r: parseInt(h.substr(0, 2), 16) / 255, g: parseInt(h.substr(2, 2), 16) / 255, b: parseInt(h.substr(4, 2), 16) / 255 };
}
function shade(c, k) { return { r: c.r * k, g: c.g * k, b: c.b * k }; }
function tint(c, k)  { return { r: c.r + (1 - c.r) * k, g: c.g + (1 - c.g) * k, b: c.b + (1 - c.b) * k }; }

var ACCENT = hex(BRAND.accent || '#7c3aed');
var C = {
  base:        { r: 0.055, g: 0.055, b: 0.063 },
  baseMid:     { r: 0.082, g: 0.075, b: 0.106 },
  purple:      ACCENT,
  purpleGlow:  shade(ACCENT, 0.5),
  purpleLight: tint(ACCENT, 0.4),
  purpleDim:   shade(ACCENT, 0.43),
  cream:       { r: 0.941, g: 0.925, b: 1.000 },
  creamDim:    { r: 0.545, g: 0.518, b: 0.627 },
  white:       { r: 1.000, g: 1.000, b: 1.000 },
};

// ─── Layout ──────────────────────────────────────────────────────────────────
var SIZE   = 1080;
var SIZE_H = 1350;
var PAD    = 72;
var W      = SIZE - PAD * 2;   // 936

// ─── Fonts ───────────────────────────────────────────────────────────────────
var FONT_FAM = 'Noto Sans KR';

function fReg()  { return { family: FONT_FAM, style: 'Regular' }; }
function fMed()  { return { family: FONT_FAM, style: 'Medium'  }; }
function fBold() { return { family: FONT_FAM, style: 'Bold'    }; }

async function loadFonts() {
  var candidates = ['Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic'];
  for (var i = 0; i < candidates.length; i++) {
    var fam = candidates[i];
    try {
      await figma.loadFontAsync({ family: fam, style: 'Regular' });
      await figma.loadFontAsync({ family: fam, style: 'Bold'    }).catch(function(e) { return null; });
      await figma.loadFontAsync({ family: fam, style: 'Medium'  }).catch(function(e) { return null; });
      FONT_FAM = fam;
      return;
    } catch(e) { /* next */ }
  }
  throw new Error('한국어 폰트를 찾을 수 없어요.\nFigma에서 Noto Sans KR을 추가해주세요.');
}


// ─── Helpers ─────────────────────────────────────────────────────────────────

function sf(color) {
  return [{ type: 'SOLID', color: { r: color.r, g: color.g, b: color.b } }];
}

function sfAlpha(color, alpha) {
  return [{ type: 'SOLID', color: { r: color.r, g: color.g, b: color.b }, opacity: alpha }];
}

function getLineRanges(text) {
  var lines = text.split('\n');
  var ranges = [];
  var pos = 0;
  for (var i = 0; i < lines.length; i++) {
    ranges.push({ start: pos, end: pos + lines[i].length });
    pos += lines[i].length + 1;
  }
  return ranges;
}

function contentStartY(kind) {
  if (kind === 'cta')    return 460;
  if (kind === 'step')   return 420;
  if (kind === 'course') return 360;
  if (kind === 'hook')   return 500;
  return 520;
}

// ─── Element Builders ────────────────────────────────────────────────────────

function buildBg(frame, kind, imageHash) {
  var rect = figma.createRectangle();
  rect.resize(SIZE, SIZE_H);
  rect.x = 0; rect.y = 0;

  if (kind === 'cta') {
    rect.fills = [{ type: 'SOLID', color: C.purple }];
  } else if (kind === 'before') {
    rect.fills = [
      { type: 'SOLID', color: C.baseMid },
      {
        type: 'GRADIENT_RADIAL',
        gradientTransform: [[1.0, 0, -0.35], [0, 1.0, -0.44]],
        gradientStops: [
          { color: { r: ACCENT.r * 0.3, g: ACCENT.g * 0.3, b: ACCENT.b * 0.3, a: 0.8 }, position: 0 },
          { color: { r: 0.082, g: 0.075, b: 0.106, a: 0 }, position: 1 },
        ],
      },
    ];
  } else {
    var fills = [{ type: 'SOLID', color: C.base }];
    if (imageHash) {
      fills.push({ type: 'IMAGE', scaleMode: 'FILL', imageHash: imageHash, opacity: 0.18 });
    }
    fills.push({
      type: 'GRADIENT_RADIAL',
      gradientTransform: [[1.40, 0, 0.15], [0, 1.10, -0.50]],
      gradientStops: [
        { color: { r: C.purpleGlow.r, g: C.purpleGlow.g, b: C.purpleGlow.b, a: 1.0 }, position: 0 },
        { color: { r: C.purpleGlow.r, g: C.purpleGlow.g, b: C.purpleGlow.b, a: 0.0 }, position: 1 },
      ],
    });
    rect.fills = fills;
  }
  frame.appendChild(rect);
}

async function buildTopBar(frame, kind, idx, total) {
  // 브랜드 로고는 콘텐츠에 넣지 않음 — 슬라이드 번호만 표시
  // Slide number — top right
  var numStr = (idx + 1).toString().padStart(2, '0') + ' / ' + total.toString().padStart(2, '0');
  var num = figma.createText();
  num.fontName = fReg();
  num.fontSize = 18;
  num.characters = numStr;
  num.fills = kind === 'cta' ? sfAlpha(C.purpleLight, 0.7) : sf(C.creamDim);
  num.textAutoResize = 'WIDTH_AND_HEIGHT';
  num.x = SIZE - PAD - num.width;
  num.y = 62;
  frame.appendChild(num);
}

// Eyebrow pill
async function buildEyebrow(frame, text, yPos, kind) {
  var useSolidPill = (kind === 'course' || kind === 'before' || kind === 'after' || kind === 'cta');
  var pillBg = kind === 'before' ? C.purpleDim
             : kind === 'after'  ? C.purple
             : kind === 'cta'    ? shade(ACCENT, 0.32)
             : C.purpleDim;

  var t = figma.createText();
  t.fontName = fMed();
  t.fontSize = 21;
  t.fills = kind === 'cta' ? sfAlpha(C.cream, 0.85) : sf(C.purpleLight);
  t.textAutoResize = 'WIDTH_AND_HEIGHT';
  t.x = PAD + 16;
  t.y = yPos;
  frame.appendChild(t);
  t.characters = text;

  var px = 16, ph = 36;
  var pw = t.width + px * 2;

  var pill = figma.createRectangle();
  pill.resize(pw, ph);
  pill.cornerRadius = 18;
  pill.fills = useSolidPill ? sf(pillBg) : [{ type: 'SOLID', color: C.purpleDim, opacity: 0.6 }];
  pill.x = PAD;
  pill.y = yPos;
  frame.insertChild(frame.children.length - 1, pill);

  t.y = yPos + Math.floor((ph - t.height) / 2);

  return ph + 22;
}

// Large headline with per-line purple accent
async function buildHeadline(frame, text, purpleLines, yPos, kind) {
  var isCta = kind === 'cta';
  var charCount = text.replace(/\n/g, '').length;
  var lineCount = text.split('\n').length;
  var fs = charCount < 15 ? 84
         : charCount < 28 ? 74
         : charCount < 42 ? 66
         : 58;

  var t = figma.createText();
  t.fontName = fBold();
  t.fontSize = fs;
  t.lineHeight = { value: 128, unit: 'PERCENT' };
  t.fills = sf(isCta ? C.white : C.cream);
  t.resize(W, 100);
  t.textAutoResize = 'HEIGHT';
  t.x = PAD;
  t.y = yPos;
  frame.appendChild(t);
  t.characters = text;

  if (purpleLines && purpleLines.length > 0) {
    var ranges = getLineRanges(text);
    for (var i = 0; i < purpleLines.length; i++) {
      var li = purpleLines[i];
      if (ranges[li]) {
        t.setRangeFills(ranges[li].start, ranges[li].end, sf(C.purpleLight));
      }
    }
  }
  return t.height;
}

// Short divider line
function buildDivider(frame, yPos, kind) {
  var line = figma.createRectangle();
  line.resize(48, 3);
  line.cornerRadius = 2;
  line.fills = kind === 'cta' ? sfAlpha(C.purpleLight, 0.6) : sf(C.purple);
  line.x = PAD;
  line.y = yPos;
  frame.appendChild(line);
  return 22;
}

// Body text
async function buildBody(frame, text, yPos, kind) {
  var isCta = kind === 'cta';
  var t = figma.createText();
  t.fontName = fReg();
  t.fontSize = 27;
  t.lineHeight = { value: 170, unit: 'PERCENT' };
  t.fills = isCta ? sfAlpha(C.cream, 0.85) : sf(C.creamDim);
  t.resize(W, 100);
  t.textAutoResize = 'HEIGHT';
  t.x = PAD;
  t.y = yPos;
  frame.appendChild(t);
  t.characters = text;
  return t.height;
}

// Bullet list with dot
async function buildBullets(frame, items, yPos, kind) {
  var y = yPos;
  var isCta = kind === 'cta';
  for (var i = 0; i < items.length; i++) {
    var dot = figma.createEllipse();
    dot.resize(6, 6);
    dot.x = PAD + 1;
    dot.y = y + 13;
    dot.fills = isCta ? sfAlpha(C.purpleLight, 0.7) : sf(C.purple);
    frame.appendChild(dot);

    var t = figma.createText();
    t.fontName = fReg();
    t.fontSize = 25;
    t.lineHeight = { value: 160, unit: 'PERCENT' };
    t.fills = isCta ? sfAlpha(C.cream, 0.8) : sf(C.creamDim);
    t.resize(W - 24, 100);
    t.textAutoResize = 'HEIGHT';
    t.x = PAD + 20;
    t.y = y;
    frame.appendChild(t);
    t.characters = items[i];
    y += t.height + 8;
  }
  return y - yPos;
}

// Stat cards row
async function buildStats(frame, stats, yPos) {
  var gap = 14;
  var cardW = Math.floor((W - gap * (stats.length - 1)) / stats.length);
  var cardH = 108;
  var x = PAD;

  for (var i = 0; i < stats.length; i++) {
    var card = figma.createRectangle();
    card.resize(cardW, cardH);
    card.cornerRadius = 12;
    card.fills = [{ type: 'SOLID', color: shade(ACCENT, 0.17) }];
    card.x = x; card.y = yPos;
    frame.appendChild(card);

    var vt = figma.createText();
    vt.fontName = fBold();
    vt.fontSize = 34;
    vt.fills = sf(C.purpleLight);
    vt.textAutoResize = 'WIDTH_AND_HEIGHT';
    vt.x = x; vt.y = yPos + 16;
    frame.appendChild(vt);
    vt.characters = stats[i].v;
    vt.x = x + Math.floor((cardW - vt.width) / 2);

    var lt = figma.createText();
    lt.fontName = fReg();
    lt.fontSize = 18;
    lt.fills = sf(C.creamDim);
    lt.textAutoResize = 'WIDTH_AND_HEIGHT';
    lt.x = x; lt.y = yPos + 58;
    frame.appendChild(lt);
    lt.characters = stats[i].l;
    lt.x = x + Math.floor((cardW - lt.width) / 2);

    x += cardW + gap;
  }
  return cardH + 16;
}

// ─── Main Slide Builder ───────────────────────────────────────────────────────

async function buildSlide(slide, idx, total, imageHash) {
  var kind      = slide.kind;
  var eyebrow   = slide.eyebrow   || null;
  var badge     = slide.badge     || null;
  var headline  = slide.headline  || '';
  var purpleLns = slide.purpleLines || [];
  var body      = slide.body      || null;
  var bullets   = slide.bullets   || null;
  var stats     = slide.stats     || null;
  var stepNum   = slide.stepNum   || null;

  var frame = figma.createFrame();
  frame.resize(SIZE, SIZE_H);
  frame.clipsContent = true;
  frame.name = 'Slide ' + (idx + 1) + (kind === 'hook' ? ' — 훅' : kind === 'cta' ? ' — CTA' : ' — ' + kind);

  buildBg(frame, kind, imageHash || null);
  await buildTopBar(frame, kind, idx, total);

  var y = contentStartY(kind);

  // Large step number
  if (stepNum) {
    var sn = figma.createText();
    sn.fontName = fBold();
    sn.fontSize = 96;
    sn.lineHeight = { value: 100, unit: 'PERCENT' };
    sn.characters = stepNum;
    sn.fills = sf(C.purple);
    sn.textAutoResize = 'WIDTH_AND_HEIGHT';
    sn.x = PAD;
    sn.y = y;
    frame.appendChild(sn);
    y += sn.height + 18;
  }

  // Eyebrow or badge pill
  var labelText = eyebrow || badge;
  if (labelText) {
    y += await buildEyebrow(frame, labelText, y, kind);
  }

  // Headline
  if (headline) {
    var hh = await buildHeadline(frame, headline, purpleLns, y, kind);
    y += hh + 18;
  }

  // Divider
  if (kind !== 'cta' && kind !== 'hook' && kind !== 'step') {
    y += buildDivider(frame, y, kind);
  }

  // Body
  if (body) {
    var bh = await buildBody(frame, body, y, kind);
    y += bh + 14;
  }

  // Bullets
  if (bullets && bullets.length > 0) {
    y += await buildBullets(frame, bullets, y, kind);
  }

  // Stats
  if (stats && stats.length > 0) {
    y += await buildStats(frame, stats, y + 8);
  }

  // CTA arrow line decoration
  if (kind === 'cta') {
    var arr = figma.createRectangle();
    arr.resize(44, 3);
    arr.cornerRadius = 2;
    arr.fills = sfAlpha(C.purpleLight, 0.5);
    arr.x = PAD;
    arr.y = SIZE_H - 80;
    frame.appendChild(arr);
  }

  return frame;
}


// ─── Run ─────────────────────────────────────────────────────────────────────
await loadFonts();

// 기존 노드 오른쪽 빈 곳부터 나란히 배치
var startX = 0;
var kids = figma.currentPage.children;
for (var k = 0; k < kids.length; k++) {
  startX = Math.max(startX, kids[k].x + kids[k].width + 200);
}

var ids = [];
for (var i = 0; i < SLIDES.length; i++) {
  var f = await buildSlide(SLIDES[i], i, SLIDES.length, null);
  f.x = startX + i * (SIZE + 40);
  f.y = 0;
  figma.currentPage.appendChild(f);
  ids.push(f.id);
}
return { createdNodeIds: ids, font: FONT_FAM };
