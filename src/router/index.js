import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/views/HomeView";
import Ckancfini from "@/views/Ckancfini";
import motus from "@/views/motus";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/ckancfini',
    name: 'C-kan-c-fini',
    component: Ckancfini
  },
  {
    path: '/motus',
    name: 'motus-en-gros',
    component: motus
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
