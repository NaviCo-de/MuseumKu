import { collection, addDoc, Timestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 

// Data User Palsu (Supaya postingan ada yang punya)
const DUMMY_USERS = [
  {
    uid: "user_shandy",
    username: "shandy_darrell",
    photoProfile: "https://i.pravatar.cc/150?img=11", // Foto profil cowok
    role: "user"
  },
  {
    uid: "user_aldo",
    username: "aldo_fahrezy",
    photoProfile: "https://i.pravatar.cc/150?img=3",
    role: "user"
  }
];

// Data Postingan Palsu (Sesuai UI kamu)
const DUMMY_POSTS = [
  {
    userId: "user_shandy",
    username: "shandy_darrell",
    userPhoto: "https://i.pravatar.cc/150?img=11", // Denormalisasi (tempel langsung biar cepat load)
    imageURL: "https://picsum.photos/id/20/800/600", // Gambar Museum A
    location: "Museum Sejarah Jakarta",
    caption: "Pengalaman saya sangat menyenangkan di museum ini! Saya mendapatkan banyak insight...",
    likes: 45,
    comments: 12,
    shares: 5,
    createdAt: new Date() 
  },
  {
    userId: "user_aldo",
    username: "aldo_fahrezy",
    userPhoto: "https://i.pravatar.cc/150?img=3",
    imageURL: "https://picsum.photos/id/40/800/800", // Gambar Museum B
    location: "Museum Nasional",
    caption: "Keren banget arsitekturnya! Wajib ke sini kalau ke Jakarta.",
    likes: 120,
    comments: 34,
    shares: 10,
    createdAt: new Date(Date.now() - 86400000) // Kemarin
  }
];

export const seedDatabase = async () => {
  try {
    console.log("Seeding started...");
    
    // 1. Tanam User
    for (const user of DUMMY_USERS) {
      await setDoc(doc(db, "users", user.uid), user);
    }

    // 2. Tanam Postingan
    for (const post of DUMMY_POSTS) {
      await addDoc(collection(db, "posts"), {
        ...post,
        createdAt: Timestamp.fromDate(post.createdAt)
      });
    }
    
    alert("DATA DUMMY BERHASIL DIBUAT!");
  } catch (error) {
    console.error(error);
    alert("Gagal Seeding");
  }
};