import { Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { FirebaseStorage, connectStorageEmulator } from "firebase/storage";
import { Auth, connectAuthEmulator } from "firebase/auth";

export default {
  production: false,
  baseUrl: 'http://localhost:4200',
  useEmulators: true,
  firebase: {
    options: {
      apiKey: 'demo',
      appId: 'demo',
      projectId: 'demo-market',
      authDomain: 'demo-market.firebaseapp.com',
      storageBucket: 'default-bucket',
    },
    firestore: (firestore: Firestore) => connectFirestoreEmulator(firestore, 'localhost', 8000),
    storage: (storage: FirebaseStorage) => connectStorageEmulator(storage, 'localhost', 9199),
    auth: (auth: Auth) => connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true }),
  }
};