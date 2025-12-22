// ==== Globální proměnné ====
let data = null
let mapPosition = {}
let cities = []
let remainingCitiesToGuess = []
let countOfWrongAnswers = 0
let mainMapClickHandlerInstance = null

// ==== preference ====
const preferences = JSON.parse(localStorage.getItem("preferences"))

// ==== info box ====
const draggableWindow = new DraggableElement("handle", "info-box")
draggableWindow.countElement = document.getElementById("count")
draggableWindow.remainsElement = document.getElementById("remains")
draggableWindow.wrongElement = document.getElementById("count-of-wrong-answers")
draggableWindow.successRateElement = document.getElementById("success-rate")
draggableWindow.markElement = document.getElementById("mark")

// ==== functions ====
const mapClickHandler = (event, worldMap) => {
    console.log(event.offsetX, event.offsetY)
}

const initializeGame = async () => {
    data = await DataImport.getData("../../data/cities.json")
    
    mapPosition = data[preferences.continent].mapPosition
    cities = data[preferences.continent].cities

    remainingCitiesToGuess = [...cities]
    // remainingCitiesToGuess = remainingCitiesToGuess.filter((city) => {
    //     return preferences.regions.includes(city.region) + capital/city
    // })
    // remainingCitiesToGuess = Random.randomElementsFromArray(remainingCitiesToGuess, preferences.countOfQuestions)

    // ==== info box - aktualní info ====
    draggableWindow.countElement.textContent = remainingCitiesToGuess.length
    draggableWindow.remainsElement.textContent = remainingCitiesToGuess.length
    draggableWindow.wrongElement.textContent = "0"
    draggableWindow.successRateElement.textContent = "--"
    draggableWindow.markElement.textContent = "--"

    cities.forEach((city) => {
        const element = document.getElementById(city.landId)

        element.classList.add("active")
        element.querySelectorAll("path").forEach((pathElement) => {
            pathElement.classList.add("active")
        })
    })

    // ==== Nastavení viewBox pro mapu ====
    const worldMap = document.getElementById("map")

    worldMap.setAttribute('viewBox', `${mapPosition.x} ${mapPosition.y} ${mapPosition.width} ${mapPosition.height}`)
    document.documentElement.style.setProperty("--scale", mapPosition.scale)

    // ==== Nastavení click handleru pro mapu (globální) ====
    if (worldMap) {
        mainMapClickHandlerInstance = (event) => mapClickHandler(event, worldMap)
        worldMap.addEventListener("click", mainMapClickHandlerInstance)
    }
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

// ==== close window ====
document.getElementById("close-btn").addEventListener("click", () => {
    if (preferences.href === "europe") {
        window.close()
    } else if (preferences.href === "world") {
        window.location.href = "../../html/world.html"
    }
})