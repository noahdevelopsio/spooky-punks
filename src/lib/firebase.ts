import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// This is a public configuration and is safe to expose.
const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyBTqdhX9SwrExSraPDBsMa4naNlitSHw3U",
    authDomain: "spooky-punks.firebaseapp.com",
    projectId: "spooky-punks",
    storageBucket: "spooky-punks.appspot.com",
    messagingSenderId: "802572131043",
    appId: "1:802572131043:web:026706bc4c8a7759ba83d6",
    measurementId: "G-JCS8QEXJ2D"
};

let app;
// This pattern ensures that Firebase is initialized only once.
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// These services can be initialized here and reused throughout the app.
// It's safe to call them multiple times as they will return the same instance.
const auth = getAuth(app);
const db = getFirestore(app);


export { app, auth, db };
