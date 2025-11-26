import { Colors } from '@/constants/Colors';
import { UserProfile } from '@/types/users';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '@/firebaseConfig.js';

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState(''); // Nambah field Nama sesuai gambar
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password || !name) return Alert.alert("Error", "Isi semua kolom!");
        if (password !== confirmPassword) return Alert.alert("Error", "Password tidak sama!");

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userData: UserProfile = {
                uid: user.uid,
                email: email,
                username: name, // Pakai inputan nama user
                photoProfile: null,
                xp: 0,
                createdAt: new Date().toISOString(),
                password: "ENCRYPTED_BY_AUTH" // Jangan simpan password asli di DB!
            }

            await setDoc(doc(db, "users", user.uid), userData);
            Alert.alert("Sukses", "Akun berhasil dibuat!");
        } catch (error: any) {
            Alert.alert("Gagal", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* HEADER COKELAT DENGAN JUDUL */}
            <View style={styles.header}>
                 {/* Simulasi Status Bar */}
                 <View style={{height: 20}} /> 
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Buat Akun</Text>

                <TextInput style={styles.input} placeholder="Nama" value={name} onChangeText={setName} />
                <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
                <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
                <TextInput style={styles.input} placeholder="Konfirmasi Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

                <TouchableOpacity style={styles.loginBtn} onPress={handleRegister} disabled={loading}>
                    <Text style={styles.loginText}>{loading ? "Memproses..." : "Daftar"}</Text>
                </TouchableOpacity>

                <Text style={styles.orText}>Atau daftar menggunakan</Text>

                <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.socialBtn}>
                        <Ionicons name="logo-google" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialBtn}>
                        <Ionicons name="logo-facebook" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                
                {/* Tombol Balik ke Login */}
                 <View style={styles.footer}>
                    <Text style={{color: '#666'}}>Sudah punya akun? </Text>
                    <TouchableOpacity onPress={() => router.push('/login')}>
                        <Text style={styles.link}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

// Gunakan styles yang sama dengan LoginScreen di atas
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { height: 60, backgroundColor: Colors.cokelatTua.base },
    content: { flex: 1, padding: 30, justifyContent: 'center', marginTop: -50 }, // Naik dikit
    title: { fontSize: 28, fontWeight: 'bold', color: Colors.cokelatTua.base, marginBottom: 30, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#333', borderRadius: 10, padding: 15, fontSize: 16, marginBottom: 15 },
    loginBtn: { backgroundColor: Colors.cokelatTua.base, padding: 15, borderRadius: 25, alignItems: 'center', marginTop: 10, marginBottom: 30 },
    loginText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    orText: { textAlign: 'center', color: '#666', marginBottom: 20 },
    socialContainer: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
    socialBtn: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
    link: { color: Colors.cokelatTua.base, textDecorationLine: 'underline', fontWeight: 'bold' }
});