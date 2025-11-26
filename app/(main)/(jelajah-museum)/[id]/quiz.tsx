import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MUSEUMS } from '@/constants/data';
import { useAchievements } from '@/hooks/useAchievements';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- KONFIGURASI ---
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_MODEL_NAME = "gemini-2.0-flash"; 

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const museum = MUSEUMS.find(m => m.id === id);
  const { recordQuizCompletion } = useAchievements();

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});

  // State untuk Modal Hasil
  const [showResultModal, setShowResultModal] = useState(false);
  const [quizResult, setQuizResult] = useState({ correct: 0, total: 0, score: 0 });

  const setFallbackQuestions = useCallback(() => {
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
        },
        {
            question: "Gedung ini dahulu digunakan sebagai apa?",
            options: ["Kantor Pos", "Stasiun Kereta", "Balai Kota Batavia", "Gudang Rempah"],
            correctIndex: 2
        }
    ]);
    setLoading(false);
  }, []);

  const generateQuiz = useCallback(async (museumName: string) => {
    if (!GEMINI_API_KEY) {
        console.warn("API Key hilang");
        setFallbackQuestions();
        return;
    }

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: GEMINI_MODEL_NAME,
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `Buatkan 3 soal pilihan ganda tentang "${museumName}" dalam bahasa Indonesia.
      Format JSON array murni:
      [ { "question": "...", "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"], "correctIndex": 0 } ]`;

      const result = await model.generateContent(prompt);
      const text = result.response.text(); 
      console.log("Gemini Flash Response:", text);
      
      setQuestions(JSON.parse(text));

    } catch (error: any) {
      console.error("Error SDK Gemini:", error);
      if (error.message?.includes("429") || error.message?.includes("quota")) {
         // Silent fallback or specific handling
      }
      setFallbackQuestions(); 
    } finally {
      setLoading(false);
    }
  }, [setFallbackQuestions]);

  useEffect(() => {
    if (museum) {
      generateQuiz(museum.name);
    }
  }, [museum, generateQuiz]);

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = () => {
    let score = 0;
    let correctCount = 0;
    questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
            score += 10;
            correctCount++;
        }
    });

    recordQuizCompletion();

    // GANTI ALERT DENGAN SET STATE MODAL
    setQuizResult({ correct: correctCount, total: questions.length, score });
    setShowResultModal(true);
  };

  if (!museum) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5D4037" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
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
                <Text style={{marginTop: 10, color: '#666'}}>Sedang membuat soal...</Text>
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

      {/* MODAL HASIL KUIS */}
      <Modal visible={showResultModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeader}>Hasil Kuis</Text>
            <Text style={styles.modalDesc}>
              Kamu menjawab benar <Text style={{fontWeight:'bold'}}>{quizResult.correct}</Text> dari <Text style={{fontWeight:'bold'}}>{quizResult.total}</Text> soal!{'\n'}
              Total Poin Tambahan: <Text style={{fontWeight:'bold', color: '#5D4037'}}>{quizResult.score}</Text>
            </Text>
            
            <TouchableOpacity 
                style={styles.primaryButtonModal} 
                onPress={() => {
                    setShowResultModal(false);
                    router.navigate('/(main)/(jelajah-museum)');
                }}
            >
              <Text style={styles.primaryButtonText}>Selesai</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { padding: 20, paddingBottom: 50, paddingTop: 50 },
  backRow: { alignSelf: 'flex-start', marginBottom: 10 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#000' },
  museumSubtitle: { fontSize: 16, color: '#8D6E63', fontWeight: 'bold', marginTop: 5, textAlign: 'center' },
  questionContainer: { marginBottom: 30 },
  questionLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#000' },
  questionText: { fontSize: 15, lineHeight: 22, color: '#000', marginBottom: 15 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  optionCard: {
    width: '48%', 
    backgroundColor: '#EFEBE9', 
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D7CCC8'
  },
  optionSelected: {
    backgroundColor: '#5D4037', 
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
  submitText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

  // --- MODAL STYLES (SAMA SEPERTI PAYMENT) ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '80%', backgroundColor: '#FFF', borderRadius: 24, padding: 25, alignItems: 'center', elevation: 10 },
  modalHeader: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#000', marginBottom: 10 },
  modalDesc: { fontSize: 14, textAlign: 'center', color: '#000', marginBottom: 25, lineHeight: 20 },
  
  primaryButtonModal: { 
    backgroundColor: '#4E342E', 
    width: '100%', 
    paddingVertical: 14, 
    borderRadius: 16, // Radius 16
    alignItems: 'center'
  },
  primaryButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});