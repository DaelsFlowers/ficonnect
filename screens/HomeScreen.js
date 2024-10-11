import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Estado para almacenar errores

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.name || ''); // Manejo de nombre
            setUserRole(userData.role || ''); // Manejo de rol
          } else {
            console.log('No se encontró el documento del usuario.');
            setError('Usuario no encontrado'); // Manejo de error
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        setError('Error al obtener datos'); // Manejo de error
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate('Login');
      })
      .catch((error) => console.error(error));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text> {/* Mostrar mensaje de error */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>{t('Welcome')} {userName}!</Text>
      <Text style={styles.infoText}>{t('succeslog')}</Text>
      <Text style={styles.roleText}>{t('rol')}: {userRole}</Text>
      
      {userRole === 'admin' && (
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => navigation.navigate('AdminPanel')} // Navegación al panel admin
        >
          <Text style={styles.adminButtonText}>Admin Panel</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>{t('Logout')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  roleText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: '#2B2D42',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  signOutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  adminButton: {
    backgroundColor: '#EF233C',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  adminButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
