// Config for TGF Visitors Map
import { HomeData, VisitorData } from './tgf-visitors-map-data.js';

export const tgfVisitorsMapConfig = {
  homeData: HomeData,
  visitorData: VisitorData,
  center: [54.09354272113172, -2.765121459960938],
  zoom: 5.5,
  tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  tileAttribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  buttonViews: [
    { id: 'UK', center: [54.09354272113172, -2.765121459960938], zoom: 5.5 },
    { id: 'Ireland', center: [54.14433895052212, -6.646728515625001], zoom: 7 },
    { id: 'France', center: [46.21167508670015, 6.624755859375001], zoom: 6 },
    { id: 'Germany', center: [50.91125953173824, 8.668212890625002], zoom: 6 },
    { id: 'Finland', center: [61.50271713616598, 24.158935546875004], zoom: 6 },
    { id: 'USA', center: [29.462318337210963, -88.92333984375001], zoom: 5 },
    {
      id: 'Australia',
      center: [-25.31671837192806, 133.90136718750003],
      zoom: 4,
    },
    {
      id: 'NewZealand',
      center: [-39.92843137829837, 174.56176757812503],
      zoom: 6,
    },
    {
      id: 'SouthAfrica',
      center: [-28.064709657296667, 27.993164062500004],
      zoom: 5,
    },
    {
      id: 'SouthEastAsia',
      center: [1.8934235913826891, 102.85400390625],
      zoom: 5,
    },
  ],
};
