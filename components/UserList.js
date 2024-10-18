import React from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import styles from '../styles/HomeScreenStyles';

const UserList = ({ users, setSelectedUserId }) => (
  <FlatList
    data={users}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <TouchableOpacity style={styles.userItem} onPress={() => setSelectedUserId(item.id)}>
        <View style={styles.userCircle}>
          <Text style={styles.initials}>{item.name.charAt(0)}</Text>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: item.online ? 'green' : 'red' }
            ]}
          />
        </View>
        <Text style={[styles.userName, !item.online && styles.offlineText]}>{item.name}</Text>
      </TouchableOpacity>
    )}
  />
);

export default UserList;
