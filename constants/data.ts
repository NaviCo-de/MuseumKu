export const MUSEUMS = [
  {
    id: '1',
    name: 'Museum Sejarah Jakarta',
    address: 'Jl. Taman Fatahillah No.1, Jakarta Barat',
    // Titik tengah untuk kamera awal map
    latitude: -6.1352,
    longitude: 106.8133,
    
    // BOUNDS: Koordinat [BaratDaya, TimurLaut] untuk menempelkan gambar denah
    // Anda harus cari koordinat pojok kiri-bawah dan kanan-atas gedung museum di Google Maps
    overlayBounds: [
      [-6.1355, 106.8130], // South-West (Kiri Bawah)
      [-6.1349, 106.8136]  // North-East (Kanan Atas)
    ],
    
    // Gunakan gambar denah transparan (PNG) agar menyatu dengan peta
    floorPlanImage: 'https://via.placeholder.com/500x500.png?text=Denah+Transparan', 
    
    description: 'Museum Sejarah Jakarta...',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Jakarta_History_Museum_Front_View.jpg', 
    price: 7500,
    checkpoints: [
      { id: 'cp1', name: 'Ruang Prasejarah', status: 'locked' },
      { id: 'cp2', name: 'Ruang Tarumanegara', status: 'locked' },
    ],
    // ... data lainnya
  },
  // ... museum lain
];