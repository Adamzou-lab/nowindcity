# nowindcity — Règles globales du projet

## Identité
Application web de carte interactive des vents en France.
Nom : nowindcity
Concept : aider les gens aux cheveux bouclés à trouver les villes les moins venteuses.

## Stack technique
- Vanilla HTML / CSS / JavaScript (pas de framework)
- Leaflet.js pour la carte interactive
- Open-Meteo API (gratuite, sans clé)

## Palette de couleurs
- --sky-50: #f0f9ff
- --sky-100: #e0f2fe
- --sky-200: #bae6fd
- --sky-300: #7dd3fc
- --sky-400: #38bdf8
- --sky-500: #0ea5e9
- --sky-600: #0284c7
- --sky-800: #075985
- --white: #ffffff
- --text: #0c4a6e
- Police : Outfit (Google Fonts)

## Conventions de code
- ES6+ uniquement, pas de var
- Commentaires en français
- Indentation : 2 espaces
- Noms de fonctions en camelCase

## Structure des fichiers
- css/style.css → styles globaux
- js/api.js → appels API et cache
- js/map.js → carte Leaflet
- js/data.js → traitement des données
- js/ui.js → interactions interface
- data/cities.json → liste des villes