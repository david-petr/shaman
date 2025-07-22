const continent = document.getElementById("continent")

document.getElementById("countries").addEventListener("click", () => {
    localStorage.setItem("preferences", JSON.stringify( {continent: continent.value, href: "world"} ))

    window.location.href = "../html/countries/set.html"
})