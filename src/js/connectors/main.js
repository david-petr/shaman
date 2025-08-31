// ==== Globální proměnné ====
const conceptsAElement = document.getElementById("conceptsA")
const conceptsBElement = document.getElementById("conceptsB")
const wrongTaskContent = document.getElementById("wrong")
const taskContent = document.getElementById("task")
const continueButton = document.getElementById("continue-btn")
let topicData = null
let countOfWrongAnswers = 0
let conceptA
let conceptB
let correctButtonElement
let remains

// ==== preference ====
const preferences = JSON.parse(localStorage.getItem("preferences"))
const href = preferences.href
const topic = preferences.topic

// ==== info box ====
const draggableWindow = new DraggableElement("handle", "info-box")
draggableWindow.countElement = document.getElementById("count")
draggableWindow.remainsElement = document.getElementById("remains")
draggableWindow.wrongElement = document.getElementById("count-of-wrong-answers")
draggableWindow.successRateElement = document.getElementById("success-rate")
draggableWindow.markElement = document.getElementById("mark")

// ==== functions ====
const disableButtons = (buttonA, buttonB) => {
    buttonA.style.backgroundColor = Color.makeHexTransparent(Color.darken(document.documentElement.style.getPropertyValue("--active-btn"), 60), 0.99)
    buttonA.style.color = Color.makeHexTransparent("#c2c2c2c2", 0.99)
    buttonA.style.cursor = "default"
    buttonA.classList.add("disabled")

    buttonB.style.backgroundColor = Color.makeHexTransparent(Color.darken(document.documentElement.style.getPropertyValue("--active-btn"), 60), 0.99)
    buttonB.style.color = Color.makeHexTransparent("#c2c2c2c2", 0.99)
    buttonB.style.cursor = "default"
    buttonB.classList.add("disabled")
}

function continueButtonHandler() {
    this.removeEventListener("click", continueButtonHandler)

    taskContent.style.display = "flex"
    wrongTaskContent.style.display = "none"

    conceptA.classList.remove("blink-target")
    correctButtonElement.classList.remove("blink-target")
    conceptB.classList.remove("active-btn")


    disableButtons(conceptA, correctButtonElement)

    conceptsAElement.addEventListener("click", buttonHandler)
    conceptsBElement.addEventListener("click", buttonHandler)
}

function buttonHandler(e) {
    const clickedButton = e.target.closest("button")

    if(clickedButton && !clickedButton.classList.contains("disabled")){

        conceptA = conceptsAElement.querySelector(".active-btn")
        conceptB = conceptsBElement.querySelector(".active-btn")

        if(clickedButton.classList.contains("active-btn") && conceptA && conceptB){
            conceptsAElement.removeEventListener("click", buttonHandler)
            conceptsBElement.removeEventListener("click", buttonHandler)

            const data = topicData[0].concepts

            if(data[conceptA.textContent] === conceptB.textContent){
                disableButtons(conceptA, conceptB)

                conceptsAElement.addEventListener("click", buttonHandler)
                conceptsBElement.addEventListener("click", buttonHandler)
            } else {
                countOfWrongAnswers += 1

                taskContent.style.display = "none"
                wrongTaskContent.style.display = "flex"

                const correct = data[conceptA.textContent]

                const buttons = Array.from(conceptsBElement.querySelectorAll("button"))
                correctButtonElement = buttons.filter( button => {
                    return button.textContent === correct
                })
                correctButtonElement = correctButtonElement[0]
                
                conceptA.classList.add("blink-target")
                correctButtonElement.classList.add("blink-target")

                continueButton.addEventListener("click", continueButtonHandler)
            }

            remains -= 1

            if(remains === 0){
                document.getElementById("task").querySelector("p").textContent = "Všechny země uhodnuty! Gratulujeme!"
            }

            draggableWindow.updateInfoBox(remains, countOfWrongAnswers)
        } else {
            let buttons
    
            if(clickedButton.parentElement.id === "conceptsA"){
                buttons = conceptsAElement.querySelectorAll("button")
            } else if(clickedButton.parentElement.id === "conceptsB"){
                buttons = conceptsBElement.querySelectorAll("button")
            }
    
            buttons.forEach( button => {
                button.classList.remove("active-btn")
            })
    
            clickedButton.classList.add("active-btn")
        }

    }
    
}

const initializeGame = async () => {
    const data = await DataImport.getData("../../data/connectors.json")

    topicData = data[href].filter( topicObject => {
        return topicObject.topicName === topic
    })

    const conceptsA = Random.shuffleArray(Object.keys(topicData[0].concepts))
    const conceptsB = Random.shuffleArray(Object.values(topicData[0].concepts))

    conceptsA.forEach( concept => {
        const button = document.createElement("button")
        button.textContent = concept

        document.getElementById("conceptsA").appendChild(button)
    })

    conceptsB.forEach( concept => {
        const button = document.createElement("button")
        button.textContent = concept

        document.getElementById("conceptsB").appendChild(button)
    })

    conceptsAElement.addEventListener("click", buttonHandler)
    conceptsBElement.addEventListener("click", buttonHandler)

    // ==== info box - aktualní info ====
    draggableWindow.countElement.textContent = 10
    draggableWindow.remainsElement.textContent = 10
    draggableWindow.wrongElement.textContent = 0
    draggableWindow.successRateElement.textContent = "--"
    draggableWindow.markElement.textContent = "--"
    remains = 10
}

initializeGame()

// ==== accent color => css variables ====
window.accentColor.get().then(color => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
    document.documentElement.style.setProperty("--active-btn", Color.makeHexOpaque(Color.darken(color, 40)))
})
window.accentColor.onUpdated((color) => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
    document.documentElement.style.setProperty("--active-btn", Color.makeHexOpaque(Color.darken(color, 40)))
})

// ==== exit ====
document.getElementById("close-btn").addEventListener("click", () => {
    if(href === "world"){
        window.location.href = "../../html/world.html"
    } else if(href === "czechia"){
        window.location.href = "../../html/czechia.html"
    }
})