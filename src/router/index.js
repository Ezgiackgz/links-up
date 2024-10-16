import { createRouter, createWebHistory } from 'vue-router'
import LinkList from "@/components/LinkList.vue";
import SubmitLink from "@/components/SubmitLink.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LinkList
    },
    {
      path: '/submit',
      name: 'submit',
      component: SubmitLink
    }
  ]
})

export default router
