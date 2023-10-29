import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence  } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCipqlR3-xV2xTftn016Hb4QZi_SKP6H6Q",
  authDomain: "prservice-6637a.firebaseapp.com",
  projectId: "prservice-6637a",
  storageBucket: "prservice-6637a.appspot.com",
  messagingSenderId: "928631304843",
  appId: "1:928631304843:web:b62063f6e29296fe045a8e"
};

const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);
const storage = getStorage(app);

export {db, storage};