import Vue from 'vue'
import VueRouter from 'vue-router'
import Song from '../views/Song.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Song',
    component: Song
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: () => import(/* webpackChunkName: "about" */ '../views/Recommend.vue')
  },
  {
    path: '/singer',
    name: 'Singer',
    component: () => import(/* webpackChunkName: "about" */ '../views/Singer.vue'),
    children: [
      {
        path: '/singer/singerdetails',
        name: 'SingerDetails',
        component: () => import(/* webpackChunkName: "about" */ '../views/SingerDetails.vue'),
      },
      {
        path: '/singer/singeralbums',
        name: 'SingerAlbums',
        component: () => import(/* webpackChunkName: "about" */ '../views/SingerAlbums.vue'),
      }
    ]
  },
  {
    path:'/my',
    name:'My',
    component: () => import(/* webpackChunkName: "about" */ '../views/My.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "about" */ '../views/Search.vue'),

  },
  {
    path: '/songdetails',
    name: 'SongDetails',
    component: () => import(/* webpackChunkName: "about" */ '../views/SongDetails.vue')
  },
  {
    path: '/searchlist',
    name: 'SearchList',
    component: () => import(/* webpackChunkName: "about" */ '../views/SearchList.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
