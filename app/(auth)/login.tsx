import { useRouter } from 'expo-router';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { globalStyles } from '@/constants/styles';
export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter(); // <--- Hook navigasi

    const handleLogin = async () => {
        if (!email || !password) return Alert.alert("Error", "Isi semua kolom!");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password)
            console.log("nyampe sini ga"); 
        } catch (error: any) {
            console.log("kalo sini?"); 
            console.log("ERROR LOGIN:", error); 
            console.log("ERROR CODE:", error.code);
            let errorMessage = "Login gagal.";
      
            // Translate error Firebase biar user gak bingung
            if (error.code === 'auth/invalid-email') errorMessage = "Format email salah.";
            if (error.code === 'auth/user-not-found') errorMessage = "Akun tidak ditemukan. Daftar dulu dong.";
            if (error.code === 'auth/wrong-password') errorMessage = "Password salah bos.";
            if (error.code === 'auth/invalid-credential') errorMessage = "Email atau password salah.";

            Alert.alert("Gagal Masuk", errorMessage);
        } finally {
            setLoading(false)
        }
    }
    return (
        <View
            style={[{
                paddingHorizontal: 38 
            }]}
        >
            <Text>Ini Halaman Login</Text>
            
            {/* Tombol pindah ke Register */}
            <TextInput 
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
                style={globalStyles.authInput}
            />
            <TextInput 
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize='none'
                style={globalStyles.authInput}
            />
            <Button 
                title={loading ? "Loading..." : "Login"} 
                onPress={handleLogin} 
                disabled={loading}
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