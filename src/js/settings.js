// ==== nastavení accent color ====
window.accentColor.get().then(color => {
    document.documentElement.style.setProperty("--accent-color", color)
    document.documentElement.style.setProperty("--darken-accent-color", Color.darken(color, 20))
})
window.accentColorUpdates.onUpdated((color) => {
    document.documentElement.style.setProperty("--accent-color", color)
    document.documentElement.style.setProperty("--darken-accent-color", Color.darken(color, 20))
})

// ==== přepínání tmavého režimu ====
const darkModeToggle = document.getElementById("dark-mode-toggle")


// ==== nastavení verze ====
document.getElementById("version").textContent = "1"