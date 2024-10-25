import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import RtcEngine, { RtcLocalView, RtcRemoteView } from 'react-native-agora';

const VideoCall = ({ route, navigation }) => {
  const { channelName } = route.params; // Recibe el nombre del canal de la llamada
  const [engine, setEngine] = useState(null);
  const [remoteUid, setRemoteUid] = useState(null); // Estado para el UID remoto

  useEffect(() => {
    const init = async () => {
      const rtcEngine = await RtcEngine.create('YOUR_APP_ID'); // Reemplaza con tu App ID
      setEngine(rtcEngine);

      rtcEngine.enableVideo();
      rtcEngine.addListener('UserJoined', (uid) => {
        console.log('User joined', uid);
        setRemoteUid(uid); // Guarda el UID remoto
      });

      rtcEngine.addListener('UserOffline', (uid) => {
        console.log('User offline', uid);
        setRemoteUid(null); // Limpiar el UID remoto si el usuario se desconecta
      });

      await rtcEngine.joinChannel(null, channelName, null, 0); // Unirse al canal
    };

    init();

    return () => {
      if (engine) {
        engine.leaveChannel();
        engine.destroy();
      }
    };
  }, [channelName]);

  return (
    <View style={styles.container}>
      {/* Vista local */}
      <View style={styles.localVideo}>
        <RtcLocalView.SurfaceView style={styles.localVideo} />
      </View>

      {/* Vista remota */}
      {remoteUid && (
        <View style={styles.remoteVideo}>
          <RtcRemoteView.SurfaceView
            style={styles.remoteVideo}
            uid={remoteUid}
            channelId={channelName}
          />
        </View>
      )}

      <Button title="End Call" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  localVideo: {
    width: '100%',
    height: '50%',
    backgroundColor: 'black',
  },
  remoteVideo: {
    width: '100%',
    height: '50%',
    backgroundColor: 'gray',
  },
});

export default VideoCall;
