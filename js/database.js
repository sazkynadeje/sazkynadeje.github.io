import { db } from './config.js'; // Importujeme již vytvořené spojení
import { AuthService } from './auth.js';
import { sanitizeId } from './core.js';

export const DBService = {
    // Načte denní bank (převedený z minula)
    getBank: (callback) => {
        db.ref('sazkyData_v2/prevedenyBank').on('value', s => callback(s.val() || 0));
    },

    // Načte sezónní Jackpot (Bank Naděje)
    getJackpot: (callback) => {
        db.ref('sazkyData_v2/bankNadeje').on('value', s => callback(s.val() || 0));
    },

    // Načte celkovou pokladnu (v oběhu)
    getWallet: (callback) => {
        db.ref('sazkyData_v2/vOběhuCelkem').on('value', s => callback(s.val() || 0));
    },

    getMatches: (callback) => {
        db.ref('sazkyData_v2/zapasy').on('value', s => callback(s.val()));
    },

    getStats: (callback) => {
        db.ref('sazkyData_v2/stats').on('value', s => callback(s.val() || {}));
    },

    getPlayerProfile: (playerName, callback) => {
        const id = sanitizeId(playerName);
        db.ref(`sazkyData_v2/players/${id}`).on('value', s => callback(s.val() || {}));
    },

    // ODESLÁNÍ TIKETU - FINÁLNÍ EKONOMIKA 15/5 + CELKOVÝ OBĚH
    sendTicket: async (cart) => {
        const userData = AuthService.getUser(); 
        
        if (!userData || !userData.name) {
            throw new Error("Nejsi přihlášen! Zkus znovu zadat jméno.");
        }

        const updates = {};
        const uId = sanitizeId(userData.name);
        const matchCount = Object.keys(cart).length;
        
        // PŘÍPRAVA SÁZEK DO DATABÁZE
        for (const [matchId, bet] of Object.entries(cart)) {
            const ticketId = db.ref().child(`sazkyData_v2/zapasy/${matchId}/sazky`).push().key;
            updates[`sazkyData_v2/zapasy/${matchId}/sazky/${ticketId}`] = {
                ...bet,
                userId: uId,
                jmeno: userData.name,
                zaplaceno: false,
                timestamp: Date.now()
            };
        }

        try {
            // 1. Zápis samotných sázek
            await db.ref().update(updates);

            // 2. Zvýšíme counter odeslaných tiketů pro odznaky
            const activityRef = db.ref(`sazkyData_v2/players/${uId}/activity/ticketsSent`);
            await activityRef.transaction(current => (current || 0) + matchCount);

            return true;
        } catch (e) {
            console.error("Chyba při odesílání sázek:", e);
            throw e;
        }
    }
};
