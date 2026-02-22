import { AuthService } from './auth.js';

const firebaseConfig = {
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

const db = firebase.database();

export const DBService = {
    getBank: (callback) => {
        db.ref('sazkyData_v2/prevedenyBank').on('value', s => callback(s.val() || 0));
    },

    getMatches: (callback) => {
        db.ref('sazkyData_v2/zapasy').on('value', s => callback(s.val()));
    },

    getStats: (callback) => {
        db.ref('sazkyData_v2/stats').on('value', s => callback(s.val() || {}));
    },

    // BEZPEČNÉ A RYCHLÉ ODESLÁNÍ TIKETU (Atomická transakce)
    sendTicket: async (cart) => {
        const userData = AuthService.getUser(); 
        
        if (!userData || !userData.name) {
            throw new Error("Nejsi přihlášen! Zkus znovu zadat jméno.");
        }

        const updates = {};
        for (const [matchId, bet] of Object.entries(cart)) {
            const ticketId = db.ref().child(`sazkyData_v2/zapasy/${matchId}/sazky`).push().key;
            updates[`sazkyData_v2/zapasy/${matchId}/sazky/${ticketId}`] = {
                ...bet,
                userId: userData.id || userData.name,
                jmeno: userData.name,
                timestamp: Date.now()
            };
        }
        return db.ref().update(updates);
    }
};
