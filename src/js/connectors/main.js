// ==== Globální proměnné ====
let topicData = null
const conceptsAElement = document.getElementById("conceptsA")
const conceptsBElement = document.getElementById("conceptsB")

// ==== preference ====
const preferences = JSON.parse(localStorage.getItem("preferences"))
const href = preferences.href
const topic = preferences.topic

// ==== functions ====
function buttonHandler(e) {
    const clickedButton = e.target.closest("button")

    if(clickedButton){

        if(clickedButton.classList.contains("active-btn")){
            conceptsAElement.removeEventListener("click", buttonHandler)
            conceptsBElement.removeEventListener("click", buttonHandler)

            let conceptA = conceptsAElement.querySelector(".active-btn")
            let conceptB = conceptsBElement.querySelector(".active-btn")

            const data = topicData[0].concepts

            if(data[conceptA.textContent] === conceptB.textContent){
                conceptA.style.backgroundColor = Color.makeHexTransparent(document.documentElement.style.getPropertyValue("--active-btn"), 0.9)
                conceptA.style.color = Color.makeHexTransparent("#c2c2c2c2", 0.9)
                conceptB.style.backgroundColor = Color.makeHexTransparent(document.documentElement.style.getPropertyValue("--active-btn"), 0.9)
                conceptB.style.color = Color.makeHexTransparent("#c2c2c2c2", 0.9)


                conceptsAElement.addEventListener("click", buttonHandler)
                conceptsBElement.addEventListener("click", buttonHandler)
            } else {
                const correct = data[conceptA.textContent]

                const buttons = Array.from(conceptsBElement.querySelectorAll("button"))
                const correctButtonElement = buttons.filter( button => {
                    return button.textContent === correct
                })
                
                conceptA.classList.add("blink-target")
                correctButtonElement[0].classList.add("blink-target")
            }
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