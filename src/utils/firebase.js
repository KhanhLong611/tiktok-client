import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCRycTcfmt92cXYC5L-r91rCvtXOgRP6ZM',
  authDomain: 'tiktok-app-fc34b.firebaseapp.com',
  projectId: 'tiktok-app-fc34b',
  storageBucket: 'tiktok-app-fc34b.appspot.com',
  messagingSenderId: '542614162362',
  appId: '1:542614162362:web:6674695b4f69d6bbe3eb83',
  measurementId: 'G-M4FLH5JWQE',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
