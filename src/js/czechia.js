document.getElementById("connectors").addEventListener("click", () => {
    localStorage.setItem("preferences", JSON.stringify( { href: "czechia"} ))
    window.location.href = "../html/connectors/set.html"
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

// ==== zavření okna ====
document.getElementById("close").addEventListener("click", () => window.close())