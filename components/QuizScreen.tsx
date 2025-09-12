// components/QuizScreen.tsx
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type QuizScreenProps = {
  currentQuestion: Question;
  selectedOption: string | null;
  isOptionsDisabled: boolean;
  onOptionPress: (option: string) => void;
  onNextQuestion: () => void; // Mantido por segurança, mas não será usado
  timeLeft: number;
  lives: number;
};

export default function QuizScreen({
  currentQuestion,
  selectedOption,
  isOptionsDisabled,
  onOptionPress,
  timeLeft,
  lives,
}: QuizScreenProps) {
  const getOptionStyle = (option: string) => {
    if (selectedOption) {
      const isCorrect = option === currentQuestion.correctAnswer;
      if (option === selectedOption) {
          return isCorrect ? styles.correctOption : styles.incorrectOption;
      }
      if (isCorrect) {
          return styles.correctOption;
      }
    }
    return {};
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timerText}>Tempo: {timeLeft}</Text>
        <Text style={styles.livesText}>Vidas: {'❤️'.repeat(lives)}</Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, getOptionStyle(option)]}
            onPress={() => onOptionPress(option)}
            disabled={isOptionsDisabled}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f8ff', padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  livesText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  questionContainer: { flex: 1, backgroundColor: '#ffffff', borderRadius: 12, padding: 16, justifyContent: 'center', marginBottom: 20 },
  questionText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  optionsContainer: { flex: 2, justifyContent: 'space-around' },
  option: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, borderWidth: 2, borderColor: '#e0e0e0' },
  optionText: { fontSize: 18 },
  correctOption: { borderColor: '#4CAF50', backgroundColor: '#D4EDDA', borderWidth: 2 },
  incorrectOption: { borderColor: '#F44336', backgroundColor: '#F8D7DA', borderWidth: 2 },
});