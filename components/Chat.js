import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, ScrollView, Alert, Modal } from 'react-native';
import { auth, firestore } from '../firebaseConfig';
import { collection, query, orderBy, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/HomeScreenStyles';
import { useTranslation } from 'react-i18next';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { WebView } from 'react-native-webview'; // Importar WebView

const Chat = ({ selectedUserId, setSelectedUserId, setIsChatActive }) => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [isVideoCallVisible, setIsVideoCallVisible] = useState(false); // Estado para controlar la visibilidad del modal
    const scrollViewRef = useRef();

    useEffect(() => {
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
            scrollViewRef.current.scrollToEnd({ animated: true });
        });

        return () => unsubscribe();
    }, [selectedUserId]);

    const handleSendMessage = async () => {
        if ((!message.trim() && !image) || !selectedUserId) return;

        const msg = {
            senderId: auth.currentUser.uid,
            receiverId: selectedUserId,
            content: message,
            timestamp: new Date(),
        };

        try {
            if (image) {
                // Subir imagen a Firebase Storage
                const storage = getStorage();
                const imageRef = ref(storage, `images/${auth.currentUser.uid}/${new Date().getTime()}.jpg`);

                // Leer imagen como base64
                const response = await fetch(image.uri);
                const blob = await response.blob();

                // Subir la imagen como blob
                await uploadString(imageRef, await blobToBase64(blob), 'data_url');

                // Obtener la URL de descarga
                const downloadURL = await getDownloadURL(imageRef);
                msg.image = downloadURL; // Agregar la URL al mensaje
            }

            await setDoc(doc(collection(firestore, 'messages')), msg);
            setMessage('');
            setImage(null);
        } catch (error) {
            console.error("Error sending message:", error);
            Alert.alert("Error", "No se pudo enviar el mensaje.");
        }
    };

    // Función auxiliar para convertir Blob a Base64
    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.assets) setImage(response.assets[0]);
        });
    };

    return (
        <View style={styles.chatContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        setSelectedUserId(null);
                        setIsChatActive(false);
                    }}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => setIsVideoCallVisible(true)} // Abrir modal de videollamada
                >
                    <Ionicons name="videocam" size={24} color="#4A90E2" />
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.messagesContainer} ref={scrollViewRef}>
                {messages.map((item) => (
                    <View key={item.id} style={item.senderId === auth.currentUser.uid ? styles.sentMessage : styles.receivedMessage}>
                        <Text style={item.senderId === auth.currentUser.uid ? styles.messageText : styles.otherMessageText}>
                            {item.content || ''}
                        </Text>
                        {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
                    </View>
                ))}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.messageInput}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message..."
                />
                <TouchableOpacity onPress={selectImage}>
                    <Ionicons name="camera" size={24} color="#4A90E2" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSendMessage}>
                    <Ionicons name="send" size={24} color="#4A90E2" />
                </TouchableOpacity>
            </View>

            {/* Modal para la videollamada */}
            <Modal
                visible={isVideoCallVisible}
                animationType="slide"
                onRequestClose={() => setIsVideoCallVisible(false)} // Cerrar modal
            >
                <WebView
                    source={{ uri: 'https://meet.jit.si/ficonnect#config.disableDeepLinking=true&config.enableWelcomePage=false&config.startWithAudioMuted=true&config.startWithVideoMuted=true' }}
                    style={{ flex: 1 }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                />
                <TouchableOpacity
                    style={{ position: 'absolute', top: 40, right: 20 }} // Botón para cerrar el modal
                    onPress={() => setIsVideoCallVisible(false)}
                >
                    <Text style={{ fontSize: 18, color: '#fff' }}>Cerrar</Text>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default Chat;
