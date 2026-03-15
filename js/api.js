// api.js — Appels API Open-Meteo et traitement des données de vent

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes en millisecondes

/**
 * Récupère les données de vent depuis Open-Meteo pour une position donnée.
 * Utilise un cache localStorage avec un TTL de 30 minutes.
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<{speed: number, gusts: number, timestamp: number}>}
 */
const fetchWindData = async (lat, lng) => {
  const cacheKey = `nwc_${lat}_${lng}`;
  const now = Date.now();

  // Vérification du cache localStorage
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached);
    if (now - parsed.timestamp < CACHE_TTL) {
      return parsed;
    }
  }

  // Appel à l'API Open-Meteo
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=wind_speed_10m,wind_gusts_10m&wind_speed_unit=kmh`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur réseau : ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const current = data.current;

    const result = {
      speed: current.wind_speed_10m,
      gusts: current.wind_gusts_10m,
      timestamp: now,
    };

    // Mise en cache du résultat
    localStorage.setItem(cacheKey, JSON.stringify(result));

    return result;
  } catch (error) {
    throw new Error(`Impossible de récupérer les données de vent : ${error.message}`);
  }
};

/**
 * Calcule un score de frisottis (frizz) entre 0 et 10 selon la vitesse et les rafales.
 * Un score faible indique peu de vent — idéal pour les cheveux bouclés.
 * @param {number} speed - Vitesse du vent en km/h
 * @param {number} gusts - Vitesse des rafales en km/h
 * @returns {number} Score entre 0 et 10
 */
const calculateFrizzScore = (speed, gusts) => {
  // Pondération : 60% vitesse, 40% rafales
  const weighted = speed * 0.6 + gusts * 0.4;

  // Seuil de référence : 80 km/h correspond au score maximal de 10
  const REFERENCE_MAX = 80;

  const score = (weighted / REFERENCE_MAX) * 10;

  // Clamp entre 0 et 10, arrondi à une décimale
  return Math.round(Math.min(10, Math.max(0, score)) * 10) / 10;
};

/**
 * Retourne la catégorie de vent associée à un score donné.
 * @param {number} score - Score entre 0 et 10
 * @returns {{ label: string, color: string, emoji: string }}
 */
const getWindCategory = (score) => {
  if (score <= 2) {
    return { label: "Paradis", color: "#0ea5e9", emoji: "😇" };
  } else if (score <= 4) {
    return { label: "Calme", color: "#38bdf8", emoji: "😊" };
  } else if (score <= 6) {
    return { label: "Modéré", color: "#f59e0b", emoji: "😐" };
  } else if (score <= 8) {
    return { label: "Venteux", color: "#f97316", emoji: "😬" };
  } else {
    return { label: "Tempête", color: "#ef4444", emoji: "😱" };
  }
};
