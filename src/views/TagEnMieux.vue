<template>
  <v-container fluid full-height>
    <v-row v-if="Object.keys(data).length > 0" justify="center">
      <v-col v-for="stop of data" :key="stop" cols="12">
        <tagCard :data="stop" :title="stop.name"/>
      </v-col>
    </v-row>
    <v-row v-else justify="center">
      <v-progress-circular
          indeterminate
      ></v-progress-circular>
    </v-row>
  </v-container>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import TagCard from "@/views/TagCard.vue";

let data = ref({})


onMounted(async () => {
  const res = {}
  const maisonCom = await getDataFromApi("SEM:GENMAISONCO", "SEM:14:0:14_R_36")
  const verdun = await getDataFromApi("SEM:GENVERDUN", "SEM:14:1:14_A_37")
  const dMaisonCom = await getDataFromApi("SEM:GENMAISONCO", "SEM:D:0:D_R_1")
  const dTaillees = await getDataFromApi("SEM:GENTAILLEES", "SEM:D:1:D_A_4")

  res["verdun"] = verdun
  res["maisonCom"] = maisonCom
  res["dMaisonCom"] = dMaisonCom
  res["dTaillees"] = dTaillees

  data.value = res
})

async function getDataFromApi(stopName, routeName) {
  const response = await fetch('https://data.mobilites-m.fr/api/routers/default/index/clusters/' + stopName + '/stoptimes')
  const fullData = await response.json()
  // console.log(fullData)
  const route = fullData.filter(p => p.pattern.id === routeName)[0]
  const nextArrival = route.times[0]
  return {
    name: route.pattern.id.split(":")[1] + " // " + nextArrival.stopName.split(",")[1].trim() + " direction " + route.pattern.shortDesc,
    realtime: nextArrival.realtime,
    arrivalTime: new Date(new Date().setHours(0, 0, nextArrival.realtime ? nextArrival.realtimeArrival : nextArrival.scheduledArrival, 0)),
    scheduledArrival: new Date(new Date().setHours(0, 0, nextArrival.scheduledArrival, 0))
  }
}
</script>
