const scrollBox = document.getElementById("scroll-box")
const preferences = JSON.parse(localStorage.getItem("preferences"))
const href = preferences.href
let data = null


document.addEventListener("DOMContentLoaded", async () => {
    data = await DataImport.getData("../../data/connectors.json")

    data = data[href]

    const topics = data.map( topic => {
        return topic.topicName
    })

    topics.forEach( topic => {
        const p = document.createElement("p")
        p.textContent = topic

        scrollBox.appendChild(p)
    })
})

// ==== pozadí ====
const useDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches

const svgBack = document.getElementById("BACKGROUND")
const svgBackRect = svgBack.querySelector("rect")
const pathElements = Array.from(document.querySelectorAll("path"))

let color = (useDarkMode) ? "#242424" : "#ddd"
svgBackRect.setAttribute("style", `fill:${color};`)

pathElements.forEach((path) => {
    let stroke = (useDarkMode) ? "#a5a5a5ff" : "#575757ff"
    path.setAttribute("style", `fill:none;stroke:${stroke};stroke-miterlimit:10;`)
})

// ==== změna při aktualizaci ====
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    const useDarkMode = e.matches

    let color = (useDarkMode) ? "#242424" : "#ddd"
    svgBackRect.setAttribute("style", `fill:${color};`)

    pathElements.forEach((path) => {
        let stroke = (useDarkMode) ? "#a5a5a5ff" : "#575757ff"
        path.setAttribute("style", `fill:none;stroke:${stroke};stroke-miterlimit:10;`)
    })
})

// ==== accent color => css variables ====
window.accentColor.get().then(color => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
})
window.accentColor.onUpdated((color) => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
})