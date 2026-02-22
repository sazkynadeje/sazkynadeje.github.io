export const firebaseConfig = {
    apiKey: "AIzaSyC-NCdmsgA42FxnopKm92m1y5gUGw_z_uE", 
    authDomain: "nadeje-208bd.firebaseapp.com", 
    databaseURL: "https://nadeje-208bd-default-rtdb.europe-west1.firebasedatabase.app", 
    projectId: "nadeje-208bd", 
    storageBucket: "nadeje-208bd.firebasestorage.app", 
    messagingSenderId: "688478977789", 
    appId: "1:688478977789:web:512d1520cf96c9e59cc894" 
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const db = firebase.database();

