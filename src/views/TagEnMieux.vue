<template>
  <v-container class="padding_au_max" fluid full-height>
    <v-row justify="center">
      <v-col class="flex justify-center" cols="11" md="6">
        <v-card variant="outlined">
          <v-card-title>
            14 &ndash; Maison Communale vers Verdun
          </v-card-title>
          <v-card-text v-if="data['maisonCom']">
            <v-icon icon="mdi-signal-disconnected" v-if="!data['maisonCom'].realtime"></v-icon>
            <v-icon icon="mdi-access-point" v-else></v-icon>
            Arrive à {{data["maisonCom"].arrivalTime.toLocaleTimeString()}}
            dans {{maisonComTimeRemaining}}
          </v-card-text>
          <v-card-text v-else>
            <v-progress-circular
                indeterminate
            ></v-progress-circular>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="flex justify-center" cols="11" md="6">
        <v-card variant="outlined">
          <v-card-title>
            14 &ndash; Verdun
          </v-card-title>
          <v-card-text v-if="data['verdun']">
            <v-icon icon="mdi-signal-disconnected" v-if="!data['verdun'].realtime"></v-icon>
            <v-icon icon="mdi-access-point" v-else></v-icon>
            Arrive à {{data["verdun"].arrivalTime.toLocaleTimeString()}}
            dans {{verdunTimeRemaining}}
          </v-card-text>
          <v-card-text v-else>
            <v-progress-circular
                indeterminate
            ></v-progress-circular>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {ref, onMounted} from 'vue'

let data = ref({})
const maisonComTimeRemaining = ref("")
const verdunTimeRemaining = ref("")

onMounted(async () => {
  const res = {}
  const maisonCom = await get14MaisonCommunaleToVerdun()
  const verdun = await get14Verdun()


  res["verdun"] = verdun
  res["maisonCom"] = maisonCom

  data.value = res

  setInterval(() => {
    maisonComTimeRemaining.value = getTimeBetween(res["maisonCom"].arrivalTime, new Date())
  }, 1000)
  setInterval(() => {
    verdunTimeRemaining.value = getTimeBetween(res["verdun"].arrivalTime, new Date())
  }, 1000)
})
async function get14MaisonCommunaleToVerdun() {
  const response = await fetch('https://data.mobilites-m.fr/api/routers/default/index/clusters/SEM:GENMAISONCO/stoptimes')
  const fullData = await response.json()
  const ligne14_maison_to_verdun = fullData.filter(p => p.pattern.id === "SEM:14:0:14_R_36")[0]
  const nextArrival = ligne14_maison_to_verdun.times[0]
  return {
    realtime: nextArrival.realtime,
    arrivalTime: new Date(new Date().setHours(0, 0, nextArrival.realtime ? nextArrival.realtimeArrival + 3600 : nextArrival.scheduledArrival + 3600, 0))
  }
}

async function get14Verdun() {
  const response = await fetch('https://data.mobilites-m.fr/api/routers/default/index/clusters/SEM:GENVERDUN/stoptimes')
  const fullData = await response.json()
  const ligne14_maison_to_verdun = fullData.filter(p => p.pattern.id === "SEM:14:1:14_A_37")[0]
  const nextArrival = ligne14_maison_to_verdun.times[0]
  return {
    realtime: nextArrival.realtime,
    arrivalTime: new Date(new Date().setHours(0, 0, nextArrival.realtime ? nextArrival.realtimeArrival + 3600 : nextArrival.scheduledArrival + 3600, 0))
  }
}

function getTimeBetween(date1, date2) {
  const msRemaining = (date2 - date1)
  const hoursms = msRemaining % (60 * 60 * 1000);
  const minutesRemaining = Math.floor(hoursms / (60 * 1000));
  const minutesms = msRemaining % (60 * 1000);
  const secondsRemaining = Math.floor(minutesms / 1000);

  return Math.abs(minutesRemaining) + ":" + Math.abs(secondsRemaining)
}


</script>
<style>
.padding_au_max {
  padding-top: 20vh;
}

</style>