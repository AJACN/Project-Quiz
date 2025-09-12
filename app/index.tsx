import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuizScreen from '../components/QuizScreen';
import ResultScreen from '../components/ResultScreen';
import questions from '../questions.json';
import { Audio } from 'expo-av';

// Definindo o tipo da pergunta para melhor organização
type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

// Função para embaralhar arrays
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function HomePage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);
  const [sound, setSound] = useState<Audio.Sound>();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Carrega as perguntas e o recorde ao iniciar
  useEffect(() => {
    startNewGame();
    getHighScore();
  }, []);

  // Efeito para o cronômetro
  useEffect(() => {
    if (isQuizFinished || isOptionsDisabled) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          handleTimeOut();
          return 15;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, isQuizFinished, isOptionsDisabled]);

  // Efeito para a animação de fade
  useEffect(() => {
    if (!isQuizFinished && shuffledQuestions.length > 0) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [currentQuestionIndex, isQuizFinished, shuffledQuestions]);

  // Descarrega o som quando o componente é desmontado
  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  async function playSound(isCorrect: boolean) {
    try {
      const soundFile = isCorrect
        ? require('../assets/sounds/correct.mp3') // Crie a pasta 'sounds' em 'assets' e adicione os arquivos
        : require('../assets/sounds/incorrect.mp3');
      const { sound } = await Audio.Sound.createAsync(soundFile);
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log('Erro ao tocar o som:', error);
    }
  }

  const getHighScore = async () => {
    try {
      const storedHighScore = await AsyncStorage.getItem('highScore');
      if (storedHighScore !== null) {
        setHighScore(parseInt(storedHighScore, 10));
      }
    } catch (error) {
      console.log('Erro ao carregar o recorde:', error);
    }
  };

  const startNewGame = () => {
    const shuffled = shuffleArray([...questions]).map((question) => ({
      ...question,
      options: shuffleArray([...question.options]),
    }));
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsOptionsDisabled(false);
    setScore(0);
    setLives(3);
    setTimeLeft(15);
    setIsQuizFinished(false);
  };

  const handleOptionPress = (option: string) => {
    if (isOptionsDisabled) return;

    const isCorrect = option === currentQuestion.correctAnswer;
    playSound(isCorrect);

    if (isCorrect) {
      setScore(score + 1);
    } else {
      setLives(lives - 1);
    }

    setSelectedOption(option);
    setIsOptionsDisabled(true);

    setTimeout(() => {
      if (lives - 1 === 0 && !isCorrect) {
        finishQuiz();
      } else {
        handleNextQuestion();
      }
    }, 1500); // Espera 1.5s antes de ir para a próxima pergunta
  };

  const handleTimeOut = () => {
    setLives(lives - 1);
    if (lives - 1 === 0) {
      finishQuiz();
    } else {
      handleNextQuestion();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsOptionsDisabled(false);
      setTimeLeft(15);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (score > highScore) {
      AsyncStorage.setItem('highScore', score.toString());
      setHighScore(score);
    }
    setIsQuizFinished(true);
  }

  const handlePlayAgain = () => {
    startNewGame();
  };

  if (shuffledQuestions.length === 0) {
    return null; // ou um componente de carregamento
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  return isQuizFinished ? (
    <ResultScreen
      score={score}
      totalQuestions={shuffledQuestions.length}
      onPlayAgain={handlePlayAgain}
      highScore={highScore}
    />
  ) : (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <QuizScreen
        currentQuestion={currentQuestion}
        selectedOption={selectedOption}
        isOptionsDisabled={isOptionsDisabled}
        onOptionPress={handleOptionPress}
        onNextQuestion={handleNextQuestion} // Este botão pode ser removido
        timeLeft={timeLeft}
        lives={lives}
      />
    </Animated.View>
  );
}