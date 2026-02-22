// js/admin-eval.js
export const AdminEval = {
    parseLivesport: (rawText) => {
        let cleanText = rawText.split(/PRODLOUŽENÍ|PENALTY|NÁJEZDY/i)[0];
        const scoreMatch = cleanText.match(/(\d+)\s*[:|-]\s*(\d+)/g);
        let res = { d: 0, h: 0, strelci: [] };
        
        if(scoreMatch) {
            const last = scoreMatch[scoreMatch.length-1].replace(/\s/g,'').replace('-',':').split(':');
            res.d = last[0]; res.h = last[1];
        }

        const lines = cleanText.split('\n');
        lines.forEach(line => {
            if (line.match(/^[\d+]+['.]/)) {
                let name = line.replace(/^[\d+]+['.]\s*/, '').split('(')[0].split(',')[0].replace(/[0-9]/g, '').replace(/[:|-]/g, '').trim();
                if(name.length > 3 && !res.strelci.includes(name)) res.strelci.push(name);
            }
        });
        return res;
    }
};

