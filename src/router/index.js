import Vue from 'vue'
import VueRouter from 'vue-router'
import Discovery from '../views/Discovery.vue'
import Playlists from '../views/Playlists.vue'
import Songs from '../views/Songs.vue'
import Song from '../views/Song.vue'
import Mvs from '../views/Mvs.vue'
import Mv from '../views/Mv.vue'
import Result from '../views/Result.vue'
import Test from '../views/Test.vue'
import Playlist from '../views/Playlist.vue'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    component:Discovery
  },
  {
    path:'/playlist',
    component:Playlist
  },
  {
    path:'/test',
    component:Test
  },
  {
    path:'/discovery',
    component:Discovery
  },
  {
    path:'/playlists',
    component:Playlists
  },
  {
    path:'/songs',
    component:Songs
  },
  {
    path:'/song',
    component:Song
  },
  {
    path:'/mvs',
    component:Mvs
  },
  {
    path:'/mv',
    component:Mv
  },
  {
    path:'/result',
    component:Result
  },
  {
    path:'/signup',
    component:Signup
  },
  {
    path:'/login',
    component:Login
  },
]

const router = new VueRouter({
  routes
})


export default router
