// ==== nastavení accent color ====
window.accentColor.get().then(color => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
})
window.accentColor.onUpdated((color) => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
})

document.addEventListener("DOMContentLoaded", () => {
    // ==== přepínání tmavého režimu ====
    const darkModeToggle = document.getElementById("dark-mode-toggle")
    const useDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    const toggle = document.getElementById("toggle-switch")

    toggle.classList.add("no-transition")

    if (useDarkMode) {
        darkModeToggle.checked = true
    } else {
        darkModeToggle.checked = false
    }

    setTimeout(() => { toggle.classList.remove("no-transition") }, 0)
    darkModeToggle.addEventListener("change", () => window.darkMode.toggle())

    // ==== accent color ====
    const colorInput = document.getElementById("color")
    window.accentColor.get().then(color => colorInput.value = Color.makeHexOpaque(color))

    colorInput.addEventListener("change", (event) => {
        console.log(event.target.value)
    })

    // ==== nastavení verze ====
    window.appAPI.onAppVersion((version) => {
        document.getElementById("version").textContent = version
    })
})