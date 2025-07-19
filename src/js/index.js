// ==== accent color => css variables ====
window.accentColor.get().then(color => {
  document.documentElement.style.setProperty("--accent-color", color)
  document.documentElement.style.setProperty("--darken-accent-color", Color.darken(color, 20))
})

window.accentColorUpdates.onUpdated((color) => {
  document.documentElement.style.setProperty("--accent-color", color)
  document.documentElement.style.setProperty("--darken-accent-color", Color.darken(color, 20))
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