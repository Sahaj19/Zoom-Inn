try {
  mapboxgl.accessToken = mapToken;
  console.log(mapToken);

  if (listing && listing.geometry && listing.geometry.coordinates) {
    const map = new mapboxgl.Map({
      container: "map",
      center: listing.geometry.coordinates,
      zoom: 12,
    });

    const marker = new mapboxgl.Marker({ color: "red" })
      .setLngLat(listing.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h4>${listing.location}</h4>`
        )
      )
      .addTo(map);
  } else {
    throw new Error("Please fill the details carefully!");
  }
} catch (error) {
  console.error("An error occurred:", error);
  throw new Error("Please fill the details carefully!");
}
