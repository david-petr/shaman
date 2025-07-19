class DataImport {

    /**
     * Importuje data ze souboru
     * 
     * @param {String} path 
     * @returns
     */
    static async getData(path) {
        try {
            const response = await fetch(path)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error("Chyba při načítání dat:", error)
            return null
        }
    }
}