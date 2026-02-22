// js/notifications.js - VERZE V23 (Stable Fix)
(function() {
    console.log("🚀 NOTIF-LOGIC: Spouštím verzi V23.");

    const notifStatus = localStorage.getItem('sazka_notif_v23');
    if (notifStatus === 'ano' || notifStatus === 'skip') return;

    // 1. STYLY
    const style = document.createElement('style');
    style.innerHTML = `
        #n_box_root { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 99999; align-items: center; justify-content: center; font-family: sans-serif; }
        .n_content { background: #1e293b; padding: 35px; border-radius: 35px; border: 2px solid #00f2ff; max-width: 290px; text-align: center; color: white; box-shadow: 0 0 30px rgba(0,242,255,0.3); }
        .n_btn { width: 100%; padding: 18px; margin-top: 15px; border-radius: 18px; border: none; font-weight: 900; cursor: pointer; text-transform: uppercase; }
        .n_yes { background: #00f2ff; color: #000; }
        .n_no { background: rgba(255,255,255,0.1); color: white; margin-top: 10px; }
    `;
    document.head.appendChild(style);

    // 2. HTML
    const container = document.createElement('div');
    container.innerHTML = `
        <div id="n_box_root">
            <div class="n_content">
                <h2 style="color:#00f2ff; margin:0 0 15px 0;">OZNÁMENÍ 🏒</h2>
                <p>Chceš dostávat upozornění na výsledky přímo na displej?</p>
                <button id="n_btn_yes" class="n_btn n_yes">ANO, CHCI</button>
                <button id="n_btn_no" class="n_btn n_no">MOŽNÁ POZDĚJI</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // 3. FUNKCE PRO AKTIVACI
    function vyrizeno(stav) {
        localStorage.setItem('sazka_notif_v23', stav);
        document.getElementById('n_box_root').style.display = 'none';
        
        if (stav === 'ano' && typeof webpushr !== 'undefined') {
            console.log("🛠️ Volám registraci Webpushr...");
            webpushr('fetch_subscription', function(r) {
                if(r.status === 'success') {
                    alert("Hotovo! ✅ Notifikace jsou aktivní.");
                } else {
                    console.log("Webpushr Info:", r.description);
                }
            });
        }
    }

    // 4. ZOBRAZENÍ (Bezpečnější kontrola přímo přes prohlížeč)
    setTimeout(() => {
        // Kontrola, zda prohlížeč vůbec notifikace umí
        if (!("Notification" in window)) return;

        console.log("📊 Status notifikací:", Notification.permission);

        // Pokud ještě uživatel nepovolil ani nezakázal, ukážeme náš modál
        if (Notification.permission !== 'granted') {
            document.getElementById('n_box_root').style.display = 'flex';
        }

        document.getElementById('n_btn_yes').onclick = () => vyrizeno('ano');
        document.getElementById('n_btn_no').onclick = () => vyrizeno('skip');
    }, 3000);
})();
