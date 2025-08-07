// ==== Globální proměnné ====
let allData = null
const preferences = JSON.parse(localStorage.getItem("preferences"))
const continent = preferences.continent

const initializeGame = async () => {
    allData = await DataImport.getData("../../data/map.json")

    const countries = [...allData[continent].countries]

    countries.forEach( country => {
        const img = document.createElement("img")
        img.setAttribute("src", "../../img/flags/" + country.id + ".webp")

        document.querySelector("body").appendChild(img)
    })
}

initializeGame()