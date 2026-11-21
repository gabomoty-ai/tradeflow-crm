/**
 * MasterTrade 100% · Moteur d'Apprentissage & Validation des Compétences du Trading Pro
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
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'success') {
      // Arpège ascendant triomphant (Do - Mi - Sol - Do aigu)
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.06, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.28);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.28);
      });
    } else if (type === 'wrong') {
      // Son grave d'erreur
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.2);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'fanfare') {
      // Accord triomphant 100% Maître
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.08, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 0.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.8);
      });
    }
  } catch (e) {
    // Audio context may require user interaction
  }
}

// =============================================================================
// 2. DONNÉES PÉDAGOGIQUES : 7 PILIERS & 21 COMPÉTENCES À 100%
// =============================================================================
const PILLARS_DATA = [
  {
    id: "pillar-1",
    num: 1,
    title: "Fondations des Marchés & Ordres d'Exécution",
    desc: "Comprendre les types d'instruments, la mécanique du spread, du levier et choisir le type d'ordre adapté.",
    iconClass: "p1-icon",
    iconSymbol: "🏛️",
    competencies: [
      {
        id: "c1_1",
        code: "C1.1",
        title: "Typologie des Instruments Financiers",
        theory: "Les actions et futures s'échangent sur des marchés organisés et centralisés (NYSE, Euronext, CME) avec carnet d'ordres public. Le Forex et les CFDs s'échangent de gré à gré (OTC) auprès de courtiers qui agissent souvent comme contrepartie directe (Market Maker) ou transmettent aux banques (ECN/STP).",
        question: "Vous souhaitez spéculer sur la hausse de l'or (XAU/USD) avec un effet de levier modéré (1:20) sans détenir physiquement de lingots ni attendre une date d'échéance mensuelle. Quel contrat utilisez-vous ?",
        options: [
          { text: "Un contrat à terme (Future) avec livraison physique en coffre", correct: false, explain: "Les futures avec livraison physique obligent au débouclage avant échéance pour ne pas être livré du métal." },
          { text: "Un CFD (Contract For Difference) sur matière première au comptant", correct: true, explain: "Exact ! Le CFD permet de spéculer sur les variations de cours sans détenir physiquement l'actif, avec marge et effet de levier modulables." },
          { text: "Une obligation d'État à coupon zéro à 10 ans", correct: false, explain: "Une obligation d'État est un titre de dette souveraine, pas un contrat spéculatif sur l'or." }
        ],
        xp: 150
      },
      {
        id: "c1_2",
        code: "C1.2",
        title: "Mécanique du Spread, Bid/Ask & Marge Requise",
        theory: "Le spread est la différence entre le prix auquel vous achetez (Ask) et le prix auquel vous vendez (Bid). Tout trade débute en perte équivalente à ce spread. La marge requise est le collatéral minimum bloqué par le courtier : Marge = Valeur notionnelle / Effet de levier.",
        hasInteractiveCalc: "margin",
        question: "Sur la paire EUR/USD, le cours Bid s'affiche à 1.08500 et le cours Ask à 1.08515. Quel est le montant exact du spread ?",
        options: [
          { text: "15 pips entiers", correct: false, explain: "Attention aux pipettes (5ème décimale). 0.00015 correspond à 1.5 pip et non 15 pips." },
          { text: "1.5 pip (ou 15 fractional points)", correct: true, explain: "Bravo ! Sur les devises standard, le 4ème chiffre après la virgule représente 1 pip (0.0001). 1.08515 - 1.08500 = 0.00015 = 1.5 pip." },
          { text: "0.15 pip", correct: false, explain: "Incorrect : 0.00015 représente 1.5 pip." }
        ],
        xp: 150
      },
      {
        id: "c1_3",
        code: "C1.3",
        title: "Maîtrise des Types d'Ordres (Market, Limit, Stop, OCO)",
        theory: "Un ordre Market s'exécute immédiatement au prix disponible (attention au slippage). Un ordre Limit attend un prix plus avantageux (achat sous le cours ou vente au-dessus). Un ordre Stop achète au-dessus du cours actuel ou vend en-dessous lors d'une cassure de niveau clé (Breakout).",
        question: "Le cours actuel de l'EUR/USD est à 1.0820. Une forte résistance est située à 1.0850. Vous souhaitez acheter UNIQUEMENT si le prix casse et franchit les 1.0855. Quel type d'ordre devez-vous programmer ?",
        options: [
          { text: "Un ordre Buy Limit à 1.0855", correct: false, explain: "Un ordre Buy Limit s'exécuterait immédiatement au cours actuel (1.0820) car le système considère que 1.0820 est plus avantageux que 1.0855 !" },
          { text: "Un ordre Buy Stop à 1.0855", correct: true, explain: "Parfait ! Un Buy Stop permet de déclencher un achat uniquement quand le cours monte et franchit un seuil supérieur (idéal en cassure de résistance)." },
          { text: "Un ordre Sell Stop à 1.0855", correct: false, explain: "Un Sell Stop est un ordre de vente en-dessous du cours actuel pour couper une perte ou shorter un support." }
        ],
        xp: 150
      }
    ]
  },
  {
    id: "pillar-2",
    num: 2,
    title: "Analyse Technique & Price Action Avancée",
    desc: "Identifier la structure de marché (BOS/CHoCH), cartographier les Order Blocks et valider les confirmations de bougies.",
    iconClass: "p2-icon",
    iconSymbol: "📈",
    competencies: [
      {
        id: "c2_1",
        code: "C2.1",
        title: "Structure de Marché & Ruptures (BOS vs CHoCH)",
        theory: "Une tendance haussière saine forme une succession de sommets et creux ascendants (Higher Highs / Higher Lows). Un BOS (Break of Structure) confirme la continuation de tendance. Un CHoCH (Change of Character) correspond à la première cassure du dernier creux ascendant majeur et signale un retournement baissier potentiel.",
        question: "Sur un graphique 4 Heures, le cours vient de clôturer avec force en-dessous du dernier creux ascendant majeur (Higher Low). Quel est le diagnostic technique rigoureux ?",
        options: [
          { text: "C'est un simple bruit de marché sans conséquence, il faut acheter le creux les yeux fermés", correct: false, explain: "Acheter un couteau qui casse une structure majeure entraîne des pertes massives." },
          { text: "C'est un CHoCH baissier : la structure haussière est rompue, on privilégie désormais la recherche de ventes sur re-test", correct: true, explain: "Exact ! La clôture sous le Higher Low invalide la structure acheteuse et donne l'avantage aux vendeurs." },
          { text: "Le marché garantit un nouveau sommet historique dans l'heure suivante", correct: false, explain: "Le marché ne garantit jamais rien, et la rupture de structure indique l'inverse." }
        ],
        xp: 150
      },
      {
        id: "c2_2",
        code: "C2.2",
        title: "Cartographie des Supports, Résistances & Order Blocks",
        theory: "Un Order Block (OB) institutionnel est la dernière bougie baissière avant une violente impulsion haussière créant un déséquilibre de liquidité. Les algorithmes bancaires reviennent régulièrement 'mitiger' cette zone pour combler leurs ordres restants.",
        question: "Une bougie journalière rouge est suivie d'une explosion haussière de +3.5% qui laisse un vide de liquidité (Imbalance / FVG). Où placez-vous votre zone d'achat à haute probabilité ?",
        options: [
          { text: "Tout en haut de la bougie verte par peur de rater le train (FOMO)", correct: false, explain: "Acheter au sommet d'une impulsion expose au retracement immédiat." },
          { text: "Dans l'Order Block (dernière bougie baissière avant l'impulsion) et la zone d'Imbalance lors du retracement", correct: true, explain: "Brillant ! Le retour sur l'Order Block d'origine offre le meilleur ratio Risk/Reward avec un Stop Loss très serré." },
          { text: "N'importe où au hasard sans niveau de référence", correct: false, explain: "Un trader sans niveau clé est un joueur de casino." }
        ],
        xp: 150
      },
      {
        id: "c2_3",
        code: "C2.3",
        title: "Validation des Signaux par Chandeliers Japonais",
        theory: "Une bougie japonaise n'a AUCUN pouvoir prédictif isolée de son contexte. Une Pin Bar (Marteau de rejet) n'est valide que si elle rejette un niveau clé majeur (Support 4H, Order Block ou niveau Fibonacci 61.8%) avec une mèche mesurant au moins les 2/3 de la bougie.",
        question: "Vous observez un superbe chandelier en forme de marteau (Pin Bar) avec une très longue mèche basse. Où doit-il se situer pour valider une entrée acheteuse professionnelle ?",
        options: [
          { text: "En plein milieu d'une zone de range horizontal sans aucun support", correct: false, explain: "Au milieu d'un range, les faux signaux sont légion." },
          { text: "En rejet direct d'un support horizontal majeur 4H ou d'une zone de liquidité clé", correct: true, explain: "Parfait ! C'est la confluence entre le niveau clé et la réaction de prix (Price Action) qui crée l'avantage statistique." },
          { text: "Directement sous une résistance majeure hebdomadaire", correct: false, explain: "Acheter sous une résistance majeure est une faute grave de gestion." }
        ],
        xp: 150
      }
    ]
  },
  {
    id: "pillar-3",
    num: 3,
    title: "Gestion du Risque & Mathématiques du Capital",
    desc: "Appliquer la règle stricte du 1% de risque, calculer la taille de lot au pip près et exiger un Risk/Reward ≥ 1:2.",
    iconClass: "p3-icon",
    iconSymbol: "🛡️",
    competencies: [
      {
        id: "c3_1",
        code: "C3.1",
        title: "La Règle d'Or du 1% de Risque par Trade",
        theory: "La survie du compte prime sur la recherche du gain. En risquant 1% de son capital par trade, une série de 10 pertes consécutives ne réduit le compte que de 9.5% (récupérable). En risquant 10% par trade, 10 pertes anéantissent 65% du compte (irrécupérable, nécessitant +185% de gain pour revenir à zéro).",
        question: "Vous disposez d'un compte de trading de 30 000 €. Quelle est votre perte maximale autorisée sur un trade selon la règle professionnelle de 1% ?",
        options: [
          { text: "300 €", correct: true, explain: "Exact ! 1% de 30 000 € = 300 €. C'est le montant monétaire maximal absolu engagé par votre Stop Loss." },
          { text: "1 500 €", correct: false, explain: "1 500 € représente 5% de risque, ce qui expose le compte à un risque de ruine élevé." },
          { text: "3 000 €", correct: false, explain: "3 000 € représente 10% de risque, une gestion irresponsable." }
        ],
        xp: 150
      },
      {
        id: "c3_2",
        code: "C3.2",
        title: "Calculateur Mathématique de Taille de Position (Lots)",
        theory: "Le nombre de lots ne se choisit JAMAIS au hasard. Formule exacte : Taille de lot = Risque monétaire en € / (Distance Stop Loss en pips × Valeur du pip par lot standard). Si le Stop Loss est plus large, la taille de lot doit automatiquement diminuer.",
        hasInteractiveCalc: "lots",
        question: "Vous risquez 200 € sur l'EUR/USD avec un Stop Loss fixé à 20 pips. Sur l'EUR/USD, 1 pip pour 1 lot standard (100k) vaut 10 $ (≈ 9.20 €). Quel est le volume exact à entrer ?",
        options: [
          { text: "~1.08 lot standard", correct: true, explain: "Superbe ! 200 € / (20 pips × 9.20 €/pip) ≈ 1.08 lot. Vous maîtrisez le dimensionnement au pip près." },
          { text: "3.50 lots", correct: false, explain: "Avec 3.5 lots, vous risqueriez plus de 640 € soit plus de 3 fois votre risque toléré." },
          { text: "0.10 lot", correct: false, explain: "0.10 lot correspond à un sous-dimensionnement extrême (18 € de risque au lieu des 200 € alloués)." }
        ],
        xp: 150
      },
      {
        id: "c3_3",
        code: "C3.3",
        title: "Asymétrie Risk/Reward (R:R ≥ 1:2) & Espérance Positive",
        theory: "Espérance E = (Winrate × Gain moyen) - (Lossrate × Perte moyenne). Avec un R:R moyen de 1:2.5, vous êtes très rentable même en ayant raison seulement 4 fois sur 10 (40% de réussite) !",
        question: "Un trader réalise 100 trades : 40 trades gagnants (+500 € chacun) et 60 trades perdants (-200 € chacun, ratio R:R de 1:2.5). Quel est son bilan net ?",
        options: [
          { text: "Négatif de -4 000 € à cause des 60 défaites", correct: false, explain: "Faux ! Ce n'est pas le nombre de trades gagnants qui compte, mais le ratio entre ce qu'on gagne et ce qu'on perd." },
          { text: "Bénéfice net de +8 000 €", correct: true, explain: "Brillant ! Gains = 40 × 500 € = 20 000 €. Pertes = 60 × 200 € = 12 000 €. Résultat net = +8 000 € malgré 60% d'échecs." },
          { text: "Exactement 0 € (équilibre parfait)", correct: false, explain: "Calcul incorrect : les gains écrasent les pertes de 8 000 €." }
        ],
        xp: 150
      }
    ]
  },
  {
    id: "pillar-4",
    num: 4,
    title: "Liquidité, DOM & Flux d'Ordres (Order Flow)",
    desc: "Comprendre les contreparties Makers/Takers, repérer les chasses aux stops (Liquidity Sweeps) et maîtriser le slippage.",
    iconClass: "p4-icon",
    iconSymbol: "🌊",
    competencies: [
      {
        id: "c4_1",
        code: "C4.1",
        title: "Makers vs Takers & Consommation du Carnet",
        theory: "Les Makers injectent de la liquidité passive via des ordres Limit qui s'empilent dans le carnet d'ordres (DOM). Les Takers envoient des ordres agressifs au marché (Market Orders) qui consomment immédiatement les ordres des Makers au meilleur prix disponible.",
        question: "Un fond d'investissement injecte d'un coup un ordre d'achat agressif au marché de 400 lots. Il n'y a que 150 lots en attente au meilleur Ask. Que se passe-t-il mécaniquement ?",
        options: [
          { text: "L'ordre est rejeté par la bourse pour manque de liquidité", correct: false, explain: "Les bourses n'annulent pas les ordres Market ; elles les exécutent au prix suivant disponible." },
          { text: "L'ordre absorbe les 150 lots au premier palier, puis balaie les paliers de prix supérieurs pour exécuter les 250 lots restants (provoquant du slippage et une hausse de cours)", correct: true, explain: "Exactement ! Ce balayage mécanique des paliers du carnet d'ordres est la cause physique des hausses impulsives." },
          { text: "Le cours s'effondre immédiatement", correct: false, explain: "Un achat massif consomme les offres et pousse mécaniquement le prix vers le haut." }
        ],
        xp: 150
      },
      {
        id: "c4_2",
        code: "C4.2",
        title: "Détection des Chasses aux Stops (Liquidity Sweeps)",
        theory: "La masse des traders particuliers place ses Stop Loss prévisibles juste au-dessus des doubles sommets et sous les doubles creux. Les algorithmes institutionnels viennent balayer ces zones pour capter cette liquidité de sortie avant d'inverser le cours.",
        question: "Le cours enfonce un support évident de 4 pips, déclenche une rafale de Stop Loss vendeurs, puis clôture immédiatement au-dessus du support avec une immense mèche basse. Quelle est l'interprétation pro ?",
        options: [
          { text: "C'est une vraie cassure baissière, il faut shorter sans attendre", correct: false, explain: "C'est le piège classique des particuliers qui vendent le creux d'un balayage de liquidité." },
          { text: "C'est un 'Liquidity Sweep' (chasse aux stops) : fausse cassure orchestrée pour absorber la liquidité des vendeurs avant un rebond", correct: true, explain: "Parfait ! C'est l'un des setups les plus puissants du trading institutionnel (Smart Money Concepts)." },
          { text: "C'est une panne des serveurs de cotation", correct: false, explain: "C'est le fonctionnement normal et fluide des marchés de capitaux." }
        ],
        xp: 150
      },
      {
        id: "c4_3",
        code: "C4.3",
        title: "Slippage & Gestion du Risque en Faible Liquidité",
        theory: "Le slippage (glissement de cours) survient lors des annonces macroéconomiques ou des ouvertures de marchés avec gaps. Le Stop Loss peut être exécuté bien plus bas que le niveau demandé en cas de trou d'air de liquidité.",
        question: "Comment un gestionnaire de risque professionnel se prémunit-il contre le risque de slippage destructeur ?",
        options: [
          { text: "En coupant ses Stop Loss pour être certain de ne pas être exécuté", correct: false, explain: "Supprimer son Stop Loss est l'assurance d'une liquidation totale du compte." },
          { text: "En clôturant ou réduisant ses positions avant les annonces majeures et en évitant de trader aux heures de faible liquidité (rollover de minuit)", correct: true, explain: "Exact ! La discipline de ne pas s'exposer aux trous d'air de liquidité préserve le capital." },
          { text: "En utilisant un levier maximal de 1:500", correct: false, explain: "Un levier extrême amplifie le slippage et mène au margin call." }
        ],
        xp: 150
      }
    ]
  },
  {
    id: "pillar-5",
    num: 5,
    title: "Macroéconomie & Calendrier Fondamental",
    desc: "Décoder les surprises statistiques (NFP, CPI, Décisions de taux), analyser les corrélations d'actifs et protéger son capital.",
    iconClass: "p5-icon",
    iconSymbol: "🌍",
    competencies: [
      {
        id: "c5_1",
        code: "C5.1",
        title: "Interprétation des Chocs Statistiques (Écart vs Consensus)",
        theory: "Le marché intègre toujours le consensus des analystes dans les cours avant l'annonce. Ce qui déclenche la volatilité violente n'est pas le chiffre brut, mais l'ÉCART (la surprise) entre le chiffre publié et l'attente du marché.",
        question: "Le consensus tablait sur une création de 150 000 emplois US (NFP). Le chiffre publié explose à 320 000 avec une hausse inattendue des salaires. Quel est l'impact immédiat attendu sur le Dollar américain (DXY) et sur l'Or ?",
        options: [
          { text: "Le Dollar chute lourdement et l'Or s'envole", correct: false, explain: "Une économie en surchauffe repousse les baisses de taux et soutient le Dollar." },
          { text: "Le Dollar s'apprécie fortement (anticipation de taux d'intérêt élevés) et l'Or baisse (actif sans rendement)", correct: true, explain: "Absolument ! Une surprise haussière massive sur l'emploi renforce le Dollar et pèse sur les métaux précieux." },
          { text: "Aucun impact car l'analyse technique seule gouverne le monde", correct: false, explain: "Ignorer les flux macroéconomiques majeurs est suicidaire pour un trader." }
        ],
        xp: 150
      },
      {
        id: "c5_2",
        code: "C5.2",
        title: "Corrélations Inter-Marchés (DXY, Taux US, Actions)",
        theory: "Les marchés forment un écosystème interconnecté : Hausse des rendements obligataires réels US (US10Y) = Dollar américain fort (DXY) = Pression baissière sur l'EUR/USD, sur l'Or et sur les valeurs technologiques à fort PER (Nasdaq).",
        question: "Vous observez l'indice Dollar (DXY) tester et casser une résistance historique haussière avec un fort volume. Quelle attitude adoptez-vous sur la paire EUR/USD ?",
        options: [
          { text: "Vous cherchez des signaux de vente (Short) ou évitez d'acheter l'EUR/USD en raison de la corrélation négative", correct: true, explain: "Bravo ! L'EUR/USD évolue presque toujours à l'inverse du DXY. Trader dans le sens du Dollar maximise vos probabilités." },
          { text: "Vous achetez l'EUR/USD avec un levier maximal", correct: false, explain: "Acheter l'EUR/USD quand le Dollar explose à la hausse va à contre-courant du flux institutionnel." },
          { text: "Vous ignorez complètement le Dollar", correct: false, explain: "Le Dollar représente 88% des transactions du Forex mondial." }
        ],
        xp: 150
      },
      {
        id: "c5_3",
        code: "C5.3",
        title: "Gestion des Positions en Période d'Annonces 'Rouges'",
        theory: "À 14h30 lors de l'annonce NFP ou à 20h00 lors d'un communiqué FOMC de la Fed, le spread peut s'élargir de 10 à 25 pips en quelques secondes, et des mouvements en dents de scie (whipsaw) peuvent balayer les deux côtés du marché.",
        question: "Quelle est la règle d'or d'une institution financière 5 minutes avant la publication d'un chiffre d'inflation majeur (CPI) ?",
        options: [
          { text: "Parier 'pile ou face' au marché juste avant le compte à rebours", correct: false, explain: "C'est du pur jeu de hasard, incompatible avec la gestion de capital professionnelle." },
          { text: "Être 'Flat' (aucune position ouverte) ou avoir sécurisé ses positions à Breakeven avec une marge de tolérance suffisante", correct: true, explain: "Exact ! Les professionnels attendent que la tempête de volatilité initiale passe pour trader la vraie direction post-annonce." },
          { text: "Retirer ses stops pour éviter de se faire sortir", correct: false, explain: "Retirer son stop lors d'une annonce peut liquider un compte en 10 secondes." }
        ],
        xp: 150
      }
    ]
  },
  {
    id: "pillar-6",
    num: 6,
    title: "Psychologie du Trader, Biais & Sang-Froid",
    desc: "Éradiquer le FOMO, neutraliser le revenge trading et tenir un journal d'audit neutre et statistique.",
    iconClass: "p6-icon",
    iconSymbol: "🧠",
    competencies: [
      {
        id: "c6_1",
        code: "C6.1",
        title: "Neutralisation du Biais FOMO (Peur de Rater le Train)",
        theory: "Le FOMO est une réaction émotionnelle primitive qui pousse à acheter au sommet d'une bougie verte géante. Les opportunités de marché sont infinies et se renouvellent chaque jour. Rater un mouvement ne coûte rien ; entrer trop tard sans plan coûte souvent la ruine.",
        question: "Une action technologique vient de s'envoler de +9% en 20 minutes sans vous. La bougie percute une résistance majeure. Que faites-vous ?",
        options: [
          { text: "Vous achetez immédiatement au marché par peur que le titre ne double encore sans vous", correct: false, explain: "C'est le piège typique du FOMO où les particuliers achètent aux professionnels qui prennent leurs profits." },
          { text: "Vous restez parfaitement serein, acceptez d'avoir raté l'impulsion et attendez patiemment une consolidation ou un pullback de qualité", correct: true, explain: "Magnifique ! La maîtrise émotionnelle consiste à n'entrer que lorsque VOTRE plan est validé." },
          { text: "Vous envoyez un ordre de vente massif en levier 50x pour vous venger", correct: false, explain: "Court-circuiter une impulsion sans signal de retournement est du suicide financier." }
        ],
        xp: 150
      },
      {
        id: "c6_2",
        code: "C6.2",
        title: "Coupe-Circuit Émotionnel & Anti-Revenge Trading",
        theory: "Après 2 ou 3 pertes d'affilée, le cerveau sécrète du cortisol et bascule en mode 'Revenge Trading' (désir obsessionnel de se refaire). La règle absolue est le Max Daily Drawdown (ex: -3% max par jour) : si ce seuil est atteint, la station de trading est éteinte jusqu'au lendemain.",
        question: "Ce matin, vous venez de subir 3 pertes consécutives et vous atteignez votre perte maximale autorisée du jour (-3% de votre capital). Que faites-vous ?",
        options: [
          { text: "Vous doublez la taille de lot sur le prochain trade pour tout récupérer en un seul coup", correct: false, explain: "La méthode de la martingale mène mathématiquement à la faillite." },
          { text: "Vous fermez immédiatement la plateforme de trading, quittez votre bureau et ne rouvrez les marchés que le lendemain à tête reposée", correct: true, explain: "Parfait ! Respecter son coupe-circuit quotidien protège votre capital et préserve votre clarté mentale." },
          { text: "Vous continuez à trader en cachette sur votre smartphone", correct: false, explain: "Le contournement de ses propres règles est le signe avant-coureur du tilt destructeur." }
        ],
        xp: 150
      },
      {
        id: "c6_3",
        code: "C6.3",
        title: "Discipline de Journaling & Débriefing Neutre",
        theory: "Un trade gagnant qui n'a pas respecté le plan de risque est une FAUTE GRAVE (gain toxique). Un trade perdant qui a scrupuleusement respecté le plan est une EXCELLENTE OPÉRATION (coût normal du métier). Le débriefing doit juger le process et non le résultat monétaire.",
        question: "Dans votre journal de trading CRM, quel critère détermine en priorité si votre session a été un succès professionnel ?",
        options: [
          { text: "Le gain monétaire en euros, peu importe les entorses aux règles", correct: false, explain: "Gagner de l'argent sans respecter ses règles n'est que de la chance passagère." },
          { text: "Le taux d'adhérence stricte à votre plan de trading et le respect absolu de votre gestion du risque", correct: true, explain: "Exactement ! La rentabilité à long terme est la conséquence mécanique d'un processus exécuté avec rigueur." },
          { text: "Le nombre maximal d'ordres passés dans la journée", correct: false, explain: "L'overtrading enrichit uniquement votre courtier en commissions." }
        ],
        xp: 150
      }
    ]
  },
  {
    id: "pillar-7",
    num: 7,
    title: "Système de Trading & Exécution CRM",
    desc: "Appliquer la checklist pré-trade non négociable, gérer activement les sorties (Breakeven / TP partiels) et auditer son Profit Factor.",
    iconClass: "p7-icon",
    iconSymbol: "💼",
    competencies: [
      {
        id: "c7_1",
        code: "C7.1",
        title: "La Checklist Pré-Trade Non Négociable",
        theory: "Un trade est un contrat d'affaires. Avant toute signature (clic d'entrée), les 6 conditions du cahier des charges doivent être au vert : 1) Tendance HTF identifiée, 2) Niveau clé validé, 3) Signal de bougie présent, 4) Risque monétaire ≤ 1%, 5) R:R ≥ 1:2, 6) Pas d'annonce rouge imminente.",
        hasInteractiveChecklist: true,
        question: "Vous observez une superbe opportunité technique avec un ratio R:R de 1:3, mais une décision de taux de la Banque Centrale a lieu dans 8 minutes. Validez-vous le contrat d'entrée ?",
        options: [
          { text: "Oui, car l'analyse technique surpasse toujours l'actualité économique", correct: false, explain: "Les banques centrales déplacent des centaines de milliards et pulvérisent les supports techniques lors des annonces." },
          { text: "Non : le critère 'Sécurité Calendrier' est en échec. Dans un système CRM strict, une seule condition éliminatoire bloque l'exécution", correct: true, explain: "Excellente décision ! C'est cette rigueur de filtrage qui préserve les comptes professionnels." },
          { text: "Oui, en retirant le Stop Loss", correct: false, explain: "Supprimer le Stop Loss avant une banque centrale est la pire erreur possible." }
        ],
        xp: 150
      },
      {
        id: "c7_2",
        code: "C7.2",
        title: "Gestion Dynamique en Position (Breakeven & TP Partiels)",
        theory: "Une fois le trade en gain de +1R (1 fois le risque initial), déplacer le Stop Loss au point d'entrée (Breakeven). Le trade devient 'gratuit' (zéro risque). Prendre 50% de bénéfices à +2R et laisser courir les 50% restants avec un trailing stop pour capter les grandes tendances.",
        question: "Vous avez acheté une action à 100 $ avec un Stop Loss initial à 96 $ (risque de 4 $). Le cours cote désormais 108 $ (+2R). Quelle est la gestion professionnelle recommandée ?",
        options: [
          { text: "Déplacer le Stop Loss au point d'entrée (100 $) pour éliminer tout risque et sécuriser un bénéfice partiel sur 50% de la position", correct: true, explain: "Parfait ! Vous sécurisez vos profits tout en laissant le capital restant courir sans aucun stress." },
          { text: "Laisser le Stop Loss à 96 $ et risquer de transformer un trade gagnant en trade perdant", correct: false, explain: "Ne jamais laisser un trade ayant pris +2R redevenir perdant est une règle cardinale." },
          { text: "Tout clôturer par peur dès que le cours baisse de 0.05 $", correct: false, explain: "Couper ses gains trop tôt détruit l'asymétrie du ratio Risk/Reward." }
        ],
        xp: 150
      },
      {
        id: "c7_3",
        code: "C7.3",
        title: "Audit de Performance CRM & Profit Factor",
        theory: "Le Profit Factor = Somme de tous les gains bruts / Somme de toutes les pertes brutes. Un Profit Factor > 1.5 indique une stratégie robuste et exploitable institutionnellement. Le Sharpe Ratio mesure quant à lui le rendement par rapport à la volatilité subie.",
        question: "Sur un échantillon de 50 trades clôturés ce mois-ci, votre CRM enregistre 24 000 € de gains bruts et 12 000 € de pertes brutes. Quel est votre Profit Factor ?",
        options: [
          { text: "0.50", correct: false, explain: "0.50 signifierait que vous perdez deux fois plus que vous ne gagnez." },
          { text: "2.00 (Excellente rentabilité)", correct: true, explain: "Exact ! 24 000 € / 12 000 € = 2.00. Pour chaque euro perdu, votre système génère 2 euros de gains !" },
          { text: "1.20", correct: false, explain: "Calcul incorrect : 24 000 divisé par 12 000 donne exactement 2.00." }
        ],
        xp: 150
      }
    ]
  }
];

// =============================================================================
// 3. ÉTAT LOCAL PERSISTÉ (LOCALSTORAGE)
// =============================================================================
const STORAGE_KEY = 'mastertrade_100_state_v1';

const defaultState = {
  validatedCompetencies: {}, // id: true
  studentName: "Adam M.",
  soundEnabled: true,
  answersGiven: {} // id: selectedOptionIndex
};

let appState = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
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
  updateUI();
}

// =============================================================================
// 4. RENDU DE L'INTERFACE UTILISATEUR
// =============================================================================
function renderPillars() {
  const container = document.getElementById('pillars-container');
  if (!container) return;

  container.innerHTML = '';

  PILLARS_DATA.forEach(pillar => {
    const pillarCard = document.createElement('article');
    pillarCard.className = `pillar-card ${pillar.id}`;
    pillarCard.id = pillar.id;

    // Check pillar completion
    const totalComps = pillar.competencies.length;
    let validatedCount = 0;
    pillar.competencies.forEach(c => {
      if (appState.validatedCompetencies[c.id]) validatedCount++;
    });
    const pillarPercent = Math.round((validatedCount / totalComps) * 100);
    if (pillarPercent === 100) {
      pillarCard.classList.add('mastered');
    }

    // Header
    const header = document.createElement('div');
    header.className = 'pillar-header';
    header.innerHTML = `
      <div class="pillar-header-left">
        <div class="pillar-icon-box ${pillar.iconClass}">${pillar.iconSymbol}</div>
        <div class="pillar-info">
          <h3>
            <span>${pillar.num}. ${pillar.title}</span>
            ${pillarPercent === 100 ? '<span class="comp-badge" style="background: rgba(0, 230, 118, 0.2); color: #00e676;">MAÎTRISÉ 100% ✓</span>' : ''}
          </h3>
          <p>${pillar.desc}</p>
        </div>
      </div>
      <div class="pillar-header-right">
        <div class="pillar-score-box">
          <span class="pillar-score-text">${pillarPercent}%</span>
          <div class="pillar-mini-track">
            <div class="pillar-mini-fill" style="width: ${pillarPercent}%; background: ${pillarPercent === 100 ? 'var(--color-success)' : 'var(--color-accent)'};"></div>
          </div>
        </div>
      </div>
    `;

    // Competencies List
    const compList = document.createElement('div');
    compList.className = 'competencies-list';

    pillar.competencies.forEach(comp => {
      const isValidated = !!appState.validatedCompetencies[comp.id];
      const compItem = document.createElement('div');
      compItem.className = `comp-item ${isValidated ? 'validated' : ''}`;
      compItem.id = `comp-box-${comp.id}`;

      // Competency Header
      const compHeader = document.createElement('div');
      compHeader.className = 'comp-header';
      compHeader.innerHTML = `
        <div class="comp-header-left">
          <span class="comp-badge">${comp.code}</span>
          <span class="comp-title">${comp.title}</span>
        </div>
        <div class="comp-header-right">
          <span class="comp-status-pill">
            ${isValidated ? '✓ Validée 100%' : 'À valider'}
          </span>
        </div>
      `;

      compHeader.addEventListener('click', () => {
        playSound('click');
        compItem.classList.toggle('open');
      });

      // Competency Body
      const compBody = document.createElement('div');
      compBody.className = 'comp-body';

      // Theory Box
      let bodyHtml = `
        <div class="theory-rule-box">
          <div class="theory-title">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            RÈGLE D'OR THÉORIQUE
          </div>
          <p>${comp.theory}</p>
        </div>
      `;

      // Interactive Calculator if any
      if (comp.hasInteractiveCalc === 'margin') {
        bodyHtml += `
          <div class="exercise-box">
            <div class="exercise-header">
              <span class="exercise-kicker">SIMULATEUR DE SPREAD & MARGE EN DIRECT</span>
            </div>
            <div class="mini-calc-grid">
              <div class="mini-input-group">
                <label>Paire de devises :</label>
                <input type="text" class="mini-input" value="EUR/USD" readonly>
              </div>
              <div class="mini-input-group">
                <label>Taille en Lots (1 Lot = 100 000 €) :</label>
                <input type="number" id="calc-lots-input" class="mini-input" value="1.0" step="0.1" min="0.01">
              </div>
              <div class="mini-input-group">
                <label>Effet de Levier Broker :</label>
                <select id="calc-leverage-select" class="mini-input">
                  <option value="30">1 : 30 (Régulation ESMA)</option>
                  <option value="100">1 : 100</option>
                  <option value="500">1 : 500 (Offshore)</option>
                </select>
              </div>
            </div>
            <div class="mini-calc-result">
              <span>Marge requise bloquée :</span>
              <strong id="calc-margin-output">3 333,33 €</strong>
            </div>
          </div>
        `;
      }

      // Position size calculator if any
      if (comp.hasInteractiveCalc === 'lots') {
        bodyHtml += `
          <div class="exercise-box">
            <div class="exercise-header">
              <span class="exercise-kicker">CALCULATEUR DE TAILLE DE POSITION AU PIP PRÈS</span>
            </div>
            <div class="mini-calc-grid">
              <div class="mini-input-group">
                <label>Capital du Compte (€) :</label>
                <input type="number" id="risk-capital-input" class="mini-input" value="25000">
              </div>
              <div class="mini-input-group">
                <label>Risque Alloué (%) :</label>
                <input type="number" id="risk-percent-input" class="mini-input" value="1.0" step="0.5" max="5">
              </div>
              <div class="mini-input-group">
                <label>Distance Stop Loss (Pips) :</label>
                <input type="number" id="risk-pips-input" class="mini-input" value="25">
              </div>
            </div>
            <div class="mini-calc-result">
              <span>Volume optimal à entrer :</span>
              <strong id="calc-optimal-lots">1.09 Lot Standard</strong>
            </div>
          </div>
        `;
      }

      // Pre-trade checklist if any
      if (comp.hasInteractiveChecklist) {
        bodyHtml += `
          <div class="exercise-box">
            <div class="exercise-header">
              <span class="exercise-kicker">CHECKLIST PRÉ-SESSION CRM (6 GATES)</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px; font-size:0.85rem; margin-bottom:12px;">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" checked disabled> 1. Tendance de fond HTF (Daily/4H) identifiée</label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" checked disabled> 2. Niveau clé (Support/Résistance ou Order Block) validé</label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" checked disabled> 3. Signal de bougie Price Action (Pin Bar / Rejet) formé</label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" checked disabled> 4. Risque monétaire strictement ≤ 1% du compte</label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" checked disabled> 5. Ratio Risk/Reward minimum de 1:2 calculé</label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer; color:var(--color-danger);"><input type="checkbox" disabled> 6. Absence d'annonce rouge majeure dans les 30 min (ÉCHEC)</label>
            </div>
          </div>
        `;
      }

      // Quiz Exercise Box
      bodyHtml += `
        <div class="exercise-box">
          <div class="exercise-header">
            <span class="exercise-kicker">CAS PRATIQUE D'ÉVALUATION INTERACTIVE</span>
            <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">+${comp.xp} XP</span>
          </div>
          <div class="exercise-question">${comp.question}</div>
          <div class="quiz-options" id="quiz-options-${comp.id}">
      `;

      comp.options.forEach((opt, idx) => {
        const letters = ['A', 'B', 'C'];
        bodyHtml += `
          <button class="quiz-option-btn" data-comp="${comp.id}" data-opt="${idx}">
            <span class="option-marker">${letters[idx]}</span>
            <span>${opt.text}</span>
          </button>
        `;
      });

      bodyHtml += `
          </div>
          <div class="exercise-feedback" id="feedback-${comp.id}"></div>
        </div>

        <div class="comp-actions-bar">
          <div class="comp-xp-info">
            Statut : <strong id="action-status-${comp.id}">${isValidated ? 'Validé ✓ (100%)' : 'Répondez au cas pratique'}</strong>
          </div>
          <button class="btn-validate-comp" id="btn-val-${comp.id}" ${isValidated ? 'disabled' : ''}>
            ${isValidated ? '✓ Compétence Validée' : 'Valider la Compétence'}
          </button>
        </div>
      `;

      compBody.innerHTML = bodyHtml;

      compItem.appendChild(compHeader);
      compItem.appendChild(compBody);
      compList.appendChild(compItem);
    });

    pillarCard.appendChild(header);
    pillarCard.appendChild(compList);
    container.appendChild(pillarCard);
  });

  setupInteractiveEventListeners();
}

// =============================================================================
// 5. ÉVÉNEMENTS INTERACTIFS & VALIDATION
// =============================================================================
function setupInteractiveEventListeners() {
  // Setup Quiz Option Clicks
  document.querySelectorAll('.quiz-option-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const compId = btn.getAttribute('data-comp');
      const optIdx = parseInt(btn.getAttribute('data-opt'), 10);
      handleQuizAnswer(compId, optIdx);
    });
  });

  // Setup Validate Buttons
  document.querySelectorAll('.btn-validate-comp').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const compId = btn.id.replace('btn-val-', '');
      validateCompetency(compId);
    });
  });

  // Setup Margin Calc Inputs
  const lotsInput = document.getElementById('calc-lots-input');
  const levSelect = document.getElementById('calc-leverage-select');
  if (lotsInput && levSelect) {
    const updateMargin = () => {
      const lots = parseFloat(lotsInput.value) || 1.0;
      const lev = parseFloat(levSelect.value) || 30;
      const notional = lots * 100000;
      const margin = notional / lev;
      const out = document.getElementById('calc-margin-output');
      if (out) out.innerText = margin.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
    };
    lotsInput.addEventListener('input', updateMargin);
    levSelect.addEventListener('change', updateMargin);
  }

  // Setup Position Size Calc
  const capIn = document.getElementById('risk-capital-input');
  const pctIn = document.getElementById('risk-percent-input');
  const pipsIn = document.getElementById('risk-pips-input');
  if (capIn && pctIn && pipsIn) {
    const updatePositionSize = () => {
      const cap = parseFloat(capIn.value) || 25000;
      const pct = parseFloat(pctIn.value) || 1.0;
      const pips = parseFloat(pipsIn.value) || 25;
      const riskAmount = cap * (pct / 100);
      const pipValueEuro = 9.20; // Approx 10 USD on EUR/USD
      const lots = riskAmount / (pips * pipValueEuro);
      const out = document.getElementById('calc-optimal-lots');
      if (out) out.innerText = lots.toFixed(2) + ' Lot Standard';
    };
    capIn.addEventListener('input', updatePositionSize);
    pctIn.addEventListener('input', updatePositionSize);
    pipsIn.addEventListener('input', updatePositionSize);
  }
}

function handleQuizAnswer(compId, optIdx) {
  // Find competency data
  let compData = null;
  PILLARS_DATA.forEach(p => {
    const c = p.competencies.find(x => x.id === compId);
    if (c) compData = c;
  });
  if (!compData) return;

  const selectedOpt = compData.options[optIdx];
  const isCorrect = selectedOpt.correct;

  // Sound FX
  if (isCorrect) {
    playSound('success');
  } else {
    playSound('wrong');
  }

  // Highlight buttons
  const optButtons = document.querySelectorAll(`.quiz-option-btn[data-comp="${compId}"]`);
  optButtons.forEach((b, idx) => {
    b.classList.remove('selected-correct', 'selected-wrong');
    if (idx === optIdx) {
      b.classList.add(isCorrect ? 'selected-correct' : 'selected-wrong');
    }
  });

  // Display feedback
  const feedbackEl = document.getElementById(`feedback-${compId}`);
  if (feedbackEl) {
    feedbackEl.className = `exercise-feedback ${isCorrect ? 'correct' : 'wrong'}`;
    feedbackEl.innerHTML = `
      <strong>${isCorrect ? '✓ Réponse Exacte !' : '✕ Erreur de raisonnement'}</strong>
      <p style="margin-top:4px;">${selectedOpt.explain}</p>
    `;
  }

  // If correct, enable validate button
  const valBtn = document.getElementById(`btn-val-${compId}`);
  const statusLabel = document.getElementById(`action-status-${compId}`);
  if (isCorrect && valBtn && !appState.validatedCompetencies[compId]) {
    valBtn.disabled = false;
    valBtn.classList.add('btn-primary');
    if (statusLabel) statusLabel.innerText = 'Réussite ! Cliquez pour valider';
  }
}

function validateCompetency(compId) {
  if (appState.validatedCompetencies[compId]) return;

  appState.validatedCompetencies[compId] = true;
  saveState();
  playSound('success');

  // Check if 100% reached
  const total = 21;
  const currentCount = Object.keys(appState.validatedCompetencies).length;
  if (currentCount === total) {
    triggerCelebration();
  } else {
    renderPillars();
  }
}

// =============================================================================
// 6. GAUGE ET MÉTRIQUES GLOBALES (0% À 100%)
// =============================================================================
function updateUI() {
  const totalCompetencies = 21;
  const validatedCount = Object.keys(appState.validatedCompetencies).length;
  const overallPercent = Math.round((validatedCount / totalCompetencies) * 100);

  // Header circular chart (stroke-dasharray)
  const headerCircle = document.getElementById('header-circle-fill');
  const headerText = document.getElementById('header-percent-text');
  const headerComps = document.getElementById('header-competencies-text');
  if (headerCircle) headerCircle.setAttribute('stroke-dasharray', `${overallPercent}, 100`);
  if (headerText) headerText.innerText = `${overallPercent}%`;
  if (headerComps) headerComps.innerText = `${validatedCount} / ${totalCompetencies} validées`;

  // Hero Big Gauge (Circumference of r=50 is ~314.16)
  const heroCircle = document.getElementById('gauge-fill-lg');
  const heroText = document.getElementById('gauge-large-percent');
  if (heroCircle) {
    const dashVal = (overallPercent / 100) * 314.16;
    heroCircle.setAttribute('stroke-dasharray', `${dashVal} 314.16`);
  }
  if (heroText) heroText.innerText = `${overallPercent}%`;

  // Hero Meta
  const metaCount = document.getElementById('meta-completed-count');
  const metaXP = document.getElementById('meta-xp-total');
  const metaAspects = document.getElementById('meta-aspects-mastered');
  if (metaCount) metaCount.innerText = `${validatedCount} / ${totalCompetencies}`;
  if (metaXP) metaXP.innerText = `${validatedCount * 150} XP`;

  // Count fully mastered pillars
  let masteredPillars = 0;
  PILLARS_DATA.forEach(p => {
    const isPillarFull = p.competencies.every(c => appState.validatedCompetencies[c.id]);
    if (isPillarFull) masteredPillars++;

    // Update filter badge
    const badge = document.getElementById(`badge-p${p.num}`);
    if (badge) {
      let count = 0;
      p.competencies.forEach(c => { if (appState.validatedCompetencies[c.id]) count++; });
      const pPct = Math.round((count / p.competencies.length) * 100);
      badge.innerText = `${pPct}%`;
    }
  });

  if (metaAspects) metaAspects.innerText = `${masteredPillars} / 7`;

  const allBadge = document.getElementById('badge-all');
  if (allBadge) allBadge.innerText = `${overallPercent}%`;

  // Global linear bar
  const progressBar = document.getElementById('global-progress-bar');
  if (progressBar) progressBar.style.width = `${overallPercent}%`;

  // Rank Badge
  const rankLabel = document.getElementById('current-rank-label');
  if (rankLabel) {
    if (overallPercent < 20) {
      rankLabel.className = 'rank-tag rank-novice';
      rankLabel.innerText = 'Niv. 1 · Novice';
    } else if (overallPercent < 40) {
      rankLabel.className = 'rank-tag rank-junior';
      rankLabel.innerText = 'Niv. 2 · Apprenti Technique';
    } else if (overallPercent < 70) {
      rankLabel.className = 'rank-tag rank-advanced';
      rankLabel.innerText = 'Niv. 3 · Gestionnaire Prudent';
    } else if (overallPercent < 100) {
      rankLabel.className = 'rank-tag rank-advanced';
      rankLabel.innerText = 'Niv. 4 · Analyste Confirmé';
    } else {
      rankLabel.className = 'rank-tag rank-master';
      rankLabel.innerText = '🏆 Trader Pro Certifié (100%)';
    }
  }

  // Certificate Modal State
  const certPrintBtn = document.getElementById('btn-print-certificate');
  const certMsg = document.getElementById('cert-modal-status-msg');
  if (certPrintBtn) {
    certPrintBtn.disabled = overallPercent < 100;
  }
  if (certMsg) {
    if (overallPercent === 100) {
      certMsg.innerHTML = '<strong style="color:var(--color-success)">🎉 Félicitations ! Vos 7 aspects sont validés à 100%. Votre attestation officielle est déverrouillée !</strong>';
    } else {
      certMsg.innerText = `Encore ${totalCompetencies - validatedCount} compétences à valider pour débloquer votre diplôme officiel.`;
    }
  }
}

// =============================================================================
// 7. CÉLÉBRATION 100% & CONFETTI CANVAS
// =============================================================================
function triggerCelebration() {
  renderPillars();
  playSound('fanfare');
  launchConfetti();

  setTimeout(() => {
    openCertificateModal();
  }, 1200);
}

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiPieces = [];
  const colors = ['#00d2ff', '#00e676', '#ffb300', '#ff5252', '#a78bfa', '#ffffff'];

  for (let i = 0; i < 150; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 4 + 2,
      speedX: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 10 - 5
    });
  }

  let animationFrame;
  let startTime = Date.now();

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();

      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;

      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    });

    if (Date.now() - startTime < 6000) {
      animationFrame = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }
  render();
}

// =============================================================================
// 8. CERTIFICAT & MODAL
// =============================================================================
function openCertificateModal() {
  const modal = document.getElementById('certificate-modal');
  if (modal) modal.classList.add('active');
  playSound('click');
}

function closeCertificateModal() {
  const modal = document.getElementById('certificate-modal');
  if (modal) modal.classList.remove('active');
  playSound('click');
}

// =============================================================================
// 9. INITIALISATION AU CHARGEMENT DE LA PAGE
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  renderPillars();
  updateUI();

  // Navigation Filter Buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.pillar-card').forEach(card => {
        if (filter === 'all' || card.id === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Sound Toggle Button
  const soundBtn = document.getElementById('btn-sound-toggle');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      const label = document.getElementById('sound-label');
      if (label) label.innerText = soundEnabled ? 'Audio FX' : 'Muet';
      soundBtn.classList.toggle('btn-primary', soundEnabled);
      playSound('click');
    });
  }

  // Reset Progress Button
  const resetBtn = document.getElementById('btn-reset-progress');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm("Voulez-vous réinitialiser votre progression à 0% pour vous ré-entraîner ?")) {
        appState.validatedCompetencies = {};
        saveState();
        renderPillars();
        playSound('wrong');
      }
    });
  }

  // View Certificate Button
  const certBtn = document.getElementById('btn-view-certificate');
  if (certBtn) certBtn.addEventListener('click', openCertificateModal);

  const closeCertBtn = document.getElementById('btn-close-cert');
  if (closeCertBtn) closeCertBtn.addEventListener('click', closeCertificateModal);

  // Print Certificate Button
  const printBtn = document.getElementById('btn-print-certificate');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Student Name Input
  const nameInput = document.getElementById('cert-student-name');
  if (nameInput) {
    nameInput.value = appState.studentName || "Adam M.";
    nameInput.addEventListener('input', () => {
      appState.studentName = nameInput.value;
      saveState();
    });
  }
});
