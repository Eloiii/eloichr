<template>
  <v-container>
    <h1 class="text-h3">oui</h1>
    <v-divider></v-divider>
    <v-row justify="center" class="cards">
      <v-col v-for="item in items"
             :key="item.title">
        <v-card
            max-width="500"
            @click="redirect(item.link)"
        >
          <v-img
              class="text-white align-end"
              height="200px"
              :src="item.image"
              cover
          >
            <v-card-title>{{ item.title }}</v-card-title>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import notesMDImage from '@/assets/md.png'
export default {
  name: 'HomeView',
  data() {
    return {
      items: [
        {
          title: "Notes MD",
          link: "https://www.md.eloichr.xyz",
          image: notesMDImage,
          description: "Markdown notes"
        }
      ]
    }
  },
  methods: {
    redirect(link) {
      window.location.href = link
    }
  }
}
</script>
<style>
.cards {
  margin : 5vh 10% 0 10%;
}
</style>
