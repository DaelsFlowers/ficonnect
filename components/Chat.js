import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, Image, ScrollView, Alert } from 'react-native';
import { auth, firestore } from '../firebaseConfig';
import { collection, query, orderBy, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/HomeScreenStyles';
import { useTranslation } from 'react-i18next';

const Chat = ({ selectedUserId, setSelectedUserId, setIsChatActive }) => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
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
            ...(image && { image: image.uri }),
            timestamp: new Date(),
        };

        try {
            await setDoc(doc(collection(firestore, 'messages')), msg);
            setMessage('');
            setImage(null);
        } catch (error) {
            console.error("Error sending message:", error);
            Alert.alert("Error", "No se pudo enviar el mensaje.");
        }
    };

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.assets) setImage(response.assets[0]);
        });
    };

    return (
        <View style={styles.chatContainer}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                    setSelectedUserId(null);
                    setIsChatActive(false);
                }}
            >
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
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
        </View>
    );

};

export default Chat;