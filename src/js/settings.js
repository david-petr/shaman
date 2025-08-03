// ==== nastavení accent color ====
window.accentColor.get().then(color => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
})
window.accentColor.onUpdated((color) => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
})

const darkModeToggle = document.getElementById("dark-mode-toggle")
document.addEventListener("DOMContentLoaded", () => {
    // ==== přepínání tmavého režimu ====
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
        window.accentColor.update(event.target.value)
    })

    // ==== nastavení verze ====
    window.appAPI.onAppVersion((version) => {
        document.getElementById("version").textContent = version
    })
})

// ==== resetování do "továrního nastavení" ====
let systemMode
if(window.darkMode.getSystem()){
    systemMode = "dark"
} else {
    systemMode = "light"
}

let userMode = window.darkMode.user()
if(userMode === "system"){
    userMode = systemMode
}

if(window.accentColor.get() !== window.accentColor.system()){
    const resetButton = document.getElementById("reset")
    resetButton.style.display = "flex"

    resetButton.addEventListener("click", () => {
        window.darkMode.system()
        if (systemMode === "dark") {
            darkModeToggle.checked = true
        } else {
            darkModeToggle.checked = false
        }

        window.accentColor.system().then(color => {
            window.accentColor.update(color)
            document.getElementById("color").value = Color.makeHexOpaque(color)
        })

        resetButton.style.display = "none"
    })
}