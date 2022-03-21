<template>
  <v-container fluid style="height: 100vh;" class="d-flex flex-column">
    <v-row class="mt-16 mx-10 text-center" align="center" justify="center">
      <h1 class="text-h1">
        {{ timeRemaining }}
      </h1>
    </v-row>
    <v-row justify="center" align="center" class="flex-column my-n16">
      <div class="text-caption" style="font-size: 1em !important;">
        {{ citation }}
      </div>
      <div class="text-overline">
        {{ author }}
      </div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "C-kan-c-fini",
  data () {
    return {
      timeRemaining: null,
      citation: null,
      author: null
    }
  },
  methods: {
    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    },
    displayRemainingTime() {
      const today = new Date()
      const end = new Date(2024, 6, 1)

      const msRemaining = (end - today)
      const daysRemaining = Math.floor(msRemaining / (24 * 60 * 60 * 1000))
      const daysms = msRemaining % (24 * 60 * 60 * 1000)
      const hoursRemaining = Math.floor(daysms / (60 * 60 * 1000))
      const hoursms = msRemaining % (60*60*1000);
      const minutesRemaining = Math.floor(hoursms / (60*1000));
      const minutesms = msRemaining % (60*1000);
      const secondsRemaining = Math.floor(minutesms / 1000);
      this.timeRemaining = daysRemaining + ' jours ' + hoursRemaining + ' heures ' + minutesRemaining + ' minutes et ' + secondsRemaining + ' secondes ' + 'avant le diplôme'
    },
    async getQuote() {
      const response = await fetch("https://type.fit/api/quotes")
      const res = await response.json()
      return res[this.getRandomInt(res.length)]
    },
    async displayQuote() {
      const quote = await this.getQuote()
      this.author = quote.author
      this.citation = quote.text
    }
  },
  async created() {
    this.displayRemainingTime()
    setInterval(this.displayRemainingTime, 1000)
    await this.displayQuote()
  }
}
</script>

<style scoped>

</style>