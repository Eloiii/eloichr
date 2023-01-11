<template>
  <v-container fluid full-height class="padding_au_max">
    <v-row justify="center">
        <v-col cols="3" class="flex justify-center">
            <v-list lines="two" bg-color="transparent">
                <v-list-item title="Eloi Charra" prepend-avatar="https://media.licdn.com/dms/image/C4D03AQG-gOZ-FaGblw/profile-displayphoto-shrink_800_800/0/1650405270185?e=1678924800&v=beta&t=WirJhlc6-hcYIvgOzrbcGtbUBv6k51KWjIDRr3Q9PB4">

                </v-list-item>
            </v-list>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
import notesMDImage from '@/assets/md.png'
import ckancfiniImage from '@/assets/ckancfini.png'
import motus from '@/assets/motus.jpeg'
import {defineComponent} from "vue";
import {useI18n} from "vue-i18n";

export default defineComponent({
  name: 'HomeView',
  setup() {
    const {t} = useI18n();
    return {
      t,
    };
  },
  data() {
    return {
      items: [
        {
          id: 0,
          title: "Notes MD",
          link: "https://www.md.eloichr.xyz",
          image: notesMDImage,
          text: "white"
        },
        {
          id: 1,
          title: "C'est quand c'est fini ?",
          link: window.location.href + "ckancfini",
          image: ckancfiniImage,
          text: "black"
        },
        {
          id: 2,
          title: "C'EST PAS MOTUS",
          link: window.location.href + "motus",
          image: motus,
          text: "white"
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
.padding_au_max {
    padding-top: 20vh;
}

.v-avatar {
    height: 62px !important;
    width: 62px !important;
}
</style>
