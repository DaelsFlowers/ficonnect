import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { auth } from '../firebaseConfig';
import { sendEmailVerification } from "firebase/auth";

export default function ConfirmEmailScreen({ navigation }) {
  const [isVerified, setIsVerified] = useState(auth.currentUser?.emailVerified);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkEmailVerified = async () => {
      try {
        await auth.currentUser?.reload(); 
        if (auth.currentUser?.emailVerified) {
          setIsVerified(true);
          navigation.navigate('Home'); 
        } else {
          setIsVerified(false);
          setLoading(false); 
        }
      } catch (error) {
        console.error(error);
        setLoading(false); 
      }
    };

    checkEmailVerified();

    const interval = setInterval(checkEmailVerified, 10000); 

    return () => clearInterval(interval); 
  }, [navigation]);

  const resendVerificationEmail = () => {
    if (auth.currentUser) {
      setLoading(true);
      sendEmailVerification(auth.currentUser)
        .then(() => {
          setLoading(false);
          alert('Verificación de email enviada!');
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);
        });
    } else {
      console.error("No hay usuario autenticado");
    }
  };

  const checkVerificationStatus = () => {
    setLoading(true);
    auth.currentUser?.reload()
      .then(() => {
        setLoading(false);
        if (auth.currentUser?.emailVerified) {
          setIsVerified(true);
          navigation.navigate('Home');
        } else {
          alert('El correo electrónico aún no ha sido verificado.');
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifica tu correo electrónico</Text>
      <Text style={styles.text}>
        Enviamos un enlace de verificación a tu email. Por favor, verifica tu correo electrónico para continuar.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={resendVerificationEmail}>
          <Text style={styles.buttonText}>Reenviar Verificación</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={checkVerificationStatus}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Revisar Verificación</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2B2D42',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    borderColor: '#2B2D42',
    borderWidth: 2,
  },
  secondaryButtonText: {
    color: '#2B2D42',
  },
});
