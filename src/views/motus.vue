<template>
  <!--  TODO FIX ERREURS DANS CONSOLE-->
  <!--  TODO VOIR POUR MOBILE fait chier-->
  <v-container fluid style="height: calc(100vh - 64px);">
    <input v-model="currentInputState" class="mobileInput" style="display: none" type="text"
           @input="parseMobileInput"/>
    <v-layout class="d-flex flex-column" full-height>
      <v-row class="mt-2" justify="center">
        <h1 class="text-md-h2 text-h3">Motus en gros</h1>
      </v-row>
      <v-row v-if="message.length !== 0" class="mt-2" justify="center">
        <v-col cols="12" md="4">
          <v-alert type="error"> {{ message }}</v-alert>
        </v-col>
      </v-row>
      <v-row class="mt-2" justify-md="space-around">
        <v-col cols="12" md="2">
          <div class="d-flex justify-center flex-column align-center">
            <v-btn color="primary" size="large" @click="dialog = true">
              <v-icon class="ml-n3 mr-2">
                mdi-refresh
              </v-icon>
              NOUVEAU MOT
            </v-btn>
            <v-dialog v-model="dialog" width="500">
              <v-card>
                <v-card-text>
                  Longeur max du mot
                  <v-slider v-model="wordLengthMax" :max="sliderMax" :min="sliderMin" class="mt-8" step="1"
                            thumb-label="always" ticks="true">
                  </v-slider>
                </v-card-text>
                <v-card-actions>
                  <v-btn elevation="1" size="large" @click="newGame(true)">
                    Conjugué
                  </v-btn>
                  <v-btn elevation="1" size="large" @click="newGame(false)">
                    Non conjugué
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <p class="text-md-h3 text-h4 text-align mt-10">
              {{ streak < 0 ? streak + '🥶' : streak + '🔥' }}
            </p>
          </div>
        </v-col>
        <v-col v-if="word && displayableLetters !== [] && displayableLetters[0]?.letter" cols="12" md="7">
          <v-row v-for="row in GUESS_COUNT" :key="row" justify="center">
            <v-col v-for="col in word.length" :key="col" class="my-md-3 mx-md-1 pa-md-0 pb-md-1 mx-n2" cols="2" md="1"
                   @click="oui">
              <v-card :color="getCellColor(row, col)" class="pa-2 text-center" elevation="2" outlined
                      tile>
                  <span v-if="(row - 1) === currentGuess && !isGameOver"
                        class="text-md-h2 text-h4"> {{ displayableLetters[col - 1].letter }}
                  </span>
                <span v-else-if="(row - 1) < currentGuess"
                      class="text-md-h2 text-h4"> {{
                    guessedWords[row - 1] !== undefined ? guessedWords[row - 1][col - 1].letter : '.'
                  }}
                  </span>
                <span v-else class="text-md-h2 text-h4"> &nbsp;
                  </span>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-else class="text-center">
          <v-progress-circular indeterminate="true" size="100">
          </v-progress-circular>
        </v-col>
        <v-col cols="12" md="2">
          <div class="text-h6">
            Historique
          </div>
          <v-list class="mt-5" dense>
            <v-list-item v-for="word in history" :key="word.word">
              <v-list-item>
                <v-icon> {{ word.guessed ? 'mdi-check' : 'mdi-close' }}</v-icon>
                {{ word.word }}
              </v-list-item>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-layout>
  </v-container>
  <v-snackbar
      v-model="snackBar"
      :timeout="5000"
      class="d-md-none"
      color="primary"
      multi-line
  >
    {{ mobileMessage }}
  </v-snackbar>
</template>

<script setup>
import {ref} from 'vue'

const GUESS_COUNT = ref(6)
const word = ref(null)
const message = ref("")
const mobileMessage = ref("⚠️ Appuie sur une case pour pouvoir entrer des lettres")
const isGameOver = ref(false)
const currentGuess = ref(0)
const guessedLetters = ref([])
const guessedWords = ref([])
const currentGuessing = ref([])
const streak = ref(0)
const displayableLetters = ref([])
const lettersStat = ref(null)
const dialog = ref(false)
const sliderMin = ref(2)
const sliderMax = ref(20)
const wordLengthMax = ref(7)
const wordLengthMin = ref(2)
const snackBar = ref(false)
const currentInputState = ref("")
const history = ref([])

document.addEventListener('keydown', parseKeyEvent);
newGame(false).then()
snackBar.value = true

if (sessionStorage.getItem("history") === undefined) {
  sessionStorage.setItem("history", JSON.stringify([]))
  history.value = JSON.parse(sessionStorage.getItem("history"))
  if (history.value === null || history.value.length === 0)
    sessionStorage.setItem("history", JSON.stringify([]))
}


async function newGame(conjugate) {
  dialog.value = false
  initVars()
  await getNewWord(wordLengthMin.value, wordLengthMax.value, conjugate)
  if (word.value) {
    initLetterGuesses()
    buildDisplayableLetters()
  }
}

function initLetterGuesses() {
  for (let letterCount = 0; letterCount < word.value.length - 1; letterCount++) {
    if (letterCount === 0)
      guessedLetters.value.push(word.value.firstLetter)
    guessedLetters.value.push(".")
  }
}

function initVars() {
  isGameOver.value = false
  currentGuess.value = 0
  guessedLetters.value = []
  currentGuessing.value = []
  guessedWords.value = []
  displayableLetters.value = []
}

async function getNewWord(min, max, conjugate) {
  const request = await fetch("https://api.dicolink.com/v1/mots/motauhasard?&minlong=" + min + "&maxlong=" + max + "&verbeconjugue=" + conjugate + "&api_key=fBN0OBotLQVWC2gFdE501ACc0W62XtxU")
  if (request.status === 429) {
    displayMessage("Bah là en gros j'ai plus de crédit quoi", true)
    return
  }
  const response = await request.json()
  if (response) {
    const correctWord = response[0].mot.toUpperCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
    word.value = {
      correctWord: correctWord,
      firstLetter: correctWord.charAt(0),
      length: correctWord.length
    }
    getLettersStat()
  } else {
    displayMessage("Erreur lors de la récupération du mot, veuillez réessayer dans quelques instants", true)
  }

}

async function parseKeyEvent(e) {
  //space
  if (e.keyCode === 32) {
    e.preventDefault()
    await newGame(false)
    return
  }
  if (isGameOver.value)
    return
  //a-z
  if (e.keyCode >= 65 && e.keyCode <= 90 && currentGuessing.value.length < word.value.length) {
    currentGuessing.value.push(e.key.toUpperCase())
  }
  //backspace
  if (e.keyCode === 8) {
    currentGuessing.value.pop()
  }
  //enter
  if (e.keyCode === 13) {
    e.preventDefault()
    await validateGuess()
  }
  if (!isGameOver.value)
    buildDisplayableLetters()
}

function buildDisplayableLetters() {
  const displayableLettersTemp = []
  displayableLettersTemp[0] = {
    letter: currentGuessing.value[0] || word.value.firstLetter,
    color: "red"
  }
  for (let letter = 1; letter < word.value.length; letter++) {
    let replacementLetter;
    if (currentGuessing.value.length !== 0)
      replacementLetter = "."
    else
      replacementLetter = guessedLetters.value[letter] || "."
    const data = {
      letter: currentGuessing.value[letter] || replacementLetter,
      color: displayableLettersTemp[letter]?.color || 'grey-lighten-2'
    }
    displayableLettersTemp.push(data)
    displayableLetters.value = displayableLettersTemp
  }
}

function mergeArrays(array1, array2) {
  let res = []
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== ".")
      res.push(array1[i])
    else res.push(array2[i])
  }
  return res
}

function displayMessage(text, resetGuess) {
  message.value = text
  if (resetGuess)
    currentGuessing.value = []
  sleep(4000).then(() => message.value = "")
}

async function validateGuess() {
  const completeGuessing = mergeArrays(currentGuessing.value, guessedLetters.value)
  if (completeGuessing.length === word.value.length) {
    const guessingword = completeGuessing.join("")
    const res = await testWord(guessingword)
    await parseRes(res)
  } else {
    displayMessage("Le mot est trop court", false)
  }
}

function getLettersStat() {
  lettersStat.value = new Map()
  let seenLetters = []
  for (let letter = 0; letter < word.value.length; letter++) {
    const currLetter = word.value.correctWord.charAt(letter)
    if (!seenLetters.includes(currLetter)) {
      seenLetters.push(currLetter)
      const occ = word.value.correctWord.split(currLetter).length - 1;
      lettersStat.value.set(currLetter, occ)
    }
  }
}

async function wordExists(word) {
  const link = "https://api.dicolink.com/v1/mot/" + word + "/definitions?limite=200&api_key=fBN0OBotLQVWC2gFdE501ACc0W62XtxU"
  const request = await fetch(link)
  if (request.status === 429)
    return 429
  const response = await request.json()
  return response.error

}

async function testWord(testedWord) {
  if (testedWord.charAt(0) !== word.value.correctWord.charAt(0))
    return "WRONGFIRSTLETTER"
  const doesWordExist = await wordExists(testedWord)
  if (doesWordExist === 429)
    return "NOCREDIT"
  else if (doesWordExist !== undefined)
    return "NOTAWORD"
  let res = []
  for (let i = 0; i < testedWord.length; i++) {
    res[i] = ""
  }
  let cloneLettersStats = new Map(lettersStat.value)
  for (let letter = 0; letter < testedWord.length; letter++) {
    const currLetter = testedWord.charAt(letter)
    const currLetterocc = cloneLettersStats.get(currLetter)
    if (currLetter === word.value.correctWord.charAt(letter)) {
      res[letter] = {
        letter: currLetter,
        status: "CORRECT"
      }
      cloneLettersStats.set(currLetter, currLetterocc - 1)
    }
  }
  for (let letter = 0; letter < testedWord.length; letter++) {
    const currLetter = testedWord.charAt(letter)
    const currLetterocc = cloneLettersStats.get(currLetter)
    if (currLetterocc > 0 && res[letter] === "") {
      res[letter] = {
        letter: currLetter,
        status: "MISPLACED"
      }
      cloneLettersStats.set(currLetter, currLetterocc - 1)
    } else if (res[letter] === "") {
      res[letter] = {
        letter: testedWord.charAt(letter),
        status: "WRONG"
      }
    }
  }
  return res
}

function getColor(status) {
  switch (status) {
    case "CORRECT":
      return "red-lighten-1"
    case "MISPLACED":
      return "light-green"
    default:
      return "grey-lighten-2"
  }
}

async function parseRes(res) {
  res = await res;
  if (res === "NOTAWORD") {
    const completeGuessing = mergeArrays(currentGuessing.value, guessedLetters.value)
    const guessingword = completeGuessing.join("")
    displayMessage(guessingword + " n'est pas un mot dans mon dictionnaire", true)
    return
  }
  if (res === "WRONGFIRSTLETTER") {
    displayMessage("Le mot doit commencer par un " + word.value.firstLetter, true)
    return
  }
  if (res === "NOCREDIT") {
    displayMessage("Bah là en gros j'ai plus de crédit quoi", true)
    return
  }
  for (let letter = 0; letter < word.value.length; letter++) {
    displayableLetters.value[letter].color = getColor(res[letter].status)
    if (res[letter].status === "CORRECT") {
      guessedLetters.value[letter] = res[letter].letter
    }
  }
  currentGuess.value++;
  const gameOver = await checkGameOver()
  guessedWords.value.push(displayableLetters.value)
  if (!gameOver) {
    currentGuessing.value = []
    buildDisplayableLetters()
  }
}

async function checkGameOver() {
  if (currentGuess.value >= GUESS_COUNT.value && guessedLetters.value.includes(".")) {
    displayMessage("Bah non le mot c'était " + word.value.correctWord, false)
    isGameOver.value = true
    streak.value - 1 >= 0 ? streak.value = -1 : streak.value -= 1
    updateHistory(false)
    return true
  }
  for (let guessedLetter of guessedLetters.value) {
    if (guessedLetter === ".")
      return false
  }
  if (currentGuessing.value.join("") === word.value.correctWord) {
    isGameOver.value = true
    streak.value + 1 <= 0 ? streak.value = 1 : streak.value += 1
    updateHistory(true)
    return true
  }
  return false
}

function updateHistory(guessed) {
  let historyTemp
  const sessionHistory = sessionStorage.getItem("history")
  if (sessionHistory !== undefined && sessionHistory !== null)
    historyTemp = JSON.parse(sessionStorage.getItem("history"))
  else
    historyTemp = []
  historyTemp.push({
    word: word.value.correctWord,
    guessed: guessed
  })
  history.value = historyTemp
  sessionStorage.setItem("history", JSON.stringify(historyTemp))
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getCellColor(row, col) {
  if (row === 1 && col === 1)
    return 'red-lighten-1'
  if ((row - 1) < currentGuess.value && guessedWords.value[row - 1] !== undefined)
    return guessedWords.value[row - 1][col - 1].color
  return 'grey-lighten-2'
}

</script>