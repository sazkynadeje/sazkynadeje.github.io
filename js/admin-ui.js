// js/admin-ui.js
export const AdminUI = {
    renderMatches: (snap, db) => {
        const aC = document.getElementById('activeMatches');
        const hC = document.getElementById('historyMatches');
        if (!aC || !hC) return;

        aC.innerHTML = ""; hC.innerHTML = "";
        const data = snap.val(); 
        if (!data) return;

        Object.entries(data).reverse().forEach(([mid, m]) => {
            const div = document.createElement('div'); 
            div.className = 'match-item';
            
            let betsHtml = "";
            if (m.sazky) {
                Object.entries(m.sazky).forEach(([bid, s]) => {
                    const isPaid = s.zaplaceno || false;
                    const isEval = m.status === "vyhodnoceno";
                    betsHtml += `
                        <div class="bet-row">
                            <button class="paid-toggle" onclick="window.adminTogglePaid('${mid}','${bid}',${isPaid})" 
                                    style="background:${isPaid ? '#38a169':'#e53e3e'}; color:white;">
                                ${isPaid ? 'OK' : 'DLUŽÍ'}
                            </button>
                            <div style="flex:1; font-size:0.9em;"><strong>${s.jmeno}</strong></div>
                            <input type="text" id="editTip-${mid}-${bid}" value="${s.tip || s.skore}" ${isEval ? 'disabled' : ''} 
                                   style="width:55px; text-align:center; padding:8px; margin:0; background:#000; color:#fff; border:1px solid #334155;">
                            <input type="text" id="editStr-${mid}-${bid}" value="${s.strelec}" ${isEval ? 'disabled' : ''} 
                                   style="width:90px; padding:8px; margin:0; background:#000; color:#fff; border:1px solid #334155;">
                            ${!isEval ? `<button onclick="window.adminUpdateBet('${mid}','${bid}')" style="background:none; border:none; cursor:pointer; font-size:1.2em;">💾</button>` : ''}
                        </div>`;
                });
            }

            const headerStatus = m.status === 'vyhodnoceno' ? `<span style="color:var(--green)">VYHODNOCENO (${m.vysledek})</span>` : `<span style="color:var(--blue)">AKTIVNÍ</span>`;

            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:10px;">
                    <strong style="color:var(--blue); font-size:1.1em;">${m.domaci} - ${m.hoste}</strong>
                    <div style="font-size:0.7em; font-weight:900;">${headerStatus}</div>
                </div>
                ${betsHtml}
                <div style="margin-top:20px;">
                    ${m.status === 'aktivni' ? `
                        <textarea id="raw-${mid}" placeholder="Sem vlož text z Livesportu..." style="height:60px; font-size:0.85em;"></textarea>
                        <button class="btn btn-blue" onclick="window.adminStartEval('${mid}')">ZPRACOVAT VÝSLEDEK</button>
                    ` : `
                        <div style="display:flex; gap:10px;">
                            <button class="btn btn-blue" style="flex:1; font-size:0.7em; padding:10px; opacity:0.5;" onclick="window.adminReopenMatch('${mid}')">OTEVŘÍT ZÁPAS</button>
                            <button class="btn-red" style="flex:1; font-size:0.7em; padding:10px; background:none; border:1px solid var(--red); border-radius:12px; color:var(--red);" onclick="window.adminDeleteMatch('${mid}')">SMAZAT</button>
                        </div>
                    `}
                </div>`;

            if(m.status === "vyhodnoceno") hC.appendChild(div); else aC.appendChild(div);
        });
    },

    renderTags: (strelci, containerId) => {
        const c = document.getElementById(containerId); 
        if (!c) return;
        c.innerHTML = "";
        strelci.forEach((s, i) => {
            c.innerHTML += `<div class="tag">${s} <span onclick="window.adminRemoveTag(${i})" style="cursor:pointer; font-size:1.4em;">×</span></div>`;
        });
    }
};
