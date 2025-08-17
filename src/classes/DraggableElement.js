class  DraggableElement {
    constructor(handleId, infoWindowId) {
        this.handle = document.getElementById(handleId)
        this.infoWindow = document.getElementById(infoWindowId)

        this.isDragging = false
        this.offsetX = 0
        this.offsetY = 0

        this.addEventListeners()
    }

    addEventListeners() {
        if (this.handle) {
            this.handle.addEventListener("mousedown", this.onMouseDown.bind(this))
        } else {
            console.error(`Element s ID "${handleId}" nebyl nalezen.`)
        }

        document.addEventListener("mousemove", this.onMouseMove.bind(this))
        document.addEventListener("mouseup", this.onMouseUp.bind(this))
    }

    onMouseDown(e) {
        this.isDragging = true

        this.offsetX = e.clientX - this.infoWindow.getBoundingClientRect().left
        this.offsetY = e.clientY - this.infoWindow.getBoundingClientRect().top
        this.handle.style.cursor = "grabbing"
    }

    onMouseMove(e) {
        if (!this.isDragging) return

        const newX = e.clientX - this.offsetX
        const newY = e.clientY - this.offsetY
        this.infoWindow.style.left = `${newX}px`
        this.infoWindow.style.top = `${newY}px`
    }

    onMouseUp() {
        this.isDragging = false
        this.handle.style.cursor = "move"
    }

    removeEventListeners() {
        if (this.handle) {
            this.handle.removeEventListener("mousedown", this.onMouseDown.bind(this))
        }
        document.removeEventListener("mousemove", this.onMouseMove.bind(this))
        document.removeEventListener("mouseup", this.onMouseUp.bind(this))
    }

    updateInfoBox(remainingCountriesToGuessLength, countOfWrongAnswers) {
        this.remainsElement.textContent = remainingCountriesToGuessLength
        this.wrongElement.textContent = countOfWrongAnswers

        let successRate = Math.round((Number(this.countElement.textContent) - remainingCountriesToGuessLength - countOfWrongAnswers) / (Number(this.countElement.textContent) - remainingCountriesToGuessLength) * 100)

        if (!isNaN(successRate)) {
            this.successRateElement.textContent = `${successRate}%`

            let mark

            if (successRate >= 90) {
                mark = 1
            } else if (successRate >= 75) {
                mark = 2
            } else if (successRate >= 50) {
                mark = 3
            } else if (successRate >= 30)
                mark = 4
            else {
                mark = 5
            }

            this.markElement.textContent = mark
        }
    }
}