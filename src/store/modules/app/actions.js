import { DB } from '@/firebase/db'

import Vue from 'vue';

export default {
  updateAudioConfig({ commit, state }, audioConfig) {
    commit('setAudioConfig', audioConfig)
  },
  showToast({ commit, state }, toast) {
    commit('setToast', { ...state.toast, ...toast });
    commit('setShowToast', false);
    setTimeout(() => {
      commit('setShowToast', true);
    }, 100)
    console.log('toast', toast);
  },
  updateResponsiveByWidth: ({ commit }, width) => {
    // 1: xs
    // 2: sm
    // 3: md
    // 4: lg
    // 5: xl

    let rs = 'lg';

    switch (true) {
      case (width < 576):
        rs = 1;
        break;

      case (width >= 576 && width < 768):
        rs = 2;
        break;

      case (width >= 768 && width < 992):
        rs = 3;
        break;

      case (width >= 992 && width < 1200):
        rs = 4;
        break;

      case (width >= 1200):
        rs = 5;

    }

    commit('setResponsive', rs);

  },
  updateRecentlyStory({ commit, state }, recentStory) {
    let recentStories = JSON.parse(JSON.stringify(state.recentStories))

    let index = recentStories.findIndex(it => it.id == recentStory.storyInfo.id);


    if (index < 0) {
      Vue.prototype.$axios.get(`/story/info?idStory=${recentStory.storyInfo.id}`)
        .then(rs => {
          let { data } = rs;

          recentStories.push({
            ...data.data,
            recentChapter: {
              id: recentStory.chapterId,
              title: recentStory.storyInfo.chapter,
              href: recentStory.chapterHref,
              time: Date.now()
            }
          })
          commit('setRecentStories', recentStories.sort((a, b) => b.recentChapter.time - a.recentChapter.time))

        })


    } else {
      let story = recentStories[index];

      story.recentChapter = {
        id: recentStory.chapterId,
        href: recentStory.chapterHref,
        title: recentStory.storyInfo.chapter,
        time: Date.now()
      };


      recentStories.splice(index, 1, story);
      commit('setRecentStories', recentStories.sort((a, b) => b.recentChapter.time - a.recentChapter.time))

    }

  }
}
