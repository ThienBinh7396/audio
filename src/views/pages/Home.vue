<template>
<v-container class="pt-0 px-4">
    <v-row>
        <v-col>
            <v-carousel v-model="slideIndex" cycle :height="detectMobile ? 180 : 320" hide-delimiter-background show-arrows-on-hover>
                <v-carousel-item v-for="(slide, i) in slides" :src="slide.image" :key="'slide-' + i" v-ripple @click="$router.push(slide.url)">
                </v-carousel-item>
            </v-carousel>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <div class="mobile-action" v-if="detectMobile">
                <div class="button-audio-control">
                    <v-btn class="size-default " color="#2740e0" dark fab @click.stop="startSpeak()">
                        <div @click.stop="$store.commit('app/setShowSearch', true)">
                            <v-icon class="ld ld-tremble">mdi-magnify</v-icon>
                        </div>
                    </v-btn>
                </div>
            </div>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <section class="box-center mt-6" v-if="recent_stories && recent_stories.length != 0">
                <h2 class="mb-2 text---lightColor">Truyện đã đọc</h2>

                <div class="mt-5">
                    <hooper :settings="hooperSettings" :wheelControl="false" class="small-navigation px-1">
                        <slide v-for="(item, index) in recent_stories" :key="`_recent-story-${index}`">
                            <v-card class="ma-1 mr-4 pa-0 transparent slide-story" elevation="4" @click="$router.push(`/read/story/${item.story_url}/${item.recentChapter.href}/${item.recentChapter.id}`)">
                                <div class=" pb-0">
                                    <div class="image">
                                        <img :src="getImageUrl(item.image)" width="100%" />
                                    </div>
                                    <div class="absolute-top">
                                        <v-chip color="#1b8ee0" label>
                                            {{item.category_name}}
                                        </v-chip>
                                    </div>
                                    <div class="information">
                                        <div class="name">{{item.name}}</div>
                                        <div class="tb-link">{{item.recentChapter.title}}</div>
                                        <div class="continue">
                                            <div>Đọc tiếp</div>
                                            <div class="icon">
                                                <v-icon class="ld ld-slide-ltr" color="#1b8ee0" size="20">mdi-chevron-right</v-icon>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </v-card>
                        </slide>
                        <hooper-navigation slot="hooper-addons"></hooper-navigation>
                    </hooper>

                </div>
            </section>

            <section class="box-center mt-6" v-if="news && news.length != 0">
                <h2 class="mb-2 text---lightColor">Truyện mới</h2>

                <div class="mt-5">
                    <hooper :settings="hooperSettings" :wheelControl="false" class="small-navigation px-1">
                        <slide v-for="(item, index) in news" :key="`_recent-story-${index}`">
                            <v-card class="ma-1 mr-4 pa-0 transparent slide-story" elevation="4" @click="$router.push(`/story/${item.name}/${item.id}`)">
                                <div class=" pb-0">
                                    <div class="image">
                                        <img :src="getImageUrl(item.image)" width="100%" />
                                    </div>
                                    <div class="absolute-top">
                                        <v-chip :color="item.finish ? 'green' : '#1b8ee0'" label>
                                            {{item.finish ? 'Hoàn thành' : 'Đang ra'}}
                                        </v-chip>
                                    </div>
                                    <div class="information">
                                        <div class="name">{{item.name}}</div>
                                        <div class="tb-link ">{{item.author}}</div>
                                        <div class="tb-link ">{{item.count_chapter}} chương</div>
                                        <div class="continue">
                                            <div>Đọc truyện</div>
                                            <div class="icon">
                                                <v-icon class="ld ld-slide-ltr" color="#1b8ee0" size="20">mdi-chevron-right</v-icon>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </v-card>
                        </slide>
                        <hooper-navigation slot="hooper-addons"></hooper-navigation>
                    </hooper>

                </div>
            </section>

            <section class="box-center mt-6" v-if="finish && finish.length != 0">
                <h2 class="mb-2 text---lightColor">Truyện đã hoàn thành</h2>

                <div class="mt-5">
                    <hooper :settings="hooperSettings" :wheelControl="false" class="small-navigation px-1">
                        <slide v-for="(item, index) in finish" :key="`_recent-story-${index}`">
                            <v-card class="ma-1 mr-4 pa-0 transparent slide-story" elevation="4" @click="$router.push(`/story/${item.name}/${item.id}`)">
                                <div class=" pb-0">
                                    <div class="image">
                                        <img :src="getImageUrl(item.image)" width="100%" />
                                    </div>
                                    <div class="absolute-top">
                                        <v-chip :color="'green'" label>
                                            {{item.count_chapter}} chương
                                        </v-chip>
                                    </div>
                                    <div class="information">
                                        <div class="name">{{item.name}}</div>
                                        <div class="tb-link ">{{item.author}}</div>
                                        <div class="tb-link ">{{item.count_chapter}} chương</div>
                                        <div class="continue">
                                            <div>Đọc truyện</div>
                                            <div class="icon">
                                                <v-icon class="ld ld-slide-ltr" color="#1b8ee0" size="20">mdi-chevron-right</v-icon>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </v-card>
                        </slide>
                        <hooper-navigation slot="hooper-addons"></hooper-navigation>
                    </hooper>

                </div>
            </section>
            <section class="box-center mt-6" v-if="newUpdate && newUpdate.length != 0">
                <h2 class="mb-2 text---lightColor">Truyện mới cập nhật</h2>

                <div class="mt-5">
                    <hooper :settings="hooperSettings" :wheelControl="false" class="small-navigation px-1">
                        <slide v-for="(item, index) in newUpdate" :key="`_recent-story-${index}`">
                            <v-card class="ma-1 mr-4 pa-0 transparent slide-story" elevation="4" @click="$router.push(`/story/${item.name}/${item.id}`)">
                                <div class=" pb-0">
                                    <div class="image">
                                        <img :src="getImageUrl(item.image)" width="100%" />
                                    </div>
                                    <div class="absolute-top">
                                        <v-chip :color="'#f11000'" label>
                                            {{item.finish ? 'Hoàn thành': 'Đang ra'}} 
                                        </v-chip>
                                    </div>
                                    <div class="information">
                                        <div class="name">{{item.name}}</div>
                                        <div class="tb-link ">{{item.author}}</div>
                                        <div class="tb-link ">{{item.count_chapter}} chương</div>
                                        <div class="continue">
                                            <div>Đọc truyện</div>
                                            <div class="icon">
                                                <v-icon class="ld ld-slide-ltr" color="#1b8ee0" size="20">mdi-chevron-right</v-icon>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </v-card>
                        </slide>
                        <hooper-navigation slot="hooper-addons"></hooper-navigation>
                    </hooper>

                </div>
            </section>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import {
    mapMutations,
    mapState
} from 'vuex';

import {
    Hooper,
    Slide,
    Navigation as HooperNavigation
} from 'hooper';

export default {
    components: {
        Hooper,
        Slide,
        HooperNavigation,
    },
    data() {
        return {
            nav: [{
                path: '/',
                text: 'Trang chủ'
            }],
            searchStory: {
                baseUrl: 'https://truyen.tangthuvien.vn/tim-kiem?term=',
                query: 'Vu sư',
                loading: false
            },
            resultSearch: [],
            voice: 'Vietnamese Female',
            slideIndex: 0,
            slides: [{
                    image: '/img/slide1.jpg',
                    url: 'story/Mục%20Thần%20Ký/17299'
                },
                {
                    image: '/img/slide2.jpg',
                    url: '/story/Phi%20Kiếm%20Vấn%20Đạo/17987'
                },
                {
                    image: '/img/slide3.jpg',
                    url: '/story/Phàm%20Nhân%20Tu%20Tiên%20Chi%20Tiên%20Giới%20Thiên/18229'
                },
                {
                    image: '/img/slide6.jpg',
                    url: '/story/Tam%20Thốn%20Nhân%20Gian/20640'
                }
            ],
            hooperSettings: {
                itemsToShow: 1,
                breakpoints: {
                    576: {
                        itemsToShow: 2
                    },
                    800: {
                        itemsToShow: 4
                    },
                }
            },

            news: null,
            finish: null,
            newUpdate: null
        }
    },
    mounted() {
        this.setNav(this.nav)
        this.setTopBackground('/img/top_background.jfif')
    },
    computed: {
        ...mapState('app', ['detectMobile', 'recentStories']),
        recent_stories: {
            get() {
                return this.recentStories
            },
            set(val) {
                this.recent_stories = val
            }

        }
    },
    created() {
        console.log(this.recentStories);

        this.init();

    },
    methods: {
        ...mapMutations('app', ['setNav', 'setTopBackground']),
        init: function () {
            this.$axios.get('/story/home')
                .then(rs => {
                    let {
                        data
                    } = rs;

                    this.news = data.data.story_news;

                    this.finish = data.data.story_finish;

                    this.newUpdate = data.data.story_starts;

                })
        },

        getSearchUrl: function () {
            return `${this.searchStory.baseUrl}${decodeURI(this.searchStory.query)}`;
        },
        playStory: function (text) {
            var parameters = {
                onstart: () => {
                    console.log("Voice started a a a");
                },
                onend: () => {
                    console.log("Voice ended b b b");
                }
            };

            responsiveVoice.cancel();
            responsiveVoice.speak(text, this.voice, parameters);
        },
        searchingStory: function () {
            this.playStory(this.searchStory.query);

            this.searchStory.loading = true;
            this.$axios.get(this.getSearchUrl())
                .then(rs => {
                    let {
                        data
                    } = rs;
                    console.log(data);
                    this.resultSearch = data;

                    this.searchStory.loading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.searchStory.loading = false;
                })

        },
        removeStoryResult: function (index) {
            this.resultSearch.splice(index, 1);
        },
        toStory: function (item) {

            this.$router.push(`/story/${item.name}/${item.id}`);
        },
        getImageUrl: function (url) {
            return imageUrl(url)
        }

    }
}
</script>

<style lang="scss" scoped>
.story-result {
    position: relative;
    width: 100%;
    margin-top: 12px;
    overflow-x: hidden;
    max-height: calc(100vh - 100px);
    padding-right: 8px;

    .story-content {
        position: relative;
        background: #2A3B4D;
        display: flex;
        margin: 0px 16px 12px;
        padding: 8px 24px 8px 16px;
        cursor: pointer;

        &:hover {
            background: rgba(118, 140, 163, 0.5);
        }

        .story-index {
            width: 40px;
        }

        .story-close {
            position: absolute;
            right: 16px;
            top: 7px;
            transition: 0.3s;

            &:hover i {
                color: #fff !important;
            }
        }
    }
}
</style>
