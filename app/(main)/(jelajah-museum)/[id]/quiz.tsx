import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, StatusBar, Image, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MUSEUMS } from '@/constants/data';

// --- KONFIGURASI GEMINI ---
// Ganti ini dengan API Key asli Anda
const GEMINI_API_KEY = "YOUR_API_KEY_HERE"; 

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const museum = MUSEUMS.find(m => m.id === id);

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});

  // 1. Generate Soal via Gemini saat halaman dibuka
  useEffect(() => {
    if (museum) {
      generateQuiz(museum.name);
    }
  }, [museum]);

  const generateQuiz = async (museumName: string) => {
    setLoading(true);
    try {
      const prompt = `Buatkan 3 soal pilihan ganda tentang "${museumName}" dalam bahasa Indonesia dengan tingkat jawaban dari rendah, sedang, hingga sulit masing masing per soal 1. 
      Format output HARUS JSON murni tanpa markdown, array of objects dengan struktur:
      [
        {
          "question": "Pertanyaan...",
          "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
          "correctIndex": 0 // Index jawaban benar (0-3)
        }
      ]`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      
      // Bersihkan format jika ada markdown ```json ... ```
      const cleanJson = textResponse.replace(/```json|```/g, '').trim();
      const parsedQuestions = JSON.parse(cleanJson);
      
      setQuestions(parsedQuestions);
    } catch (error) {
      console.error("Error Gemini:", error);
      Alert.alert("Gagal", "Gagal memuat soal dari AI. Menggunakan soal cadangan.");
      // Fallback ke data dummy
      setQuestions([
        {
            question: "Apa nama lain dari Museum Sejarah Jakarta?",
            options: ["Museum Fatahillah", "Museum Nasional", "Museum Wayang", "Museum Bank"],
            correctIndex: 0
        },
        {
            question: "Terletak di kawasan manakah museum ini?",
            options: ["Kota Baru", "Kota Tua", "Monas", "Ancol"],
            correctIndex: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = () => {
    // Hitung Skor
    let score = 0;
    let correctCount = 0;
    questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
            score += 10;
            correctCount++;
        }
    });

    Alert.alert(
        "Hasil Kuis",
        `Kamu menjawab benar ${correctCount} dari ${questions.length} soal!\nTotal Poin Tambahan: ${score}`,
        [
            { 
                text: "Selesai", 
                // UPDATE NAVIGASI: Balik ke halaman awal jelajah museum (List Museum)
                // Menggunakan 'popToTop' atau navigate ke root tab jelajah
                onPress: () => router.navigate('/(main)/(jelajah-museum)')
            }
        ]
    );
  };

  if (!museum) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5D4037" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Navigasi Back Manual */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backRow}>
            <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={{alignItems: 'center', marginBottom: 20}}>
            <Text style={styles.pageTitle}>Kuis</Text>
            <Text style={styles.museumSubtitle}>{museum.name}</Text>
        </View>

        {loading ? (
            <View style={{marginTop: 50, alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#5D4037" />
                <Text style={{marginTop: 10, color: '#666'}}>AI sedang membuat soal...</Text>
            </View>
        ) : (
            <>
                {questions.map((item, index) => (
                    <View key={index} style={styles.questionContainer}>
                        <Text style={styles.questionLabel}>Nomor {index + 1}</Text>
                        <Text style={styles.questionText}>{item.question}</Text>

                        <View style={styles.optionsGrid}>
                            {item.options.map((opt: string, optIdx: number) => {
                                const isSelected = selectedAnswers[index] === optIdx;
                                return (
                                    <TouchableOpacity 
                                        key={optIdx}
                                        style={[
                                            styles.optionCard,
                                            isSelected && styles.optionSelected
                                        ]}
                                        onPress={() => handleSelectAnswer(index, optIdx)}
                                    >
                                        <Text style={[
                                            styles.optionText,
                                            isSelected && styles.optionTextSelected
                                        ]}>
                                            {String.fromCharCode(65 + optIdx)}. {opt}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                ))}

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
            </>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  // Header
  header: { backgroundColor: '#8D6E63', paddingBottom: 15 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#FFF' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF', fontFamily: Platform.OS === 'ios' ? 'serif' : 'Roboto' },

  scrollContent: { padding: 20, paddingBottom: 50 },
  backRow: { alignSelf: 'flex-start', marginBottom: 10 },
  
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#000' },
  museumSubtitle: { fontSize: 16, color: '#8D6E63', fontWeight: 'bold', marginTop: 5 },

  // Question Style
  questionContainer: { marginBottom: 30 },
  questionLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#000' },
  questionText: { fontSize: 15, lineHeight: 22, color: '#000', marginBottom: 15 },
  
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  optionCard: {
    width: '48%', // Dua kolom
    backgroundColor: '#EFEBE9', // Coklat sangat muda
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D7CCC8'
  },
  optionSelected: {
    backgroundColor: '#5D4037', // Coklat Tua saat dipilih
    borderColor: '#3E2723'
  },
  optionText: { color: '#5D4037', fontSize: 13, textAlign: 'center' },
  optionTextSelected: { color: '#FFF', fontWeight: 'bold' },

  submitButton: {
    backgroundColor: '#3E2723',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    width: '60%',
    alignSelf: 'center'
  },
  submitText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});