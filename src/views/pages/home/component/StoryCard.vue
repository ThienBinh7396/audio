<template
  ><v-card
    class="ma-1 mr-4 pa-0 transparent slide-story"
    elevation="4"
    @click="$router.push(`/story/${data.name}/${data.id}`)"
  >
    <div class=" pb-0">
      <div class="image">
        <img :src="getTtvWebImageUrl(data.image)" width="100%" />
      </div>
      <div class="absolute-top">
        <v-chip :color="data.finish ? 'green' : '#1b8ee0'" label>
          {{ data.finish ? "Hoàn thành" : data.count_chapter + " chương" }}
        </v-chip>
      </div>
      <div class="information">
        <div class="name">{{ data.name }}</div>
        <div class="tb-link ">{{ data.author }}</div>
        <div class="tb-link ">{{ data.count_chapter }} chương</div>
        <div class="continue">
          <div>Đọc truyện</div>
          <div class="icon">
            <v-icon class="ld ld-slide-ltr" color="#1b8ee0" size="20"
              >mdi-chevron-right</v-icon
            >
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
    },
  },
};
</script>

<style></style>
