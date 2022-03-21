<template>
  <v-container>
    <h1 class="text-h3">{{ t('title')}}</h1>
    <v-divider></v-divider>
    <v-row justify="center" class="cards">
      <v-col v-for="item in items"
             :key="item.title">
        <v-card
            max-width="500"
            @click="redirect(item.link)"
        >
          <v-img
              class="align-end"
              :class="'text-'+item.text"
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
import ckancfiniImage from '@/assets/ckancfini.png'
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
export default defineComponent ({
  name: 'HomeView',
  setup() {
      const { t } = useI18n();
      return {
        t,
      };
  },
  data() {
    return {
      items: [
        {
          title: "Notes MD",
          link: "https://www.md.eloichr.xyz",
          image: notesMDImage,
          description: "Markdown notes",
          text: "white"
        },
        {
          title: "C'est quand c'est fini ?",
          link: window.location.href + "ckancfini",
          image: ckancfiniImage,
          description: "Savoir combien de temps il reste avant la fin...  ",
          text: "black"
        }
      ]
    }
  },
  methods: {
    redirect(link) {
      window.location.href = link
    }
  }
})
</script>
<style>
.cards {
  margin : 5vh 10% 0 10%;
}
</style>
