export const MUSEUMS = [
  {
    id: '1',
    name: 'Museum Sejarah Jakarta',
    address: 'Jl. Taman Fatahillah No.1, Jakarta Barat',
    latitude: -6.1352,
    longitude: 106.8133,
    overlayBounds: [
      [-6.1355, 106.8130], // South-West
      [-6.1349, 106.8136], // North-East
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description: 'Museum Sejarah Jakarta...',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 7500,
    checkpoints: [
      { id: 'cp1', name: 'Ruang Prasejarah', status: 'locked' },
      { id: 'cp2', name: 'Ruang Tarumanegara', status: 'locked' },
    ],
  },
  {
    id: '2',
    name: 'Museum Nasional Indonesia',
    address: 'Jl. Medan Merdeka Barat No.12, Jakarta Pusat',
    latitude: -6.1767,
    longitude: 106.8227,
    overlayBounds: [
      [-6.1770, 106.8223],
      [-6.1764, 106.8231],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description: 'Museum yang menyimpan koleksi sejarah dan budaya Indonesia.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 10000,
    checkpoints: [
      { id: 'cp1', name: 'Galeri Prasejarah Nusantara', status: 'locked' },
      { id: 'cp2', name: 'Galeri Hindu-Buddha', status: 'locked' },
      { id: 'cp3', name: 'Galeri Etnografi', status: 'locked' },
    ],
  },
  {
    id: '3',
    name: 'Museum Bank Indonesia',
    address: 'Jl. Pintu Besar Utara No.3, Kota Tua, Jakarta Barat',
    latitude: -6.1376,
    longitude: 106.8133,
    overlayBounds: [
      [-6.1379, 106.8130],
      [-6.1373, 106.8137],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description:
      'Museum yang menceritakan sejarah perbankan dan ekonomi Indonesia.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 5000,
    checkpoints: [
      { id: 'cp1', name: 'Ruang Sejarah Rupiah', status: 'locked' },
      { id: 'cp2', name: 'Ruang Krisis Moneter', status: 'locked' },
    ],
  },
  {
    id: '4',
    name: 'Museum Wayang',
    address: 'Jl. Pintu Besar Utara No.27, Kota Tua, Jakarta Barat',
    latitude: -6.1359,
    longitude: 106.8134,
    overlayBounds: [
      [-6.1362, 106.8131],
      [-6.1356, 106.8137],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description: 'Museum yang menampilkan koleksi wayang dari berbagai daerah.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 5000,
    checkpoints: [
      { id: 'cp1', name: 'Ruang Wayang Kulit Jawa', status: 'locked' },
      { id: 'cp2', name: 'Ruang Wayang Golek Sunda', status: 'locked' },
    ],
  },
  {
    id: '5',
    name: 'Museum Tekstil Jakarta',
    address: 'Jl. KS Tubun No.4, Jakarta Barat',
    latitude: -6.1875,
    longitude: 106.8084,
    overlayBounds: [
      [-6.1878, 106.8081],
      [-6.1872, 106.8087],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description:
      'Museum yang menampilkan warisan tekstil dan batik dari seluruh Indonesia.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 5000,
    checkpoints: [
      { id: 'cp1', name: 'Ruang Batik Nusantara', status: 'locked' },
      { id: 'cp2', name: 'Workshop Membatik', status: 'locked' },
    ],
  },
  {
    id: '6',
    name: 'Museum Sumpah Pemuda',
    address: 'Jl. Kramat Raya No.106, Jakarta Pusat',
    latitude: -6.1913,
    longitude: 106.8447,
    overlayBounds: [
      [-6.1916, 106.8444],
      [-6.1910, 106.8450],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description:
      'Museum yang mengabadikan peristiwa bersejarah Sumpah Pemuda tahun 1928.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 5000,
    checkpoints: [
      { id: 'cp1', name: 'Ruang Kongres Pemuda', status: 'locked' },
      { id: 'cp2', name: 'Galeri Tokoh Pergerakan', status: 'locked' },
    ],
  },
  {
    id: '7',
    name: 'Museum Tsunami Aceh',
    address: 'Jl. Sultan Iskandar Muda, Banda Aceh',
    latitude: 5.5577,
    longitude: 95.3170,
    overlayBounds: [
      [5.5574, 95.3167],
      [5.5580, 95.3173],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description:
      'Museum yang dibangun untuk mengenang peristiwa tsunami Aceh tahun 2004.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 10000,
    checkpoints: [
      { id: 'cp1', name: 'Lorong Tsunami', status: 'locked' },
      { id: 'cp2', name: 'Ruang Doa', status: 'locked' },
    ],
  },
  {
    id: '8',
    name: 'Museum Ullen Sentalu',
    address: 'Kaliurang, Sleman, Daerah Istimewa Yogyakarta',
    latitude: -7.5814,
    longitude: 110.4306,
    overlayBounds: [
      [-7.5817, 110.4303],
      [-7.5811, 110.4309],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description:
      'Museum budaya yang menyoroti sejarah dan kehidupan bangsawan Mataram.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 50000,
    checkpoints: [
      { id: 'cp1', name: 'Ruang Putri Mataram', status: 'locked' },
      { id: 'cp2', name: 'Ruang Seni Jawa', status: 'locked' },
    ],
  },
  {
    id: '9',
    name: 'Museum Sonobudoyo',
    address: 'Jl. Pangurakan No.6, Yogyakarta',
    latitude: -7.8017,
    longitude: 110.3653,
    overlayBounds: [
      [-7.8020, 110.3650],
      [-7.8014, 110.3656],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description:
      'Museum yang menyimpan koleksi budaya Jawa, Bali, Madura, dan Lombok.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 5000,
    checkpoints: [
      { id: 'cp1', name: 'Ruang Keris dan Senjata', status: 'locked' },
      { id: 'cp2', name: 'Ruang Topeng Tradisional', status: 'locked' },
    ],
  },
  {
    id: '10',
    name: 'Museum Geologi Bandung',
    address: 'Jl. Diponegoro No.57, Bandung',
    latitude: -6.9011,
    longitude: 107.6191,
    overlayBounds: [
      [-6.9014, 107.6188],
      [-6.9008, 107.6194],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description:
      'Museum yang menampilkan koleksi batuan, fosil, dan informasi kegempaan.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 3000,
    checkpoints: [
      { id: 'cp1', name: 'Ruang Vulkanologi', status: 'locked' },
      { id: 'cp2', name: 'Ruang Fosil Dinosaurus', status: 'locked' },
    ],
  },
  {
    id: '11',
    name: 'Museum Konferensi Asia Afrika',
    address: 'Jl. Asia Afrika No.65, Bandung',
    latitude: -6.9219,
    longitude: 107.6078,
    overlayBounds: [
      [-6.9222, 107.6075],
      [-6.9216, 107.6081],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description: 'Museum yang mengabadikan Konferensi Asia Afrika 1955.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 0,
    checkpoints: [
      { id: 'cp1', name: 'Ruang Pleno KAA', status: 'locked' },
      { id: 'cp2', name: 'Galeri Tokoh Dunia', status: 'locked' },
    ],
  },
  {
    id: '12',
    name: 'Museum Angkut',
    address: 'Jl. Terusan Sultan Agung No.2, Batu, Jawa Timur',
    latitude: -7.8843,
    longitude: 112.5246,
    overlayBounds: [
      [-7.8846, 112.5243],
      [-7.8840, 112.5249],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description:
      'Museum transportasi yang menampilkan berbagai kendaraan dari masa ke masa.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 120000,
    checkpoints: [
      { id: 'cp1', name: 'Zona Eropa', status: 'locked' },
      { id: 'cp2', name: 'Zona Hollywood', status: 'locked' },
    ],
  },
  {
    id: '13',
    name: 'Museum Batik Pekalongan',
    address: 'Jl. Jetayu No.1, Pekalongan',
    latitude: -6.8889,
    longitude: 109.6746,
    overlayBounds: [
      [-6.8892, 109.6743],
      [-6.8886, 109.6749],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description:
      'Museum yang fokus pada sejarah dan perkembangan batik Pekalongan.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 5000,
    checkpoints: [
      { id: 'cp1', name: 'Galeri Batik Klasik', status: 'locked' },
      { id: 'cp2', name: 'Galeri Batik Kontemporer', status: 'locked' },
    ],
  },
  {
    id: '14',
    name: 'Museum Benteng Vredeburg',
    address: 'Jl. Jenderal Ahmad Yani No.6, Yogyakarta',
    latitude: -7.8005,
    longitude: 110.3672,
    overlayBounds: [
      [-7.8008, 110.3669],
      [-7.8002, 110.3675],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description:
      'Museum perjuangan yang berisi diorama sejarah kemerdekaan Indonesia.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 5000,
    checkpoints: [
      { id: 'cp1', name: 'Diorama Perang Kemerdekaan', status: 'locked' },
      { id: 'cp2', name: 'Ruang Tokoh Nasional', status: 'locked' },
    ],
  },
  {
    id: '15',
    name: 'Museum Perjuangan Yogyakarta',
    address: 'Jl. Kolonel Sugiyono No.24, Yogyakarta',
    latitude: -7.8091,
    longitude: 110.3708,
    overlayBounds: [
      [-7.8094, 110.3705],
      [-7.8088, 110.3711],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description:
      'Museum yang menampilkan perjuangan rakyat Yogyakarta dalam mempertahankan kemerdekaan.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 3000,
    checkpoints: [
      { id: 'cp1', name: 'Ruang Senjata Rakyat', status: 'locked' },
      { id: 'cp2', name: 'Ruang Foto Perjuangan', status: 'locked' },
    ],
  },
  {
    id: '16',
    name: 'Museum Bahari Jakarta',
    address: 'Jl. Ps. Ikan No.1, Penjaringan, Jakarta Utara',
    latitude: -6.1252,
    longitude: 106.8101,
    overlayBounds: [
      [-6.1255, 106.8098],
      [-6.1249, 106.8104],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description:
      'Museum yang menampilkan sejarah kelautan dan perniagaan Nusantara.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 5000,
    checkpoints: [
      { id: 'cp1', name: 'Ruang Kapal Tradisional', status: 'locked' },
      { id: 'cp2', name: 'Ruang Peta Jalur Perdagangan', status: 'locked' },
    ],
  },
  {
    id: '17',
    name: 'Museum Sejarah Bali',
    address: 'Denpasar, Bali',
    latitude: -8.6563,
    longitude: 115.2221,
    overlayBounds: [
      [-8.6566, 115.2218],
      [-8.6560, 115.2224],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description:
      'Museum yang menampilkan sejarah perkembangan budaya dan kerajaan di Bali.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 10000,
    checkpoints: [
      { id: 'cp1', name: 'Ruang Kerajaan Bali', status: 'locked' },
      { id: 'cp2', name: 'Ruang Seni Tari dan Gamelan', status: 'locked' },
    ],
  },
  {
    id: '18',
    name: 'Museum Subak Bali',
    address: 'Tabanan, Bali',
    latitude: -8.5443,
    longitude: 115.1261,
    overlayBounds: [
      [-8.5446, 115.1258],
      [-8.5440, 115.1264],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description:
      'Museum yang menjelaskan sistem irigasi tradisional Subak di Bali.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 5000,
    checkpoints: [
      { id: 'cp1', name: 'Ruang Sistem Irigasi Subak', status: 'locked' },
      { id: 'cp2', name: 'Ruang Peralatan Tani Tradisional', status: 'locked' },
    ],
  },
  {
    id: '19',
    name: 'Museum Kereta Api Ambarawa',
    address: 'Jl. Stasiun No.1, Ambarawa, Jawa Tengah',
    latitude: -7.2667,
    longitude: 110.4047,
    overlayBounds: [
      [-7.2670, 110.4044],
      [-7.2664, 110.4050],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description:
      'Museum yang menyimpan koleksi lokomotif kereta api kuno di Indonesia.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 10000,
    checkpoints: [
      { id: 'cp1', name: 'Zona Lokomotif Uap', status: 'locked' },
      { id: 'cp2', name: 'Zona Kereta Penumpang Kuno', status: 'locked' },
    ],
  },
  {
    id: '20',
    name: 'Museum Fatahillah Mini',
    address: 'Kota Tua, Jakarta Barat',
    latitude: -6.1350,
    longitude: 106.8139,
    overlayBounds: [
      [-6.1353, 106.8136],
      [-6.1347, 106.8142],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description:
      'Versi mini museum yang berfokus pada sejarah alun-alun Fatahillah.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 3000,
    checkpoints: [
      { id: 'cp1', name: 'Zona Peta Kota Tua', status: 'locked' },
      { id: 'cp2', name: 'Zona Foto Arsip', status: 'locked' },
    ],
  },
  {
    id: '21',
    name: 'Museum Kreatif Nusantara',
    address: 'Jl. Kreatif No.1, Jakarta Selatan',
    latitude: -6.2607,
    longitude: 106.8103,
    overlayBounds: [
      [-6.2610, 106.8100],
      [-6.2604, 106.8106],
    ],
    floorPlanImage:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764094518/Rectangle_17_ihbz2i.png',
    description:
      'Museum fiktif yang berfokus pada inovasi dan gamifikasi budaya Nusantara.',
    image:
      'https://res.cloudinary.com/dqxmywp1y/image/upload/v1764158340/Cover_Blog_Dienvibi_5.png_goffhp.webp',
    price: 15000,
    checkpoints: [
      { id: 'cp1', name: 'Zona AR Peninggalan Sejarah', status: 'locked' },
      { id: 'cp2', name: 'Zona Mini Game Budaya', status: 'locked' },
    ],
  },
];