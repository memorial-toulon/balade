/* ==========================================================
   Bouton « Ma position » : affiche la position du visiteur sur la carte
   (nécessite l'accord du visiteur ; rien n'est enregistré)
   ========================================================== */
(function () {
  if (typeof map === 'undefined' || !navigator.geolocation) { return; }

  var point = null, cercle = null, premiereFois = true, suivi = false;

  var Bouton = L.Control.extend({
    options: { position: 'bottomright' },
    onAdd: function () {
      var div = L.DomUtil.create('div', 'leaflet-bar ma-position');
      var a = L.DomUtil.create('a', '', div);
      a.href = '#';
      a.title = 'Afficher ma position';
      a.setAttribute('role', 'button');
      a.setAttribute('aria-label', 'Afficher ma position');
      a.innerHTML = '<i class="fa fa-location-arrow"></i>';
      L.DomEvent.on(a, 'click', function (e) {
        L.DomEvent.preventDefault(e);
        L.DomEvent.stopPropagation(e);
        if (point) { map.setView(point.getLatLng(), Math.max(map.getZoom(), 16)); }
        if (!suivi) {
          suivi = true;
          premiereFois = true;
          L.DomUtil.addClass(div, 'actif');
          map.locate({ watch: true, setView: false, enableHighAccuracy: true });
        }
      });
      return div;
    }
  });
  map.addControl(new Bouton());

  map.on('locationfound', function (e) {
    if (!point) {
      cercle = L.circle(e.latlng, { radius: e.accuracy, color: '#635420', weight: 1, fillColor: '#E8BE07', fillOpacity: 0.15 }).addTo(map);
      point = L.circleMarker(e.latlng, { radius: 8, color: '#FFFFFF', weight: 3, fillColor: '#635420', fillOpacity: 1 })
        .bindTooltip('Vous êtes ici').addTo(map);
    } else {
      point.setLatLng(e.latlng);
      cercle.setLatLng(e.latlng).setRadius(e.accuracy);
    }
    if (premiereFois) {
      premiereFois = false;
      map.setView(e.latlng, Math.max(map.getZoom(), 16));
    }
  });

  map.on('locationerror', function () {
    suivi = false;
    var b = document.querySelector('.ma-position');
    if (b) { b.classList.remove('actif'); }
    var msg = L.DomUtil.create('div', 'ma-position-erreur', document.getElementById('map'));
    msg.textContent = 'Position indisponible : autorisez la localisation dans votre navigateur.';
    setTimeout(function () { msg.remove(); }, 5000);
  });
})();
