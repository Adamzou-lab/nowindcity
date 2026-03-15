// map.js — Gestion de la carte Leaflet et des marqueurs de villes

/**
 * Retourne la couleur et l'emoji associés à un score de vent (0-10).
 * Un score élevé signifie peu de vent (favorable aux cheveux bouclés).
 * @param {number} score - Score Frizz de 0 à 10
 * @returns {{ color: string, emoji: string }}
 */
const getWindCategory = (score) => {
  if (score >= 8) return { color: '#0ea5e9', emoji: '😄' }; // Très calme — sky-500
  if (score >= 6) return { color: '#38bdf8', emoji: '🙂' }; // Calme — sky-400
  if (score >= 4) return { color: '#7dd3fc', emoji: '😐' }; // Modéré — sky-300
  if (score >= 2) return { color: '#bae6fd', emoji: '😕' }; // Venteux — sky-200
  return { color: '#e0f2fe', emoji: '😩' };                  // Très venteux — sky-100
};

/**
 * Initialise la carte Leaflet centrée sur la France.
 * Utilise les tuiles CartoDB Positron.
 * @param {string} containerId - ID de l'élément HTML qui contiendra la carte
 * @returns {L.Map} L'objet carte Leaflet
 */
const initMap = (containerId) => {
  // Création de la carte centrée sur la France
  const map = L.map(containerId).setView([46.5, 2.5], 6);

  // Ajout du fond de carte CartoDB Positron
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  return map;
};

/**
 * Ajoute un marqueur circulaire coloré pour une ville sur la carte.
 * @param {L.Map} map - L'objet carte Leaflet
 * @param {{ name: string, lat: number, lng: number, region: string }} city - Données de la ville
 * @param {number} score - Score Frizz de 0 à 10
 * @param {{ speed: number, gusts: number }} windData - Données de vent
 * @returns {L.CircleMarker} Le marqueur créé
 */
const addCityMarker = (map, city, score, windData) => {
  const { color, emoji } = getWindCategory(score);

  // Création du marqueur circulaire avec couleur selon le score
  const marker = L.circleMarker([city.lat, city.lng], {
    radius: 14,
    fillColor: color,
    fillOpacity: 0.9,
    color: '#ffffff',
    weight: 2,
  });

  // Contenu de la popup avec les informations de la ville
  const popupContent = `
    <div class="popup-content">
      <h3 class="popup-city">${emoji} ${city.name}</h3>
      <p class="popup-region">${city.region}</p>
      <hr />
      <p class="popup-wind">
        <span class="popup-label">Vent :</span>
        <span class="popup-value">${windData.speed.toFixed(1)} km/h</span>
      </p>
      <p class="popup-gusts">
        <span class="popup-label">Rafales :</span>
        <span class="popup-value">${windData.gusts.toFixed(1)} km/h</span>
      </p>
      <p class="popup-score">
        <span class="popup-label">Score Frizz :</span>
        <span class="popup-value">${score.toFixed(1)} / 10</span>
      </p>
    </div>
  `;

  marker.bindPopup(popupContent);
  marker.addTo(map);

  return marker;
};

/**
 * Supprime un tableau de marqueurs de la carte.
 * @param {L.Map} map - L'objet carte Leaflet
 * @param {L.CircleMarker[]} markers - Tableau des marqueurs à supprimer
 * @returns {void}
 */
const clearMarkers = (map, markers) => {
  markers.forEach((marker) => {
    map.removeLayer(marker);
  });
};

/**
 * Met à jour tous les marqueurs de la carte à partir d'un tableau de données de villes.
 * @param {L.Map} map - L'objet carte Leaflet
 * @param {{ city: object, score: number, windData: object }[]} citiesData - Données des villes
 * @returns {L.CircleMarker[]} Tableau des marqueurs créés
 */
const updateAllMarkers = (map, citiesData) => {
  // Création des marqueurs pour chaque ville
  const markers = citiesData.map(({ city, score, windData }) =>
    addCityMarker(map, city, score, windData)
  );

  return markers;
};
