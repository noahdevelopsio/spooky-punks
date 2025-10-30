import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// This is a public configuration and is safe to expose.
const firebaseConfig: FirebaseOptions = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id",
};

let app, auth, db;

// This pattern ensures that Firebase is initialized only once.
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// These services can be initialized here and reused throughout the app.
// It's safe to call them multiple times as they will return the same instance.
auth = getAuth(app);
db = getFirestore(app);


export { app, auth, db };
