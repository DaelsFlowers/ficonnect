import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E5E5E5', // Fondo más claro y relajante
    },
    header: {
        marginBottom: 15,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 26,
        fontWeight: '700',
        color: '#374151', // Texto ligeramente más oscuro para mayor contraste
    },
    userListContainer: {
        flex: 1,
        marginVertical: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    chatContainer: {
        position: "absolute",
        maxHeight: "97%",
        bottom: 0, // Asegúrate de que el contenedor esté siempre en la parte inferior
        left: '5%', // Añade un margen a la izquierda
        right: '5%', // Añade un margen a la derecha
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 15, // Ajustado para un mejor aspecto
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.2, // Aumentado para más visibilidad
        shadowRadius: 10,
        elevation: 5, // Para Android, asegúrate de que tenga una sombra adecuada
        zIndex: 10, // Para que el contenedor esté en la parte superior
    },
    chatTitle: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    selectedUserName: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    messageBubble: {
        padding: 12,
        borderRadius: 18,
        marginVertical: 6,
        maxWidth: '75%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    myMessage: {
        backgroundColor: '#4F46E5',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: '#D1D5DB',
        alignSelf: 'flex-start',
    },
    messageImage: {
        width: 220,
        height: 160,
        borderRadius: 12,
        marginBottom: 5,
    },
    messageText: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: '500',
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EF4444',
        paddingVertical: 14,
        borderRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        marginTop: 10,
    },
    signOutButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 8,
    },
    messagesContainer: {
        flex: 1,
        paddingBottom: 80, // Para que los mensajes no se oculten detrás del input
    },
    sentMessage: {
        backgroundColor: '#4F46E5', // Color para el mensaje enviado
        alignSelf: 'flex-end', // Alineación a la derecha
        padding: 12,
        borderRadius: 18,
        marginVertical: 6,
        maxWidth: '75%', // Ancho máximo
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    messageText: {
        fontSize: 16,
        color: '#FFF', // Color de texto para mensajes enviados
        fontWeight: '500',
    },
    otherMessageText: {
        fontSize: 16,
        color: '#000', // Color de texto para mensajes recibidos
        fontWeight: '500',
    },
    receivedMessage: {
        backgroundColor: '#D1D5DB', // Color para el mensaje recibido
        alignSelf: 'flex-start', // Alineación a la izquierda
        padding: 12,
        borderRadius: 18,
        marginVertical: 6,
        maxWidth: '75%', // Ancho máximo
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: 220,
        height: 160,
        borderRadius: 12,
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    input: {
        marginVertical: 8,
        padding: 14,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F3F4F6',
        elevation: 2,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 8,
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    userCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    initials: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '600',
    },
    statusIndicator: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#10B981',
        position: 'absolute',
        bottom: 2,
        right: 2,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    userName: {
        fontSize: 18,
        fontWeight: '500',
        color: '#1F2937',
    },
    offlineText: {
        color: '#9CA3AF',
    },
    selectImageButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginVertical: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    selectImageButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    sendButton: {
        backgroundColor: '#22C55E',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginVertical: 8,
        elevation: 3,
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        marginTop: 10,
        marginBottom: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    userListContainer: {
        flex: 1,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        backgroundColor: '#2196F3',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    logoutButton: {
        backgroundColor: '#FF3D00',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10,
    },
    logoutButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
