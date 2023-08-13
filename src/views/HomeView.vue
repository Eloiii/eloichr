<template>
  <v-container class="padding_au_max" fluid full-height>
    <v-row justify="center">
      <v-col class="flex justify-center" cols="11" md="2">
        <div class="main_content">
          <div class="main_content_info">
            <v-avatar image="https://avatars.githubusercontent.com/u/58401906?v=4" size="75">

            </v-avatar>
            <div class="main_content_info_name">
              <div class="text-h5">
                Eloi Chr.
              </div>
              <div class="text-caption">
                <a class="text-decoration-none text-grey-darken-1"
                   href="https://github.com/Eloiii">github.com/Eloiii</a>
              </div>
            </div>
          </div>
          <div class="main_content_projects">
            <div class="mb-5 text-h6">Where to go ?</div>
            <div v-for="project in items" :key="project.id" class="main_content_projects_project">
              <div>
                <v-avatar :image="project.image" size="large">

                </v-avatar>
              </div>
              <div class="main_content_projects_project_info">
                <div>
                  <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                      <a :class="isHovering ? '' : 'text-decoration-none'" :href="project.link"
                         class="text-subtitle-1 text-white" v-bind="props">{{ project.title }}</a>
                      <svg class="ml-2 mb-n1" fill="#ffffff" height="20" stroke="#ffffff" width="20"
                           xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.062 15 4 13.938 12.438 5.5H5V4h10v10h-1.5V6.562Z"/>
                      </svg>
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

<script setup>
import {ref} from 'vue'

const items = ref([
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
    desc: "Bon bah voilà quoi",
    link: window.location.href + "motus",
    image: "https://static1.purepeople.com/articles/2/33/78/62/@/4817276-exclusif-thierry-beccaro-backstage-d-624x600-1.jpg",
  }
])
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
