import { useRouter } from 'expo-router';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter(); // <--- Hook navigasi

    const handleLogin = async () => {
        if (!email || !password) return Alert.alert("Error", "Isi semua kolom!");
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error: any) {
            let errorMessage = "Login gagal.";
      
            // Translate error Firebase biar user gak bingung
            if (error.code === 'auth/invalid-email') errorMessage = "Format email salah.";
            if (error.code === 'auth/user-not-found') errorMessage = "Akun tidak ditemukan. Daftar dulu dong.";
            if (error.code === 'auth/wrong-password') errorMessage = "Password salah bos.";
            if (error.code === 'auth/invalid-credential') errorMessage = "Email atau password salah.";

            Alert.alert("Gagal Masuk", errorMessage);
        }
    }
    return (
        <View>
            <Text>Ini Halaman Login</Text>
            
            {/* Tombol pindah ke Register */}
            <TextInput 
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
                style={styles.input}
            />
            <TextInput 
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                autoCapitalize='none'
                style={styles.input}
            />
            <Button 
                title="Login" 
                onPress={handleLogin} 
            />
            <Button 
                title="Belum punya akun? Daftar" 
                onPress={() => router.push('/register')} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 }
});