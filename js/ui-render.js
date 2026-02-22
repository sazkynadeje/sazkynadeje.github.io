// js/ui-render.js
export const UIRenderer = {
    renderMatches: (zapasy, containerId, uId, user, activeDeadlines) => {
        const container = document.getElementById(containerId);
        container.innerHTML = "";
        if (!zapasy) return;

        Object.entries(zapasy).reverse().forEach(([id, m]) => {
            activeDeadlines[id] = m.deadline;
            const isEval = m.status === "vyhodnoceno";
            const isClosed = Date.now() > new Date(m.deadline).getTime();
            const userHasBet = m.sazky && Object.values(m.sazky).some(s => s.userId === uId || s.jmeno === user.name);

            const card = document.createElement('div');
            card.className = "match-card";
            card.onclick = () => { 
                const d = document.getElementById(`det-${id}`); 
                d.style.display = d.style.display === 'none' ? 'block' : 'none'; 
            };
            
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75em; margin-bottom:15px;">
                    <span style="color:var(--neon); font-weight:900;">ID: ${id.substring(0,5)}</span>
                    ${isEval ? `<span style="background:#27ae60; padding:4px 12px; border-radius:50px;">VÝSLEDEK ${m.vysledek}</span>` : `<span id="t-${id}" style="color:var(--neon); font-weight:bold;">⏱️</span>`}
                </div>
                <div class="flags-wrapper">
                    <div class="flag-container"><img class="flag-img" src="https://flagcdn.com/w160/${m.kodD}.png"><br><small>${m.domaci}</small></div>
                    <div class="vs-circle">VS</div>
                    <div class="flag-container"><img class="flag-img" src="https://flagcdn.com/w160/${m.kodH}.png"><br><small>${m.hoste}</small></div>
                </div>
                <div id="det-${id}" style="display:none; padding-top:20px; border-top:1px solid rgba(255,255,255,0.1);" onclick="event.stopPropagation()">
                    ${(!isClosed && !isEval) ? (
                        userHasBet ? 
                        `<div style="color:var(--neon); font-weight:900; padding:15px; border:1px dashed var(--neon); border-radius:15px; font-size:0.8em;">UŽ MÁŠ VSADZENO ✅</div>` :
                        `<div style="display:flex; justify-content:center; gap:10px; margin-bottom:20px;">
                            <input type="number" id="scD-${id}" class="score-input" placeholder="0">
                            <span style="font-size:2em; font-weight:900;">:</span>
                            <input type="number" id="scH-${id}" class="score-input" placeholder="0">
                        </div>
                        <input type="text" id="str-${id}" class="input-field" placeholder="Příjmení střelce">
                        <button class="btn-add-ticket" onclick="window.actionAdd('${id}', '${m.domaci} vs ${m.hoste}')">PŘIDAT NA TIKET (20 Kč)</button>`
                    ) : `<div style="font-weight:900; color:var(--neon);">SÁZKY UZAVŘENY</div>`}
                    <div id="bets-${id}" style="margin-top:15px;"></div>
                </div>`;
            container.appendChild(card);

            if(m.sazky) {
                const bl = document.getElementById(`bets-${id}`);
                Object.values(m.sazky).forEach(s => {
                    bl.innerHTML += `<div style="font-size:0.85em; background:rgba(255,255,255,0.03); padding:10px; border-radius:12px; margin-bottom:6px; display:flex; justify-content:space-between;">
                        <span>${s.stav || '⏳'} ${s.jmeno}</span> <b>${s.tip || s.skore}</b>
                    </div>`;
                });
            }
        });
    },

    startClock: (activeDeadlines) => {
        setInterval(() => {
            Object.entries(activeDeadlines).forEach(([id, dl]) => {
                const el = document.getElementById(`t-${id}`);
                if (!el) return;
                const diff = new Date(dl).getTime() - Date.now();
                if(diff <= 0) { 
                    el.innerText = "🔐 UZAVŘENO"; 
                    el.style.color = "#ff4444"; 
                } else {
                    const h=Math.floor(diff/3600000), m=Math.floor((diff%3600000)/60000), s=Math.floor((diff%60000)/1000);
                    el.innerText = `⏱️ ${h}:${m<10?'0'+m:m}:${s<10?'0'+s:s}`;
                }
            });
        }, 1000);
    }
};

