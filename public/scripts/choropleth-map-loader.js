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

document.addEventListener('DOMContentLoaded', function () {
  const els = document.querySelectorAll('.choropleth-map[data-config]');
  console.log(`[Choropleth] Found ${els.length} map container(s).`);
  for (const el of els) {
    renderChoroplethMap(el);
  }
});

function renderChoroplethMap(container) {
  console.log('[Choropleth] Found container:', container);
  try {
    const config = reviveFunctions(JSON.parse(container.dataset.config));
    console.log('[Choropleth] Parsed config:', config);
    if (typeof window.L === 'undefined') {
      console.error('[Choropleth] window.L (Leaflet) is undefined!');
      return;
    }
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

    console.log('[Choropleth] geojsonData:', geojsonData);
    if (geojsonData) {
      L.geoJSON(geojsonData, {
        style: feature => {
          const value = feature.properties[styleProp];
          const color = getColor(value);
          console.log('[Choropleth] Feature value:', value, 'Color:', color);
          return {
            fillColor: color,
            weight: 2,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7,
          };
        },
      }).addTo(map);
      console.log('[Choropleth] GeoJSON layer added.');
    } else {
      console.error('[Choropleth] No geojsonData found in config:', config);
    }

    // --- Info control ---
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
      this._div.innerHTML = `<h4>${infoTitle || ''}</h4>${contents}`;
    };
    info.addTo(map);

    // --- Legend control ---
    const legend = L.control({ position: legendPosition || 'bottomright' });
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      const stops = getColorStops || [];
      let labels = [];
      let from, to;
      for (let i = 0; i < stops.length; i++) {
        from = stops[i];
        to = stops[i + 1];
        labels.push(
          `<i style="background:${getColor(from)}" class="legend-swatch"></i> ` +
            from +
            (to ? '&ndash;' + to : '+'),
        );
      }
      div.innerHTML = `<h4>${legendTitle || ''}</h4>` + labels.join('<br>');
      return div;
    };
    legend.addTo(map);

    // --- Feature highlight logic ---
    function highlightFeature(e) {
      const layer = e.target;
      layer.setStyle({
        weight: 3,
        color: '#666',
        fillOpacity: 0.9,
      });
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
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

    // --- GeoJSON layer with interactivity ---
    const geojson = L.geoJSON(geojsonData, {
      style: feature => {
        const value = feature.properties[styleProp];
        const color = getColor(value);
        return {
          fillColor: color,
          weight: 2,
          opacity: 1,
          color: 'white',
          fillOpacity: 0.7,
        };
      },
      onEachFeature,
    }).addTo(map);
    console.log('[Choropleth] GeoJSON layer added.');
  } catch (e) {
    console.error('[Choropleth] Error rendering map:', e);
  }
}
