// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getRemoteConfig } from "firebase/remote-config"; // ✅ добавляем импорт RemoteConfig

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAmjoD2JiW19kumdwMO_yFRPCYMnJCzzRw",
    authDomain: "rafconsolestudio-f27bb.firebaseapp.com",
    projectId: "rafconsolestudio-f27bb",
    storageBucket: "rafconsolestudio-f27bb.appspot.com",
    messagingSenderId: "243191212",
    appId: "1:243191212:web:4481e88e9c2df856fe3e09",
    measurementId: "G-B8H61V5CHB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
/*let analytics = null;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}*/

// ✅ Инициализация Remote Config
const remoteConfig = getRemoteConfig(app);
remoteConfig.settings = {
    minimumFetchIntervalMillis: 3600000, // 1 час
};
remoteConfig.defaultConfig = {
    NEXT_PUBLIC_TELEGRAM_BOT_TOKEN: 'default_token',
    NEXT_PUBLIC_TELEGRAM_CHAT_ID: 'default_chat_id',
};

export { app, remoteConfig }; // ✅ экспортируем
