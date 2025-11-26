import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { Colors } from '@/constants/Colors'; // Pastikan path benar
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) return Alert.alert("Error", "Isi semua kolom!");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            Alert.alert("Gagal Masuk", error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            {/* HEADER COKELAT */}
            <View style={styles.header}>
                {/* Icon baterai/sinyal diabaikan dulu, fokus ke layout */}
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Halo!</Text>
                <Text style={styles.subtitle}>Masukkan username dan password untuk masuk</Text>

                <View style={styles.inputContainer}>
                    <TextInput 
                        placeholder='Email'
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize='none'
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput 
                        placeholder='Password'
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                    />
                </View>

                <TouchableOpacity 
                    style={styles.loginBtn} 
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.loginText}>{loading ? "Loading..." : "Masuk"}</Text>
                </TouchableOpacity>

                <Text style={styles.orText}>Atau masuk menggunakan</Text>

                <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.socialBtn}>
                        <Ionicons name="logo-google" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialBtn}>
                        <Ionicons name="logo-facebook" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={{color: '#666'}}>Belum punya akun? </Text>
                    <TouchableOpacity onPress={() => router.push('/register')}>
                        <Text style={styles.link}>Daftar di sini!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 40, // Meniru status bar cokelat di desain
    backgroundColor: Colors.cokelatTua.base, 
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20
  },
  headerTime: { color: 'white', fontWeight: 'bold' },
  content: { flex: 1, padding: 30, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: Colors.cokelatTua.base, marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 30 },
  inputContainer: { marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#333', // Border agak gelap sesuai gambar
    borderRadius: 10,
    padding: 15,
    fontSize: 16
  },
  loginBtn: {
    backgroundColor: Colors.cokelatTua.base, // Cokelat Tua
    padding: 15,
    borderRadius: 25, // Rounded pill
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30
  },
  loginText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  orText: { textAlign: 'center', color: '#666', marginBottom: 20 },
  socialContainer: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 40 },
  socialBtn: {
    width: 50, height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  link: { color: Colors.cokelatTua.base, textDecorationLine: 'underline', fontWeight: 'bold' }
});
