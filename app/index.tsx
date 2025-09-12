import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuScreen from '../components/MenuScreen';
import QuizScreen from '../components/QuizScreen';
import ResultScreen from '../components/ResultScreen';
import questions from '../questions.json';
import { Audio } from 'expo-av';

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function HomePage() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);

  const musicPlayer = useRef<Audio.Sound | null>(null);
  const effectSound = useRef<Audio.Sound | null>(null);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const sfxVolume = 0.8;
  const [isMuted, setIsMuted] = useState(false);
  const [showAudioControls, setShowAudioControls] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getHighScore();
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    return () => {
      musicPlayer.current?.unloadAsync();
      effectSound.current?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (gameState === 'playing' || gameState === 'finished') {
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing' || isOptionsDisabled) return;
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
  }, [currentQuestionIndex, gameState, isOptionsDisabled]);


  async function playBackgroundMusic(track: 'quiz' | 'results' | 'menu') {
    if (musicPlayer.current) {
      const status = await musicPlayer.current.getStatusAsync();
      if (status.isLoaded) await musicPlayer.current.unloadAsync();
    }
    
    // Decidimos não ter música no menu, então retornamos cedo.
    if (track === 'menu') return;

    const file = track === 'quiz' 
      ? require('../assets/sounds/quiz-music.mp3')
      : require('../assets/sounds/results-music.mp3');

    try {
      const { sound } = await Audio.Sound.createAsync(file, { isLooping: true, volume: isMuted ? 0 : musicVolume });
      musicPlayer.current = sound;
      await musicPlayer.current.playAsync();
    } catch (error) {
      console.log('Erro ao tocar música de fundo:', error);
    }
  }

  async function playSound(isCorrect: boolean) {
    try {
      if (effectSound.current) {
        await effectSound.current.unloadAsync();
      }
      const soundFile = isCorrect ? require('../assets/sounds/correct.mp3') : require('../assets/sounds/incorrect.mp3');
      const { sound } = await Audio.Sound.createAsync(soundFile, { volume: isMuted ? 0 : sfxVolume });
      effectSound.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.log('Erro ao tocar o som de efeito:', error);
    }
  }
  
  const handleMuteToggle = async () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    if (musicPlayer.current) {
      await musicPlayer.current.setVolumeAsync(newMuteState ? 0 : musicVolume);
    }
  };

  const handleVolumeChange = async (value: number) => {
    if (isMuted) { setIsMuted(false); }
    setMusicVolume(value);
    if (musicPlayer.current) {
      await musicPlayer.current.setVolumeAsync(value);
    }
  };
  
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

  const handleStartQuiz = () => {
    const shuffled = shuffleArray([...questions]);
    setShuffledQuestions(shuffled.map(q => ({...q, options: shuffleArray(q.options)})));
    setScore(0);
    setLives(3);
    setTimeLeft(15);
    setSelectedOption(null);
    setIsOptionsDisabled(false);
    setCurrentQuestionIndex(0);
    setShowAudioControls(false);
    fadeAnim.setValue(0);
    setGameState('playing');
    playBackgroundMusic('quiz');
  };
  
  const handleOptionPress = (option: string) => {
    if (isOptionsDisabled) return;
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const isCorrect = option === currentQuestion.correctAnswer;
    playSound(isCorrect);
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
        setScore(newScore);
    } else {
        setLives(lives - 1);
    }
    setSelectedOption(option);
    setIsOptionsDisabled(true);
    setTimeout(() => {
        const isLastQuestion = currentQuestionIndex === shuffledQuestions.length - 1;
        const outOfLives = lives - 1 === 0 && !isCorrect;
        if (isLastQuestion || outOfLives) {
            finishQuiz(newScore);
        } else {
            handleNextQuestion();
        }
    }, 1500);
  };

  const handleTimeOut = () => {
      const newLives = lives - 1;
      setLives(newLives);
      const isLastQuestion = currentQuestionIndex === shuffledQuestions.length - 1;
      if (newLives === 0 || isLastQuestion) {
          finishQuiz(score);
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
          finishQuiz(score);
      }
  };

  const finishQuiz = async (finalScore: number) => {
      if (finalScore > highScore) {
        try {
            await AsyncStorage.setItem('highScore', finalScore.toString());
            setHighScore(finalScore);
        } catch (error) {
            console.log('Erro ao salvar o recorde:', error);
        }
      }
      setGameState('finished');
      playBackgroundMusic('results');
  }

  // NOVA FUNÇÃO: Voltar para o menu
  const handleReturnToMenu = () => {
    setGameState('menu');
    setShowAudioControls(false);
    playBackgroundMusic('menu'); // Para a música
  };
  
  if (shuffledQuestions.length === 0 && gameState === 'playing') {
    return null; 
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  if (gameState === 'menu') {
    return <MenuScreen 
      onStartQuiz={handleStartQuiz}
      highScore={highScore}
      isMuted={isMuted}
      volume={musicVolume}
      onMuteToggle={handleMuteToggle}
      onVolumeChange={handleVolumeChange}
      showAudioControls={showAudioControls}
      toggleAudioControls={() => setShowAudioControls(!showAudioControls)}
    />
  }

  if (gameState === 'finished') {
    return <ResultScreen
      score={score}
      totalQuestions={shuffledQuestions.length}
      onPlayAgain={handleStartQuiz} // Reutiliza a função de iniciar
      onReturnToMenu={handleReturnToMenu} // Passa a nova função
      highScore={highScore}
      isMuted={isMuted}
      volume={musicVolume}
      onMuteToggle={handleMuteToggle}
      onVolumeChange={handleVolumeChange}
      showAudioControls={showAudioControls}
      toggleAudioControls={() => setShowAudioControls(!showAudioControls)}
    />
  }

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <QuizScreen
        currentQuestion={currentQuestion}
        selectedOption={selectedOption}
        isOptionsDisabled={isOptionsDisabled}
        onOptionPress={handleOptionPress}
        timeLeft={timeLeft}
        lives={lives}
        isMuted={isMuted}
        volume={musicVolume}
        onMuteToggle={handleMuteToggle}
        onVolumeChange={handleVolumeChange}
        showAudioControls={showAudioControls}
        toggleAudioControls={() => setShowAudioControls(!showAudioControls)}
      />
    </Animated.View>
  );
}