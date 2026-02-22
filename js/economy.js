import { db } from './config.js'; // Přidáváme přímý import

export const EconomyService = {
    // Odstranili jsme (db) z argumentu, protože ji importujeme nahoře
    init: () => {
        const dbRef = db.ref('sazkyData_v2');

        dbRef.on('value', snap => {
            const data = snap.val() || {};
            const prev = parseInt(data.prevedenyBank) || 0;
            const jack = parseInt(data.bankNadeje) || 0;
            const obehrano = parseInt(data.vOběhuCelkem) || 0;
            
            let dailyExtra = 0;
            if (data.zapasy) {
                const aktivni = Object.values(data.zapasy)
                    .filter(m => m.status === "aktivni")
                    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

                if (aktivni.length > 0 && aktivni[0].sazky) {
                    dailyExtra = Object.keys(aktivni[0].sazky).length * 15;
                }
            }

            const uiMain = document.getElementById('uiMainBank');
            const uiNadeje = document.getElementById('uiBankNadeje');
            const uiVklad = document.getElementById('uiCelkovyVklad');

            if (uiMain) uiMain.innerText = (prev + dailyExtra).toLocaleString();
            if (uiNadeje) uiNadeje.innerText = jack.toLocaleString();
            if (uiVklad) uiVklad.innerText = obehrano.toLocaleString();

            const inPrev = document.getElementById('prevBankInput');
            const inNadeje = document.getElementById('nadejeBankInput');
            const inVklad = document.getElementById('vOběhuInput');

            if (inPrev && document.activeElement !== inPrev) inPrev.value = prev;
            if (inNadeje && document.activeElement !== inNadeje) inNadeje.value = jack;
            if (inVklad && document.activeElement !== inVklad) inVklad.value = obehrano;
        });
    },

    // Také zde jsme odstranili db z argumentu
    saveBank: (path, value) => {
        return db.ref('sazkyData_v2/' + path).set(parseInt(value) || 0);
    }
};
