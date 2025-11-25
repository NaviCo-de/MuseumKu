import { useState, useEffect } from 'react';
import { doc, setDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';

export function useMuseumFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setFavoriteIds([]);
      setLoading(false);
      return;
    }

    // Listener Realtime ke subcollection 'favorites' milik user
    // Ini seperti memasang CCTV di kotak favorit user
    const favRef = collection(db, 'users', user.uid, 'favorites');
    
    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      const ids = snapshot.docs.map(doc => doc.id);
      setFavoriteIds(ids);
      setLoading(false);
    }, (error) => {
      console.error("Gagal ambil favorit:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fungsi Toggle (Like/Unlike)
  const toggleFavorite = async (museumId: string) => {
    const user = auth.currentUser;
    if (!user) return; // Atau redirect ke login

    const docRef = doc(db, 'users', user.uid, 'favorites', museumId);

    if (favoriteIds.includes(museumId)) {
      // Jika sudah ada, hapus (Unlike)
      await deleteDoc(docRef);
    } else {
      // Jika belum ada, tambah (Like)
      await setDoc(docRef, { addedAt: new Date() });
    }
  };

  return { favoriteIds, toggleFavorite, loading };
}