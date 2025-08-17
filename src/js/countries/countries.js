// ==== Globální proměnné ====
let allMapData = null
let remainingCountriesToGuess = []
let countOfWrongAnswers = 0
let mainMapClickHandlerInstance = null
let mapPosition = {}
let currentCountryElement = document.getElementById("country")
let taskContent = document.getElementById("task")
let wrongTaskContent = document.getElementById("wrong")
const continueButton = document.getElementById("continue-btn")

// ==== preference ====
const preferences = JSON.parse(localStorage.getItem("preferences"))

// ==== info box ====
const draggableWindow = new DraggableElement("handle", "info-box")
draggableWindow.countElement = document.getElementById("count")
draggableWindow.remainsElement = document.getElementById("remains")
draggableWindow.wrongElement = document.getElementById("count-of-wrong-answers")
draggableWindow.successRateElement = document.getElementById("success-rate")
draggableWindow.markElement = document.getElementById("mark")

// ==== functions =====
const update = () => {
    const guessedCountryId = currentCountryElement.dataset.id

    if (guessedCountryId) {
        remainingCountriesToGuess = remainingCountriesToGuess.filter(country => country.id !== guessedCountryId)
    }

    if (remainingCountriesToGuess.length > 0) {
        const nextRandomCountry = Random.randomElement(remainingCountriesToGuess)
        if (nextRandomCountry) {
            currentCountryElement.textContent = nextRandomCountry.name
            currentCountryElement.dataset.id = nextRandomCountry.id
        }

        draggableWindow.updateInfoBox(remainingCountriesToGuess.length, countOfWrongAnswers)
    } else {
        currentCountryElement.textContent = "Všechny země uhodnuty! Gratulujeme!"
        currentCountryElement.dataset.id = ""

        document.getElementById("map").removeEventListener("click", mainMapClickHandlerInstance)

        allMapData.forEach((country) => {
            const element = document.getElementById(country.id)

            element.removeEventListener("mouseover", countryMouseOverHandler)

            element.removeEventListener("mouseout", countryMouseOutHandler)

            if(country.circle) {
                const circle = element.querySelector("circle")
                if (circle) {
                    circle.removeEventListener("mouseover", circleMouseOverHandler)

                    circle.removeEventListener("mouseout", circleMouseOutHandler)
                }

                circleMouseOutHandler.call(circle)
            }

            countryMouseOutHandler.call(element)
        })
    }
}

const continueButtonHandler = function () {
    this.removeEventListener("click", continueButtonHandler)

    taskContent.style.display = "flex"
    wrongTaskContent.style.display = "none"

    document.getElementById("map").addEventListener("click", mainMapClickHandlerInstance)

    allMapData.forEach((country) => {
        const element = document.getElementById(country.id)

        element.addEventListener("mouseover", countryMouseOverHandler)

        element.addEventListener("mouseout", countryMouseOutHandler)

        if (country.circle) {
            const circle = element.querySelector("circle")
            if (circle) {
                circle.addEventListener("mouseover", circleMouseOverHandler)

                circle.addEventListener("mouseout", circleMouseOutHandler)
            }

            circleMouseOutHandler.call(circle)
        }

        if (country.id === currentCountryElement.dataset.id) {
            element.classList.remove("blink-target")
            element.querySelectorAll("path").forEach((pathEl) => {
                pathEl.classList.remove("blink-target")
            })
        }

        countryMouseOutHandler.call(element)
    })

    update()
}

const countryMouseOverHandler = function () {
    const element = this

    window.accentColor.get().then(color => {
        color = Color.makeHexOpaque(color)
        element.style.fill = color
        element.querySelectorAll("path").forEach((pathEl) => {
            pathEl.style.fill = color
        })
    })
}

const countryMouseOutHandler = function () {
    const element = this
    const originalColor = document.documentElement.style.getPropertyValue("--active-land")

    element.style.fill = originalColor
    element.querySelectorAll("path").forEach((pathEl) => {
        pathEl.style.fill = originalColor
    })
}

const circleMouseOverHandler = function () {
    const circle = this

    window.accentColor.get().then(color => {
        color = Color.makeHexOpaque(color)
        circle.style.fill = color
    })
}

const circleMouseOutHandler = function () {
    const circle = this
    const originalColor = document.documentElement.style.getPropertyValue("--active-land")

    circle.style.fill = originalColor
}


const mapClickHandler = (event, worldMap) => {
    let clickedCountry = event.target.closest(".landxx")
    if (!clickedCountry) {
        clickedCountry = event.target.closest(".circlexx")
        if (!clickedCountry) {
            clickedCountry = event.target.closest(".unxx")
        }
    }

    if (clickedCountry) {

        while (clickedCountry.id.length > 2 || clickedCountry.parentElement.id.length === 2) {
            clickedCountry = clickedCountry.parentElement
        }

        if (currentCountryElement.dataset.id === clickedCountry.id) {
            update()

        } else {
            taskContent.style.display = "none"
            wrongTaskContent.style.display = "flex"

            countOfWrongAnswers += 1

            worldMap.removeEventListener("click", mainMapClickHandlerInstance)

            allMapData.forEach((country) => {
                const element = document.getElementById(country.id)

                element.removeEventListener("mouseover", countryMouseOverHandler)

                element.removeEventListener("mouseout", countryMouseOutHandler)

                if (country.circle) {
                    const circle = element.querySelector("circle")
                    if (circle) {
                        circle.removeEventListener("mouseover", circleMouseOverHandler)

                        circle.removeEventListener("mouseout", circleMouseOutHandler)
                    }
                }

                if (country.id === currentCountryElement.dataset.id) {
                    if (country.circle) {
                        element.querySelector("circle").style.fill = "unset"
                    }

                    element.classList.add("blink-target")
                    element.querySelectorAll("path").forEach((pathEl) => {
                        pathEl.classList.add("blink-target")
                    })
                }
            })

            continueButton.addEventListener("click", continueButtonHandler)
        }
    }
}

// ==== Hlavní inicializační funkce pro celou hru ====
const initializeGame = async () => {
    allMapData = await DataImport.getData("../../data/map.json")

    mapPosition = allMapData[preferences.continent].mapPosition
    allMapData = allMapData[preferences.continent].countries

    remainingCountriesToGuess = [...allMapData]
    remainingCountriesToGuess = remainingCountriesToGuess.filter((country) => {
        return preferences.regions.includes(country.region)
    })
    remainingCountriesToGuess = Random.randomElementsFromArray(remainingCountriesToGuess, preferences.countOfQuestions)

    // ==== info box - aktualní info ====
    draggableWindow.countElement.textContent = remainingCountriesToGuess.length
    draggableWindow.remainsElement.textContent = remainingCountriesToGuess.length
    draggableWindow.wrongElement.textContent = "0"
    draggableWindow.successRateElement.textContent = "--"
    draggableWindow.markElement.textContent = "--"


    allMapData.forEach((country) => {
        const element = document.getElementById(country.id)

        element.classList.add("active")
        element.querySelectorAll("path").forEach((pathElement) => {
            pathElement.classList.add("active")
        })

        element.addEventListener("mouseover", countryMouseOverHandler)

        element.addEventListener("mouseout", countryMouseOutHandler)

        // ==== přidání koleček kolem malých zemí ====
        if (country.circle) {
            const circle = element.querySelector("circle")
            if (circle) {
                circle.style.opacity = 1

                circle.addEventListener("mouseover", circleMouseOverHandler)

                circle.addEventListener("mouseout", circleMouseOutHandler)
            }
        }
    })

    // ==== Nastavení prvního losu země k uhodnutí ====
    update()

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