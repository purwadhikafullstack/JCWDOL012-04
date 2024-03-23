// // src/app.ts
// import express from 'express';
// import opencage from 'opencage-api-client';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());

// app.get('/geocode/:location', async (req, res) => {
//   const locationName = req.params.location;

//   // Check if the location is already in the database
//   let location = await prisma.location.findUnique({
//     where: { name: locationName },
//   });

//   if (!location) {
//     try {
//       // Use the OpenCage API client to geocode the location
//       const { data } = await opencage.geocode({ q: locationName });

//       if (data.status.code === 200 && data.results.length > 0) {
//         const place = data.results[0];

//         // Save to the database
//         location = await prisma.location.create({
//           data: {
//             name: locationName,
//             lat: place.geometry.lat,
//             lng: place.geometry.lng,
//           },
//         });
//       } else {
//         console.log('Status', data.status.message);
//         console.log('total_results', data.total_results);
//         return res.status(404).json({ error: 'Location not found' });
//       }
//     } catch (error) {
//       console.error('Error fetching geocode:', error);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//   }

//   // Respond with the location data
//   res.json({ lat: location.lat, lng: location.lng });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
