<template>
<div class="chapter-wrapper" :class="{'dialog': dialog}">
    <div class="title_wrapper">
        <div class="title">Truyện có {{this.chapters.length}} chương: </div>
    </div>
    <loading-icon w="64" margin="40px auto 0" v-if="loading"></loading-icon>
    <div class="chapter-container relative" v-if="!loading">
        <v-tooltip top v-for="(item, i) in showChapters" :key="`chapter-${now}-${i}`" :id="`chapter-${now}-${i}`">
            <template v-slot:activator="{ on }">
                <div v-on="on" class="chapter-item text-truncate" :id="`js-chapter-${now}-${i}`" :class="{'chapter-divider' : item.type == 'divider', active: current == Number(item.chapterId)}" :chap="item.chapterId" @click="toChapter(item)">
                    {{item.title}}

                </div>
            </template>
            <span>{{item.title}}</span>
        </v-tooltip>

    </div>
    <div v-if="!loading && responsive > 1">

        <div class="mt-8 switch-page relative">
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-text-field v-on="on" class="no-hint" value="1" @keyup="checkNumber($event)" @blur="checkNumber($event)" @click="checkNumber($event)" @change="checkNumber($event)" id="switch_page" solo outlined dense flat append-icon="mdi-hand-pointing-right" v-on:click:append="goPage()" />
                </template>
                <span>Go Page</span>
            </v-tooltip>
        </div>
        <v-pagination v-model="page" class="mt-2 mb-6 small" total-visible="8" circle :length="getLength()"></v-pagination>
    </div>
    <div class="pagination mt-6 py-3" v-if="!loading && responsive == 1">
        <span class="pagination-title mr-1 fs-14">Chọn khoảng: </span>
        <v-chip class="tb-chip-small mr-1" color="green" v-for="(num, i) in Math.ceil(this.chapters.length / 75)" :key="`pagination-${now}-${i}`" @click="page = num">
            {{(num - 1) * 75 + 1}} - {{num * 75}}
        </v-chip>
    </div>
</div>
</template>

<script>
import {
    mapMutations,
    mapState
} from 'vuex';
export default {
    props: {
        story_id: {
            type: Number
        },
        story_url: {
            type: String
        },
        current: {
            type: Number,
            default: -1,
            required: false
        },
        dialog: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    data() {
        return {
            loading: true,
            chapters: [],
            showChapters: [],
            now: Date.now(),
            page: 1
        }
    },
    created() {
        this.init();

    },
    watch: {
        page: function (val) {
            if(val <= 0) this.page = 1;
            this.getShowChapter();

        }
    },
    computed: {
        ...mapState('app', ['responsive'])
    },
    methods: {
        init: function () {
            this.loading = true;

            this.$axios.get('/story/chapter', {
                    params: {
                        storyId: this.story_id
                    }
                })
                .then(rs => {
                    let {
                        data
                    } = rs;

                    this.chapters = data.data;

                    if (this.current != -1) {
                        let index = this.chapters.findIndex(it => it.chapterId == this.current);

                        this.page = Math.ceil(index / 75);

                        let that = this;


                        setTimeout(() => {
                            
                            if ($(`[chap=${that.chapters[index].chapterId}]`).length != 0) {

                                $('#js-dialog-chapter-content').animate({
                                    scrollTop: $(`[chap=${that.chapters[index].chapterId}]`).position().top - 100
                                }, 100);
                            }
                        }, 200);
                    }

                    this.getChapter();

                    this.getShowChapter();

                    this.loading = false;

                })

        },
        getShowChapter: function () {

            let sIndex = (this.page - 1) * 75;
            let eIndex = this.page * 75;

            this.showChapters = [...this.chapters.slice(sIndex, eIndex)];

        },

        getLength: function () {
            let length = Math.ceil(this.chapters.length / 75);
            return length > 0 ? length : 1;
        },
        checkNumber: function ($event) {
            let elem = document.getElementById('switch_page');

            if (!/\d+/gi.test($event.key)) {
                if (elem.value.length == 0) elem.value = 0;
            }
            elem.value = parseInt(elem.value);
            if (parseInt(elem.value) > this.chapters.length) {
                elem.value = this.chapters.length;
            }
            if (parseInt(elem.value) < 0) {
                elem.value = 0;
            }

            if ($event.key == 'Enter') {
                this.goPage();
            }

        },
        goPage: function () {
            let elem = document.getElementById('switch_page');
            let p = Number(parseInt(elem.value));

            let chapId = this.chapters[p - 1].chapterId;

            p = Math.ceil(p / 75);
            this.page = p > this.getLength() ? this.getLength() : p;

            setTimeout(() => {
                $('#js-dialog-chapter-content').animate({
                    scrollTop: $(`[chap=${chapId}]`).position().top
                }, 100);
            }, 200);

        },
        toChapter: function (item) {

            if (item.type == 'divider') return;
            this.$router.push(`/read/story/${this.story_url}/${item.href}/${item.chapterId}`);
        },
        getChapter: function () {
            this.$emit('getChapter', this.chapters);
        }
    }
}
</script>

<style lang="scss" scoped>
.switch-page {
    width: 120px;
    margin: auto;
}
</style>
