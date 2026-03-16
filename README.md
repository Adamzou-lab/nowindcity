# nowindcity — Les villes les moins venteuses de France

> Fait avec Claude par Adamzou — Holberton School AI Engineer · 2025

---

## L'idée

Tout est parti d'une observation du quotidien : les personnes aux cheveux bouclés savent à quel point le vent peut ruiner une coiffure. Mais plus sérieusement, le vent impacte la qualité de vie — confort en terrasse, pratique du sport en extérieur, bien-être général.

L'idée : créer une carte interactive qui permet de visualiser et comparer les villes françaises selon leur niveau de vent, pour aider les gens à choisir où s'installer ou voyager en fonction de ce critère souvent ignoré.

---

## Le cheminement

Ce projet est né d'une collaboration entre une idée humaine et une exécution assistée par IA.

**1. Le concept** — L'idée, le nom "nowindcity" et les exigences viennent d'Adamzou : une carte de France interactive, des données météo en temps réel, un score de "frizz" pour quantifier le vent, et un design sky-blue moderne.

**2. L'architecture multi-agents** — Avant de coder, une architecture d'agents IA spécialisés a été définie dans `.claude/agents/` :
- **Manager** — chef d'orchestre, coordonne et valide
- **Scout** — génère et maintient `data/cities.json` avec les 30 grandes villes françaises
- **Aero** — designer UI, gère `css/style.css` avec le thème sky-blue
- **DataForge** — expert API, gère `js/api.js` (Open-Meteo + cache localStorage)
- **WindMapper** — expert cartographie, gère `js/map.js` (Leaflet.js)

**3. La stack technique** — Choix délibéré du vanilla JS sans framework, pour la légèreté et la maîtrise totale du code. L'API Open-Meteo a été choisie car elle est gratuite, sans clé, et fournit des données météo précises.

**4. Les données** — 30 grandes villes françaises avec leurs coordonnées précises, stockées dans `data/cities.json`. Les données de vent sont récupérées en temps réel via Open-Meteo et cachées 30 minutes en localStorage pour limiter les appels API.

**5. Le score Frizz** — Un score de 0 à 10 a été conçu pour quantifier le niveau de vent de façon intuitive, combinant vitesse du vent et rafales. Chaque ville reçoit une catégorie, une couleur et un emoji correspondant.

**6. Le SEO et la mise en production** — `robots.txt`, `sitemap.xml` et une `og-image.png` ont été générés pour assurer une bonne indexation et un rendu optimal sur les réseaux sociaux.

---

## Pourquoi "Fait avec Claude" ?

L'idée, la direction créative, le nom, le concept du score Frizz et toutes les décisions de design viennent d'Adamzou. Claude a été l'outil d'exécution et d'architecture.

Afficher cette mention, c'est être transparent sur sa méthode de travail — une approche qui fait partie intégrante de la formation AI Engineer à Holberton School.

---

## Stack technique

- HTML5 / CSS3 / JavaScript ES6+ (vanilla, aucun framework)
- **Leaflet.js** — carte interactive
- **Open-Meteo API** — données météo gratuites, sans clé
- Cache localStorage — TTL 30 minutes par ville
- Police : Outfit (Google Fonts)

---

## Fonctionnalités

- Carte interactive centrée sur la France
- 30 grandes villes françaises avec marqueurs colorés
- Données de vent en temps réel (vitesse + rafales)
- Score Frizz de 0 à 10 par ville
- Popups détaillés au clic sur chaque marqueur
- Sidebar avec classement des villes
- Cache intelligent pour limiter les appels API
- 100% responsive — mobile first

---

## Structure du projet

```
nowindcity/
├── index.html           # Point d'entrée
├── css/
│   └── style.css        # Styles globaux (thème sky-blue)
├── js/
│   ├── api.js           # Appels Open-Meteo + cache
│   ├── map.js           # Carte Leaflet + marqueurs
│   ├── data.js          # Traitement des données
│   └── ui.js            # Interactions interface
├── data/
│   └── cities.json      # 30 villes françaises + coordonnées
├── .claude/
│   └── agents/          # Définitions des agents IA
├── CLAUDE.md            # Règles du projet pour Claude
├── robots.txt
├── sitemap.xml
└── og-image.png
```

---

## Lancement local

```bash
# Python (sans installation)
python3 -m http.server 8080
# Ouvrir http://localhost:8080
```

---

## Auteur

**Adamzou** — Étudiant Holberton School, spécialisation AI Engineer
Hub : [adamzou.fr](https://adamzou.fr) · Projet : [nowindcity.adamzou.fr](https://nowindcity.adamzou.fr)
