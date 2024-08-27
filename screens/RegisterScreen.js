import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../firebaseConfig'; 
import logo from '../assets/ficonnect_logo2.png';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            setErrorMessage('Todos los campos son obligatorios');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(firestore, 'users', user.uid), {
                name,
                email,
                createdAt: serverTimestamp(),
            });

            navigation.navigate('Login');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.imagenlogo}>
                <Image source={logo} style={styles.logo} />
            </View>
            <Text style={styles.title}>CREAR CUENTA</Text>
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>NOMBRE</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>CORREO</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>CONTRASEÑA</Text>
                    <View style={styles.passwordWrapper}>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            style={styles.input}
                        />
                        <Pressable 
                            onPress={() => setShowPassword(!showPassword)} 
                            style={styles.eyeIcon}
                        >
                            <Text>{showPassword ? 'X' : 'O'}</Text>
                        </Pressable>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>CONFIRMAR CONTRASEÑA</Text>
                    <View style={styles.passwordWrapper}>
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            style={styles.input}
                        />
                        <Pressable 
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
                            style={styles.eyeIcon}
                        >
                            <Text>{showConfirmPassword ? 'X' : 'O'}</Text>
                        </Pressable>
                    </View>
                </View>
                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>REGISTRARSE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.linkText}>VOLVER AL LOGIN</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
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
        textAlign: 'center',
    },
    form: {
        width: '100%',
        paddingVertical: 24,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        alignItems: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        width: '100%',
    },
    passwordWrapper: {
        position: 'relative',
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 8,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#2B2D42',
        paddingVertical: 12,
        borderRadius: 8,
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
    link: {
        marginTop: 8,
    },
    linkText: {
        color: '#007bff',
        textAlign: 'center',
        fontSize: 16,
    },
});