// components/MenuScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AudioControls from './AudioControls';

type MenuScreenProps = {
  onStartQuiz: () => void;
  highScore: number;
  isMuted: boolean;
  volume: number;
  onMuteToggle: () => void;
  onVolumeChange: (value: number) => void;
  showAudioControls: boolean;
  toggleAudioControls: () => void;
};

export default function MenuScreen({
  onStartQuiz,
  highScore,
  isMuted,
  volume,
  onMuteToggle,
  onVolumeChange,
  showAudioControls,
  toggleAudioControls,
}: MenuScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
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

      <View style={styles.content}>
        <Text style={styles.title}>Project Moon</Text>
        <Text style={styles.subtitle}>Quiz de Conhecimento</Text>
        <Text style={styles.highScore}>RECORDE ATUAL: {highScore}</Text>

        <TouchableOpacity style={styles.startButton} onPress={onStartQuiz}>
          <Text style={styles.startButtonText}>INICIAR TESTE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  topBar: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  settingsButton: {
    padding: 10,
  },
  settingsButtonText: {
    fontSize: 28,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ff3333',
    textShadowColor: 'rgba(255, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: '#f0f0f0',
    marginBottom: 60,
  },
  highScore: {
    fontSize: 18,
    color: '#ffcc00',
    marginBottom: 40,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#4a0a0a',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ff6600',
  },
  startButtonText: {
    color: '#ffcc00',
    fontSize: 22,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});