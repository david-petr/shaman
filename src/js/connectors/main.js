// ==== Globální proměnné ====
let topicData = null

// ==== preference ====
const preferences = JSON.parse(localStorage.getItem("preferences"))
const href = preferences.href
const topic = preferences.topic

// ==== functions ====
const initializeGame = async () => {
    const data = await DataImport.getData("../../data/connectors.json")

    topicData = data[href].filter( topicObject => {
        return topicObject.topicName === topic
    })

    const conceptsA = Random.shuffleArray(Object.keys(topicData[0].concepts))
    const conceptsB = Random.shuffleArray(Object.values(topicData[0].concepts))
}

initializeGame()

// ==== accent color => css variables ====
window.accentColor.get().then(color => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
})
window.accentColor.onUpdated((color) => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
})