import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import logo from '../assets/ficonnect_logo2.png';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                navigation.navigate('Home');
            })
            .catch((error) => setErrorMessage(error.message));
    };

    return (
        <View style={styles.container}>
            <View style={styles.imagenlogo}>
                <Image source={logo} style={styles.logo} />
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.title}>INICIAR SESION</Text>
                <View style={styles.form}>
                    <View>
                        <Text>Correo</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>
                    <View style={styles.passwordContainer}>
                        <Text>Contraseña</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                style={[styles.input, styles.passwordInput]}
                            />
                            <TouchableOpacity
                                style={styles.toggleButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Text style={styles.toggleButtonText}>
                                    {showPassword ? 'X' : 'O'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <View style={styles.linkContainer}>
                        <Text style={styles.linkText}>NO TIENES CUENTA? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.linkTextB}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    imagenlogo: {
        width: '100%',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginTop: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#333',
    },
    formContainer: {
        padding: 10,
        alignItems: 'center',
    },
    form: {
        width: '100%',
        maxWidth: 400,
        paddingHorizontal: 16,
        paddingVertical: 24,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    input: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    passwordContainer: {
        marginBottom: 16,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    passwordInput: {
        flex: 1,
    },
    toggleButton: {
        position: 'absolute',
        right: 0,
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    toggleButtonText: {
        color: '#007bff',
    },
    error: {
        color: 'red',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#2B2D42',
        paddingVertical: 12,
        borderRadius: 16,
        marginBottom: 12,
        width: '50%',
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    linkContainer: {
        flexDirection: 'row',
        marginTop: 8,
        justifyContent: 'center',
    },
    linkText: {
        color: '#2B2D42',
        fontSize: 16,
    },
    linkTextB: {
        color: '#007bff',
        fontSize: 16,
    },
});