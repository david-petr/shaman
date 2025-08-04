const continent = document.getElementById("continent")

document.getElementById("countries").addEventListener("click", () => {
    localStorage.setItem("preferences", JSON.stringify( {continent: continent.value, href: "world"} ))

    window.location.href = "../html/countries/set.html"
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

const loadFiles = async () => {
    const folderPath = "src/img/flags-small/"

    if (folderPath) {
        const files = await File.getFiles(folderPath)

        if (files) {
            const flagsSection = document.getElementById("flags-background")

            files.forEach(file => {
                const img = document.createElement("img")
                img.setAttribute("src", "../img/flags-small/" + file)

                flagsSection.appendChild(img)
            })
        }
    }
}

document.addEventListener("DOMContentLoaded", () => loadFiles())

// ==== zavření okna ====
document.getElementById("close").addEventListener("click", () => window.close())