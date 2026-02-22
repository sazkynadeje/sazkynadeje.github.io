/**
 * CORE LOGIC - KANCELÁŘ NADĚJE v5.2
 * Centrální místo pro výpočty, sanitaci a konfiguraci
 */

export const CONFIG = {
    // Bodové ohodnocení (Nadějné Body - NB)
    POINTS: { SCORE: 5, STRIKER: 3, TREND: 1 },
    
    // Peněžní logika (Ekonomika 15/5)
    BET_PRICE: 20,           // Celková cena tiketu
    DAILY_SHARE: 15,         // Část jdoucí do dnešního banku
    JACKPOT_SHARE: 5,        // Část jdoucí do celkového Banku Naděje
    
    CURRENCY: "Kč"
};

/**
 * Vytvoří unikátní ID z uživatelského jména pro LocalStorage a DB klíče
 * Odstraňuje diakritiku, mezery a převádí na malá písmena.
 */
export function sanitizeId(name) {
    if (!name) return null;
    return name.normalize("NFD")
               .replace(/[\u0300-\u036f]/g, "") // Odstraní diakritiku
               .replace(/\s+/g, '')             // Odstraní mezery
               .toLowerCase()
               .trim();
}

/**
 * Logika pro výpočet bodů (Nadějných Bodů - NB)
 * @param {Object} tip - Objekt sázky {tip: "1:2", strelec: "Pasta"}
 * @param {Object} result - Objekt výsledku {vysledek: "1:2", strelci: ["Pasta", "Zacha"]}
 */
export function calculatePoints(tip, result) {
    // Rozklad skóre (ošetření pro různé názvy vlastností v DB)
    const tipSkore = tip.tip || tip.skore;
    const resSkore = result.vysledek || result.skore;

    const [tD, tH] = tipSkore.split(':').map(Number);
    const [rD, rH] = resSkore.split(':').map(Number);
    
    // 1. Přesné skóre
    const hitsScore = (tD === rD && tH === rH);
    
    // 2. Trend (1 = domácí, 2 = hosté, 0 = remíza)
    const tipTrend = tD > tH ? 1 : (tD < tH ? 2 : 0);
    const realTrend = rD > rH ? 1 : (rD < rH ? 2 : 0);
    const hitsTrend = (tipTrend === realTrend);

    // 3. Střelci (case-insensitive kontrola)
    const tipStriker = tip.strelec.toLowerCase().trim();
    const matchStrelci = result.strelciZapasu || result.střelci || [];
    
    const hitsStriker = matchStrelci.some(s => 
        s.toLowerCase().includes(tipStriker) || tipStriker.includes(s.toLowerCase())
    );

    return {
        score: hitsScore ? CONFIG.POINTS.SCORE : 0,
        striker: hitsStriker ? CONFIG.POINTS.STRIKER : 0,
        trend: hitsTrend ? CONFIG.POINTS.TREND : 0,
        total: (hitsScore ? CONFIG.POINTS.SCORE : 0) + 
               (hitsStriker ? CONFIG.POINTS.STRIKER : 0) + 
               (hitsTrend ? CONFIG.POINTS.TREND : 0)
    };
}
