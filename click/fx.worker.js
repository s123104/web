// fx.worker.js — OffscreenCanvas 繪製（細雷電 / 水波紋 / 文字）
// 主線只傳批次 tap 與 active pointers，避免卡頓

let ctx = null,
  canvas = null,
  width = 0,
  height = 0,
  dpr = 1,
  lowPower = false;
let config = { rippleEnabled: true, lightningEnabled: true };

const TIER = {
  1: {
    color: "#ffe6f3",
    widthMul: 1.0,
    jitterMul: 0.85,
    glow: 0.12,
    halo: 18,
    particles: 2,
    branch: 0,
    rings: 0,
  },
  2: {
    color: "#ffd9ef",
    widthMul: 1.04,
    jitterMul: 0.92,
    glow: 0.14,
    halo: 20,
    particles: 3,
    branch: 0,
    rings: 0,
  },
  3: {
    color: "#ffb2dc",
    widthMul: 1.08,
    jitterMul: 1.0,
    glow: 0.16,
    halo: 22,
    particles: 4,
    branch: 1,
    rings: 0,
  },
  4: {
    color: "#ff94d0",
    widthMul: 1.12,
    jitterMul: 1.05,
    glow: 0.18,
    halo: 24,
    particles: 5,
    branch: 1,
    rings: 1,
  },
  5: {
    color: "#f66fb9",
    widthMul: 1.18,
    jitterMul: 1.1,
    glow: 0.2,
    halo: 26,
    particles: 6,
    branch: 1,
    rings: 1,
  },
  6: {
    color: "#d9efff",
    widthMul: 1.26,
    jitterMul: 1.15,
    glow: 0.22,
    halo: 28,
    particles: 7,
    branch: 2,
    rings: 1,
  },
  7: {
    color: "#9ed9ff",
    widthMul: 1.34,
    jitterMul: 1.22,
    glow: 0.24,
    halo: 30,
    particles: 8,
    branch: 2,
    rings: 2,
  },
  8: {
    color: "#7ccaff",
    widthMul: 1.46,
    jitterMul: 1.28,
    glow: 0.27,
    halo: 32,
    particles: 9,
    branch: 2,
    rings: 2,
  },
  9: {
    color: "#52b7ff",
    widthMul: 1.6,
    jitterMul: 1.35,
    glow: 0.3,
    halo: 34,
    particles: 11,
    branch: 3,
    rings: 3,
  },
  10: {
    color: "#ffffff",
    widthMul: 1.82,
    jitterMul: 1.45,
    glow: 0.36,
    halo: 38,
    particles: 13,
    branch: 3,
    rings: 3,
  },
};

const trail = { single: [], player1: [], player2: [] }; // {x,y,ts,tier}
const ripples = []; // {x,y,start,tier}
const labels = []; // {x,y,start,txt,color,mirror}
let active = []; // [{x,y,playerId,tier}]
const TRAIL_WINDOW = 650,
  TRAIL_MAX_POINTS = 32,
  RIPPLE_MAX = 24;

let seed = 1337;
function rand() {
  seed = (seed * 1664525 + 1013904223) | 0;
  return (seed >>> 0) / 4294967296;
}

// 粉色藍色漸層顏色生成器（用於超高速TPS）
function getPinkBlueColor(time, offset = 0) {
  const phase = (time * 0.003 + offset) % 1;
  const colors = [
    { r: 246, g: 111, b: 185 }, // 粉紅 #f66fb9
    { r: 255, g: 255, b: 255 }, // 白色 #ffffff
    { r: 82, g: 183, b: 255 }, // 粉藍 #52b7ff
    { r: 246, g: 111, b: 185 }, // 回到粉紅
  ];

  const index = phase * (colors.length - 1);
  const i = Math.floor(index);
  const t = index - i;
  const c1 = colors[i];
  const c2 = colors[(i + 1) % colors.length];

  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

function resize(w, h, devicePR) {
  width = w;
  height = h;
  dpr = devicePR || 1;
  if (canvas) {
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font =
      '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  }
}
function addTap(t) {
  const arr = trail[t.playerId];
  const now = t.ts;
  arr.push({
    x: t.x,
    y: t.y,
    ts: now,
    tier: t.tier,
    ultraSpeed: t.ultraSpeed || false,
  });
  const cutoff = now - TRAIL_WINDOW;
  while (
    arr.length > 0 &&
    (arr.length > TRAIL_MAX_POINTS || arr[0].ts < cutoff)
  )
    arr.shift();

  // 漂浮數字（雙人上方玩家鏡像）
  labels.push({
    x: t.x,
    y: t.y,
    start: now,
    txt: String(increaseScore(t.playerId)),
    color: TIER[t.tier].color,
    mirror: t.mode === "dual" && t.playerId === "player1",
  });
  if (labels.length > 60) labels.splice(0, labels.length - 60);

  // 節流的水波紋（只在超高速速率 eligible 才加入）
  if (config.rippleEnabled && t.rippleEligible) {
    if (ripples.length >= RIPPLE_MAX)
      ripples.splice(0, ripples.length - RIPPLE_MAX + 1);
    ripples.push({ x: t.x, y: t.y, start: now, tier: t.tier });
  }
}
const scoreCache = { single: 0, player1: 0, player2: 0 };
function increaseScore(p) {
  return ++scoreCache[p];
}

function drawLightning() {
  if (!config.lightningEnabled) return;
  const cutoff = performance.now() - TRAIL_WINDOW;
  for (const key of Object.keys(trail)) {
    const pts = trail[key].filter((p) => p.ts >= cutoff);
    if (pts.length < 2) continue;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i],
        b = pts[i + 1];
      const dx = b.x - a.x,
        dy = b.y - a.y,
        len = Math.hypot(dx, dy);
      if (len < 6) continue;
      const nx = dx / len,
        ny = dy / len,
        px = -ny,
        py = nx;

      const c1 = TIER[a.tier],
        c2 = TIER[b.tier];
      const width = 1.1 * ((c1.widthMul + c2.widthMul) / 2);
      const amp = Math.min(
        28,
        len * 0.042 * ((c1.jitterMul + c2.jitterMul) / 2) * (lowPower ? 0.8 : 1)
      );
      const N =
        (lowPower ? 8 : 12) + Math.floor(((a.tier + b.tier) / 2 - 1) * 0.5);
      const pts2 = [];
      for (let s = 0; s <= N; s++) {
        const t = s / N,
          bx = a.x + nx * len * t,
          by = a.y + ny * len * t;
        const fall = 1 - Math.abs(2 * t - 1);
        const off = (rand() - 0.5) * 2 * amp * fall;
        pts2.push({ x: bx + px * off, y: by + py * off });
      }
      // 外光暈
      ctx.beginPath();
      ctx.moveTo(pts2[0].x, pts2[0].y);
      for (let k = 1; k < pts2.length; k++) ctx.lineTo(pts2[k].x, pts2[k].y);
      ctx.strokeStyle = `rgba(255,255,255,${0.12 + (c1.glow + c2.glow) / 2})`;
      ctx.lineWidth = width + 1.2;
      ctx.stroke();

      // 主幹（梯度）- 檢查是否為超高速模式
      const isUltraSpeed = a.ultraSpeed || b.ultraSpeed;
      let grad;

      if (isUltraSpeed) {
        // 超高速粉色藍色漸層
        grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        const now = performance.now();
        grad.addColorStop(0, getPinkBlueColor(now, 0));
        grad.addColorStop(0.33, getPinkBlueColor(now, 0.33));
        grad.addColorStop(0.66, getPinkBlueColor(now, 0.66));
        grad.addColorStop(1, getPinkBlueColor(now, 1));
      } else {
        // 原有漸層
        grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, c1.color);
        grad.addColorStop(0.5, "#ffffff");
        grad.addColorStop(1, c2.color);
      }

      ctx.beginPath();
      ctx.moveTo(pts2[0].x, pts2[0].y);
      for (let k = 1; k < pts2.length; k++) ctx.lineTo(pts2[k].x, pts2[k].y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = isUltraSpeed ? width * 1.5 : width;
      ctx.stroke();

      // 微分枝
      const branchCount = Math.min(3, Math.floor((c1.branch + c2.branch) / 2));
      if (branchCount > 0 && !lowPower) {
        for (let bidx = 0; bidx < branchCount; bidx++) {
          const mid =
            1 +
            Math.floor(((pts2.length - 2) * (bidx + 1)) / (branchCount + 1));
          const base = pts2[mid],
            dir = bidx % 2 ? 1 : -1;
          const blen = Math.min(22, 6 + len * 0.08);
          const jitter = (rand() - 0.5) * 6;
          ctx.beginPath();
          ctx.moveTo(base.x, base.y);
          ctx.lineTo(
            base.x + -ny * dir * blen + nx * jitter,
            base.y + nx * dir * blen + ny * jitter
          );
          ctx.strokeStyle = bidx % 2 ? c1.color : c2.color;
          ctx.globalAlpha = 0.7;
          ctx.lineWidth = Math.max(0.8, width * 0.7);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }
}
function drawRipples(now) {
  const next = [];
  for (const rp of ripples) {
    const conf = TIER[rp.tier];
    const dur = 680 * (1 - (rp.tier - 1) * 0.02) * (lowPower ? 1.15 : 1);
    const t = Math.min(1, (now - rp.start) / dur);
    const rings = conf.rings;
    for (let i = 0; i < rings; i++) {
      const p = Math.min(1, t + i * 0.08);
      if (p <= 0) continue;
      const r = (30 + rp.tier * 10) * p * (1 + i * 0.3);
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = conf.color;
      ctx.globalAlpha = (1 - p) * (0.55 - i * 0.12);
      ctx.lineWidth = 2 + rp.tier * 0.15 - i * 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    if (t < 1) next.push(rp);
  }
  ripples.length = 0;
  ripples.push(...next);
}
function drawHalos() {
  for (const p of active) {
    const halo = TIER[p.tier].halo;
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, halo);
    grd.addColorStop(0, TIER[p.tier].color + "cc");
    grd.addColorStop(1, TIER[p.tier].color + "00");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(p.x, p.y, halo, 0, Math.PI * 2);
    ctx.fill();
  }
}
function drawLabels(now) {
  const next = [];
  for (const lb of labels) {
    const t = Math.min(1, (now - lb.start) / 1000);
    const y = lb.y - 46 * t;
    ctx.save();
    if (lb.mirror) {
      ctx.translate(lb.x, y);
      ctx.rotate(Math.PI);
      ctx.translate(-lb.x, -y);
    }
    ctx.fillStyle = lb.color;
    ctx.globalAlpha = 0.9 - 0.9 * t;
    ctx.fillText(lb.txt, lb.x, y);
    ctx.restore();
    if (t < 1) next.push(lb);
  }
  labels.length = 0;
  labels.push(...next);
}

let lastFrame = 0,
  targetFps = 60;
function draw(ts) {
  if (!ctx) return;
  const now = performance.now();
  if (now - lastFrame < 1000 / targetFps) {
    requestAnimationFrame(draw);
    return;
  }
  lastFrame = now;

  ctx.clearRect(0, 0, width, height);
  drawHalos();
  if (config.lightningEnabled) drawLightning();
  if (config.rippleEnabled) drawRipples(now);
  drawLabels(now);

  requestAnimationFrame(draw);
}

self.addEventListener("message", (e) => {
  const data = e.data;
  if (data.type === "init") {
    canvas = data.canvas;
    ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    lowPower = !!data.lowPower;
    dpr = data.dpr || 1;
    requestAnimationFrame(draw);
  } else if (data.type === "init-fallback") {
    // 需要時可改為回傳繪製指令到主線（此專案用不到）
  } else if (data.type === "resize") {
    resize(data.width, data.height, data.dpr);
  } else if (data.type === "config") {
    config.rippleEnabled = !!data.rippleEnabled;
    config.lightningEnabled = !!data.lightningEnabled;
  } else if (data.type === "batch") {
    for (const t of data.taps) {
      addTap(t);
    }
  } else if (data.type === "active") {
    active = data.active || [];
  } else if (data.type === "fps") {
    targetFps = data.value || 60;
  }
});

const requestAnimationFrame = (fn) => {
  return (
    self.requestAnimationFrame ||
    ((cb) => setTimeout(() => cb(performance.now()), 1000 / 60))
  )(fn);
};
