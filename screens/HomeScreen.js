import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { auth, firestore, database } from '../firebaseConfig'; // Asegúrate de importar el Realtime Database
import { doc, getDoc, updateDoc, onSnapshot, collection, query } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import UserList from '../components/UserList';
import Chat from '../components/Chat';
import styles from '../styles/HomeScreenStyles';
import { Ionicons } from '@expo/vector-icons';
import { ref, set, onDisconnect } from 'firebase/database'; // Importar funciones de Realtime Database

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [isChatActive, setIsChatActive] = useState(false); // Controlar la visibilidad del chat

  useEffect(() => {
    const fetchUserNameAndUsers = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().name);
            await updateDoc(doc(firestore, 'users', user.uid), { online: true });

            // Guardar el estado de conexión en Realtime Database
            const userRef = ref(database, `users/${user.uid}`);
            set(userRef, { online: true, name: userDoc.data().name });
            onDisconnect(userRef).set({ online: false }); // Desconectar automáticamente
          }

          const q = query(collection(firestore, 'users'));
          const unsubscribe = onSnapshot(q, snapshot => {
            setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          });

          return () => unsubscribe();
        } catch (error) {
          console.error('Error fetching user data:', error);
          Alert.alert('Error', 'No se pudo obtener la información del usuario.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUserNameAndUsers();
  }, []);

  const handleSignOut = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(firestore, 'users', user.uid), { online: false });
      }
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión.');
    }
  };

  const openModal = () => {
    const user = auth.currentUser;
    setUserInfo({
      username: user?.displayName || '',
      userId: user?.uid,
      userRole: 'User',
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setUserInfo({});
    setModalVisible(false);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isChatActive && (
        <View style={styles.header}>
          <Text style={styles.welcomeText}>{t('Hello')}, {userName} 👋</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={t('SearchUsers')}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <TouchableOpacity onPress={openModal}>
              <Ionicons name="settings-outline" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {selectedUserId ? (
        <Chat 
          selectedUserId={selectedUserId} 
          setSelectedUserId={setSelectedUserId} 
          setIsChatActive={setIsChatActive} 
        />
      ) : (
        <ScrollView style={styles.userListContainer}>
          <UserList users={filteredUsers} setSelectedUserId={setSelectedUserId} />
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{t('UserInformation')}</Text>
          <Text>Username: {userName}</Text>
          <Text>User ID: {userInfo.userId}</Text>
          <Text>User Role: {userInfo.userRole}</Text>

          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>{t('Close')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <Text style={styles.logoutButtonText}>{t('Logout')}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
