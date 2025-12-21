const scrollBox = document.getElementById("scroll-box")
const preferences = JSON.parse(localStorage.getItem("preferences"))
const href = preferences.href
let data = null

// ==== functions ====
const send = () => {
    const activePElement = document.querySelector(".active")

    localStorage.setItem("preferences", JSON.stringify( {topic: activePElement.textContent, href: href} ))
    window.location.href = "../../html/connectors/main.html"
}

document.addEventListener("DOMContentLoaded", async () => {
    data = await DataImport.getData("../../data/connectors.json")

    data = data[href]

    const topics = data.map( topic => {
        return topic.topicName
    })

    topics.forEach( topic => {
        const p = document.createElement("p")
        p.textContent = topic
        
        // ==== označení možnosti ====
        p.addEventListener("click", () => {
            const topicElements = scrollBox.querySelectorAll("p")

            topicElements.forEach( element => {
                element.classList.remove("active")
            })

            p.classList.add("active")
        })
        
        scrollBox.appendChild(p)
    })
    
    if(!document.querySelector(".active")){
        const firstPElement = scrollBox.querySelector("p")

        firstPElement.classList.add("active")
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
    document.documentElement.style.setProperty("--active-color", Color.makeHexOpaque(Color.darken(color, -20)))
})
window.accentColor.onUpdated((color) => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
    document.documentElement.style.setProperty("--active-color", Color.makeHexOpaque(Color.darken(color, -20)))
})

// ==== exit ====
document.getElementById("close").addEventListener("click", () => {
    if(href === "world"){
        window.location.href = "../../html/world.html"
    } else if(href === "czechia"){
        window.location.href = "../../html/czechia.html"
    }
})

// ==== start ====
document.getElementById("start").addEventListener("click", () => {
    send()
})