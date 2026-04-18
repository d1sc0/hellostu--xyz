// apex-chart-data.js
//
// Centralized chart config and data for all ApexChart.astro usage.
//
// Each export provides options and series for a specific chart, to be used as props for the generic ApexChart component.
//
// Used in:
//   - TGF parkrun data dive post (TGF-data-dive.mdx)
//   - Blogging about not blogging post (blogging-about-not-blogging.mdx)
//   - Any other post/component using <ApexChart />

// --- Attendance (area) ---
export const attendanceOptions = {
  chart: {
    height: 450,
    type: 'area',
    zoom: { enabled: false },
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'straight' },
  title: {
    text: 'Weekly finishers at The Great Field parkrun',
    align: 'left',
  },
  grid: {
    row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
  },
  xaxis: {
    title: { text: 'Dates' },
    labels: { hideOverlappingLabels: true },
    categories: [
      '30 Oct 21',
      '06 Nov 21',
      '13 Nov 21',
      '20 Nov 21',
      '27 Nov 21',
      '04 Dec 21',
      '11 Dec 21',
      '18 Dec 21',
      '01 Jan 22',
      '08 Jan 22',
      '15 Jan 22',
      '22 Jan 22',
      '29 Jan 22',
      '05 Feb 22',
      '12 Feb 22',
      '19 Feb 22',
      '26 Feb 22',
      '05 Mar 22',
      '12 Mar 22',
      '19 Mar 22',
    ],
  },
  yaxis: {
    title: { text: 'Finishers' },
    min: 0,
    max: 400,
  },
};
export const attendanceSeries = [
  {
    name: 'Finishers',
    data: [
      345, 317, 341, 325, 255, 223, 207, 261, 194, 257, 271, 275, 270, 262, 363,
      243, 222, 243, 231, 230,
    ],
  },
];

// --- Finishing Times (line) ---

export const finishTimesOptions = {
  chart: {
    height: 450,
    type: 'line',
    zoom: { enabled: false },
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'straight' },
  title: {
    text: 'Fastest finishers at The Great Field parkrun',
    align: 'left',
  },
  grid: {
    row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
  },
  xaxis: {
    title: { text: '' },
    labels: { hideOverlappingLabels: true },
    categories: [
      '30 Oct 21',
      '06 Nov 21',
      '13 Nov 21',
      '20 Nov 21',
      '27 Nov 21',
      '04 Dec 21',
      '11 Dec 21',
      '18 Dec 21',
      '01 Jan 22',
      '08 Jan 22',
      '15 Jan 22',
      '22 Jan 22',
      '29 Jan 22',
      '05 Feb 22',
      '12 Feb 22',
      '19 Feb 22',
      '26 Feb 22',
      '05 Mar 22',
      '12 Mar 22',
      '19 Mar 22',
    ],
  },
  yaxis: {
    title: { text: 'Finishing Time (mm:ss)' },
    min: new Date('2019-01-01T09:13:00').getTime(),
    max: new Date('2019-01-01T09:23:00').getTime(),
    formatterKey: 'finishingTime', // Custom key for loader to add formatter
  },
};
export const finishTimesSeries = [
  {
    name: 'Fastest Man (mm:ss)',
    data: [
      new Date('2019-01-01T09:16:37').getTime(),
      new Date('2019-01-01T09:16:29').getTime(),
      new Date('2019-01-01T09:16:21').getTime(),
      new Date('2019-01-01T09:17:18').getTime(),
      new Date('2019-01-01T09:17:01').getTime(),
      new Date('2019-01-01T09:16:23').getTime(),
      new Date('2019-01-01T09:17:23').getTime(),
      new Date('2019-01-01T09:16:37').getTime(),
      new Date('2019-01-01T09:18:16').getTime(),
      new Date('2019-01-01T09:18:34').getTime(),
      new Date('2019-01-01T09:18:01').getTime(),
      new Date('2019-01-01T09:18:19').getTime(),
      new Date('2019-01-01T09:18:41').getTime(),
      new Date('2019-01-01T09:18:08').getTime(),
      new Date('2019-01-01T09:18:07').getTime(),
      new Date('2019-01-01T09:17:45').getTime(),
      new Date('2019-01-01T09:17:44').getTime(),
      new Date('2019-01-01T09:17:22').getTime(),
      new Date('2019-01-01T09:17:14').getTime(),
      new Date('2019-01-01T09:17:37').getTime(),
    ],
  },
  {
    name: 'Fastest Women (mm:ss)',
    data: [
      new Date('2019-01-01T09:20:17').getTime(),
      new Date('2019-01-01T09:20:53').getTime(),
      new Date('2019-01-01T09:20:02').getTime(),
      new Date('2019-01-01T09:21:02').getTime(),
      new Date('2019-01-01T09:21:44').getTime(),
      new Date('2019-01-01T09:21:19').getTime(),
      new Date('2019-01-01T09:21:43').getTime(),
      new Date('2019-01-01T09:18:40').getTime(),
      new Date('2019-01-01T09:20:42').getTime(),
      new Date('2019-01-01T09:18:26').getTime(),
      new Date('2019-01-01T09:21:32').getTime(),
      new Date('2019-01-01T09:20:15').getTime(),
      new Date('2019-01-01T09:22:10').getTime(),
      new Date('2019-01-01T09:21:39').getTime(),
      new Date('2019-01-01T09:21:47').getTime(),
      new Date('2019-01-01T09:20:01').getTime(),
      new Date('2019-01-01T09:21:49').getTime(),
      new Date('2019-01-01T09:21:10').getTime(),
      new Date('2019-01-01T09:20:38').getTime(),
      new Date('2019-01-01T09:21:33').getTime(),
    ],
  },
];

// --- Generations (donut) ---
export const generationsOptions = {
  chart: {
    width: '100%',
    height: 450,
    type: 'donut',
  },
  plotOptions: {
    pie: { donut: { size: '35%' } },
  },
  dataLabels: { style: { fontSize: '14px' } },
  legend: { position: 'bottom' },
  labels: [
    'Silent Generation',
    'Baby Boomers',
    'Generation X',
    'Millenials',
    'Generation Z',
    'Generation Alpha',
  ],
  series: [13, 437, 701, 449, 198, 86],
};
export const generationsSeries = [13, 437, 701, 449, 198, 86];

// --- Time Distribution (bar) ---
export const timeDistOptions = {
  chart: {
    type: 'bar',
    height: 450,
    background: '#ffeeff',
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      borderRadiusApplication: 'end',
      horizontal: false,
    },
  },
  dataLabels: { enabled: false },
  yaxis: { min: 0, max: 2000 },
  xaxis: {
    categories: [
      '10-15 mins ',
      '15-20 mins ',
      '20-25 mins ',
      '25-30 mins ',
      '30-35 mins ',
      '35-40 mins ',
      '40-45 mins ',
      '45-50 mins ',
      '50-55 mins ',
      '55-60 mins ',
      '60-65 mins',
    ],
  },
};
export const timeDistSeries = [
  {
    name: 'Number of finshers',
    data: [0, 180, 1162, 1778, 1202, 449, 165, 57, 17, 31, 6],
  },
];

// --- Blogging chart (pie) ---
// Used in blogging-about-not-blogging.mdx

export const bloggingChartOptions = {
  chart: {
    width: '100%',
    height: 450,
    type: 'pie',
  },
  legend: {
    show: true,
    position: 'bottom',
  },
  labels: [
    'Worrying too much about other people and their reactions',
    'Messing about with post images',
    'Finding and writing the words',
    'Correcting mistakes',
    'Distracted by some other existential crisis',
  ],
  theme: {
    monochrome: {
      enabled: false,
    },
  },
  dataLabels: {
    formatter(val) {
      return [val.toFixed(1) + '%'];
    },
  },
  responsive: [
    {
      breakpoint: 900,
      options: {
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
};

export const bloggingChartSeries = [40, 5, 15, 30, 10];
