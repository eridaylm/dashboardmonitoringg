// // store.ts
// import { createSignal } from 'solid-js';

// const [genderData, setGenderData] = createSignal({
//   provinsi: {},
//   kabupaten: {},
//   kecamatan: {}
// });

// const [chartData, setChartData] = createSignal({
//   provinsi: {
//     Sumatera: { population: 1000000, males: 500000, females: 500000 },
//     Jawa: { population: 2000000, males: 1000000, females: 1000000 }
//   },
//   // Add more data as needed
// });

// const updateGenderData = (data) => {
//   const provinsiData = {};
//   const kabupatenData = {};
//   const kecamatanData = {};

//   data.forEach(user => {
//     const { provinsi, kabupaten, kecamatan, gender } = user;

//     // Initialize data structures if not present
//     if (!provinsiData[provinsi]) {
//       provinsiData[provinsi] = { male: 0, female: 0 };
//     }
//     if (!kabupatenData[kabupaten]) {
//       kabupatenData[kabupaten] = { male: 0, female: 0 };
//     }
//     if (!kecamatanData[kecamatan]) {
//       kecamatanData[kecamatan] = { male: 0, female: 0 };
//     }

//     // Increment gender count
//     if (gender === 'Male') {
//       provinsiData[provinsi].male++;
//       kabupatenData[kabupaten].male++;
//       kecamatanData[kecamatan].male++;
//     } else if (gender === 'Female') {
//       provinsiData[provinsi].female++;
//       kabupatenData[kabupaten].female++;
//       kecamatanData[kecamatan].female++;
//     }
//   });

//   setGenderData({ provinsi: provinsiData, kabupaten: kabupatenData, kecamatan: kecamatanData });
// };

// export { genderData, updateGenderData, chartData };
