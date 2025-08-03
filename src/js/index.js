const updateSection = document.getElementById("update")
const updateMessageElement = document.getElementById("updateMessage")
const progressBar = document.getElementById("progress-bar")
const progressElement = document.getElementById("progress")

// ==== accent color => css variables ====
window.accentColor.get().then(color => {
  document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
  document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
  document.documentElement.style.setProperty("--update-back", Color.makeHexOpaque(Color.darken(color, 40)))
})
window.accentColor.onUpdated((color) => {
  document.documentElement.style.setProperty("--accent-color", Color.makeHexOpaque(color))
  document.documentElement.style.setProperty("--darken-accent-color", Color.makeHexOpaque(Color.darken(color, 20)))
  document.documentElement.style.setProperty("--update-back", Color.makeHexOpaque(Color.darken(color, 40)))
})

// ==== app update info ====
document.addEventListener("DOMContentLoaded", () => {
  window.sendMessage.get( message => {
    if(message === "available"){
      window.windowApi.resizeWindow(300, 460)
      updateMessageElement.textContent = "Nová verze aplikace je k dispozici. Stahuje se na pozadí."
      updateSection.style.display = "flex"

      setTimeout(() => {
        updateMessageElement.style.display = "none"
        progressBar.style.display = "flex"
        window.updateProgress.get( progress => {
          progressElement.value = progress.percent
        })
      }, 5000)

    } else if(message === "downloaded"){
      progressBar.style.display = "none"
      updateMessageElement.style.display = "block"
      updateMessageElement.textContent = "Aktualizace je stažena"

      setTimeout(() => {
        window.windowApi.resizeWindow(300, 425)
        updateSection.style.display = "none"
      }, 3000)

    } else {
      console.log(message)
    }
  })
})

// ==== open new windows ====
document.getElementById("europe").addEventListener("click", () => {
  localStorage.setItem("preferences", JSON.stringify( {continent: "europe", href: "europe"} ))

  if(window.newWindow){
    window.newWindow.openNewWindow({ 
      width: null,
      height: null,
      resizable: true,
      fullscreen: true,
      file: "/countries/set.html",
      title: "Evropa",
      openDevTools: false
    })
  }
})
document.getElementById("world").addEventListener("click", () => {
  if(window.newWindow){
    window.newWindow.openNewWindow({
      width: null,
      height: null,
      resizable: true,
      fullscreen: true,
      file: "world.html",
      title: "Svět",
      openDevTools: true
    })
  }
})