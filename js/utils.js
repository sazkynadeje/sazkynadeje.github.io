
// js/utils.js

export const Utils = {
    // Odstraní diakritiku (háčky a čárky) - důležité pro střelce a vlajky
    normalizeText: (text) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    },

    // Formátování odpočtu času do uzávěrky
    formatCountdown: (deadline) => {
        const diff = new Date(deadline).getTime() - Date.now();
        if (diff <= 0) return { closed: true, text: "🔐 UZAVŘENO" };

        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        return { 
            closed: false, 
            text: `⏱️ ${h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}` 
        };
    },

    // Generátor URL pro QR kód platby
    getQrUrl: (amount, userName) => {
        const msg = `Sazka_${userName}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return `https://api.paylibo.com/paylibo/generator/czech/image?accountNumber=295511827&bankCode=0300&amount=${amount}&currency=CZK&message=${msg}`;
    }
};
