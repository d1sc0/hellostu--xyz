import L from 'leaflet';

function reviveFunctions(obj) {
  // Recursively revive stringified functions in config
  for (const key in obj) {
    if (typeof obj[key] === 'string' && obj[key].startsWith('function')) {
      // eslint-disable-next-line no-new-func
      obj[key] = eval('(' + obj[key] + ')');
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      reviveFunctions(obj[key]);
    }
  }
  return obj;
}

function renderChoroplethMap(container) {
  const config = reviveFunctions(JSON.parse(container.dataset.config));
  const {
    geojsonData,
    center = [53.0, -3.0],
    zoom = 6,
    tileUrl,
    tileAttribution,
    styleProp = 'value',
    getColorStops = [],
    getColor,
    legendTitle = '',
    infoTitle = '',
    infoValue,
    legendPosition = 'topleft',
    attribution = '',
  } = config;

  const map = L.map(container.id, {
    zoomControl: false,
    dragging: false,
    boxZoom: false,
    touchZoom: false,
  }).setView(center, zoom);

  if (tileUrl) {
    L.tileLayer(tileUrl, {
      minZoom: zoom,
      maxZoom: zoom,
      attribution: tileAttribution,
    }).addTo(map);
  }

  // Info control
  const info = L.control();
  info.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };
  info.update = function (props) {
    let contents = '';
    if (props) {
      if (infoValue) contents = infoValue(props);
    } else {
      contents = '<br />Hover over a region';
    }
    this._div.innerHTML = `<strong>${infoTitle}</strong><br /><br />${contents}`;
  };
  info.addTo(map);

  // Style function
  function style(feature) {
    return {
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '2',
      fillOpacity: 0.7,
      fillColor: getColor(feature.properties[styleProp]),
    };
  }

  function highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
      weight: 2,
      color: '#fff',
      dashArray: '',
      fillOpacity: 0.7,
    });
    layer.bringToFront();
    info.update(layer.feature.properties);
  }

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  }

  const geojson = L.geoJson(geojsonData, {
    style,
    onEachFeature,
  }).addTo(map);

  // Legend
  const legend = L.control({ position: legendPosition });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');
    const grades = getColorStops;
    const labels = [legendTitle ? `<strong>${legendTitle}</strong>` : ''];
    let from, to;
    for (let i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];
      labels.push(
        `<div class="legend-swatch" style="background:${getColor(from + 1)}"></div> ${from}${to ? `&ndash;${to}` : '+'}`,
      );
    }
    div.innerHTML = labels.join('<br>');
    return div;
  };
  legend.addTo(map);

  // Attribution
  if (attribution) {
    map.attributionControl.addAttribution(attribution);
  }
}

// Find all map containers and render
for (const el of document.querySelectorAll('[data-config]')) {
  renderChoroplethMap(el);
}
