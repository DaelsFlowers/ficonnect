import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { auth } from '../firebaseConfig';
import { sendEmailVerification } from "firebase/auth";

export default function ConfirmEmailScreen({ navigation }) {
  const [isVerified, setIsVerified] = useState(auth.currentUser?.emailVerified);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkEmailVerified = setInterval(() => {
      auth.currentUser.reload()
        .then(() => {
          if (auth.currentUser.emailVerified) {
            clearInterval(checkEmailVerified);
            setIsVerified(true);
            navigation.navigate('Home');
          }
        })
        .catch((error) => console.error(error));
    }, 1000);

    return () => clearInterval(checkEmailVerified);
  }, [navigation]);

  const resendVerificationEmail = () => {
    setLoading(true);
    auth.currentUser.sendEmailVerification()
      .then(() => {
        setLoading(false);
        alert('Verificacion de  email Enviada!');
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Por favor verifica tu correo electronico . Enviamos un link de verificacion a tu email.
      </Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Reenviar Verificacion de Email" onPress={resendVerificationEmail} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});
