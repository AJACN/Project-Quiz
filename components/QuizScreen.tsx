import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AudioControls from './AudioControls';

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
  timeLeft: number;
  lives: number;
  isMuted: boolean;
  volume: number;
  onMuteToggle: () => void;
  onVolumeChange: (value: number) => void;
  showAudioControls: boolean;
  toggleAudioControls: () => void;
};

export default function QuizScreen({
  currentQuestion,
  selectedOption,
  isOptionsDisabled,
  onOptionPress,
  timeLeft,
  lives,
  isMuted,
  volume,
  onMuteToggle,
  onVolumeChange,
  showAudioControls,
  toggleAudioControls,
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
      <View style={styles.topBar}>
        <View style={styles.statsContainer}>
          <Text style={styles.timerText}>TEMPO: {timeLeft}s</Text>
          <Text style={styles.livesText}>{'⏰'.repeat(lives)}</Text>
        </View>
        <TouchableOpacity onPress={toggleAudioControls} style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {showAudioControls && (
        <AudioControls 
          isMuted={isMuted}
          volume={volume}
          onMuteToggle={onMuteToggle}
          onVolumeChange={onVolumeChange}
        />
      )}

      <View style={styles.contentContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0c0c0c',
    padding: 20,
    paddingTop: 40,
  },
  topBar: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    zIndex: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsButton: {
    padding: 10,
  },
  settingsButtonText: {
    fontSize: 28,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffcc00',
    textTransform: 'uppercase',
  },
  livesText: {
    fontSize: 26,
    color: '#ff6600',
    marginLeft: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 60, // Dá espaço para a barra de áudio não sobrepor
  },
  questionContainer: { 
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 25, 
    justifyContent: 'center', 
    marginBottom: 40,
    minHeight: 120,
    borderWidth: 2,
    borderColor: '#4a0a0a',
  },
  questionText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center',
    color: '#f0f0f0',
  },
  optionsContainer: { 
    justifyContent: 'center',
  },
  option: { 
    backgroundColor: '#2a2a2a',
    paddingVertical: 18, 
    paddingHorizontal: 15,
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#666666',
    marginBottom: 12,
  },
  optionText: { 
    fontSize: 17,
    color: '#f0f0f0',
    textAlign: 'center',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  correctOption: { 
    borderColor: '#33cc33',
    backgroundColor: '#1a3a1a',
    borderWidth: 2,
  },
  incorrectOption: { 
    borderColor: '#ff3333',
    backgroundColor: '#4a1a1a',
    borderWidth: 2,
  },
});