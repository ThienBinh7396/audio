<template>
<div class="pl-3 pt-3 pb-6">
    <div class="d-flex align-baseline pr-2">
        <v-text-field label="Tìm kiếm gì đó..." outlined prepend-inner-icon="mdi-magnify" color="#aaa" @keyup="searchStory()" v-model="query" solo dense></v-text-field>
        <v-progress-circular class="ml-2 d-block" width="2" size="23" indeterminate v-if="loading" color="primary"></v-progress-circular>
        <v-icon class="ml-1" v-if="!loading" size="26" color="#ccc" @click="closeSearchDialog()">mdi-close</v-icon>
    </div>
    <perfect-scrollbar class="story-result pr-1">
        <div v-for="(item, i) in stories" :key="`search-story-${i}`">
            <div class="story-result-item pl-1" v-if="item.type == 'story'" v-ripple :loading="loading" @click="toStory(item)">
                <div class="search-story-title">{{item.name}}</div>
                <div class="search-story-author">{{item.author}}</div>
                <div class="search-story-amount-chapter">{{item.number}} chương</div>
            </div>
        </div>
    </perfect-scrollbar>
</div>
</template>

<script>
import {
    mapMutations,
    mapActions
} from 'vuex'
export default {
    data() {
        return {
            stories: [],
            query: '',
            loading: false
        }
    },
    created() {

    },
    methods: {
        ...mapActions('app', ['showToast']),
        ...mapMutations('app', ['setShowSearch']),
        searchStory: function () {
            if (!this.query || this.query.trim() == '') {
                this.showToast({
                    type: 'warning',
                    text: 'Type something...'
                })
                return;
            }
            this.loading = true;

            this.$axios.get('/story/search', {
                    params: {
                        query: this.query
                    }
                })
                .then(rs => {
                    let {
                        data
                    } = rs;

                    this.stories = data.data;
                    this.loading = false;
                })
        },
        toStory: function (item) {

            this.$router.push(`/story/${item.name}/${item.id}`);
        },
        closeSearchDialog: function(){
            this.setShowSearch(false);
        }
    }
}
</script>

<style>

</style>
