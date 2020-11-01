import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDgFbgsk5n933VxT3tnV0rK5hKDdVIVbkg",
  authDomain: "instagram-clone-1b81a.firebaseapp.com",
  databaseURL: "https://instagram-clone-1b81a.firebaseio.com",
  projectId: "instagram-clone-1b81a",
  storageBucket: "instagram-clone-1b81a.appspot.com",
  messagingSenderId: "82136929944",
  appId: "1:82136929944:web:872117df62abe2728ce2ed",
  measurementId: "G-9D4NWLRB8K"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
