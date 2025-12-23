// ==== Globální proměnné ====
let data = null
let mapPosition = {}
let cities = []
let remainingCitiesToGuess = []
let countOfWrongAnswers = 0
let mainMapClickHandlerInstance = null
let currentCityElement = document.getElementById("country")
const NS = "http://www.w3.org/2000/svg"
const worldMap = document.getElementById("map")

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
const update = () => {
    const guessedCityId = currentCityElement.dataset.id

    if(guessedCityId){
        remainingCitiesToGuess = remainingCitiesToGuess.filter(city => city.id !== guessedCityId)

    }

    draggableWindow.updateInfoBox(remainingCitiesToGuess.length, countOfWrongAnswers)

    if (remainingCitiesToGuess.length > 0) {
        const nextRandomCity = Random.randomElement(remainingCitiesToGuess)
        if (nextRandomCity) {
            currentCityElement.textContent = nextRandomCity.name
            currentCityElement.dataset.id = nextRandomCity.id
        }
    } else {
        currentCityElement.textContent = "Všechny země uhodnuty! Gratulujeme!"
        currentCityElement.dataset.id = ""

        document.getElementById("map").removeEventListener("click", mainMapClickHandlerInstance)
    }
}

const mapClickHandler = (event) => {
    // let clickedCountry = event.target.closest(".landxx")

    // if(clickedCountry){
    //     const rect = clickedCountry.getBoundingClientRect()
    //     const relativeX = event.clientX - rect.left
    //     const relativeY = event.clientY - rect.top

    //     const percentX = (relativeX / rect.width) * 100
    //     const percentY = (relativeY / rect.height) * 100

    //     console.log(`"x": ${percentX.toFixed(2)}, "y": ${percentY.toFixed(2)}`)
    // }
}

const cityClickHandler = (event) => {
    const cityId = event.target.dataset.id

    if(cityId === currentCityElement.dataset.id){
        update()
    } else {
        
    }
}

const initializeGame = async () => {
    data = await DataImport.getData("../../data/cities.json")
    
    mapPosition = data[preferences.continent].mapPosition
    cities = data[preferences.continent].cities

    remainingCitiesToGuess = [...cities]
    remainingCitiesToGuess = remainingCitiesToGuess.filter((city) => {
        return preferences.regions.includes(city.region)
    })
    remainingCitiesToGuess = Random.randomElementsFromArray(remainingCitiesToGuess, preferences.countOfQuestions)

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

        const rect = element.getBBox()
        const x = rect.x + (rect.width * (city.position.x / 100))
        const y = rect.y + (rect.height * (city.position.y / 100))

        const cityGroup = document.createElementNS(NS, "g")
        cityGroup.setAttribute("class", "city-group")

        if (city.type === "capital-city") {
            const polygon = document.createElementNS(NS, "polygon")
            const size = 2.5
            let points = ""

            for (let i = 0; i < 5; i++) {
                const angle = (i * 2 * Math.PI / 5) - Math.PI / 2
                const px = x + size * Math.cos(angle)
                const py = y + size * Math.sin(angle)
                points += `${px},${py} `
            }

            polygon.setAttribute("points", points.trim())
            polygon.setAttribute("class", "city-marker")
            polygon.dataset.id = city.id
            polygon.style.fill = "var(--accent-color)"
            polygon.addEventListener("click", cityClickHandler)
            cityGroup.appendChild(polygon)
        } else {
            const circle = document.createElementNS(NS, "circle")
            circle.setAttribute("cx", x)
            circle.setAttribute("cy", y)
            circle.setAttribute("r", 1.5)
            circle.setAttribute("class", "city-marker")
            circle.dataset.id = city.id
            circle.style.fill = "var(--accent-color)"
            circle.addEventListener("click", cityClickHandler)
            cityGroup.appendChild(circle)
        }

        worldMap.appendChild(cityGroup)
    })

    // ==== Nastavení prvního losu země k uhodnutí ====
    update()

    // ==== Nastavení viewBox pro mapu ====
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
    window.location.href = "../../html/world.html"
})