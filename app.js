/**
 * TradeFlow CRM · Académie Pro Trader
 * Moteur d'application interactif & simulateurs
 */

// =============================================================================
// 1. GESTION DU SON VIA WEB AUDIO API (AUCUNE DÉPENDANCE EXTERNE)
// =============================================================================

let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx?.resume();
    }
    const now = audioCtx.currentTime;

    if (type === 'click') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'win') {
      // Accord ascendant triomphant (Do - Mi - Sol)
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.06, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.35);
      });
    } else if (type === 'loss') {
      // Son descendant de stop touché
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'alert') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    // Audio context may require user interaction
  }
}

// =============================================================================
// 2. ÉTAT GLOBAL DE L'APPLICATION (PERSISTÉ DANS LOCALSTORAGE)
// =============================================================================

const STORAGE_KEY = 'tradeflow_crm_state_v1';

const defaultState = {
  capital: 100000,
  xp: 150,
  level: "Niv. 1 · Novice",
  discipline: 100,
  modules: {
    mod1: false,
    mod2: false,
    mod3: false,
    mod4: false,
    mod5: false
  },
  scores: {
    mod1: 0,
    mod2: 0,
    mod3: 0,
    mod4: 0,
    mod5: 0
  },
  deals: [
    {
      id: "deal-1",
      asset: "EUR/USD",
      direction: "ACHAT (LONG)",
      entry: 1.0840,
      sl: 1.0815,
      tp: 1.0920,
      rr: "1 : 3.2",
      setup: "Retest Support 4H + Marteau de rejet",
      column: "active"
    },
    {
      id: "deal-2",
      asset: "BTC/USD",
      direction: "ACHAT (LONG)",
      entry: 94500,
      sl: 92800,
      tp: 99600,
      rr: "1 : 3.0",
      setup: "Cassure de Flag Haussier journalier",
      column: "qualified"
    },
    {
      id: "deal-3",
      asset: "NVDA",
      direction: "VENTE (SHORT)",
      entry: 142.50,
      sl: 145.00,
      tp: 135.00,
      rr: "1 : 3.0",
      setup: "Double Sommet sous résistance majeure",
      column: "prospect"
    },
    {
      id: "deal-4",
      asset: "GOLD (XAU/USD)",
      direction: "ACHAT (LONG)",
      entry: 2680.00,
      sl: 2665.00,
      tp: 2725.00,
      rr: "1 : 3.0",
      setup: "Rejet zone de liquidité 1H",
      column: "won"
    }
  ]
};

let appState = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Erreur de chargement state:", e);
  }
  return JSON.parse(JSON.stringify(defaultState));
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.error("Erreur de sauvegarde state:", e);
  }
  updateTopMetricsUI();
  updateSidebarProgress();
  updateCertificateUI();
}

function addXP(amount) {
  appState.xp += amount;
  if (appState.xp < 300) {
    appState.level = "Niv. 1 · Novice";
  } else if (appState.xp < 600) {
    appState.level = "Niv. 2 · Analyste Junior";
  } else if (appState.xp < 950) {
    appState.level = "Niv. 3 · Gestionnaire de Risque";
  } else if (appState.xp < 1300) {
    appState.level = "Niv. 4 · Trader Institutionnel";
  } else {
    appState.level = "Niv. 5 · Master Trader OS";
  }
  playSound('win');
  saveState();
}

// =============================================================================
// 3. NAVIGATION ET INTERFACE
// =============================================================================

function switchTab(tabId) {
  playSound('click');
  document.querySelectorAll('.content-tab').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

  const targetTab = document.getElementById(tabId);
  if (targetTab) {
    targetTab.classList.add('active');
  }

  const targetNav = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
  if (targetNav) {
    targetNav.classList.add('active');
  }

  // Si on ouvre le module technique, redessiner le canvas
  if (tabId === 'tab-module-technical') {
    setTimeout(drawTechnicalChart, 50);
  }
  if (tabId === 'tab-module-risk') {
    setTimeout(calculatePositionSize, 50);
  }
  if (tabId === 'tab-module-orderflow') {
    setTimeout(renderDomLadder, 50);
  }
}

function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      if (tabId) switchTab(tabId);
    });
  });

  // Sound toggle button
  const soundBtn = document.getElementById('btn-toggle-sound');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      const label = document.getElementById('sound-label');
      if (label) {
        label.innerText = soundEnabled ? 'Audio FX' : 'Muet';
      }
      soundBtn.classList.toggle('btn-primary', soundEnabled);
      soundBtn.classList.toggle('btn-ghost', !soundEnabled);
      if (soundEnabled) playSound('click');
    });
  }

  // Quick new deal
  const newDealBtn = document.getElementById('btn-quick-new-deal');
  if (newDealBtn) {
    newDealBtn.addEventListener('click', openNewDealModal);
  }

  // Today's date
  const dateEl = document.getElementById('date-display');
  if (dateEl) {
    const now = new Date();
    dateEl.innerText = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}

function updateTopMetricsUI() {
  const capEl = document.getElementById('top-capital');
  const discEl = document.getElementById('top-discipline');
  const levelEl = document.getElementById('top-level');
  const xpBar = document.getElementById('top-xp-bar');
  const xpText = document.getElementById('top-xp-text');
  const dashCap = document.getElementById('dash-capital');

  if (capEl) capEl.innerText = appState.capital.toLocaleString('fr-FR') + " $";
  if (dashCap) dashCap.innerText = appState.capital.toLocaleString('fr-FR') + " $";
  if (discEl) discEl.innerText = appState.discipline + "%";
  if (levelEl) levelEl.innerText = appState.level;

  if (xpBar && xpText) {
    const maxXP = 1500;
    const pct = Math.min(100, Math.round((appState.xp / maxXP) * 100));
    xpBar.style.width = pct + '%';
    xpText.innerText = `${appState.xp} / ${maxXP} XP`;
  }
}

function updateSidebarProgress() {
  const mods = appState.modules;
  let count = 0;
  if (mods.mod1) { count++; document.getElementById('status-mod1')?.classList.add('done'); }
  if (mods.mod2) { count++; document.getElementById('status-mod2')?.classList.add('done'); }
  if (mods.mod3) { count++; document.getElementById('status-mod3')?.classList.add('done'); }
  if (mods.mod4) { count++; document.getElementById('status-mod4')?.classList.add('done'); }
  if (mods.mod5) { count++; document.getElementById('status-mod5')?.classList.add('done'); }

  const pct = Math.round((count / 5) * 100);
  const fill = document.getElementById('sidebar-progress-fill');
  const score = document.getElementById('sidebar-total-score');
  const sub = document.getElementById('sidebar-progress-sub');

  if (fill) fill.style.width = pct + '%';
  if (score) score.innerText = pct + '%';
  if (sub) sub.innerText = `${count}/5 modules validés`;

  // Pipeline count
  const pipeCount = document.getElementById('sidebar-pipeline-count');
  if (pipeCount) pipeCount.innerText = appState.deals.length;
}

// =============================================================================
// 4. MODULE 1 : ANALYSE TECHNIQUE (CHART CANVAS & PATTERN SCANNER)
// =============================================================================

let techChartState = {
  direction: 'BUY',
  entry: 1.0842,
  sl: 1.0820,
  tp: 1.0910,
  candles: [],
  isSimulating: false,
  resistance: 1.0850,
  support: 1.0800
};

function generateInitialCandles() {
  const candles = [];
  let price = 1.0810;
  // Générer 24 bougies réalistes formant un triangle ascendant sous résistance
  for (let i = 0; i < 24; i++) {
    const noise = (Math.random() - 0.45) * 0.0012;
    price += noise;
    // Bloquer sous résistance
    if (price > 1.0850) price = 1.0848 - Math.random() * 0.0006;
    // Tendance des creux plus hauts (triangle ascendant)
    const minFloor = 1.0800 + (i * 0.00015);
    if (price < minFloor) price = minFloor + 0.0004;

    const open = price;
    const close = open + (Math.random() - 0.48) * 0.0008;
    const high = Math.max(open, close) + Math.random() * 0.0005;
    const low = Math.min(open, close) - Math.random() * 0.0005;
    candles.push({ open, high, low, close });
  }
  techChartState.candles = candles;
}

function drawTechnicalChart() {
  const canvas = document.getElementById('canvas-technical');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Background
  ctx.fillStyle = '#090e17';
  ctx.fillRect(0, 0, w, h);

  // Grille subtile
  ctx.strokeStyle = '#151e2e';
  ctx.lineWidth = 1;
  for (let y = 30; y < h; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  for (let x = 60; x < w; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  const candles = techChartState.candles;
  if (!candles || candles.length === 0) return;

  // Calcul Min / Max prix
  let minP = 1.0790;
  let maxP = 1.0930;

  function priceToY(p) {
    return h - ((p - minP) / (maxP - minP)) * (h - 40) - 20;
  }

  // Tracer la résistance clé (1.0850)
  const resY = priceToY(techChartState.resistance);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(0, resY);
  ctx.lineTo(w, resY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#f59e0b';
  ctx.font = '10px "JetBrains Mono"';
  ctx.fillText('RÉSISTANCE MAJEURE 1.0850', 14, resY - 6);

  // Tracer ligne de tendance ascendante (supports de creux)
  const suppStart = priceToY(1.0800);
  const suppEnd = priceToY(1.0838);
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(40, suppStart);
  ctx.lineTo(w - 180, suppEnd);
  ctx.stroke();
  ctx.fillStyle = '#3b82f6';
  ctx.fillText('Trendline Ascendante (Creux plus hauts)', 45, suppStart - 8);

  // Tracer les chandeliers
  const candleW = 12;
  const gap = (w - 100) / (candles.length + 6);

  candles.forEach((c, i) => {
    const x = 30 + i * gap;
    const isBull = c.close >= c.open;
    const color = isBull ? '#10b981' : '#ef4444';

    const yOpen = priceToY(c.open);
    const yClose = priceToY(c.close);
    const yHigh = priceToY(c.high);
    const yLow = priceToY(c.low);

    // Mèche
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + candleW / 2, yHigh);
    ctx.lineTo(x + candleW / 2, yLow);
    ctx.stroke();

    // Corps
    ctx.fillStyle = color;
    const bodyTop = Math.min(yOpen, yClose);
    const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
    ctx.fillRect(x, bodyTop, candleW, bodyHeight);
  });

  // Tracer les niveaux utilisateur (Entry, SL, TP)
  const entryY = priceToY(techChartState.entry);
  const slY = priceToY(techChartState.sl);
  const tpY = priceToY(techChartState.tp);

  // Take profit line
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(w - 240, tpY);
  ctx.lineTo(w, tpY);
  ctx.stroke();
  ctx.fillStyle = '#10b981';
  ctx.fillText(`TAKE PROFIT (TP): ${techChartState.tp.toFixed(4)}`, w - 210, tpY - 6);

  // Entry line
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w - 240, entryY);
  ctx.lineTo(w, entryY);
  ctx.stroke();
  ctx.fillStyle = '#3b82f6';
  ctx.fillText(`ENTRÉE (FILL): ${techChartState.entry.toFixed(4)}`, w - 210, entryY - 6);

  // Stop loss line
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(w - 240, slY);
  ctx.lineTo(w, slY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#ef4444';
  ctx.fillText(`STOP LOSS (SL): ${techChartState.sl.toFixed(4)}`, w - 210, slY - 6);
}

function setTechDirection(dir) {
  techChartState.direction = dir;
  document.getElementById('btn-dir-buy')?.classList.toggle('active', dir === 'BUY');
  document.getElementById('btn-dir-sell')?.classList.toggle('active', dir === 'SELL');
  playSound('click');
  updateTechLevels();
}

function updateTechLevels() {
  const slInput = document.getElementById('input-tech-sl');
  const tpInput = document.getElementById('input-tech-tp');
  if (slInput) techChartState.sl = parseFloat(slInput.value);
  if (tpInput) techChartState.tp = parseFloat(tpInput.value);

  const entry = techChartState.entry;
  const sl = techChartState.sl;
  const tp = techChartState.tp;

  let risk = Math.abs(entry - sl);
  let reward = Math.abs(tp - entry);
  let rrRatio = (reward / (risk || 0.0001)).toFixed(2);

  const rrEl = document.getElementById('display-tech-rr');
  if (rrEl) {
    rrEl.innerText = `1 : ${rrRatio}`;
    rrEl.style.color = rrRatio >= 2 ? '#34d399' : '#f87171';
  }

  drawTechnicalChart();
}

function resetTechChart() {
  generateInitialCandles();
  const banner = document.getElementById('tech-result-banner');
  if (banner) banner.classList.add('hidden');
  drawTechnicalChart();
  playSound('click');
}

function triggerTechSimulation() {
  if (techChartState.isSimulating) return;
  techChartState.isSimulating = true;
  playSound('alert');

  const banner = document.getElementById('tech-result-banner');
  if (banner) {
    banner.className = 'alert-box alert-info mt-3';
    banner.innerHTML = '⚡ <strong>Simulation en cours...</strong> Observation de la cassure de résistance et du retest bougie par bougie...';
    banner.classList.remove('hidden');
  }

  let step = 0;
  const simInterval = setInterval(() => {
    step++;
    const last = techChartState.candles[techChartState.candles.length - 1];
    
    // Scénario haussier avec breakout
    let nextOpen = last.close;
    let nextClose = nextOpen + 0.0009 + (Math.random() - 0.3) * 0.0006;
    let nextHigh = Math.max(nextOpen, nextClose) + Math.random() * 0.0004;
    let nextLow = Math.min(nextOpen, nextClose) - Math.random() * 0.0003;

    techChartState.candles.push({
      open: nextOpen,
      close: nextClose,
      high: nextHigh,
      low: nextLow
    });

    drawTechnicalChart();

    if (nextHigh >= techChartState.tp || step >= 6) {
      clearInterval(simInterval);
      techChartState.isSimulating = false;
      
      const isWinner = (techChartState.direction === 'BUY' && nextHigh >= techChartState.tp);
      if (isWinner) {
        playSound('win');
        appState.capital += 3200;
        appState.modules.mod1 = true;
        appState.scores.mod1 = 250;
        addXP(250);
        document.getElementById('score-mod1').innerText = "250 / 250 XP";

        if (banner) {
          banner.className = 'alert-box alert-success mt-3';
          banner.innerHTML = `🎉 <strong>EXCELLENTE EXÉCUTION INSTITUTIONNELLE !</strong><br>
          Le Breakout de la résistance à 1.0850 a fonctionné avec force. Le Take Profit a été atteint à 1.0910 avec un gain de <strong>+3 200 $ (+3.2 R)</strong>.<br>
          <em>Module 1 validé avec succès (+250 XP).</em>`;
        }
      } else {
        playSound('loss');
        if (banner) {
          banner.className = 'alert-box alert-warning mt-3';
          banner.innerHTML = `⚠️ <strong>Résultat Neutre ou Stop Touché :</strong> Analysez le sens choisi (Long vs Short) et l'espace donné au Stop Loss. Cliquez sur 'Recharger un Scénario' pour recommencer.`;
        }
      }
      saveState();
    }
  }, 350);
}

function answerTechQuiz(choice) {
  const feedback = document.getElementById('quiz-tech-feedback');
  if (!feedback) return;
  feedback.classList.remove('hidden');

  if (choice === 2) {
    feedback.className = 'quiz-feedback alert-box alert-success';
    feedback.innerHTML = `✅ <strong>Parfait ! Réponse C :</strong> Attendre le retest de la résistance cassée (qui devient support) évite d'acheter le sommet d'une impulsion (éviter le FOMO).`;
    playSound('win');
    addXP(50);
  } else {
    feedback.className = 'quiz-feedback alert-box alert-danger';
    feedback.innerHTML = `❌ <strong>Erreur classique :</strong> Acheter au marché en plein breakout vous expose à une fausse cassure (Bull Trap). La discipline CRM impose d'attendre la confirmation sur le retest.`;
    playSound('loss');
  }
}

// =============================================================================
// 5. MODULE 2 : RISQUE & DIMENSIONNEMENT (CALCULATEUR & DRAWDOWN)
// =============================================================================

function calculatePositionSize() {
  const capInput = document.getElementById('risk-capital');
  const pctInput = document.getElementById('risk-percent');
  const slInput = document.getElementById('risk-sl-pips');

  if (!capInput || !pctInput || !slInput) return;

  const capital = parseFloat(capInput.value) || 100000;
  const riskPct = parseFloat(pctInput.value) || 1.0;
  const slPips = parseFloat(slInput.value) || 25;

  document.getElementById('risk-percent-val').innerText = `${riskPct.toFixed(1)}%`;

  // Montant à risquer
  const cashRisk = capital * (riskPct / 100);
  // Valeur par pip pour 1 lot standard sur EUR/USD = 10$
  const pipValuePerLot = 10.0;
  // Lots = Risque / (Pips * Valeur du Pip)
  const lotSize = cashRisk / (slPips * pipValuePerLot);

  document.getElementById('risk-cash-loss').innerText = `${cashRisk.toLocaleString('fr-FR')} $`;
  document.getElementById('risk-lot-size').innerText = `${lotSize.toFixed(2)} Lots`;
}

function runDrawdownCrashTest() {
  playSound('alert');
  const canvas = document.getElementById('canvas-equity');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Background
  ctx.fillStyle = '#090e17';
  ctx.fillRect(0, 0, w, h);

  // Grille
  ctx.strokeStyle = '#151e2e';
  ctx.lineWidth = 1;
  for (let y = 20; y < h; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Simulation de 20 trades avec série de pertes inévitable
  // 1: Gain (+2R), 0: Perte (-1R)
  const outcomes = [1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1];

  let equitySafe = 100000;
  let equityRisky = 100000;

  const pointsSafe = [equitySafe];
  const pointsRisky = [equityRisky];

  outcomes.forEach(out => {
    // Stratégie A : 1% risque, R:R 1:2
    if (out === 1) {
      equitySafe += equitySafe * 0.02;
    } else {
      equitySafe -= equitySafe * 0.01;
    }
    pointsSafe.push(equitySafe);

    // Stratégie B : 10% risque agressif
    if (out === 1) {
      equityRisky += equityRisky * 0.20;
    } else {
      equityRisky -= equityRisky * 0.10;
    }
    pointsRisky.push(equityRisky);
  });

  const minE = 50000;
  const maxE = 140000;

  function toY(val) {
    return h - ((val - minE) / (maxE - minE)) * (h - 40) - 20;
  }

  const stepX = (w - 60) / outcomes.length;

  // Tracer Stratégie Safe (Verte)
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  pointsSafe.forEach((p, i) => {
    const x = 30 + i * stepX;
    const y = toY(p);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Tracer Stratégie Risky (Rouge)
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  pointsRisky.forEach((p, i) => {
    const x = 30 + i * stepX;
    const y = toY(p);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Légendes sur le canvas
  ctx.fillStyle = '#10b981';
  ctx.font = '11px "JetBrains Mono"';
  ctx.fillText('● Stratégie 1% Risque (Disciplinée)', 40, 25);
  ctx.fillStyle = '#ef4444';
  ctx.fillText('● Stratégie 10% Risque (Sur-Levier)', 40, 42);

  // Mettre à jour stats textuelles
  document.getElementById('equity-safe-end').innerText = Math.round(equitySafe).toLocaleString('fr-FR') + ' $';
  document.getElementById('equity-risky-end').innerText = Math.round(equityRisky).toLocaleString('fr-FR') + ' $';

  const feedback = document.getElementById('drawdown-feedback');
  if (feedback) {
    feedback.className = 'alert-box alert-success mt-3';
    feedback.innerHTML = `🛡️ <strong>LEÇON RETENUE :</strong> Lors de la série de 5 pertes consécutives, la stratégie à 10% a vu son capital fondre de plus de <strong>-41%</strong>. À ce stade, le trader est émotionnellement détruit et ruiné. La stratégie disciplinée à 1% n'a fléchi que de <strong>-4.9%</strong> avant de rebondir vers de nouveaux sommets.<br>
    <em>Module 2 validé avec succès (+250 XP).</em>`;
  }

  appState.modules.mod2 = true;
  appState.scores.mod2 = 250;
  addXP(250);
  document.getElementById('score-mod2').innerText = "250 / 250 XP";
  saveState();
}

// =============================================================================
// 6. MODULE 3 : CARNET D'ORDRES (DOM LADDER SIMULATOR)
// =============================================================================

let domState = {
  midPrice: 100.00,
  asks: [
    { price: 100.80, volume: 40 },
    { price: 100.60, volume: 25 },
    { price: 100.40, volume: 15 },
    { price: 100.20, volume: 20 },
    { price: 100.05, volume: 12 }
  ],
  bids: [
    { price: 99.95, volume: 18 },
    { price: 99.80, volume: 30 },
    { price: 99.60, volume: 22 },
    { price: 99.40, volume: 35 },
    { price: 99.20, volume: 50 }
  ]
};

function renderDomLadder() {
  const container = document.getElementById('dom-ladder-rows');
  if (!container) return;
  container.innerHTML = '';

  const maxVol = 60;

  // Asks (descending from highest to best ask)
  domState.asks.forEach(ask => {
    const pct = Math.round((ask.volume / maxVol) * 100);
    const row = document.createElement('div');
    row.className = 'dom-row';
    row.innerHTML = `
      <div class="dom-ask-vol">
        <span>${ask.volume} lots</span>
        <div class="dom-ask-bar" style="width: ${pct}%;"></div>
      </div>
      <div class="dom-price">${ask.price.toFixed(2)}</div>
      <div class="dom-bid-vol"></div>
    `;
    container.appendChild(row);
  });

  // Spread row
  const spreadRow = document.createElement('div');
  spreadRow.className = 'dom-row';
  spreadRow.innerHTML = `
    <div class="dom-ask-vol"></div>
    <div class="dom-price spread-row">SPREAD: 0.10 $</div>
    <div class="dom-bid-vol"></div>
  `;
  container.appendChild(spreadRow);

  // Bids (descending from best bid to lowest)
  domState.bids.forEach(bid => {
    const pct = Math.round((bid.volume / maxVol) * 100);
    const row = document.createElement('div');
    row.className = 'dom-row';
    row.innerHTML = `
      <div class="dom-ask-vol"></div>
      <div class="dom-price">${bid.price.toFixed(2)}</div>
      <div class="dom-bid-vol">
        <span>${bid.volume} lots</span>
        <div class="dom-bid-bar" style="width: ${pct}%;"></div>
      </div>
    `;
    container.appendChild(row);
  });
}

function resetDomLadder() {
  domState = {
    midPrice: 100.00,
    asks: [
      { price: 100.80, volume: 40 },
      { price: 100.60, volume: 25 },
      { price: 100.40, volume: 15 },
      { price: 100.20, volume: 20 },
      { price: 100.05, volume: 12 }
    ],
    bids: [
      { price: 99.95, volume: 18 },
      { price: 99.80, volume: 30 },
      { price: 99.60, volume: 22 },
      { price: 99.40, volume: 35 },
      { price: 99.20, volume: 50 }
    ]
  };
  renderDomLadder();
  const report = document.getElementById('dom-execution-report');
  if (report) {
    report.className = 'alert-box alert-info mt-4';
    report.innerHTML = '<strong>État :</strong> Carnet réinitialisé. En attente de votre ordre.';
  }
  playSound('click');
}

function executeDomOrder(type) {
  const volInput = document.getElementById('dom-order-volume');
  const volume = parseInt(volInput?.value) || 45;
  const report = document.getElementById('dom-execution-report');

  if (type === 'MARKET_BUY') {
    // Consomme les asks du plus proche au plus lointain
    let remaining = volume;
    let totalSpent = 0;
    let levelsConsumed = 0;

    for (let i = domState.asks.length - 1; i >= 0; i--) {
      const ask = domState.asks[i];
      if (remaining <= 0) break;
      levelsConsumed++;
      const taken = Math.min(remaining, ask.volume);
      totalSpent += taken * ask.price;
      ask.volume -= taken;
      remaining -= taken;
    }

    const avgPrice = (totalSpent / (volume - remaining)).toFixed(3);
    const slippage = (avgPrice - 100.05).toFixed(3);

    renderDomLadder();
    playSound('alert');

    if (report) {
      report.className = 'alert-box alert-warning mt-4';
      report.innerHTML = `⚡ <strong>ORDRE AU MARCHÉ EXÉCUTÉ !</strong><br>
      Vous avez acheté <strong>${volume} lots</strong>.<br>
      • Prix de départ affiché : 100.05 $<br>
      • <strong>Prix moyen exécuté (VWAP) : ${avgPrice} $</strong><br>
      • Niveaux du carnet consommés : ${levelsConsumed}<br>
      • <strong>Slippage subi : +${slippage} $ par contrat</strong>.<br>
      <em>Vous comprenez pourquoi les institutionnels n'achètent jamais tout d'un coup au marché !</em>`;
    }

    appState.modules.mod3 = true;
    appState.scores.mod3 = 300;
    addXP(300);
    document.getElementById('score-mod3').innerText = "300 / 300 XP";
    saveState();

  } else if (type === 'LIMIT_BUY') {
    // Place l'ordre au meilleur bid (99.95)
    domState.bids[0].volume += volume;
    renderDomLadder();
    playSound('win');

    if (report) {
      report.className = 'alert-box alert-success mt-4';
      report.innerHTML = `🎯 <strong>ORDRE LIMITE PLACÉ DANS LE CARNET !</strong><br>
      Vos <strong>${volume} lots</strong> sont désormais en attente à <strong>99.95 $</strong>.<br>
      • Vous apportez de la liquidité au marché (Maker).<br>
      • <strong>Slippage garanti : 0.00 $</strong>. Vous ne payerez pas un centime de plus que votre prix cible !<br>
      <em>Module 3 validé avec succès (+300 XP).</em>`;
    }

    appState.modules.mod3 = true;
    appState.scores.mod3 = 300;
    addXP(300);
    document.getElementById('score-mod3').innerText = "300 / 300 XP";
    saveState();
  }
}

function answerDomQuiz(choice) {
  const fb = document.getElementById('quiz-dom-feedback');
  if (!fb) return;
  fb.classList.remove('hidden');

  if (choice === 2) {
    fb.className = 'quiz-feedback alert-box alert-success';
    fb.innerHTML = `✅ <strong>Exact ! Réponse C :</strong> Le volume disponible à 100.00 $ n'étant que de 10 lots, les 40 lots restants dévorent les offres supérieures, gonflant le prix moyen à 100.47 $.`;
    playSound('win');
    addXP(50);
  } else {
    fb.className = 'quiz-feedback alert-box alert-danger';
    fb.innerHTML = `❌ <strong>Faux :</strong> Un carnet d'ordres n'a pas de liquidité infinie au premier prix. Vous payez le prix réel des contreparties suivantes.`;
    playSound('loss');
  }
}

// =============================================================================
// 7. MODULE 4 : MACRO INTELLIGENCE (CHRONO FLASH NFP)
// =============================================================================

let macroTimer = null;
let macroTimeLeft = 15;
let currentMacroAnswer = null;

function startMacroChronoChallenge() {
  playSound('alert');
  macroTimeLeft = 15;
  document.getElementById('btn-start-macro-sim').disabled = true;

  const btnBull = document.getElementById('btn-macro-bull');
  const btnBear = document.getElementById('btn-macro-bear');
  btnBull.disabled = false;
  btnBear.disabled = false;

  const headline = document.getElementById('news-title');
  const actualVal = document.getElementById('nfp-actual');
  const feedback = document.getElementById('macro-result-feedback');

  headline.innerText = "🔥 FLASH US LABOUR STATS : Créations d'emplois Non-Farm Payrolls (NFP)";
  actualVal.innerText = "264 000"; // Surprise massivement haussière vs 180k prévu !
  currentMacroAnswer = 'BULLISH';

  if (feedback) feedback.classList.add('hidden');

  clearInterval(macroTimer);
  macroTimer = setInterval(() => {
    macroTimeLeft--;
    document.getElementById('macro-countdown').innerText = `${macroTimeLeft}s`;

    if (macroTimeLeft <= 0) {
      clearInterval(macroTimer);
      decideMacro('TIMEOUT');
    }
  }, 1000);
}

function decideMacro(choice) {
  clearInterval(macroTimer);
  document.getElementById('btn-macro-bull').disabled = true;
  document.getElementById('btn-macro-bear').disabled = true;
  document.getElementById('btn-start-macro-sim').disabled = false;

  const feedback = document.getElementById('macro-result-feedback');
  if (!feedback) return;
  feedback.classList.remove('hidden');

  if (choice === currentMacroAnswer) {
    playSound('win');
    feedback.className = 'alert-box alert-success mt-3';
    feedback.innerHTML = `🎯 <strong>RÉFLEXE MACRO PARFAIT !</strong><br>
    Chiffre réel à <strong>264 000 vs 180 000 attendu</strong> (+46% de surprise positive !).<br>
    <strong>Mécanisme économique :</strong> Un marché du travail américain en surchauffe force la Réserve Fédérale à maintenir des taux d'intérêt élevés. Les capitaux mondiaux affluent vers les rendements américains, propulsant le Dollar (USD) à la hausse !<br>
    <em>Module 4 validé avec succès (+200 XP).</em>`;
    
    appState.modules.mod4 = true;
    appState.scores.mod4 = 200;
    addXP(200);
    document.getElementById('score-mod4').innerText = "200 / 200 XP";
    saveState();
  } else if (choice === 'TIMEOUT') {
    playSound('loss');
    feedback.className = 'alert-box alert-warning mt-3';
    feedback.innerHTML = `⏱️ <strong>TEMPS ÉCOULÉ !</strong> Les algorithmes haute fréquence ont déjà pris l'avantage sur le marché. Le chiffre de 264k était ultra-haussier pour l'USD.`;
  } else {
    playSound('loss');
    feedback.className = 'alert-box alert-danger mt-3';
    feedback.innerHTML = `❌ <strong>ERREUR D'INTERPRÉTATION MACRO :</strong> Vous avez vendu le Dollar alors que le marché de l'emploi sortait 84 000 postes au-dessus des prévisions. Cela renforce la politique restrictive de la Fed et fait exploser le Dollar.`;
  }
}

// =============================================================================
// 8. MODULE 5 : PSYCHOLOGIE & AUDIT DES BIAIS
// =============================================================================

let psyStep = 0;
let psyBattery = 100;

const psyScenarios = [
  {
    title: "Le Choc du Stop Touché à 1 Pip Près",
    desc: "Votre trade sur l'EUR/USD est stoppé à 1.2 pip près avant d'exploser vers votre objectif initial de Take Profit. La sensation d'injustice vous submerge. Que faites-vous ?",
    choices: [
      {
        text: "A. Entrer immédiatement avec 2x plus de lots pour se venger du marché (Revenge Trading).",
        impact: -40,
        result: "Désastreux ! Vous agissez sous l'emprise de la rancœur. Le marché retranche immédiatement et vous subissez une perte double.",
        correct: false
      },
      {
        text: "B. Accepter le coût du jeu, fermer la station et noter dans le journal CRM : 'Stop placé trop serré dans le bruit'.",
        impact: +10,
        result: "Parfait ! La gestion des émotions est exemplaire. Vous transformez une perte normale en apprentissage documenté.",
        correct: true
      },
      {
        text: "C. Envoyer un message de colère sur les réseaux sociaux et déplacer ses stops à l'avenir.",
        impact: -25,
        result: "Supprimer ses stops est la voie la plus rapide vers la faillite complète.",
        correct: false
      }
    ]
  },
  {
    title: "L'Euphorie du Gros Gagnant (+4 R)",
    desc: "Vous venez d'encaisser 4 000 $ en 30 minutes. Vous vous sentez invincible, un véritable génie de la finance. Que faites-vous maintenant ?",
    choices: [
      {
        text: "A. Rester sur les écrans et chercher n'importe quel autre trade pour doubler encore la mise (Overtrading).",
        impact: -30,
        result: "L'illusion de contrôle vous fait prendre un setup médiocre et vous rendez tous vos gains au marché.",
        correct: false
      },
      {
        text: "B. Respecter sa règle de journée gagnante : éteindre l'ordinateur et profiter de sa journée.",
        impact: +10,
        result: "Discipline de fer ! Verrouiller ses gains psychologiques protège le capital acquis.",
        correct: true
      }
    ]
  },
  {
    title: "La Série Noire du Vendredi Après-Midi",
    desc: "Vous avez essuyé 3 pertes d'affilée aujourd'hui. Il est 16h30 le vendredi. Vous refusez de passer le week-end dans le rouge.",
    choices: [
      {
        text: "A. Forcer un dernier trade coûte que coûte avant la clôture pour finir 'vert'.",
        impact: -40,
        result: "Le piège ultime de l'égo. Les spreads s'écartent le vendredi soir et le marché vous punit lourdement.",
        correct: false
      },
      {
        text: "B. Clôturer la semaine, accepter la variance statistique et planifier l'audit du journal le dimanche calme.",
        impact: +15,
        result: "Attitude de gérant de fonds professionnel. Les statistiques se jugent sur 100 trades, pas sur une seule journée.",
        correct: true
      }
    ]
  }
];

function restartPsySimulator() {
  psyStep = 0;
  psyBattery = 100;
  renderPsyScenario();
  updatePsyGauge();
}

function renderPsyScenario() {
  if (psyStep >= psyScenarios.length) {
    document.getElementById('psy-scenario-title').innerText = "Audit Psychologique Terminé !";
    document.getElementById('psy-scenario-text').innerHTML = `Félicitations pour avoir complété les 3 épreuves de résistance mentale. Votre score de discipline finale s'élève à <strong>${psyBattery} / 100</strong>.`;
    document.getElementById('psy-scenario-buttons').innerHTML = '';
    
    appState.modules.mod5 = true;
    appState.scores.mod5 = 250;
    addXP(250);
    document.getElementById('score-mod5').innerText = "250 / 250 XP";
    saveState();
    return;
  }

  const sc = psyScenarios[psyStep];
  document.getElementById('psy-step-count').innerText = `Situation ${psyStep + 1} sur ${psyScenarios.length}`;
  document.getElementById('psy-scenario-title').innerText = sc.title;
  document.getElementById('psy-scenario-text').innerText = sc.desc;

  const btnContainer = document.getElementById('psy-scenario-buttons');
  btnContainer.innerHTML = '';

  sc.choices.forEach(ch => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerText = ch.text;
    btn.onclick = () => selectPsyChoice(ch);
    btnContainer.appendChild(btn);
  });

  const fb = document.getElementById('psy-scenario-feedback');
  if (fb) fb.classList.add('hidden');
}

function selectPsyChoice(choice) {
  psyBattery = Math.max(0, Math.min(100, psyBattery + choice.impact));
  updatePsyGauge();

  const fb = document.getElementById('psy-scenario-feedback');
  if (fb) {
    fb.classList.remove('hidden');
    if (choice.correct) {
      playSound('win');
      fb.className = 'alert-box alert-success mt-3';
      fb.innerHTML = `✅ ${choice.result}`;
    } else {
      playSound('loss');
      fb.className = 'alert-box alert-danger mt-3';
      fb.innerHTML = `⚠️ ${choice.result}`;
    }
  }

  setTimeout(() => {
    psyStep++;
    renderPsyScenario();
  }, 2200);
}

function updatePsyGauge() {
  const fill = document.getElementById('psy-gauge-fill');
  const score = document.getElementById('psy-gauge-score');
  const status = document.getElementById('psy-gauge-status');

  if (fill) fill.style.width = `${psyBattery}%`;
  if (score) score.innerText = `${psyBattery} / 100`;

  if (status) {
    if (psyBattery >= 80) {
      status.innerText = "Statut : Lucidité optimale. Discipline institutionnelle intacte.";
      status.style.color = '#34d399';
    } else if (psyBattery >= 50) {
      status.innerText = "Statut : Fatigue cognitive légère. Risque accru de FOMO.";
      status.style.color = '#fbbf24';
    } else {
      status.innerText = "Statut : Dérive émotionnelle critique ! Arrêt immédiat obligatoire.";
      status.style.color = '#f87171';
    }
  }
}

// =============================================================================
// 9. MODULE 6 : LE PIPELINE CRM DU TRADER (KANBAN JOURNAL)
// =============================================================================

function renderKanbanBoard() {
  const columns = ['prospect', 'qualified', 'active', 'won', 'lost'];
  
  columns.forEach(col => {
    const container = document.getElementById(`cards-${col}`);
    const countEl = document.getElementById(`count-${col}`);
    if (!container) return;

    container.innerHTML = '';
    const deals = appState.deals.filter(d => d.column === col);
    if (countEl) countEl.innerText = deals.length;

    deals.forEach(deal => {
      const card = document.createElement('div');
      card.className = 'deal-card';
      card.draggable = true;
      card.id = deal.id;
      card.ondragstart = (e) => handleDragStart(e, deal.id);

      const isLong = deal.direction.includes('LONG') || deal.direction.includes('ACHAT');
      const dirClass = isLong ? 'dir-long' : 'dir-short';

      card.innerHTML = `
        <div class="deal-head">
          <span class="deal-asset">${deal.asset}</span>
          <span class="deal-dir ${dirClass}">${deal.direction}</span>
        </div>
        <div class="deal-setup">${deal.setup}</div>
        <div class="deal-metrics">
          <span>In: ${deal.entry}</span>
          <span>SL: ${deal.sl}</span>
          <span class="text-primary font-bold">TP: ${deal.tp}</span>
        </div>
        <div class="deal-actions">
          <span class="text-xs text-muted">R:R ${deal.rr || '1:3'}</span>
          <div>
            ${col !== 'prospect' ? `<button class="deal-action-btn" onclick="moveDeal('${deal.id}', -1)" title="Reculer">←</button>` : ''}
            ${col !== 'lost' && col !== 'won' ? `<button class="deal-action-btn" onclick="moveDeal('${deal.id}', 1)" title="Avancer">Avancer →</button>` : ''}
            <button class="deal-action-btn text-danger" onclick="deleteDeal('${deal.id}')" title="Supprimer">&times;</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  });

  updateDashboardKPIs();
}

function handleDragStart(e, dealId) {
  e.dataTransfer.setData('text/plain', dealId);
}

function allowDrop(e) {
  e.preventDefault();
}

function handleDrop(e, targetCol) {
  e.preventDefault();
  const dealId = e.dataTransfer.getData('text/plain');
  const deal = appState.deals.find(d => d.id === dealId);
  if (deal && deal.column !== targetCol) {
    deal.column = targetCol;
    playSound('click');
    saveState();
    renderKanbanBoard();
  }
}

function moveDeal(dealId, direction) {
  const cols = ['prospect', 'qualified', 'active', 'won', 'lost'];
  const deal = appState.deals.find(d => d.id === dealId);
  if (!deal) return;

  const currentIndex = cols.indexOf(deal.column);
  const newIndex = currentIndex + direction;

  if (newIndex >= 0 && newIndex < cols.length) {
    deal.column = cols[newIndex];
    if (deal.column === 'won') {
      playSound('win');
      appState.capital += 2500;
      addXP(100);
    } else if (deal.column === 'lost') {
      playSound('loss');
      appState.capital -= 1000;
    } else {
      playSound('click');
    }
    saveState();
    renderKanbanBoard();
  }
}

function deleteDeal(dealId) {
  appState.deals = appState.deals.filter(d => d.id !== dealId);
  playSound('click');
  saveState();
  renderKanbanBoard();
}

function updateDashboardKPIs() {
  const won = appState.deals.filter(d => d.column === 'won').length;
  const lost = appState.deals.filter(d => d.column === 'lost').length;
  const closed = won + lost;

  const winRateEl = document.getElementById('dash-winrate');
  const pfEl = document.getElementById('dash-profit-factor');

  if (closed > 0) {
    const wr = Math.round((won / closed) * 100);
    if (winRateEl) winRateEl.innerText = `${wr}%`;
    const pf = lost === 0 ? (won * 2.5).toFixed(2) : ((won * 3) / lost).toFixed(2);
    if (pfEl) pfEl.innerText = pf;
  }
}

function resetPipelineToDefault() {
  appState.deals = JSON.parse(JSON.stringify(defaultState.deals));
  saveState();
  renderKanbanBoard();
  playSound('click');
}

// Modal nouveau deal
function openNewDealModal() {
  document.getElementById('modal-new-deal')?.classList.remove('hidden');
  playSound('click');
}

function closeNewDealModal() {
  document.getElementById('modal-new-deal')?.classList.add('hidden');
}

function handleCreateDeal(e) {
  e.preventDefault();
  const asset = document.getElementById('deal-asset').value;
  const direction = document.getElementById('deal-direction').value;
  const entry = parseFloat(document.getElementById('deal-entry').value);
  const sl = parseFloat(document.getElementById('deal-sl').value);
  const tp = parseFloat(document.getElementById('deal-tp').value);
  const setup = document.getElementById('deal-setup').value;
  const column = document.getElementById('deal-column').value;

  const risk = Math.abs(entry - sl);
  const reward = Math.abs(tp - entry);
  const rr = `1 : ${(reward / (risk || 0.0001)).toFixed(1)}`;

  const newDeal = {
    id: `deal-${Date.now()}`,
    asset,
    direction,
    entry,
    sl,
    tp,
    rr,
    setup,
    column
  };

  appState.deals.push(newDeal);
  addXP(80);
  saveState();
  renderKanbanBoard();
  closeNewDealModal();
}

// =============================================================================
// 10. CERTIFICAT & AUDIT DE VALIDATION
// =============================================================================

function updateCertificateUI() {
  const mods = appState.modules;
  let count = 0;

  for (let i = 1; i <= 5; i++) {
    const isValid = mods[`mod${i}`];
    const item = document.getElementById(`audit-item-${i}`);
    const score = document.getElementById(`audit-score-${i}`);
    if (isValid) {
      count++;
      item?.classList.add('valid');
      if (score) score.innerText = "✓ Validé";
    } else {
      item?.classList.remove('valid');
      if (score) score.innerText = "Non validé";
    }
  }

  const certScore = document.getElementById('cert-score-total');
  if (certScore) certScore.innerText = `${Math.round((count / 5) * 100)}%`;
}

function validateAllModulesDebug() {
  appState.modules = {
    mod1: true,
    mod2: true,
    mod3: true,
    mod4: true,
    mod5: true
  };
  appState.scores = {
    mod1: 250,
    mod2: 250,
    mod3: 300,
    mod4: 200,
    mod5: 250
  };
  addXP(1250);
  saveState();
  playSound('win');
  alert("🎉 Tous les modules ont été validés ! Le certificat est désormais complet à 100%.");
}

// =============================================================================
// INITIALISATION AU CHARGEMENT DE LA PAGE
// =============================================================================

window.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  generateInitialCandles();
  drawTechnicalChart();
  calculatePositionSize();
  renderDomLadder();
  renderPsyScenario();
  renderKanbanBoard();
  updateTopMetricsUI();
  updateSidebarProgress();
  updateCertificateUI();
});
