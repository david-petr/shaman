// ==== Globální proměnné ====
let allMapData = null
const preferences = JSON.parse(localStorage.getItem("preferences"))
const continent = preferences.continent

const initializeGame = async () => {
    allMapData = await DataImport.getData("../../data/map.json")

    
}

initializeGame()