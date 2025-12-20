// ==== nastavení accent color ====
window.accentColor.get().then(color => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
})
window.accentColor.onUpdated((color) => {
    document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
    document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
})

const clickHandler = async (mode) => {
    try {
        let userMode = await window.darkMode.user()
        let userModeIfSystem

        if(userMode === "system"){
            const systemMode = await window.darkMode.getSystem()
            userMode = (systemMode) ? "dark" : "light"
            userModeIfSystem = (systemMode) ? "dark" : "light"
        }
        
        if(mode !== userMode){
            if(mode === "light" || mode === "dark"){
                window.darkMode.toggle()
            } 

            if(mode === "system"){
                window.darkMode.system()
            }
        }

        if(mode === userModeIfSystem){
            window.darkMode.setThemeManual(mode)
        }

    } catch (e){
        console.error(e)
    }
}

// ==== načtení předvoleb ====
const initHandler = async () => {
    try {
        // ==== nastavení aktuálního modu ====
        let userMode = await window.darkMode.user()

        const allModes = document.querySelectorAll(".mode")
        allModes.forEach( mode => {
            if(mode.id === userMode){
                mode.classList.add("active")
            }
        })

        document.getElementById("tripple-switch").addEventListener("click", (e) => {
            const clickedMode = e.target.closest(".mode")
            if(clickedMode){
                allModes.forEach( mode => {
                    mode.classList.remove("active")

                    if(mode.id === clickedMode.id){
                        mode.classList.add("active")

                        clickHandler(clickedMode.id)
                    }
                })
            }
        })

    } catch (e) {
        console.error(e)
    }
}

const resetHandler = async () => {
    // ==== systemový režim ====
    window.darkMode.system()

    const allModes = document.querySelectorAll(".mode")
    allModes.forEach( mode => {
        mode.classList.remove("active")

        if(mode.id === "system"){
            mode.classList.add("active")
        }
    })

    // ==== resetování barvy ====
    window.accentColor.system().then(color => {
        const colorInput = document.getElementById("color")
        colorInput.value = Color.makeHexOpaque(color)
        window.accentColor.update(color)
    })
}

document.addEventListener("DOMContentLoaded", () => {
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

    initHandler()

    // ==== resetování do "továrního nastavení" ====
    document.getElementById("reset").addEventListener("click", resetHandler)
})