import { incData } from './fire-map-data.js';
// Fire incident map config and data for use with ChoroplethMap.astro
// Used in choropleth-experiments.mdx

export const fireMapConfig = {
  geojsonData: {
    type: 'FeatureCollection',
    features: incData.features,
  },
  center: [53.0, -3.0],
  zoom: 6,
  tileUrl:
    'https://api.mapbox.com/styles/v1/discodroid/cl1uingit001s15qrej26suwa/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGlzY29kcm9pZCIsImEiOiJjanVhdzNlcXQwNmprNDRsNG9iNmQ4dTlpIn0.bkdjNk6mySecnK6gg-3KXw',
  tileAttribution:
    '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
  styleProp: 'incidents',
  getColorStops: [0, 2000, 4000, 6000, 12000, 24000],
  getColor: String(function (val) {
    return val > 24000
      ? '#800026'
      : val > 12000
        ? '#BD0026'
        : val > 6000
          ? '#E31A1C'
          : val > 4000
            ? '#FC4E2A'
            : val > 2000
              ? '#FD8D3C'
              : '#FEB24C';
  }),
  legendTitle: 'Number of Incidents',
  infoTitle: 'Number of Incidents',
  infoValue: String(function (props) {
    return `<b>${props.name}</b><br />${props.incidents} incidents`;
  }),
  legendPosition: 'topleft',
  attribution:
    'Fire incident data from &copy; <a href="https://www.gov.uk/government/statistical-data-sets/fire-statistics-data-tables#incidents-attended">GOV.UK</a>',
};
