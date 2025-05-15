import messaging from '@react-native-firebase/messaging';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled = 
    authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('✅ Permission notifications accordée');
    await getFcmToken();
  } else {
    console.log('❌ Permission refusée');
  }
}

export async function getFcmToken() {
  const token = await messaging().getToken();
  if (token) {
    console.log('📱 Token FCM récupéré :', token);

    // Envoie au backend
    await fetch('https://accomplished-vision-production.up.railway.app/api/fcm-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_user: 2, // <-- adapte si dynamique
        role: 'cuisinier',
        fcmToken: token
      })
    });
  }
}
