<template>
  <v-app>
    <!--  TODO FIX ERREURS DANS CONSOLE-->
    <!--  TODO AJOUTER HISTORIQUE-->
    <!--  TODO VOIR POUR MOBILE-->
    <!--  TODO FIX LETTRE EN PLUS A LA FIN QUAND GAGNE-->
    <!--  TODO TEST PERDU (6 LIGNES PLEINES SANS TROUVER)-->
    <v-container fluid style="height: calc(100vh - 64px);">
      <v-layout full-height class="d-flex flex-column">
        <v-row justify="center">
          <h1 class="text-h2">Motus en gros</h1>
        </v-row>
        <v-row justify="center" v-if="message.length !== 0">
          <v-col cols="12" md="4">
            <v-alert type="error"> {{ message }}</v-alert>
          </v-col>
        </v-row>
        <v-row class="d-sm-none">
          {{ mobileMessage }}
        </v-row>
        <v-row justify="space-around">
          <v-col cols="2">
            <div class="d-inline-flex justify-center flex-column align-center">
              <v-btn size="large" @click="dialog = true" color="primary">
                <v-icon class="ml-n3 mr-2">
                  mdi-refresh
                </v-icon>
                NOUVEAU MOT
              </v-btn>
              <v-dialog v-model="dialog">
                <v-card>
                  <v-card-text>
                    Longeur max du mot
                    <v-slider v-model="wordLengthMax" thumb-label="always" :min="sliderMin" :max="sliderMax" ticks step="1" class="mt-8">
                    </v-slider>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn size="large" @click="newGame(true)" elevation="1">
                      Conjugué
                    </v-btn>
                    <v-btn size="large" @click="newGame(false)" elevation="1">
                      Non conjugué
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <p class="text-h3 text-align mt-10">
                {{ streak < 0 ? streak + '🥶' : streak + '🔥' }}
              </p>
            </div>
          </v-col>
          <v-col cols="7" v-if="word && displayableLetters !== [] && displayableLetters[0]?.letter">
            <v-row v-for="row in GUESS_COUNT" :key="row" justify="center">
              <v-col v-for="col in word.length" :key="col" cols="1" class="my-3 mx-1 pa-0 pb-1">
                <v-card tile outlined class="pa-2 text-center" elevation="2"
                        :color="(row - 1) < currentGuess && guessedWords[row -1] !== undefined ? guessedWords[row - 1][col-1].color : 'grey-lighten-2'">
                <span v-if="(row - 1) === currentGuess"
                      class="text-h2"> {{ displayableLetters[col - 1].letter }} </span>
                  <span v-else-if="(row - 1) < currentGuess"
                        class="text-h2"> {{
                      guessedWords[row - 1] !== undefined ? guessedWords[row - 1][col - 1].letter : '.'
                    }} </span>
                  <span v-else class="text-h2"> &nbsp; </span>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-else class="text-center">
            <v-progress-circular indeterminate="true" size="100">
            </v-progress-circular>
          </v-col>
          <v-col cols="2">
            ici c'est l'historique
          </v-col>
        </v-row>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>

export default {
  name: "motus-en-gros",
  data() {
    return {
      GUESS_COUNT: 6,
      word: null,
      message: "",
      isGameOver: false,
      currentGuess: 0,
      guessedLetters: [],
      guessedWords: [],
      currentGuessing: [],
      streak: 0,
      displayableLetters: [],
      lettersStat: null,
      dialog: false,
      sliderMin: 2,
      sliderMax: 20,
      wordLengthMax: 7,
      wordLengthMin: 2
    }
  },
  methods: {
    async newGame(conjugate) {
      this.dialog = false
      this.initVars()
      console.log(conjugate)
      await this.getNewWord(this.wordLengthMin, this.wordLengthMax, conjugate)
      this.initLetterGuesses()
      this.buildDisplayableLetters()
      // this.setMobileEvents()
      // this.setStreak()
    },
    initLetterGuesses() {
      for (let letterCount = 0; letterCount < this.word.length - 1; letterCount++) {
        if (letterCount === 0)
          this.guessedLetters.push(this.word.firstLetter)
        this.guessedLetters.push(".")
      }
    },
    initVars() {
      this.isGameOver = false
      this.currentGuess = 0
      this.guessedLetters = []
      this.currentGuessing = []
      this.guessedWords = []
      this.displayableLetters = []
    },
    async getNewWord(min, max, conjugate) {
      const request = await fetch("https://api.dicolink.com/v1/mots/motauhasard?&minlong=" + min + "&maxlong=" + max + "&verbeconjugue=" + conjugate + "&api_key=fBN0OBotLQVWC2gFdE501ACc0W62XtxU")
      const response = await request.json()
      if (response) {
        const correctWord = response[0].mot.toUpperCase()
        this.word = {
          correctWord: correctWord,
          firstLetter: correctWord.charAt(0),
          length: correctWord.length
        }
        this.getLettersStat()
      } else {
        this.displayMessage("Erreur lors de la récupération du mot, veuillez réessayer dans quelques instants", true)
      }

    },
    async parseKeyEvent(e) {
      //space
      if (e.keyCode === 32) {
        e.preventDefault()
        await this.newGame(false)
        return
      }
      if (this.isGameOver)
        return
      //a-z
      if (e.keyCode >= 65 && e.keyCode <= 90 && this.currentGuessing.length < this.word.length) {
        this.currentGuessing.push(e.key.toUpperCase())
      }
      //backspace
      if (e.keyCode === 8) {
        this.currentGuessing.pop()
      }
      //enter
      if (e.keyCode === 13) {
        e.preventDefault()
        await this.validateGuess()
      }
      if (!this.isGameOver)
        this.buildDisplayableLetters()
    },
    buildDisplayableLetters() {
      const displayableLetters = []
      displayableLetters[0] = {
        letter: this.word.firstLetter,
        color: "green"
      }
      for (let letter = 1; letter < this.word.length; letter++) {
        let replacementLetter;
        if (this.currentGuessing.length !== 0)
          replacementLetter = "."
        else
          replacementLetter = this.guessedLetters[letter] || "."
        const data = {
          letter: this.currentGuessing[letter] || replacementLetter,
          color: this.displayableLetters[letter]?.color || 'transparent'
        }
        displayableLetters.push(data)
        this.displayableLetters = displayableLetters
      }
    },
    mergeArrays(array1, array2) {
      let res = []
      for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== ".")
          res.push(array1[i])
        else res.push(array2[i])
      }
      return res
    },
    displayMessage(text, resetGuess) {
      this.message = text
      if (resetGuess)
        this.currentGuessing = []
      this.sleep(4000).then(() => this.message = "")
    },
    async validateGuess() {
      const completeGuessing = this.mergeArrays(this.currentGuessing, this.guessedLetters)
      if (completeGuessing.length === this.word.length) {
        const guessingword = completeGuessing.join("")
        const res = this.testWord(guessingword)
        await this.parseRes(res)
      } else {
        this.displayMessage("Le mot est trop court 😮‍💨", false)
      }
    },
    getLettersStat() {
      this.lettersStat = new Map()
      let seenLetters = []
      for (let letter = 0; letter < this.word.length; letter++) {
        const currLetter = this.word.correctWord.charAt(letter)
        if (!seenLetters.includes(currLetter)) {
          seenLetters.push(currLetter)
          const occ = this.word.correctWord.split(currLetter).length - 1;
          this.lettersStat.set(currLetter, occ)
        }
      }
    },
    async wordExists(word) {
      const link = "https://api.dicolink.com/v1/mot/" + word + "/definitions?limite=200&api_key=fBN0OBotLQVWC2gFdE501ACc0W62XtxU"
      const request = await fetch(link)
      const response = await request.json()
      return response.error === undefined && response?.status !== 429

    },
    async testWord(word) {
      if (word.charAt(0) !== this.word.correctWord.charAt(0))
        return "WRONGFIRSTLETTER"
      const doesWordExist = await this.wordExists(word)
      if (!doesWordExist)
        return "NOTAWORD"
      let res = []
      for (let i = 0; i < word.length; i++) {
        res[i] = ""
      }
      let cloneLettersStats = new Map(this.lettersStat)
      for (let letter = 0; letter < word.length; letter++) {
        const currLetter = word.charAt(letter)
        const currLetterocc = cloneLettersStats.get(currLetter)
        if (currLetter === this.word.correctWord.charAt(letter)) {
          res[letter] = {
            letter: currLetter,
            status: "CORRECT"
          }
          cloneLettersStats.set(currLetter, currLetterocc - 1)
        }
      }
      for (let letter = 0; letter < word.length; letter++) {
        const currLetter = word.charAt(letter)
        const currLetterocc = cloneLettersStats.get(currLetter)
        if (currLetterocc > 0 && res[letter] === "") {
          res[letter] = {
            letter: currLetter,
            status: "MISPLACED"
          }
          cloneLettersStats.set(currLetter, currLetterocc - 1)
        } else if (res[letter] === "") {
          res[letter] = {
            letter: word.charAt(letter),
            status: "WRONG"
          }
        }
      }
      return res
    },
    getColor(status) {
      switch (status) {
        case "CORRECT":
          return "red-lighten-1"
        case "MISPLACED":
          return "light-green"
        default:
          return "transparent"
      }
    },
    async parseRes(res) {
      res = await res;
      if (res === "NOTAWORD") {
        const completeGuessing = this.mergeArrays(this.currentGuessing, this.guessedLetters)
        const guessingword = completeGuessing.join("")
        this.displayMessage(guessingword + " n'est pas un mot dans mon dictionnaire 🤨", true)
        return
      }
      if (res === "WRONGFIRSTLETTER") {
        this.displayMessage("Le mot doit commencer par un " + this.word.firstLetter + " 🙄", true)
        return
      }
      for (let letter = 0; letter < this.word.length; letter++) {
        this.displayableLetters[letter].color = this.getColor(res[letter].status)
        if (res[letter].status === "CORRECT") {
          this.guessedLetters[letter] = res[letter].letter
        }
      }
      this.currentGuess++;
      const gameOver = await this.checkGameOver()
      this.guessedWords.push(this.displayableLetters)
      this.currentGuessing = []
      if (!gameOver) {
        this.buildDisplayableLetters()
      }
    },
    async checkGameOver() {
      if (this.currentGuess >= this.GUESS_COUNT && this.guessedLetters.includes(".")) {
        this.displayMessage("Perdu... 😔 Le mot était " + this.word.correctWord, false)
        this.isGameOver = true
        this.streak - 1 >= 0 ? this.streak = -1 : this.streak -= 1
        // await this.updateHistory(false)
        return true
      }
      for (let guessedLetter of this.guessedLetters) {
        if (guessedLetter === ".")
          return false
      }
      if (this.currentGuessing.join("") === this.word.correctWord) {
        this.guessedWords.push(this.displayableLetters)
        this.currentGuess++
        this.isGameOver = true
        this.streak + 1 <= 0 ? this.streak = 1 : this.streak += 1
        // await this.updateHistory(true)
        return true
      }
      return false
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  },
  async created() {
    document.addEventListener('keydown', this.parseKeyEvent);
    this.newGame(false).then()
  }
}
</script>