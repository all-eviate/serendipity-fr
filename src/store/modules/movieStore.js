import axios from 'axios'

const movieStore = {
  namespaced: true,
  state: {
    genreTable: [],
  },
  getters: {
    GET_GENRE_TABLE: state => state.genreTable
  },
  mutations: {
    SET_GENRE_TABLE: (state, genreTable) => {
        state.genreTable = genreTable
    },
  },
  actions: {
    setGenreTable: function({ commit }) {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      axios({
          method: 'get',
          url: `${SERVER_URL}/movies/genres/`,
        })
          .then(res => {
            const genreTable = res.data
            // console.log(genreTable)
            commit('SET_GENRE_TABLE', genreTable)
          })
          .catch(err => {
            console.log('에러!')
            console.log(err)
          })
    },
  }
}

export default movieStore