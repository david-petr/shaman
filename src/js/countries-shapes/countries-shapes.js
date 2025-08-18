// ==== Globální proměnné ====
let allMapData = null
let data = []
let remainingCountriesToGuess = []
let guessedCountry = null

// ==== preference ====
const preferences = JSON.parse(localStorage.getItem("preferences"))
const continent = preferences.continent

// ==== functions ====
const update = () => {
    if(remainingCountriesToGuess.length > 0){
        if(guessedCountry){
            const previousCountryElement = document.getElementById(guessedCountry.id)
            previousCountryElement.style.display = "none"
    
            const previousPathElements = previousCountryElement.querySelectorAll("path")
            previousPathElements.forEach( element => {
                element.style.display = "block"
            })
        }

        guessedCountry = Random.randomElement(remainingCountriesToGuess)

        const countryElement = document.getElementById(guessedCountry.id)
        countryElement.style.display = "block"

        const pathElements = countryElement.querySelectorAll("path")
        pathElements.forEach( element => {
            element.style.display = "block"
        })

        remainingCountriesToGuess = remainingCountriesToGuess.filter( country => country.id !== guessedCountry.id)
    } else {
        console.log("konec")
    }
}

// ==== Hlavní inicializační funkce pro celou hru ====
const initializeGame = async () => {
    const worldMap = document.getElementById("map")
    worldMap.setAttribute("viewBox", "0 0 2500 1000")

    const gElements = worldMap.querySelectorAll("g")
    gElements.forEach( element => {
        element.style.display = "none"
    })
    const pathElements = worldMap.querySelectorAll("path")
    pathElements.forEach( element => {
        element.style.display = "none"
    })

    allMapData = await DataImport.getData("../../data/shapes.json")
    data = [...allMapData[continent]]
    remainingCountriesToGuess = Random.randomElementsFromArray(data, preferences.countOfQuestions)

    update()
}

// ==== DOM Content Loaded - hlavní spouštěč ====
document.addEventListener("DOMContentLoaded", initializeGame)

// ==== odstranění prvků ====
document.querySelector("#ocean")?.remove()
const titles = document.querySelector("body").querySelectorAll("title")
titles.forEach((title) => {
    title.remove()
})

// ==== nastavení accent color ====
window.accentColor.get().then(color => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.darken(Color.makeHexOpaque(color), 20))
})

window.accentColor.onUpdated((color) => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.darken(Color.makeHexOpaque(color), 20))
})