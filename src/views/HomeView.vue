<template>
  <v-container fluid full-height class="padding_au_max">
    <v-row justify="center">
        <v-col md="2" cols="11" class="flex justify-center">
            <div class="main_content">
              <div class="main_content_info">
                <v-avatar image="https://avatars.githubusercontent.com/u/58401906?v=4" size="75">

                </v-avatar>
                <div class="main_content_info_name">
                  <div class="text-h5">
                    Eloi Charra
                  </div>
                  <div class="text-body-2 text-grey">
                    Computer Science student
                  </div>
                  <div class="text-caption">
                    <a href="https://github.com/Eloiii" class="text-decoration-none text-grey-darken-1">github.com/Eloiii</a>
                  </div>
                </div>
              </div>
              <div class="main_content_projects">
                <div class="mb-5 text-h6">Where to go ?</div>
                <div class="main_content_projects_project" v-for="project in items" :key="project.id">
                  <div>
                    <v-avatar size="large" :image="project.image">

                    </v-avatar>
                  </div>
                  <div class="main_content_projects_project_info">
                    <div>
                      <v-hover>
                        <template v-slot:default="{ isHovering, props }">
                          <a v-bind="props" class="text-subtitle-1 text-white" :class="isHovering ? '' : 'text-decoration-none'" :href="project.link">{{ project.title }}</a>
                          <svg class="ml-2 mb-n1" xmlns="http://www.w3.org/2000/svg" height="20" width="20" stroke="#ffffff" fill="#ffffff"><path d="M5.062 15 4 13.938 12.438 5.5H5V4h10v10h-1.5V6.562Z"/></svg>
                        </template>
                      </v-hover>
                    </div>
                    <div class="text-caption text-grey">
                      {{ project.desc }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {defineComponent} from "vue";
import {useI18n} from "vue-i18n";
import ArrowTrCircle from 'iconoir/icons/arrow-tr-circle.svg'

export default defineComponent({
  name: 'HomeView',
  components: ArrowTrCircle,
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
          title: "HedgeDoc",
          desc: "Markdown notes",
          link: "https://www.md.eloichr.xyz",
          image: "https://framalibre.org/sites/default/files/styles/thumbnail/public/leslogos/HedgeDoc-Logo%201.png?itok=5O-YNFNh",
        },
        {
          id: 1,
          title: "C'est quand c'est fini ?",
          link: window.location.href + "ckancfini",
          desc: "...",
          image: "https://media.istockphoto.com/id/866655750/fr/vectoriel/sablier.jpg?b=1&s=170667a&w=0&k=20&c=6pZvnnYvK80_OWkTfyZ9iwL6gUWzcU9AX2IrF4TOdds=",
        },
        {
          id: 2,
          title: "Motus",
          desc: "It's not Motus",
          link: window.location.href + "motus",
          image: "https://static1.purepeople.com/articles/2/33/78/62/@/4817276-exclusif-thierry-beccaro-backstage-d-624x600-1.jpg",
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
<style lang="scss">
.padding_au_max {
    padding-top: 20vh;
}

.main_content {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;

  .main_content_info {
    display: flex;
    align-items: center;

    .main_content_info_name {
      margin-left: 5%;
    }
  }

  .main_content_projects {
    margin-top: 10%;

    .main_content_projects_project {
      display: flex;
      margin-bottom: 8%;

      .main_content_projects_project_info {
        margin-left: 5%;
      }
    }
  }
}
</style>
