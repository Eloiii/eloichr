<template>
  <v-app :theme="theme">
    <v-app-bar app dark color="transparent" flat>
      <v-switch inset="oui" label="Dark mode" class="mt-8" @click="toggleTheme"></v-switch>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
<script>
import {ref} from 'vue'

export default {
  setup() {
    const theme = ref('light')
    return {
      theme,
      toggleTheme: () => theme.value = theme.value === 'light' ? 'dark' : 'light'
    }
  }
}
</script>
