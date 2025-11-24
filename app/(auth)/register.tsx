import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig'; // Pastikan path ini benar
import { useRouter } from 'expo-router'; // <--- 1. Import ini
import { UserProfile } from '@/types/users';


export default function RegisterScreen() { // <--- 2. Hapus { navigation }
    const router = useRouter(); // <--- 3. Panggil hook ini
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password) return Alert.alert("Error", "Isi semua kolom!");

        setLoading(true);
        try {
            // A. Bikin Akun di Authentication (Dapat UID)
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // B. Simpan Data Profil ke Firestore
            // Kita pakai 'setDoc' supaya ID Dokumen = UID User (Biar gampang dicari nanti)
            const userData: UserProfile = {
                uid: user.uid,
                email: email,
                username: email.split('@')[0],
                photoProfile: null,
                xp: 0,
                createdAt: new Date().toISOString(),
                password: password
            }

            await setDoc(doc(db, "users", user.uid), userData);
            
            Alert.alert("Sukses", "Akun dan Database berhasil dibuat!");
            
            // Opsional: Redirect manual kalau perlu
            router.replace('/login');

        } catch (error: any) {
            Alert.alert("Gagal", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Buat Akun Baru</Text>
            <TextInput 
                placeholder="Email" 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize="none"
                style={styles.input} 
            />
            <TextInput 
                placeholder="Password" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry 
                style={styles.input} 
            />
            <Button title={loading ? "Loading..." : "Daftar Sekarang"} onPress={handleRegister} />
            
            {/* Contoh navigasi manual ke Login pakai Expo Router */}
            <Text style={{marginTop: 20, color: 'blue'}} onPress={() => router.push('/login')}>
                Sudah punya akun? Login
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 }
});