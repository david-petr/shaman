const input = document.getElementById("number-input")
const preferences = JSON.parse(localStorage.getItem("preferences"))
const continent = preferences.continent
const href = preferences.href
let data = null

// ==== functions ====
const changeStaus = (id) => {
    const checkbox = document.getElementById(id)

    if(checkbox.dataset.checked === "true"){
        checkbox.style.background = "none"
        const tick = checkbox.querySelector("div")
        tick.style.display = "none"
        checkbox.dataset.checked = false
    } else {
        checkbox.style.background = "var(--accent-color)"
        const tick = checkbox.querySelector("div")
        tick.style.display = "flex"
        checkbox.dataset.checked = true
    }
}

const update = (data, continent) => {
    const checkboxes = Array.from(document.querySelectorAll(".checkbox"))
    const checked = checkboxes.filter((checkbox) => {
        return checkbox.dataset.checked === "true"
    })
    
    const labels = checked.map((checkbox) => {
        const checkboxContent = checkbox.parentElement
        return checkboxContent.querySelector("label").textContent
    })
    
    let cities = [...data[continent].cities]

    cities = cities.filter((country) => {
        return labels.includes(country.region)
    })

    input.value = cities.length
    input.setAttribute("max", cities.length)
    document.getElementById("count-of-questions").textContent = cities.length
}

// ==== potvrzení otázek a začátek kvízu ====
document.getElementById("start").addEventListener("click", () => {
    const preferences = {}

    // ==== regiony ke zkoušení ====
    const checkboxes = Array.from(document.querySelectorAll(".checkbox"))
    const checked = checkboxes.filter((checkbox) => {
        return checkbox.dataset.checked === "true"
    })
    const labels = checked.map((checkbox) => {
        const checkboxContent = checkbox.parentElement
        return checkboxContent.querySelector("label").textContent
    })
    preferences.regions = labels

    // ==== počet otázek ke zkoušení ====
    const countOfQuestions = input.value
    preferences.countOfQuestions = countOfQuestions

    // ==== continent ke zkoušení ====
    preferences.continent = continent
    preferences.href = href

    localStorage.setItem("preferences", JSON.stringify(preferences))

    window.location.href = "../../html/cities/main.html"
})

// ==== načtení počtu otázek ====
document.addEventListener("DOMContentLoaded", async () => {
    data = await DataImport.getData("../../data/cities.json")

    // ==== nastavení výběru regionů ====
    let cities = [...data[continent].cities]
    let labels = cities.map((city) => {
        return city.region
    })

    labels = new Set(labels)

    labels.forEach((labelName) => {
        const id = labelName.substring(0, 3).toLowerCase()

        const div = document.createElement("div")
        div.classList.add("checkbox-content")

        const checkbox = document.createElement("div")
        checkbox.setAttribute("id", id)
        checkbox.classList.add("checkbox")

        const tick = document.createElement("div")
        tick.classList.add("tick")
        tick.innerHTML = '<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        checkbox.appendChild(tick)

        // ==== checkbox => aktualizace při výběru ====
        div.addEventListener("click", () => {
            changeStaus(id)
            update(data, continent)
        })

        if (id !== "asi") {
            checkbox.style.backgroundColor = "var(--accent-color)"
            tick.style.display = "flex"
            checkbox.dataset.checked = true
        }

        const label = document.createElement("label")
        label.textContent = labelName

        div.appendChild(checkbox)
        div.appendChild(label)

        document.getElementById("allCheckboxes").appendChild(div)
    })

    if (labels.has("") && labels.size === 1) {
        document.getElementById("choise").style.display = "none"

        const countBoxElement = document.getElementById("count")
        countBoxElement.style.border = "none"
        countBoxElement.style.width = "100%"
        document.getElementById("settings").style.width = "50%"
    }

    update(data, continent)
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
    if (href === "europe") {
        window.close()
    } else if (href === "world") {
        window.location.href = "../../html/world.html"
    }
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