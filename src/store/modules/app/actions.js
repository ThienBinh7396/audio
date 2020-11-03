import { DB } from '@/firebase/db'

import Vue from 'vue';

export default {
    initializeIp({ commit }, ip) {
        ip = btoa(ip);

        commit('setIp', ip);




        DB.collection('users').doc(`${ip}`).get()
            .then(snap => {
                if (!snap.exists) {
                    DB.collection('users').doc(`${ip}`).set({
                        config: {
                            volume: 1,
                            speed: 1,
                            fontSize: 24
                        },
                        stories: []
                    }, (err) => {})
                } else {

                    DB.collection('users').doc(`${ip}`)
                        .onSnapshot(doc => {
                            let data = doc.data();

                            if (!data.stories) {
                                data.stories = [];
                            }

                            commit('setConfig', data.config);
                            commit('setRecentStories', data.stories);
                        });


                }
            })

    },
    updateConfig({ commit, state }, config) {
        if (!state.ip) return;

        console.log(state);


        DB.collection('users').doc(state.ip)
            .update({
                config
            })
    },
    showToast({ commit }, toast) {
        commit('setToast', toast);

        commit('setShowToast', false);
        setTimeout(() => {
            commit('setShowToast', true);
        }, 100)
        console.log(toast);
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
        if (!state.ip) return;


        DB.collection('users').doc(state.ip)
            .get()
            .then(snap => {
                let stories = null;

                if (!snap.data().hasOwnProperty('stories')) {
                    stories = [];
                } else {
                    stories = snap.data().stories;
                }

                let index = stories.findIndex(it => it.id == recentStory.storyInfo.id);

                if (index < 0) {
                    Vue.prototype.$axios.get(`/story/info?id_story=${recentStory.storyInfo.id}`)
                        .then(rs => {
                            let { data } = rs;

                            stories.push({
                                ...data.data,
                                recentChapter: {
                                    id: recentStory.chapterId,
                                    title: recentStory.storyInfo.chapter,
                                    href: recentStory.chapterHref,
                                    time: Date.now()
                                }
                            })

                            stories.sort((a, b) => b.recentChapter.time - a.recentChapter.time);

                            DB.collection('users').doc(state.ip)
                                .update({ stories });

                        })


                } else {
                    let story = stories[index];

                    story.recentChapter = {
                        id: recentStory.chapterId,
                        href: recentStory.chapterHref,
                        title: recentStory.storyInfo.chapter,
                        time: Date.now()
                    };


                    stories.splice(index, 1, story);

                    stories.sort((a, b) => b.recentChapter.time - a.recentChapter.time);

                    DB.collection('users').doc(state.ip)
                        .update({ stories });

                }

            })
    }
}