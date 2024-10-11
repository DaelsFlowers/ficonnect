// ChatTest.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet } from 'react-native';

export default function ChatTest() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const sendMessage = () => {
    if (currentMessage.trim() !== '') {
      setMessages([...messages, { text: currentMessage, id: messages.length.toString() }]);
      setCurrentMessage(''); // Limpiar el campo después de enviar
    }
  };

  return (
    <View style={styles.container}>
      {/* Lista de mensajes */}
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={styles.chatArea}
      />

      {/* Campo de texto y botón de enviar */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={currentMessage}
          onChangeText={setCurrentMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  chatArea: {
    flex: 1,
    marginBottom: 10,
  },
  messageBubble: {
    backgroundColor: '#DCF8C6',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    backgroundColor: '#FFF',
  },
  input: {
    flex: 1,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#00A9F4',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
