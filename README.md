# TradeFlow CRM · Académie Pro Trader

Application web interactive d'apprentissage institutionnel du trading construite sur la métaphore d'un **CRM commercial & d'entreprise**.

---

## 🌟 La Métaphore CRM appliquée au Trading

Sur les marchés financiers, les particuliers abordent souvent le trading comme un jeu de casino ou une prédiction d'avenir. À l'opposé, les banques d'investissement et les fonds spéculatifs gèrent chaque position comme un **contrat d'affaires rigoureux (Deal)** :

1. **Lead Qualification (Analyse Technique) :** Filtrer 90% du bruit pour ne retenir que les opportunités techniques irréprochables (niveaux clés, chandeliers de confirmation, breakouts).
2. **Pricing & Risk Policy (Gestion du Risque) :** Tarifer le risque au pip près, respecter le plafond d'exposition (1% max) et garantir la survie à long terme.
3. **Market Counterparty (Carnet d'Ordres DOM) :** Comprendre qui est en face : ordres Market vs Limit, absorption, liquidité et slippage.
4. **Macro Intelligence (Fondamentaux) :** Surveiller les catalyseurs macroéconomiques (NFP, CPI, Décisions de taux Fed).
5. **Behavioral Audit (Psychologie) :** Éradiquer le FOMO, le revenge trading et auditer les biais cognitifs.
6. **Deal Pipeline (Kanban Journal) :** Suivre le cycle de vie complet de ses positions de l'idée au post-mortem.

---

## 📚 Les 5 Modules de Spécificité & Exercices Interactifs

| Module | Spécificité du Trading | Exercice Pratique Intégré |
| :--- | :--- | :--- |
| **Module 1** | **Deal Screening (Chartisme & Price Action)** | **Pattern Scanner Interactif :** Graphique dynamique HTML5 Canvas avec tracé de résistance/support, réglage d'entrée, Stop Loss et Take Profit, et simulation bougie par bougie. |
| **Module 2** | **Pricing & Risk Management (Dimensionnement)** | **Calculateur de Lots & Crash Test Monte-Carlo :** Calcul mathématique de la taille de position au pip près et comparaison visuelle des courbes d'équité (1% vs 10% sur-levier). |
| **Module 3** | **Counterparties & Order Flow (Microstructure)** | **Simulateur DOM Live (Depth of Market) :** Carnet d'ordres animé à 10 niveaux, exécution d'ordres Market (avec calcul du slippage) vs Limit (Maker). |
| **Module 4** | **Macro Intelligence (Événements Économiques)** | **Défi Chrono Flash NFP (15s) :** Alerte en temps réel avec écart consensus vs résultat réel et choix éclair de la direction haussière/baissière sur l'USD. |
| **Module 5** | **Audit Psychologique (Discipline & Biais)** | **Simulateur de Sang-Froid :** Arbre de décision interactif avec jauge de capital émotionnel face aux situations de stress (Stop frôlé, euphorie, série de pertes). |
| **Pipeline** | **Journal Opérationnel Kanban** | **Pipeline CRM à 5 Colonnes :** Glisser-déposer de cartes, calcul automatique du Win Rate, Profit Factor et Espérance mathématique. |
| **Certificat** | **Validation & Attestation** | **Attestation Officielle :** Bilan audité des 5 compétences avec impression/export direct. |

---

## 🚀 Lancement & Utilisation Locale

L'application est 100% autonome et ne nécessite aucun outil de build (`npm`, `bundler`, etc.) ni serveur tiers :

1. Ouvrez simplement le fichier `index.html` dans n'importe quel navigateur moderne (Chrome, Safari, Firefox, Edge).
2. Ou lancez un serveur local rapide avec Python :
```bash
python3 -m http.server 8080
```
Puis rendez-vous sur `http://localhost:8080`.

---

## 🛠️ Stack Technique

- **HTML5 Sémantique :** Structure modulaire et accessible.
- **CSS3 Avancé :** Variables CSS personnalisées, design system sombre institutionnel, layout Flexbox & CSS Grid, animations fluides.
- **JavaScript Vanilla ES6+ :** Moteur d'état réactif, persistance `localStorage`, rendu Canvas 2D pour les chandeliers et la courbe de drawdown.
- **Web Audio API :** Synthétiseur sonore natif (chimes de victoire, alertes de stop, clics) sans aucun fichier audio externe requis.
