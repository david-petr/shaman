const input = document.getElementById("number-input")
const preferences = JSON.parse(localStorage.getItem("preferences"))
const continent = preferences.continent
const href = preferences.href
let data = null

// ==== potvrzení otázek a začátek kvízu ====
document.getElementById("start").addEventListener("click", () => {
    const preferences = {}

    // ==== počet otázek ke zkoušení ====
    const countOfQuestions = input.value
    preferences.countOfQuestions = countOfQuestions

    // ==== continent ke zkoušení ====
    preferences.continent = continent

    localStorage.setItem("preferences", JSON.stringify(preferences))

    window.location.href = "../../html/countries-shapes/main.html"
})

// načtení počtu otázek
document.addEventListener("DOMContentLoaded", async () => {
    data = await DataImport.getData("../../data/shapes.json")

    let countries

    if (!data[continent].concepts){
        countries = [...data[continent]]
    } else {
        countries = [...data[continent].concepts]
    }

    input.setAttribute("max", countries.length)
    input.value = countries.length
    document.getElementById("count-of-questions").textContent = countries.length
})

// ==== odčítací tlačítko ====
document.getElementById("subtract").addEventListener("click", () => {
    if (input.value > 1) {
        input.value -= 1
    }
})

// ==== přičítací tlačítko ====
document.getElementById("plus").addEventListener("click", () => {
    if (input.value < Number(input.getAttribute("max"))) {
        input.value = Number(input.value) + 1
    }
})

document.getElementById("close").addEventListener("click", () => {
    window.location.href = "../../html/world.html"
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