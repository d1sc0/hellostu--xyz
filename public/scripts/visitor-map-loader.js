

function reviveFunctions(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string' && obj[key].startsWith('function')) {
      obj[key] = eval('(' + obj[key] + ')');
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      reviveFunctions(obj[key]);
    }
  }
  return obj;
}

function circleWithText(latLng, txt, radius, borderWidth, circleClass) {
  var size = radius * 2;
  var style =
    'style="width: ' +
    size +
    'px; height: ' +
    size +
    'px; border-width: ' +
    borderWidth +
    'px;"';
  var iconSize = size + borderWidth * 2;
  var icon = L.divIcon({
    html:
      '<span class="circle ' +
      circleClass +
      '" ' +
      style +
      '>' +
      txt +
      '</span>',
    className: '',
    iconSize: [iconSize, iconSize],
  });
  var marker = L.marker(latLng, {
    icon: icon,
  });
  return marker;
}

function renderVisitorMap(container) {
  const config = reviveFunctions(JSON.parse(container.dataset.config));
  const {
    homeData,
    visitorData,
    center,
    zoom,
    tileUrl,
    tileAttribution,
    buttonViews,
  } = config;

  const map = L.map(container.id, { zoomSnap: 0.5 }).setView(center, zoom);

  L.tileLayer(tileUrl, {
    maxZoom: 19,
    attribution: tileAttribution,
  }).addTo(map);

  L.geoJSON(homeData, {
    pointToLayer: function (feature, latlng) {
      return circleWithText(latlng, 'TGF', 13, 2, 'circle2');
    },
  }).addTo(map);

  function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.HomeName) {
      layer.bindPopup(
        'Number of unique athleteIDs to <br/>visit the Great Field parkrun<br/> from <strong>' +
          feature.properties.HomeName +
          '</strong> is: ' +
          feature.properties.NoOfAthletes,
      );
    }
  }

  L.geoJSON(visitorData, {
    pointToLayer: function (feature, latlng) {
      return circleWithText(
        latlng,
        feature.properties.NoOfAthletes,
        18,
        2,
        'circle1',
      );
    },
    onEachFeature,
  }).addTo(map);

  // Button handlers
  if (buttonViews && Array.isArray(buttonViews)) {
    buttonViews.forEach(({ id, center, zoom }) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          map.setView(center, zoom);
        });
      }
    });
  }
}

for (const el of document.querySelectorAll('[data-config]')) {
  renderVisitorMap(el);
}
