class Color {

    /**
     * Převede hexadecimální barvu s volitelným alfa kanálem na plně neprůhlednou hexadecimální barvu.
     *
     * @param {string} hexColor Vstupní hexadecimální barva (např. "#FF0000", "#FF000080").
     * @returns {string} Plně neprůhledná hexadecimální barva (např. "#FF0000"), nebo prázdný řetězec, pokud je vstup neplatný.
     */
    static makeHexOpaque(hexColor) {
        if (!hexColor || typeof hexColor !== 'string' || !hexColor.startsWith('#')) {
            console.warn("Neplatný vstup pro makeHexOpaque. Očekává se řetězec začínající '#'.")
            return ''
        }

        const cleanHex = hexColor.slice(1)

        const length = cleanHex.length

        if (length === 3 || length === 6) {
            return hexColor
        } else if (length === 4) {
            const r = cleanHex[0]
            const g = cleanHex[1]
            const b = cleanHex[2]
            return `#${r}${r}${g}${g}${b}${b}`
        } else if (length === 8) {
            return `#${cleanHex.substring(0, 6)}`
        } else {
            console.warn(`Neplatná délka hexadecimální barvy: ${hexColor}`)
            return ''
        }
    }

    /**
     * Přidá alfa kanál k hexadecimální barvě, čímž ji učiní průsvitnou.
     *
     * @param {string} hexColor Vstupní hexadecimální barva (např. "#FF0000", "#FFF").
     * @param {number} opacity Průhlednost od 0 (plně průhledné) do 1 (plně neprůhledné).
     * @returns {string} Hexadecimální barva s alfa kanálem (např. "#FF000080").
     */
    static makeHexTransparent(hexColor, opacity) {
        // 1. Validace vstupu
        if (!hexColor || typeof hexColor !== 'string' || !hexColor.startsWith('#')) {
            console.warn("Neplatný vstup pro makeHexTransparent. Očekává se řetězec začínající '#'.");
            return '';
        }
        if (typeof opacity !== 'number' || opacity < 0 || opacity > 1) {
            console.warn("Neplatná hodnota průhlednosti. Očekává se číslo od 0 do 1.");
            return '';
        }

        // 2. Převod na 6místný hex kód
        const cleanHex = hexColor.slice(1);
        let fullHex;

        if (cleanHex.length === 3) {
            fullHex = cleanHex.split('').map(char => char + char).join('');
        } else if (cleanHex.length === 6 || cleanHex.length === 8) {
            // Pokud má barva již alfa kanál, odstraníme ho pro účely nové průhlednosti
            fullHex = cleanHex.substring(0, 6);
        } else {
            console.warn(`Neplatná délka hexadecimální barvy: ${hexColor}`);
            return '';
        }

        // 3. Převod průhlednosti na hexadecimální formát
        // 0 = 00, 1 = FF, 0.5 = 80
        const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');

        // 4. Vrácení hex kódu s alfa kanálem
        return `#${fullHex}${alpha}`;
    }

    /**
     * Ztmavý barvu o dané procento
     * 
     * @param {String} color 
     * @param {Number} percent 
     * @returns {String}
     */
    static darken(color, percent) {
        color = color.substring(1)
        let r = parseInt(color.substring(0, 2), 16)
        let g = parseInt(color.substring(2, 4), 16)
        let b = parseInt(color.substring(4, 6), 16)

        r = Math.round(r * (1 - percent / 100))
        g = Math.round(g * (1 - percent / 100))
        b = Math.round(b * (1 - percent / 100))

        r = r.toString(16).padStart(2, '0')
        g = g.toString(16).padStart(2, '0')
        b = b.toString(16).padStart(2, '0')

        return `#${r}${g}${b}`
    }
}