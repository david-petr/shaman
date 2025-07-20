const updateSection = document.getElementById("update")
const updateMessageElement = document.getElementById("updateMessage")

// ==== accent color => css variables ====
window.accentColor.get().then(color => {
  document.documentElement.style.setProperty("--accent-color", color)
  document.documentElement.style.setProperty("--darken-accent-color", Color.darken(color, 20))
  document.documentElement.style.setProperty("--update-back", Color.darken(color, 40))
})

window.accentColorUpdates.onUpdated((color) => {
  document.documentElement.style.setProperty("--accent-color", color)
  document.documentElement.style.setProperty("--darken-accent-color", Color.darken(color, 20))
  document.documentElement.style.setProperty("--update-back", Color.darken(color, 40))
})

document.addEventListener("DOMContentLoaded", () => {
  window.sendMessage.get( message => {
    if(message === "available"){
      window.windowApi.resizeWindow(300, 450)
      updateMessageElement.textContent = "Nová verze aplikace je k dispozici. Stahuje se na pozadí."
      updateSection.style.display = "flex"

      setTimeout(() => {
        updateMessageElement.style.display = "none"
        window.updateProgress.get( progress => {
          updateMessageElement.textContent = progress.percent
        })
      }, 5000)
    } else if(message === "downloaded"){
      updateMessageElement.textContent = "Aktualizece je stažena"

      setTimeout(() => {
        updateSection.style.display = "none"
        window.windowApi.resizeWindow(300, 425)
      }, 5000)
    }
  })
})

// ==== open new windows ====
document.getElementById("europe").addEventListener("click", () => {
  if(window.newWindow){
    window.newWindow.openNewWindow({ 
      with: null,
      height: null,
      resizable: true,
      fullscreen: true,
      file: "/countries/set.html",
      openDevTools: true
    })
  }
})
// ...