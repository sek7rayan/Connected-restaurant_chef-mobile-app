import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

let handlerRegistered = false;

export const setupFCMForegroundHandler = async () => {
  if (handlerRegistered) return;
  handlerRegistered = true;

  await notifee.createChannel({
    id: 'default',
    name: 'Notifications par défaut',
    importance: AndroidImportance.HIGH,
    vibration: true,
    sound: 'default',
  });

  messaging().onMessage(async remoteMessage => {
    console.log("📩 [onMessage] Notification reçue (avant-plan) :", JSON.stringify(remoteMessage));
  
    if (!remoteMessage?.notification) {
      console.log("⚠️ [onMessage] Pas de contenu notification, message ignoré.");
      return;
    }
  
    try {
      await notifee.displayNotification({
        title: remoteMessage.notification.title ?? '📨 Notification',
        body: remoteMessage.notification.body ?? 'Tu as un nouveau message !',
        android: {
          channelId: 'default',
          pressAction: { id: 'default' },
          vibrationPattern: [200, 300],
          sound: 'default',
        },
      });
      console.log("✅ [onMessage] Notification affichée avec notifee");
    } catch (err) {
      console.error("❌ [onMessage] Erreur affichage notifee :", err);
    }
  });
};  