import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AudioControls from './AudioControls';

type ResultScreenProps = {
    score: number;
    totalQuestions: number;
    onPlayAgain: () => void;
    onReturnToMenu: () => void; // Nova prop
    highScore: number;
    isMuted: boolean;
    volume: number;
    onMuteToggle: () => void;
    onVolumeChange: (value: number) => void;
    showAudioControls: boolean;
    toggleAudioControls: () => void;
};

export default function ResultScreen({ 
    score, 
    totalQuestions, 
    onPlayAgain, 
    onReturnToMenu, // Nova prop
    highScore,
    isMuted,
    volume,
    onMuteToggle,
    onVolumeChange,
    showAudioControls,
    toggleAudioControls,
}: ResultScreenProps) {
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

            <View style={styles.contentContainer}>
                <Text style={styles.title}>RESULTADOS DO TESTE</Text>
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>
                        Questões corretas: {score} de {totalQuestions}
                    </Text>
                    <Text style={styles.highScoreText}>
                        Recorde de questões: {highScore}
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={onPlayAgain}>
                        <Text style={styles.buttonText}>Reiniciar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.menuButton]} onPress={onReturnToMenu}>
                        <Text style={styles.buttonText}>Menu</Text>
                    </TouchableOpacity>
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
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#ffcc00',
        textShadowColor: 'rgba(255, 153, 0, 0.9)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    scoreContainer: {
        backgroundColor: '#1c1c1c',
        borderRadius: 8,
        padding: 30,
        marginBottom: 50,
        borderWidth: 2,
        borderColor: '#4a0a0a',
        alignItems: 'center',
        width: '100%',
    },
    scoreText: {
        fontSize: 22,
        marginBottom: 10,
        color: '#f0f0f0',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    highScoreText: {
        fontSize: 20,
        color: '#aaaaaa',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        backgroundColor: '#4a0a0a',
        paddingVertical: 18,
        paddingHorizontal: 35,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ff6600',
        alignItems: 'center',
        flex: 1, // Faz os botões dividirem o espaço
        marginHorizontal: 10, // Adiciona espaço entre os botões
    },
    menuButton: {
      backgroundColor: '#2a2a2a',
      borderColor: '#666666',
    },
    buttonText: {
        color: '#ffcc00',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});