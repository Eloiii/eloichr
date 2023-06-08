<template>
  <v-app theme="dark">
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script setup>
import { analytics } from "../firebaseConfig";
import { logEvent } from "firebase/analytics";

logEvent(analytics, 'visited');
</script>