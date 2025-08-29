// ==== Globální proměnné ====
let allMapData = null
let data = []
let remainingCountriesToGuess = []
let guessedCountry = null
let worldMap
let countOfWrongAnswers = 0
const testButtonsSection = document.getElementById("test-buttons")
const testButtons = testButtonsSection.querySelectorAll("button")
const wrongTaskContent = document.getElementById("wrong")
const taskContent = document.getElementById("task")
const continueButton = document.getElementById("continue-btn")

// ==== preference ====
const preferences = JSON.parse(localStorage.getItem("preferences"))
const continent = preferences.continent

// ==== info box ====
const draggableWindow = new DraggableElement("handle", "info-box")
draggableWindow.countElement = document.getElementById("count")
draggableWindow.remainsElement = document.getElementById("remains")
draggableWindow.wrongElement = document.getElementById("count-of-wrong-answers")
draggableWindow.successRateElement = document.getElementById("success-rate")
draggableWindow.markElement = document.getElementById("mark")

// ==== functions ====
function continueButtonHandler() {
    this.removeEventListener("click", continueButtonHandler)

    taskContent.style.display = "flex"
    wrongTaskContent.style.display = "none"

    testButtons.forEach( button => {
        button.classList.remove("blink-target")
        button.classList.remove("disabled-btn")
        button.addEventListener("click", buttonHandler)
    })

    update()
}

function buttonHandler() {
    const id = this.id

    if(id === guessedCountry.id){
        draggableWindow.remainsElement.textContent = remainingCountriesToGuess.length

        update()
    } else {
        countOfWrongAnswers += 1

        taskContent.style.display = "none"
        wrongTaskContent.style.display = "flex"

        testButtons.forEach( button => {
            button.removeEventListener("click", buttonHandler)

            if(button.id === guessedCountry.id){
                button.classList.add("blink-target")
            } else {
                button.classList.add("disabled-btn")
            }
        })

        continueButton.addEventListener("click", continueButtonHandler)
    }
}

const update = () => {
    if(remainingCountriesToGuess.length > 0){
        draggableWindow.updateInfoBox(remainingCountriesToGuess.length, countOfWrongAnswers)

        if(guessedCountry){
            const previousCountryElement = document.getElementById(guessedCountry.id)
            previousCountryElement.style.display = "none"
    
            const previousPathElements = previousCountryElement.querySelectorAll("path")
            previousPathElements.forEach( element => {
                element.style.display = "none"
            })

            const previousGElements = previousCountryElement.querySelectorAll("g")
            previousGElements.forEach( element => {
                element.style.display = "none"
            })
        }

        guessedCountry = Random.randomElement(remainingCountriesToGuess)
        remainingCountriesToGuess = remainingCountriesToGuess.filter( country => country.id !== guessedCountry.id)

        const countryElement = document.getElementById(guessedCountry.id)
        countryElement.style.display = "block"

        const pathElements = countryElement.querySelectorAll("path")
        pathElements.forEach( element => {
            element.style.display = "block"
        })

        const gElements = countryElement.querySelectorAll("g")
        gElements.forEach( element => {
            element.style.display = "block"
        })

        // ==== nastavení země do zorného pole ====
        const viewBox = worldMap.getAttribute("viewBox").split(" ").map(parseFloat)
        let [x, y, width, height] = viewBox

        worldMap.setAttribute("viewBox", `${guessedCountry.position.x} ${guessedCountry.position.y} ${width} ${height}`)
        document.documentElement.style.setProperty("--scale", guessedCountry.position.scale)

        // ==== nastavení tlačítek ====
        let randomCountries = Random.randomElementsFromArray(data, 5)
        if(randomCountries.includes(guessedCountry)){
            while (randomCountries.includes(guessedCountry)){
                randomCountries = Random.randomElementsFromArray(data, 5)
            }
        }

        randomCountries.splice(Random.randomNumber(randomCountries.length), 0, guessedCountry)

        testButtons.forEach( (button, index) => {
            button.textContent = randomCountries[index].name
            button.id = randomCountries[index].id

            button.addEventListener("click", buttonHandler)
        })

    } else {
        testButtons.forEach( button => {
            button.removeEventListener("click", buttonHandler)

            button.classList.add("disabled-btn")
        })

        document.getElementById("task").querySelector("p").textContent = "Všechny země uhodnuty! Gratulujeme!"
    }
}

// ==== Hlavní inicializační funkce pro celou hru ====
const initializeGame = async () => {
    worldMap = document.getElementById("map")
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
    
    if(!allMapData[continent].concepts){
        data = [...allMapData[continent]]
        remainingCountriesToGuess = Random.randomElementsFromArray(data, preferences.countOfQuestions)
    } else {
        data = [...allMapData[continent].concepts, ...allMapData[continent].filling]
        remainingCountriesToGuess = Random.randomElementsFromArray([...allMapData[continent].concepts], preferences.countOfQuestions)
    }



    // ==== info box - aktuální informace ====
    draggableWindow.countElement.textContent = remainingCountriesToGuess.length
    draggableWindow.remainsElement.textContent = remainingCountriesToGuess.length
    draggableWindow.wrongElement.textContent = "0"
    draggableWindow.successRateElement.textContent = "--"
    draggableWindow.markElement.textContent = "--"

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
    document.documentElement.style.setProperty("--disabled-color", Color.makeHexOpaque(Color.darken(color, 40)))
})

window.accentColor.onUpdated((color) => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.darken(Color.makeHexOpaque(color), 20))
    document.documentElement.style.setProperty("--disabled-color", Color.makeHexOpaque(Color.darken(color, 40)))
})

// ==== close window ====
document.getElementById("close-btn").addEventListener("click", () => {
    window.location.href = "../../html/world.html"
})

// ==== testovací sekce ====
// document.addEventListener("keydown", (event) => {
//     const viewBox = worldMap.getAttribute("viewBox").split(" ").map(parseFloat)
//     let [x, y, width, height] = viewBox

//     const step = 5

//     switch (event.key){
//         case "ArrowUp":
//             y += step
//             break
//         case "ArrowDown":
//             y -= step
//             break
//         case "ArrowLeft":
//             x += step
//             break
//         case "ArrowRight":
//             x -= step
//             break
//     }

//     worldMap.setAttribute("viewBox", `${x} ${y} ${width} ${height}`)

//     if (event.ctrlKey && event.key === '+') {
//         document.documentElement.style.setProperty("--scale", Number(document.documentElement.style.getPropertyValue("--scale")) + 0.25)
//     }

//     if (event.ctrlKey && event.key === '-') {
//         document.documentElement.style.setProperty("--scale", Number(document.documentElement.style.getPropertyValue("--scale")) - 0.25)
//     }

//     document.getElementById("confirm").addEventListener("click", () => {
//         console.log(guessedCountry.name)
//         console.log(`"x": ${x}, "y": ${y}, "scale": ${Number(document.documentElement.style.getPropertyValue("--scale"))}`)
//     })
// })