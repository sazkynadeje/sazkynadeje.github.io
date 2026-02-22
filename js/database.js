import { AuthService } from './auth.js';
import { sanitizeId } from './core.js';

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
    // Načte denní bank (převedený z minula)
    getBank: (callback) => {
        db.ref('sazkyData_v2/prevedenyBank').on('value', s => callback(s.val() || 0));
    },

    // Načte sezónní Jackpot (Bank Naděje)
    getJackpot: (callback) => {
        db.ref('sazkyData_v2/bankNadeje').on('value', s => callback(s.val() || 0));
    },

    getMatches: (callback) => {
        db.ref('sazkyData_v2/zapasy').on('value', s => callback(s.val()));
    },

    getStats: (callback) => {
        db.ref('sazkyData_v2/stats').on('value', s => callback(s.val() || {}));
    },

    // Načte specifická data hráče (včetně odznaků, které tam budeme sázet)
    getPlayerProfile: (playerName, callback) => {
        const id = sanitizeId(playerName);
        db.ref(`sazkyData_v2/players/${id}`).on('value', s => callback(s.val() || {}));
    },

    // BEZPEČNÉ A RYCHLÉ ODESLÁNÍ TIKETU (Atomická transakce)
    sendTicket: async (cart) => {
        const userData = AuthService.getUser(); 
        
        if (!userData || !userData.name) {
            throw new Error("Nejsi přihlášen! Zkus znovu zadat jméno.");
        }

        const updates = {};
        const uId = sanitizeId(userData.name); // Sjednocení ID pro celou aplikaci

        for (const [matchId, bet] of Object.entries(cart)) {
            const ticketId = db.ref().child(`sazkyData_v2/zapasy/${matchId}/sazky`).push().key;
            updates[`sazkyData_v2/zapasy/${matchId}/sazky/${ticketId}`] = {
                ...bet,
                userId: uId,
                jmeno: userData.name,
                zaplaceno: false, // Každá nová sázka začíná jako nezaplacená
                timestamp: Date.now()
            };
        }
        
        // Zvýšíme counter odeslaných tiketů pro odznaky věrnosti
        const statsRef = db.ref(`sazkyData_v2/players/${uId}/activity/ticketsSent`);
        await statsRef.transaction(current => (current || 0) + Object.keys(cart).length);

        return db.ref().update(updates);
    }
};
