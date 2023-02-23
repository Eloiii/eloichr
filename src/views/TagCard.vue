<template>
  <v-fade-transition leave-absolute>
    <v-card :variant="cardStyle">
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-card-subtitle>
        <v-icon icon="mdi-signal-disconnected" v-if="!data.realtime"></v-icon>
        <v-icon icon="mdi-access-point" v-else></v-icon>
      </v-card-subtitle>
      <v-card-text>
        <div>
          Arrive à {{data.arrivalTime.toLocaleTimeString()}}
          dans <span class="font-weight-bold text-subtitle-1" :class="timeRemaining.split(':')[0] <= 0 ? 'text-red' : ''">{{timeRemaining}}</span>
        </div>
        <div>
          censé arrivé à {{data.scheduledArrival.toLocaleTimeString()}}
        </div>
      </v-card-text>
    </v-card>
  </v-fade-transition>
</template>
<script setup>
import {ref, defineProps} from "vue";

const props = defineProps(['title', 'data'])
const timeRemaining = ref("")

const cardStyle = ref('outlined')

setTimeout(() => cardStyle.value = 'tonal', 10000)
timeRemaining.value = getTimeBetween(props.data.arrivalTime)
setInterval(() => {
  timeRemaining.value = getTimeBetween(props.data.arrivalTime)
}, 1000)

function getTimeBetween(date1) {
  const msRemaining = (new Date() - date1)

  const hoursms = msRemaining % (60 * 60 * 1000);
  const minutesRemaining = Math.floor(hoursms / (60 * 1000));
  const minutesms = msRemaining % (60 * 1000);
  const secondsRemaining = Math.floor(minutesms / 1000);

  return -minutesRemaining + ":" + -secondsRemaining
}

</script>
