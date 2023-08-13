<template>
  <v-container fluid style="height: calc(100vh - 64px);">
    <v-layout class="d-flex flex-column text-center" full-height>
      <v-row align="center" class="mx-10 text-center fill-height" justify="center" no-gutters>
        <v-col cols="12">
          <div class="text-md-h1 text-h2">
            {{ timeRemaining }}
          </div>
        </v-col>
      </v-row>
      <v-row align="center" class="d-flex flex-column" justify="center" no-gutters>
        <div class="text-caption" style="font-size: 1em !important;">
          {{ citation }}
        </div>
        <div class="text-overline">
          {{ author }}
        </div>
      </v-row>
    </v-layout>
  </v-container>
</template>

<script setup>
import {ref} from 'vue'

const timeRemaining = ref(null)
const citation = ref(null)
const author = ref(null)

displayRemainingTime()
setInterval(displayRemainingTime, 1000)
displayQuote()

function displayRemainingTime() {
  const today = new Date()
  const end = new Date(2024, 8, 1)

  const msRemaining = (end - today)
  const daysRemaining = Math.floor(msRemaining / (24 * 60 * 60 * 1000))
  const daysms = msRemaining % (24 * 60 * 60 * 1000)
  const hoursRemaining = Math.floor(daysms / (60 * 60 * 1000))
  const hoursms = msRemaining % (60 * 60 * 1000);
  const minutesRemaining = Math.floor(hoursms / (60 * 1000));
  const minutesms = msRemaining % (60 * 1000);
  const secondsRemaining = Math.floor(minutesms / 1000);
  timeRemaining.value = daysRemaining + ' jours ' + hoursRemaining + ' heures ' + minutesRemaining + ' minutes et ' + secondsRemaining + ' secondes ' + 'avant le diplôme'
}

async function getQuote() {
  const response = await fetch("https://api.quotable.io/quotes/random")
  const res = await response.json()
  return res[0]
}

async function displayQuote() {
  const quote = await getQuote()
  console.log(quote)
  author.value = quote.author
  citation.value = quote.content
}
</script>

