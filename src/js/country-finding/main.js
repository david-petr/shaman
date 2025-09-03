// ==== Globální proměnné ====
let data
let isCountryOptionsActive = false
const countryInput = document.getElementById("country-input")
const countryOptions = document.getElementById("options")
const inputContent = document.getElementById("input-option")
const enterCountryButton = document.getElementById("enter-conuntry")

// ==== functions ====
function enterCountryButtonHandler() {
    const id = enterCountryButton.dataset.id


}

function countryOptionHandler(e) {
    const closestDiv = e.target.closest("div")
    
    if(closestDiv && closestDiv.parentElement.id === "options"){
        isCountryOptionsActive = true

        countryOptions.style.display = "none"
        countryInput.style.borderRadius = "18px"
    
        const clickedCountryName = closestDiv.querySelector("p").textContent
        countryInput.value = clickedCountryName

        isCountryOptionsActive = false

        enterCountryButton.dataset.id = closestDiv.id
    }
}

const removeDiacritics = (string) => {
    const normalizedString = string.normalize("NFD")

    return normalizedString.replace(/[\u0300-\u036f]/g, "")
}

function countryInputHandler(e) {
    const textContent = e.target.value

    const countries = data.countries.filter((country) => {
        const countryName = removeDiacritics(country.name.toLowerCase())

        return countryName.includes(removeDiacritics(textContent.toLowerCase()))
    })

    countryOptions.innerHTML = ""

    countryOptions.style.display = "flex"
    countryInput.style.borderRadius = "18px 18px 0px 0px"

    if(countries.length === 0){
        const div = document.createElement("div")
        const p = document.createElement("p")
        p.textContent = "Žádné výsledky"
        div.appendChild(p)

        countryOptions.appendChild(div)
    } else {
        countries.forEach((country, index) => {
            if (index <= 10) {
                const div = document.createElement("div")
                div.id = country.id
    
                const p = document.createElement("p")
                p.textContent = country.name
                div.appendChild(p)
    
                const img = document.createElement("img")
                img.setAttribute("src", `../../img/flags-small/${country.id} (Custom).jpeg`)
                div.appendChild(img)
    
                countryOptions.appendChild(div)
            }
        })
    }

}

const initializeGame = async () => {
    data = await DataImport.getData("../../data/country-finding.json")

    // ==== Nastavení viewBox pro mapu ====
    let focusCountry = data.countries.filter(country => {
        return country.id === "cz"
    })
    focusCountry = focusCountry[0]

    const worldMap = document.getElementById("map")
    worldMap.setAttribute('viewBox', `${focusCountry.position.x} ${focusCountry.position.y} 2500 1000`)
    document.documentElement.style.setProperty("--scale", (Math.floor(focusCountry.position.scale / 5)))

    // ==== eventy ====
    let isDragging = false
    let startX, startY
    let viewBoxX, viewBoxY
    let scale
    let viewBox

    worldMap.addEventListener("mousedown", (e) => {
        isDragging = true
        worldMap.style.cursor = "grabbing"

        startX = e.clientX
        startY = e.clientY

        viewBox = worldMap.getAttribute("viewBox").split(" ").map(Number)
        viewBoxX = viewBox[0]
        viewBoxY = viewBox[1]
    })
    worldMap.addEventListener("mousemove", (e) => {
        if (!isDragging) return

        const deltaX = e.clientX - startX
        const deltaY = e.clientY - startY


        const cssScale = parseFloat(document.documentElement.style.getPropertyValue("--scale"))
        scale = (viewBox[2] / worldMap.clientWidth) * (1 / cssScale)

        const newViewBoxX = viewBoxX - (deltaX * scale)
        const newViewBoxY = viewBoxY - (deltaY * scale)

        worldMap.setAttribute("viewBox", `${newViewBoxX} ${newViewBoxY} 2500 1000`)
    })
    worldMap.addEventListener("mouseup", () => {
        isDragging = false
        worldMap.style.cursor = "move"
    })
    worldMap.addEventListener("mouseleave", () => {
        isDragging = false
        worldMap.style.cursor = "move"
    })
    worldMap.addEventListener("wheel", (e) => {
        e.preventDefault()

        let scale = parseFloat(document.documentElement.style.getPropertyValue("--scale"))

        if (e.deltaY < 0) {
            scale += 0.5
        } else {
            scale -= 0.5
        }

        if (scale >= 1) {
            document.documentElement.style.setProperty("--scale", scale)
        }
    })

    // ==== odstranění prvků ====
    document.querySelector("#ocean")?.remove()
    const titles = document.querySelector("body").querySelectorAll("title")
    titles.forEach((title) => {
        title.remove()
    })

    // ==== eventy - nabítka ====
    document.querySelector("body").addEventListener("click", countryOptionHandler)
    countryInput.addEventListener("input", countryInputHandler)
    countryInput.addEventListener("blur", () => {
        setTimeout( () => {
            if(!isCountryOptionsActive){
                countryOptions.style.display = "none"
                countryInput.style.borderRadius = "18px"
            }
        }, 200)
    })

    enterCountryButton.addEventListener("click", enterCountryButtonHandler)
    document.querySelector("body").addEventListener("keydown", (e) => {
        if(e.key === "Enter"){
            enterCountryButtonHandler()
        }
    })
}

document.addEventListener("DOMContentLoaded", initializeGame)

// ==== accent color => css variables ====
window.accentColor.get().then(color => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
})
window.accentColor.onUpdated((color) => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
})