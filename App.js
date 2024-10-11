import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ConfirmEmailScreen from './screens/ConfirmEmailScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { ActivityIndicator, View, Button } from 'react-native';
import i18n from './i18n';
import { useTranslation } from 'react-i18next';

import ChatTest from './screens/ChatTest';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]); // Cambia esto a [] para que solo se ejecute al montar
  
  

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={ChatTest} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
      {/* Botón para cambiar el idioma */}
      <View style={{ position: 'absolute', bottom: 30, right: 30 }}>
        <Button title={t('ENG')} onPress={() => changeLanguage(i18n.language === 'en' ? 'es' : 'en')} />
      </View>
    </NavigationContainer>
  );
}
