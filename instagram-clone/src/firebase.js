import firebase from 'firebase'
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAKaAHDcMuUati_ZMS0C1XPKb3k94XJQ3M",
    authDomain: "instagram-clone-3ee2c.firebaseapp.com",
    databaseURL: "https://instagram-clone-3ee2c.firebaseio.com",
    projectId: "instagram-clone-3ee2c",
    storageBucket: "instagram-clone-3ee2c.appspot.com",
    messagingSenderId: "859348037862",
    appId: "1:859348037862:web:aacd331174aaeda0934b27",
    measurementId: "G-J14VYDSP05"
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebase.storage();

export { auth , db , storage }