const input = document.getElementById("number-input")
const continent = "evropa"
let data = null

// ==== functions ====
const update = (data, continent) => {
    const checkboxes = Array.from( document.querySelectorAll(".checkbox") )
    const checked = checkboxes.filter( (checkbox) => {
        return checkbox.checked === true
    })

    const labels = checked.map( (checkbox) => {
        return document.querySelector(`label[for="${checkbox.id}"]`).textContent
    })

    let countries = [...data[continent].countries]

    
    countries = countries.filter( (country) => {
        return labels.includes(country.region)
    })
    
    input.value = countries.length
    input.setAttribute("max", countries.length)
    document.getElementById("count-of-questions").textContent = countries.length
}

// ==== potvrzení otázek a začátek kvízu ====
document.getElementById("start").addEventListener("click", () => {
    const preferences = {}

    // ==== regiony ke zkoušení ====
    const checkboxes = Array.from( document.querySelectorAll(".checkbox") )
    const checked = checkboxes.filter( (checkbox) => {
        return checkbox.checked === true
    })
    const labels = checked.map( (checkbox) => {
        return document.querySelector(`label[for="${checkbox.id}"]`).textContent
    })
    preferences.regions = labels

    // ==== počet otázek ke zkoušení ====
    const countOfQuestions = input.value
    preferences.countOfQuestions = countOfQuestions

    // ==== continent ke zkoušení ====
    preferences.continent = continent

    localStorage.setItem("preferences", JSON.stringify(preferences))

    window.location.href = "../../html/countries/map.html"
})

// načtení počtu otázek
document.addEventListener("DOMContentLoaded", async () => {    
    data = await DataImport.getData("../../data/map.json")
    
    // ==== nastavení výběru regionů ====
    let countries = [...data[continent].countries]
    let labels = countries.map( (country) => {
        return country.region
    })
    labels = new Set(labels)
    
    labels.forEach( (labelName) => {
        const id = labelName.substring(0, 3).toLowerCase()

        const div = document.createElement("div")

        const checkbox = document.createElement("input")
        checkbox.setAttribute("type", "checkbox")
        checkbox.setAttribute("id", id)        
        checkbox.classList.add("checkbox")

        // ==== checkbox => aktualizace při výběru ====
        checkbox.addEventListener("change", () => {
            update(data, continent)
        })

        if(id !== "asi"){
            checkbox.checked = true
        }

        const label = document.createElement("label")
        label.textContent = labelName
        label.setAttribute("for", id)

        div.appendChild(checkbox)
        div.appendChild(label)

        document.getElementById("allCheckboxes").appendChild(div)
    })

    update(data, continent)
})

// ==== odčítací tlačítko ====
document.getElementById("subtract").addEventListener("click", () => {
    if(input.value > 1){
        input.value -= 1
    }
})

// ==== přičítací tlačítko ====
document.getElementById("plus").addEventListener("click", () => {
    if(input.value < Number(input.getAttribute("max"))){
        input.value = Number(input.value) + 1
    }
})

document.getElementById("close").addEventListener("click", () => window.close())

// ==== pozadí ====
const useDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches

const svgBack = document.getElementById("BACKGROUND")
const svgBackRect = svgBack.querySelector("rect")
const pathElements = Array.from( document.querySelectorAll("path") )

let color = (useDarkMode) ? "#242424" : "#ddd"
svgBackRect.setAttribute("style", `fill:${color};`)

pathElements.forEach( (path) => {
    let stroke = (useDarkMode) ? "#a5a5a5ff" : "#575757ff"
    path.setAttribute("style", `fill:none;stroke:${stroke};stroke-miterlimit:10;`)
})

// ==== změna při aktualizaci ====
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    const useDarkMode = e.matches

    let color = (useDarkMode) ? "#242424" : "#ddd"
    svgBackRect.setAttribute("style", `fill:${color};`)

    pathElements.forEach( (path) => {
        let stroke = (useDarkMode) ? "#a5a5a5ff" : "#575757ff"
        path.setAttribute("style", `fill:none;stroke:${stroke};stroke-miterlimit:10;`)
    })
})

// ==== accent color => css variables ====
window.accentColor.get().then(color => {
  document.documentElement.style.setProperty("--accent-color", color)
  document.documentElement.style.setProperty("--darken-accent-color", Color.darken(color, 20))
})
window.accentColorUpdates.onUpdated((color) => {
  document.documentElement.style.setProperty("--accent-color", color)
  document.documentElement.style.setProperty("--darken-accent-color", Color.darken(color, 20))
})