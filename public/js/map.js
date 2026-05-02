document.addEventListener("DOMContentLoaded", () => {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;
  if (!mapToken || typeof mapboxgl === "undefined") return;
  if (typeof listingData === "undefined") return;

  mapboxgl.accessToken = mapToken;

  let coords = [77.2090, 28.6139]; // default Delhi

  if (
    Array.isArray(listingData?.geometry?.coordinates) &&
    listingData.geometry.coordinates.length === 2
  ) {
    coords = listingData.geometry.coordinates;
  }

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: coords,
    zoom: 9,
  });

  new mapboxgl.Marker({ color: "red" })
    .setLngLat(coords)
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `<h6>${listingData.title || ""}</h6>
         <p>${listingData.location || ""}</p>`
      )
    )
    .addTo(map);
});