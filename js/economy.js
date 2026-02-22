
// js/economy.js
export const EconomyService = {
    init: (db) => {
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

            // Aktualizace UI prvků
            document.getElementById('uiMainBank').innerText = (prev + dailyExtra).toLocaleString();
            document.getElementById('uiBankNadeje').innerText = jack.toLocaleString();
            document.getElementById('uiCelkovyVklad').innerText = obehrano.toLocaleString();
        });
    }
};
