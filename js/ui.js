// ui.js — Orchestration de l'interface et des interactions utilisateur

const CITIES_URL = './data/cities.json';

// État de l'application
let map = null;
let currentMarkers = [];

/**
 * Charge la liste des villes depuis le fichier JSON local.
 * @returns {Promise<Array>}
 */
const loadCities = async () => {
  const response = await fetch(CITIES_URL);
  if (!response.ok) throw new Error('Impossible de charger cities.json');
  return response.json();
};

/**
 * Crée une card de ville pour la sidebar.
 * @param {object} city - { name, lat, lng, region }
 * @param {number} score - Score Frizz 0-10
 * @param {object} windData - { speed, gusts }
 * @returns {HTMLElement}
 */
const createCityCard = (city, score, windData) => {
  const { label, color, emoji } = getWindCategory(score);

  const card = document.createElement('div');
  card.className = 'city-card';

  card.innerHTML = `
    <div class="city-card-header">
      <span class="city-name">${city.name}</span>
      <span class="frizz-score" style="background:${color}20; color:${color}">
        ${emoji} ${score.toFixed(1)}
      </span>
    </div>
    <div class="city-card-footer">
      <span class="city-region">${city.region}</span>
      <span class="wind-badge">${windData.speed.toFixed(0)} km/h · ${label}</span>
    </div>
  `;

  return card;
};

/**
 * Remplit la sidebar avec les villes triées par score croissant (moins de vent en premier).
 * @param {Array} results - [{ city, score, windData }]
 */
const renderCityList = (results) => {
  const list = document.getElementById('city-list');
  list.innerHTML = '';

  // Tri par score croissant : score faible = peu de vent = idéal
  const sorted = [...results].sort((a, b) => a.score - b.score);

  sorted.forEach(({ city, score, windData }) => {
    list.appendChild(createCityCard(city, score, windData));
  });
};

/**
 * Met à jour le message de statut dans la sidebar.
 * @param {string} message
 */
const setStatus = (message) => {
  document.getElementById('status-message').textContent = message;
};

/**
 * Lance l'analyse des vents pour toutes les villes.
 */
const analyserVents = async () => {
  const btn = document.getElementById('btn-analyser');

  btn.disabled = true;
  btn.textContent = 'Analyse en cours…';
  setStatus('Récupération des données météo…');

  try {
    const cities = await loadCities();
    setStatus(`Interrogation de ${cities.length} villes…`);

    // Récupération parallèle pour toutes les villes
    const results = await Promise.all(
      cities.map(async (city) => {
        const windData = await fetchWindData(city.lat, city.lng);
        const score = calculateFrizzScore(windData.speed, windData.gusts);
        return { city, score, windData };
      })
    );

    // Nettoyage des anciens marqueurs
    clearMarkers(map, currentMarkers);

    // Affichage des nouveaux marqueurs sur la carte
    currentMarkers = updateAllMarkers(map, results);

    // Mise à jour de la liste dans la sidebar
    renderCityList(results);

    // Trouver la ville la moins venteuse
    const best = [...results].sort((a, b) => a.score - b.score)[0];
    setStatus(`Meilleure ville : ${best.city.name} (${best.score.toFixed(1)}/10)`);

    btn.textContent = 'Actualiser';
  } catch (error) {
    setStatus(`Erreur : ${error.message}`);
    btn.textContent = 'Réessayer';
  } finally {
    btn.disabled = false;
  }
};

/**
 * Initialisation de l'application au chargement de la page.
 */
const init = () => {
  map = initMap('map');

  document.getElementById('btn-analyser').addEventListener('click', analyserVents);

  // Lancement automatique au démarrage
  analyserVents();
};

document.addEventListener('DOMContentLoaded', init);
