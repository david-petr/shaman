class File {

    /**
     * Získá soubory z adresáře
     * 
     * @param {String} folder cesta od kořenového adresáře shaman/ ...
     * @returns 
     */
    static async getFiles(folder) {
        const response = await window.fileAPI.getFilesInFolder(folder)

        if (response.success) {
            return response.files
        } else {
            console.error('Nepodařilo se získat soubory:', response.error)
        }
    }
}