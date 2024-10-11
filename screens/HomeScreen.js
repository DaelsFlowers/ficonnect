import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, TextInput, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { launchImageLibrary } from 'react-native-image-picker'; // Importar para seleccionar imágenes

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null); // Estado para la imagen
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUserNameAndUsers = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().name);
          } else {
            console.log('No se encontró el documento del usuario.');
          }

          await updateDoc(doc(firestore, 'users', user.uid), { online: true });

          const q = query(collection(firestore, 'users'));
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUsers(usersList);
          });

          return () => unsubscribe();
        } catch (error) {
          console.error("Error fetching user data: ", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No hay usuario autenticado.');
        setLoading(false);
      }
    };

    fetchUserNameAndUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      const messagesRef = query(
        collection(firestore, 'messages'),
        orderBy('timestamp')
      );
      const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
        const messagesList = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (msg) =>
              (msg.senderId === auth.currentUser.uid && msg.receiverId === selectedUserId) ||
              (msg.senderId === selectedUserId && msg.receiverId === auth.currentUser.uid)
          );
        setMessages(messagesList);
      });

      return () => unsubscribe();
    }
  }, [selectedUserId]);

  const handleSendMessage = async () => {
    console.log('Sending message:', { message, image, selectedUserId }); // Debugging log

    if ((message.trim() === '' && !image) || !selectedUserId) return;

    const msg = {
        senderId: auth.currentUser.uid,
        receiverId: selectedUserId,
        content: message,
        ...(image && { image: image.uri }), // Add image only if it exists
        timestamp: new Date(),
    };

    try {
        await setDoc(doc(collection(firestore, 'messages')), msg);
        setMessage(''); // Resetear el mensaje
        setImage(null); // Resetear la imagen después de enviar
    } catch (error) {
        console.error("Error sending message: ", error);
    }
};


  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
        if (response.didCancel) {
            console.log('Usuario canceló la selección de imagen');
        } else if (response.error) {
            console.error('Error al seleccionar imagen: ', response.error);
        } else if (response.assets && response.assets.length > 0) { // Ensure assets exist
            setImage(response.assets[0]); // Guardar la imagen seleccionada
        }
    });
};

  const getInitials = (name) => {
    if (!name) return '';
    const namesArray = name.split(' ');
    const initials = namesArray.map(n => n.charAt(0).toUpperCase()).join('');
    return initials;
  };
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>{t('Welcome')} {userName}!</Text>
      {selectedUserId ? (
        <View style={styles.chatContainer}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.messageBubble, item.senderId === auth.currentUser.uid ? styles.myMessage : styles.otherMessage]}>
                {item.image && (
                  <Image
                    source={{ uri: item.image }} // Muestra la imagen si existe
                    style={styles.messageImage} // Estilo para la imagen
                  />
                )}
                <Text style={styles.messageText}>
                  {item.content}
                </Text>
              </View>
            )}
          />
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder={t('Type a message')}
            placeholderTextColor="#A3A3A3"
          />
          <TouchableOpacity style={styles.selectImageButton} onPress={selectImage}>
            <Text style={styles.selectImageButtonText}>{t('Select Image')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>{t('Send')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeChatButton} onPress={() => setSelectedUserId(null)}>
            <Text style={styles.closeChatButtonText}>{t('Close Chat')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={users.filter((user) => user.id !== auth.currentUser.uid)} // Filtrar el usuario actual
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => setSelectedUserId(item.id)}
            >
              <View style={styles.userCircle}>
                <Text style={styles.initials}>{getInitials(item.name)}</Text>
                <View style={[styles.statusIndicator, { backgroundColor: item.online ? 'green' : 'red' }]} />
              </View>
              <Text style={[styles.userName, !item.online && styles.offlineText]}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
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
    backgroundColor: '#FFFFFF', // Color de fondo blanco
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
  selectImageButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  selectImageButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF', // Color azul
    marginBottom: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CED4DA', // Color de borde claro
  },
  userCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007BFF', // Color azul para el círculo
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 10,
  },
  initials: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  userName: {
    color: '#212529', // Color de texto oscuro
    fontSize: 18,
  },
  offlineText: {
    color: '#A3A3A3', // Color gris para usuarios offline
  },
  chatContainer: {
    flex: 1,
    marginTop: 20,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    maxWidth: '75%',
  },
  myMessage: {
    backgroundColor: '#007BFF', // Color azul para mis mensajes
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#E9ECEF', // Color de fondo claro para mensajes de otros
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#212529', // Color de texto oscuro
  },
  input: {
    backgroundColor: '#F8F9FA', // Color de fondo claro para el input
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#CED4DA', // Color de borde claro
  },
  sendButton: {
    backgroundColor: '#007BFF', // Color azul para el botón de enviar
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF', // Color de texto blanco
  },
  closeChatButton: {
    backgroundColor: '#FF4D4D', // Color rojo para el botón de cerrar chat
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeChatButtonText: {
    color: '#FFFFFF', // Color de texto blanco
  },
  signOutButton: {
    backgroundColor: '#FF4D4D', // Color rojo para el botón de cerrar sesión
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  signOutButtonText: {
    color: '#FFFFFF', // Color de texto blanco
  },
});
