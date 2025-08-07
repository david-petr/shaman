// ==== Globální proměnné ====
const preferences = JSON.parse(localStorage.getItem("preferences"))
const continent = preferences.continent
const flagElement = document.getElementById("flag")
const testButtonsSection = document.getElementById("test-buttons")
const testButtons = testButtonsSection.querySelectorAll("button")
let guessedFlag = null
let countries = null
let remainingCountriesToGuess = []

function buttonHandler() {
    const id = this.id
    
    if(id === guessedFlag.id){
        update()
    } else {
        console.log(false)
    }
}

const update = () => {
    guessedFlag = Random.randomElement(remainingCountriesToGuess)

    remainingCountriesToGuess = remainingCountriesToGuess.filter(country => country.id !== guessedFlag.id)
    flagElement.setAttribute("src", "../../img/flags/" + guessedFlag.id + ".webp")

    let randomFlags = Random.randomElementsFromArray(countries, 3)

    if(randomFlags.includes(guessedFlag)){
        while (randomFlags.includes(guessedFlag)){
            randomFlags = Random.randomElementsFromArray(countries, 3)
        }
    }

    randomFlags.splice(Random.randomNumber(randomFlags.length), 0, guessedFlag)
    
    testButtons.forEach( (button, index) => {
        button.textContent = randomFlags[index].name
        button.id = randomFlags[index].id

        button.addEventListener("click", buttonHandler)
    }) 
}

const initializeGame = async () => {
    const allData = await DataImport.getData("../../data/flags.json")

    countries = [...allData[continent]]
    remainingCountriesToGuess = Random.randomElementsFromArray(countries, preferences.countOfQuestions)
    
    update()
}

initializeGame()