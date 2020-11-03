<template>
<v-row>
    <v-col cols="12">
        <loading-icon w="82" margin="160px auto 0" v-if="loading"></loading-icon>
        <loading-circular-dialog :show="loadingNewChapter" />

        <div class="d-none">
            <audio :src="speechSrc" id="speech-audio" @loadstart="loadstart()" @error="error()" @ended="ended()" />
        </div>

        <div class="dialog-chapter" :class="{show: dialog}" v-if="!loading">
            <div class="dialog-chapter-overplay" @click="dialog = false" />
            <v-card class="dialog-chapter-content">
                <chapter :dialog="true" @getChapter="getChapters" :current="Number(chapter_id)" :story_id="storyInfo.id" :story_url="storyInfo.url_story" />
            </v-card>
        </div>

        <div class="chapter px-0 px-md-5 px-lg-10" v-if="!loading">
            <h1 class="mt-2 text-center">{{storyInfo.title_story}}</h1>
            <div class="title text-center">{{storyInfo.chapter}}</div>
            <div class="chapter-content mt-12 mb-12">
                <p :class="{active: reading && index == currentLine }" @click="startSpeakLine(index)" class="px-3" v-for="(line, index) in storyInfo.content" :key="`line-${index}`" :id="`js-line-${index}`" v-html="line">
                </p>
            </div>
            <div class="control-box d-flex justify-space-between px-6  mt-4 mb-12">
                <v-btn outlined @click="prevChapter()" v-if="getIndex() != 0">
                    <v-icon class="mr-1">mdi-arrow-left</v-icon>
                    Previous
                </v-btn>
                <v-btn outlined @click="nextChapter()" v-if="getIndex() != chapters.length - 1">
                    Next
                    <v-icon class="ml-1">mdi-arrow-right</v-icon>
                </v-btn>
            </div>
        </div>

        <div class="button-action-group">
            <div class="button-action-scroll mb-3">
                <v-tooltip left>
                    <template v-slot:activator="{ on }">
                        <transition name="slide" mode="out-in">
                            <v-btn color="#F44336" small dark fab v-on="on" @click="scrollToTop()">
                                <v-icon class="ld ld-jump" :class="{'mt-1': scrollTop <= 180 }">{{scrollTop > 180 ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon>
                            </v-btn>
                        </transition>
                    </template>
                    <span>Về đầu trang</span>
                </v-tooltip>
            </div>
            <div class="button-action-dialog mb-6">
                <v-tooltip left>
                    <template v-slot:activator="{ on }">
                        <transition name="slide" mode="out-in">
                            <v-btn color="orange" small dark fab v-on="on" @click="dialog = true">
                                <v-icon>mdi-format-list-bulleted</v-icon>
                            </v-btn>
                        </transition>
                    </template>
                    <span>Danh sách chương</span>
                </v-tooltip>
            </div>
            <div class="button-action-read">
                <v-tooltip left>
                    <template v-slot:activator="{ on }">
                        <transition name="slide" mode="out-in">
                            <v-btn class="size-default " :color="reading ? 'black': 'blue darken-2'" dark fab v-on="on" @click="startSpeak()">
                                <radio-gif width="32" v-if="reading" style="margin-right: -2px; margin-top: -2px" />
                                <v-icon v-if="!reading">mdi-headphones-settings</v-icon>
                            </v-btn>
                        </transition>
                    </template>
                    <span>{{ reading ? 'Pause' : 'Listen'}}</span>
                </v-tooltip>
            </div>
        </div>

    </v-col>
</v-row>
</template>

<script>
import {
    mapActions,
    mapMutations
} from 'vuex';

export default {
    components: {
        Chapter: () =>
            import('@/views/partials/Chapters'),
    },
    data() {
        return {
            dialog: false,
            story_url: '',
            chapter_url: '',
            chapter_id: -1,
            storyInfo: {},
            chapters: [],
            loading: false,
            loadingNewChapter: false,
            currentLine: 0,
            reading: false,
            voice: 'Vietnamese Female',
            scrollTop: 0,
            speechSrc: ''
        }
    },
    created() {
        this.init();

    },
    watch: {
        $route: function (val) {
            this.dialog = false;

            this.init();
        }
    },
    methods: {
        ...mapMutations('app', ['setNav']),
        ...mapActions('app', ['showToast']),
        init: function () {
            let {
                story_url,
                chapter_url,
                chapter_id
            } = this.$route.params;

            this.story_url = story_url;
            this.chapter_url = chapter_url;
            this.chapter_id = chapter_id;

            this.loading = true;
            this.loadContent();
        },
        loadContent: function () {
            this.$axios.get(`/story/read`, {
                    params: {
                        story_url: this.story_url,
                        chapter_url: this.chapter_url
                    }
                })
                .then(rs => {
                    let {
                        data
                    } = rs;

                    this.loading = false;
                    this.loadingNewChapter = false;

                    let contents = data.data.content.split(/\n+/);

                    data.data.content = contents;

                    this.storyInfo = data.data;
                    this.currentLine = 0;

                    this.setNav([{
                            path: '/',
                            text: 'Trang chủ'
                        },
                        {
                            path: `/story/${this.storyInfo.url_story}/${this.storyInfo.id}`,
                            text: this.storyInfo.title_story
                        },
                        {
                            path: ``,
                            text: this.storyInfo.chapter
                        },

                    ])

                    window.history.replaceState({}, "", `/read/story/${this.story_url}/${this.chapter_url}/${this.chapter_id}`);

                    this.scrollToTop(true);

                    if (this.reading) this.speak();
                })
        },
        select: function () {
            let selectText = '';

            if (window.getSelection) {
                console.log(window.getSelection);
                selectText = window.getSelection().toString();
            } else if (document.selection) {
                console.log(document.selection);
                selectText = document.selection.createRange().text;
            }

            if (selectText.length != 0) {
                this.speak(selectText, false);
            }

        },
        startSpeak: function () {
            let audio = document.getElementById('speech-audio');
            this.reading = !this.reading;

            if (this.reading) {
                if (this.speechSrc) {
                    audio.play();

                } else {
                    this.speak();

                }

            } else {

                audio.pause();
            }
        },
        loadstart: function () {
            let audio = document.getElementById('speech-audio');
            audio.play();
        },
        ended: function () {
            this.next();
        },
        error: function () {
            if (this.speechSrc) {

                setTimeout(() => {
                    let audio = document.getElementById('speech-audio');
                    audio.load();
                }, 1000);
            }
        },
        speak: function () {
            //responsiveVoice.cancel();

            if (this.storyInfo.content[this.currentLine].trim() == "") {
                this.next();
                return;
            }

            let audio = document.getElementById('speech-audio');
            audio.pause();
            audio.currentTime = 0;

            this.$axios.post('/textToSpeech', {
                    type: 'vnspeech', // ex: fpt, google,
                    text: this.storyInfo.content[this.currentLine],
                })
                .then(rs => {
                    let {
                        data
                    } = rs;

                    if (data.Url == '') {
                        this.showToast({
                            type: 'error',
                            text: 'Load faild. Click line again!'
                        });
                        return;
                    }
                    this.speechSrc = data.Url;

                    this.scrollText();

                    setTimeout(() => {
                        audio.load();

                        audio.play();

                    }, 200);

                })
                .catch(err => {
                    this.showToast({
                        type: 'error',
                        text: 'Load faild. Click line again!'
                    })
                })

            // responsiveVoice.speak(this.storyInfo.content[this.currentLine], this.voice, {
            //     rate: 1.2,
            //     onstart: () => {
            //         this.scrollText();
            //     },
            //     onerror: (err) => {
            //         console.log(err);
            //     },
            //     onend: () => {
            //         this.next();
            //     }
            // });
        },
        startSpeakLine: function (index) {
            if (this.reading) {
                this.currentLine = index;
                this.speak();
            }
        },
        next: function () {
            this.currentLine++;

            if (this.currentLine == this.storyInfo.content.length) {
                console.log('End chapter');

                this.nextChapter();

                return;
            }

            this.speak();
        },

        nextChapter: function () {
            this.loadingNewChapter = true;

            if (this.chapters.length == 0) {
                this.showToast({
                    type: 'info',
                    text: 'Chương cuối!'
                });

                this.loadingNewChapter = false;
                return;
            }
            let index = this.getIndex();

            if (index != this.chapters.length - 1) {
                this.chapter_id = this.chapters[index + 1].chapterId;
                this.chapter_url = this.chapters[index + 1].href;

                this.loadContent();
            } else {
                this.showToast({
                    type: 'info',
                    text: 'Chương cuối!'
                })
            }
            console.log(this.chapter_id, index);

        },
        prevChapter: function () {
            this.loadingNewChapter = true;

            if (this.chapters.length == 0) {
                this.showToast({
                    type: 'info',
                    text: 'Chương cuối!'
                });

                this.loadingNewChapter = false;
                return;
            }
            let index = this.getIndex();

            if (index != 0) {
                this.chapter_id = this.chapters[index - 1].chapterId;
                this.chapter_url = this.chapters[index - 1].href;

                this.loadContent();
            } else {
                this.showToast({
                    type: 'info',
                    text: 'Chương đầu tiên. Không thể trở về!'
                })
            }
            console.log(this.chapter_id, index);

        },
        scrollText: function () {

            let objDiv = document.getElementById(`js-line-${this.currentLine}`);
            if (!objDiv) return;

            app.scrollTop = objDiv.offsetTop - 200;
        },
        scrollToTop: function (onlyTop) {
            let app = document.getElementById(`app`);
            if (onlyTop) {
                app.scrollTop = 0;
                return;
            }

            let height = document.getElementById(`main-content`).offsetHeight;
            app.scrollTop = this.scrollTop > 180 ? 0 : height;

        },
        getChapters: function (chaps) {
            this.chapters = chaps;
        },
        getIndex: function () {
            return this.chapters.findIndex(it => it.chapterId == this.chapter_id);
        }
    },
    mounted() {
        // responsiveVoice.speak('123', this.voice, {
        //     volume: 0
        // });

        let app = document.getElementById('app');

        app.addEventListener('scroll', () => {
            this.scrollTop = app.scrollTop;
        })

        window.addEventListener('keyup', (event) => {
            if (event.keyCode == 37) {
                this.prevChapter();
            }
            if (event.keyCode == 39) {
                this.nextChapter();
            }
        })
    },
    destroyed() {
        //responsiveVoice.cancel();
    }
}
</script>

<style lang="scss" scoped>
.title {
    color: #4f9bd2;
}

.chapter .chapter-content p {
    font-size: 24px;
    color: #dfdfdf;
    cursor: pointer;
}

.chapter .chapter-content p.active {
    background: #2e638a;
    color: #fff;
}
</style>
