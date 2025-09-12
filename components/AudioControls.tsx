import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

type AudioControlsProps = {
  isMuted: boolean;
  volume: number;
  onMuteToggle: () => void;
  onVolumeChange: (value: number) => void;
};

export default function AudioControls({
  isMuted,
  volume,
  onMuteToggle,
  onVolumeChange,
}: AudioControlsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMuteToggle} style={styles.muteButton}>
        <Text style={styles.muteButtonText}>{isMuted ? '🔇' : '🔊'}</Text>
      </TouchableOpacity>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={isMuted ? 0 : volume}
        onValueChange={onVolumeChange}
        minimumTrackTintColor="#ffcc00"
        maximumTrackTintColor="#4a0a0a"
        thumbTintColor="#ffcc00"
        disabled={isMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100, // Posição abaixo da barra superior
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    zIndex: 5,
  },
  muteButton: {
    padding: 5,
  },
  muteButtonText: {
    fontSize: 24,
  },
  slider: {
    flex: 1,
    height: 40,
  },
});