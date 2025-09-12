import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

type ResultScreenProps = {
    score: number;
    totalQuestions: number;
    onPlayAgain: () => void;
    highScore: number;
};

export default function ResultScreen({ score, totalQuestions, onPlayAgain, highScore }: ResultScreenProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Fim de Jogo!</Text>
            <Text style={styles.scoreText}>
                Você acertou {score} de {totalQuestions} perguntas!
            </Text>
            <Text style={styles.highScoreText}>
                Seu recorde é: {highScore}
            </Text>

        <TouchableOpacity style={styles.button} onPress={onPlayAgain}>
            <Text style={styles.buttonText}>Jogar Novamente</Text>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    scoreText: {
        fontSize: 24,
        marginBottom: 20,
        color: '#555',
    },
    highScoreText: {
        fontSize: 20,
        marginBottom: 40,
        color: '#555',
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
})