import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
// 사용자 관련 route
import Signup from '@/views/accounts/Signup'
import Login from '@/views/accounts/Login'
import UpdateUser from '@/views/accounts/UpdateUser'
import Profile from '@/views/accounts/Profile'
import UserMovieList from '@/views/accounts/UserMovieList'
import UserReviewArticleList from '@/views/accounts/UserReviewArticleList'

// 영화 관련 route
import SearchResult from '@/views/movies/SearchResult'
import MovieDetail from '@/views/movies/MovieDetail'
import EnterTarot from '@/views/movies/EnterTarot'
import TarotCard from '@/views/movies/TarotCard'

// 커뮤니티 관련 route
import ArticleList from '@/views/community/ArticleList'
import ArticleDetail from '@/views/community/ArticleDetail'
import ArticleForm from '@/views/community/ArticleForm'

// 에러 핸들러
import PageNotFound from '@/views/PageNotFound'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // Accounts router
  {
    path: '/accounts/signup',
    name: 'Signup',
    component: Signup,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('jwt')
      if (!token) {
        next()
      } else {
        next({ path: from.fullPath })
      }
    }
  },
  {
    path: '/accounts/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('jwt')
      if (!token) {
        next()
      } else {
        next({ path: from.fullPath })
      }
    },
  },
  {
    path: '/accounts/update/:username',
    name: 'UpdateUser',
    component: UpdateUser,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('jwt')
      if (token) {
        next()
      } else {
        next({ name: 'Login' })
      }
    },
  },
  {
    path: '/accounts/:username',
    name: 'Profile',
    component: Profile,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('jwt')
      if (token) {
        next()
      } else {
        next({ name: 'Login' })
      }
    },
  },
  // 사용자 + 영화 목록
  {
    path: '/accounts/:username/like',
    name: 'UserLikedMovieList',
    component: UserMovieList,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('jwt')
      if (token) {
        next()
      } else {
        next({ name: 'Login' })
      }
    },
  },
  {
    path: '/accounts/:username/wish',
    name: 'UserWishedMovieList',
    component: UserMovieList,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('jwt')
      if (token) {
        next()
      } else {
        next({ name: 'Login' })
      }
    },
  },
  // 사용자 + 게시글 목록
  {
    path: '/accounts/:username/reviews/wrote_reviews',
    name: 'UserWroteReviewList',
    component: UserReviewArticleList,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('jwt')
      if (token) {
        next()
      } else {
        next({ name: 'Login' })
      }
    },
  },
  {
    path: '/accounts/:username/reviews/liked_reviews',
    name: 'UserLikedReviewList',
    component: UserReviewArticleList,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('jwt')
      if (token) {
        next()
      } else {
        next({ name: 'Login' })
      }
    },
  },
  {
    path: '/accounts/:username/reviews/wrote_articles',
    name: 'UserWroteArticleList',
    component: UserReviewArticleList,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('jwt')
      if (token) {
        next()
      } else {
        next({ name: 'Login' })
      }
    },
  },
  {
    path: '/accounts/:username/reviews/liked_articles',
    name: 'UserLikedArticleList',
    component: UserReviewArticleList,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('jwt')
      if (token) {
        next()
      } else {
        next({ name: 'Login' })
      }
    },
  },
  // Movies router
  {
    path: '/movies/search/:criteria/:query',
    name: 'SearchResult',
    component: SearchResult,
  },
  {
    path: '/movies/detail/:movie_pk',
    name: 'MovieDetail',
    component: MovieDetail,
  },
  {
    path: '/movies/enterTarot',
    name: 'EnterTarot',
    component: EnterTarot,
  },
  {
    path: '/movies/tarot',
    name: 'TarotCard',
    component: TarotCard,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('jwt')
      if (token) {
        next()
      } else {
        next({ name: 'Login' })
      }
    },
  },
  // Community router
  {
    path: '/community',
    name: 'ArticleList',
    component: ArticleList,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('jwt')
      if (token) {
        next()
      } else {
        next({ name: 'Login' })
      }
    },
  },
  {
    path: '/community/detail/:article_pk',
    name: 'ArticleDetail',
    component: ArticleDetail,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('jwt')
      if (token) {
        next()
      } else {
        next({ name: 'Login' })
      }
    },
  },
  {
    path: '/community/create',
    name: 'ArticleForm',
    component: ArticleForm,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('jwt')
      if (token) {
        next()
      } else {
        next({ name: 'Login' })
      }
    },
  },
  {
    path: '/community/update/:article_pk',
    name: 'ArticleFormUpdate',
    component: ArticleForm,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('jwt')
      if (token) {
        next()
      } else {
        next({ name: 'Login' })
      }
    },
  },
  // Error handler
  {
    path: '*',
    redirect: '/404',
  },
  {
    path: '/404',
    name: '404',
    component: PageNotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
