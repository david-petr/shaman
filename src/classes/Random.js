class Random {

    /**
     * Náhodný prvek z pole
     * 
     * @param {Array} array
     * @returns
     */
    static randomElement(array) {
        if (array && array.length > 0) {
            const randomIndex = Math.floor(Math.random() * array.length)
            return array[randomIndex]
        } else {
            return undefined
        }
    }

    /**
     * Vybere náhodné prvky v poli
     * 
     * @param {Array} array 
     * @param {Number} count 
     * 
     *  @returns {Array}
     */
    static randomElementsFromArray(array, count){
        if (!Array.isArray(array)) {
            console.error("První argument musí být pole.")
            return []
        }
        if(count < 0){
            console.warn("Počet prvků k výběru nesmí být záporný.")
            return []
        }
        if (count > array.length) {
            console.warn("Požadovaný počet prvků je větší než počet prvků v poli.")
            return [...array]
        }
        if (count === 0) {
            return []
        }


        const randomElements = []
        const newArray = [...array]

        for (let i = 0; i < count; i++){
            const randomIndex = Math.floor(Math.random() * newArray.length)
            randomElements.push(newArray[randomIndex])
            newArray.splice(randomIndex, 1)
        }

        return randomElements
    }
}