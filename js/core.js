/**
 * CORE LOGIC - KANCELÁŘ NADĚJE v2.0
 * Centrální místo pro výpočty, sanitaci a konfiguraci
 */

export const CONFIG = {
    POINTS: { SCORE: 5, STRIKER: 3, TREND: 1 },
    BET_PRICE: 20,
    CURRENCY: "Kč"
};

/**
 * Vytvoří unikátní ID z uživatelského jména pro LocalStorage a DB klíče
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
 */
export function calculatePoints(tip, result) {
    const [tD, tH] = tip.skore.split(':').map(Number);
    const [rD, rH] = result.skore.split(':').map(Number);
    
    const hitsScore = (tD === rD && tH === rH);
    
    // Logika trendu (kdo vyhrál / remíza)
    const tipTrend = tD > tH ? 1 : (tD < tH ? 2 : 0);
    const realTrend = rD > rH ? 1 : (rD < rH ? 2 : 0);
    const hitsTrend = (tipTrend === realTrend);

    // Střelci - kontrola pole střelců
    const tipStriker = tip.strelec.toLowerCase().trim();
    const hitsStriker = result.střelci.some(s => 
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
