// ==== Globální proměnné ====
const flagElement = document.getElementById("flag")
const testButtonsSection = document.getElementById("test-buttons")
const testButtons = testButtonsSection.querySelectorAll("button")
const wrongTaskContent = document.getElementById("wrong")
const taskContent = document.getElementById("task")
let guessedFlag = null
let countries = null
let remainingCountriesToGuess = []
let countOfWrongAnswers = 0

// ==== preference ====
const preferences = JSON.parse(localStorage.getItem("preferences"))
const continent = preferences.continent

// ==== info box ====
let countElement = document.getElementById("count")
let remainsElement = document.getElementById("remains")
let wrongElement = document.getElementById("count-of-wrong-answers")
let successRateElement = document.getElementById("success-rate")
let markElement = document.getElementById("mark")

const continueButton = document.getElementById("continue-btn")

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

    wrongElement.textContent = countOfWrongAnswers

    update()

}

function buttonHandler() {
    const id = this.id
    
    if(id === guessedFlag.id){
        remainsElement.textContent = remainingCountriesToGuess.length

        update()
    } else {
        countOfWrongAnswers += 1

        taskContent.style.display = "none"
        wrongTaskContent.style.display = "flex"

        testButtons.forEach( button => {
            button.removeEventListener("click", buttonHandler)

            if(button.id === guessedFlag.id){
                button.classList.add("blink-target")
            } else {
                button.classList.add("disabled-btn")
            }
        })

        continueButton.addEventListener("click", continueButtonHandler)
    }
}

const update = () => {
    guessedFlag = Random.randomElement(remainingCountriesToGuess)

    remainingCountriesToGuess = remainingCountriesToGuess.filter(country => country.id !== guessedFlag.id)
    flagElement.setAttribute("src", "../../img/flags/" + guessedFlag.id + ".webp")

    let randomFlags = Random.randomElementsFromArray(countries, 5)

    if(randomFlags.includes(guessedFlag)){
        while (randomFlags.includes(guessedFlag)){
            randomFlags = Random.randomElementsFromArray(countries, 5)
        }
    }

    randomFlags.splice(Random.randomNumber(randomFlags.length), 0, guessedFlag)
    
    testButtons.forEach( (button, index) => {
        button.textContent = randomFlags[index].name
        button.id = randomFlags[index].id

        button.addEventListener("click", buttonHandler)
    }) 
}

const initializeGame = async () => {
    const allData = await DataImport.getData("../../data/flags.json")

    countries = [...allData[continent]]
    remainingCountriesToGuess = Random.randomElementsFromArray(countries, preferences.countOfQuestions)

    // ==== info box - aktuální informace ====
    countElement.textContent = remainingCountriesToGuess.length
    remainsElement.textContent = remainingCountriesToGuess.length
    wrongElement.textContent = "0"
    successRateElement.textContent = "--"
    markElement.textContent = "--"
    
    update()
}

initializeGame()

// ==== accent color => css variables ====
window.accentColor.get().then(color => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
    document.documentElement.style.setProperty("--disabled-color", Color.makeHexOpaque(Color.darken(color, 40)))
})
window.accentColor.onUpdated((color) => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
    document.documentElement.style.setProperty("--disabled-color", Color.makeHexOpaque(Color.darken(color, 40)))
})

// ==== info box handle - pohyb ====
const handle = document.getElementById("handle")
const infoWindow = document.getElementById("info-box")

let isDragging = false
let offsetX, offsetY

handle.addEventListener("mousedown", (e) => {
    isDragging = true
    offsetX = e.clientX - infoWindow.getBoundingClientRect().left
    offsetY = e.clientY - infoWindow.getBoundingClientRect().top
    handle.style.cursor = "grabbing"
})

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return
    const newX = e.clientX - offsetX
    const newY = e.clientY - offsetY
    infoWindow.style.left = `${newX}px`
    infoWindow.style.top = `${newY}px`
})

document.addEventListener("mouseup", () => {
    isDragging = false
    handle.style.cursor = "move"
})

// ==== close window ====
document.getElementById("close-btn").addEventListener("click", () => {
    window.location.href = "../../html/world.html"
})