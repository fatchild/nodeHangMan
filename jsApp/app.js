// VARIABLES
let dictionaryLookupURL
let randomWordURL
let word
let definition
let origins
let hints
let definitionElem
let originsElem
let wordElem
let guesses
let guessesTaken
let guessesElem
let lettersElem
let correctGuesses


// INITIALIZATION
const init = () => {
    console.log("Initializing app...")
    dictionaryLookupURL = "https://api.dictionaryapi.dev/api/v2/entries/en"
    randomWordURL = "https://random-word-api.herokuapp.com/word?number=1&swear=0"
    guessesTaken = []

    definitionElem = document.getElementById('definition')
    originsElem = document.getElementById('origin')
    wordElem = document.getElementById('word')
    guessesElem = document.getElementById('guesses')
    lettersElem = document.getElementById('letters')

    resetGame()
}
window.onload = init

// LISTENER
document.addEventListener('keydown', (e) => {
    console.log(e.code.slice(0, 3)) 
    if (e.code.slice(0, 3) !== "Key") return
    guess(e.code.slice(3, 4).toLowerCase())
})


// LOGIC
window.guess = (guess) => {
    console.log(guess)
    if (guesses < 1) return
    if (correctGuesses === word.length) return
    let alreadyGuessed = false
    // Go through all of the letters in the word and if it exists, the put it in 
    guessesTaken.forEach((value) => {
        if (value === guess){
            alreadyGuessed = true
            console.log("Already guessed")
        }
    })
    if (alreadyGuessed) return
    guessesTaken.push(guess)
    guesses -= 1
    if (guesses < 1){
        console.log("Hangman")
        resetGame()
    }
    guessesElem.textContent = guesses
    console.log(guesses)

    let correct = false
    for(let i = 0; i < word.length; i++){
        console.log(word[i], guess, guess === word[i])
        if (guess === word[i]){
            correct = true
            console.log(true)
            wordElem.children[i].textContent = word[i]
            correctGuesses += 1
        }
    }


    // Animate the thing 
    let letter = document.getElementById(guess)

    if (correct){
        letter.classList.remove("btn-secondary");
        letter.classList.add("btn-outline-success");
    } else {
        letter.classList.remove("btn-secondary");
        letter.classList.add("btn-outline-danger");
    }

    // if (correctGuesses === word.length){
    //     resetGame()
    // }

    // Animate the thing 
    // let letter = document.getElementById(guess)
    // letter.classList.remove("btn-secondary");
    // letter.classList.add("btn-outline-secondary");
}

window.resetGame = () => {
    console.log("resetGame")
    word = undefined
    guessesTaken = []
    correctGuesses = 0

    // Reset all of the buttons
    for (let i = 0; i < lettersElem.children.length; i++) {
        lettersElem.children[i].classList.add("btn-secondary");
        lettersElem.children[i].classList.remove("btn-outline-success");
        lettersElem.children[i].classList.remove("btn-outline-danger");
    }

    console.log("!")

    console.log("Getting word")
    // Get the random word
    getRandomWord().then((randomWord) => {
        console.log(randomWord);
        word = randomWord
    }).catch((err) => {
        console.log(err)
        word = undefined
    }).finally(() => {

        // Check that the word exists
        lookupWordsDefinition(word).then((randomWord) => {
            // console.log("response", word, randomWord)
            if (randomWord.title === "No Definitions Found" || word.length > 8){
                word = undefined // word is not found in the dictionary so move on

                console.log("No definitions found, try again")
                setTimeout(resetGame(), 100)
            }

            // Assign the word description and the hints 
            // if (randomWord[0].meanings[0].definitions[0].definition){
                definition = randomWord[0].meanings[0].definitions[0].definition
            // }
            // if (typeof randomWord[0].origin !== 'undefined'){
                // origins = randomWord[0].origin
            // }
            // hints = 0
            // console.log(definition, origins)

            if (!definition){
                setTimeout(resetGame(), 100)
            }
            definitionElem.textContent = definition
            // originsElem.textContent = origins || "Unknown"

            console.log(word.length)
            guesses = word.length*2
            guessesElem.textContent = guesses

            wordElem.innerHTML = ""
            for (let i = 0; i < word.length; i++){
                wordElem.innerHTML += `<div id="letter-${i}" class="col mx-2 border-bottom border-dark display-4 text-center"></div>`
            }


        }).catch((err) => {
            // console.log("err", err)

            // setTimeout(resetGame(), 500)
        })
    })
}

const getRandomWord = async () => {
    const response = await fetch(`${randomWordURL}`);
    const myJson = await response.json(); //extract JSON from the http response

    return myJson[0]
}

const lookupWordsDefinition = async (word) => {
    const response = await fetch(`${dictionaryLookupURL}/${word}`);
    const myJson = await response.json(); //extract JSON from the http response
    return myJson
  }