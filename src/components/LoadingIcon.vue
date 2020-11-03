<template>
<div class="loadingio-spinner-spinner" :style="{'margin': margin}">
    <div class="ldio-479jhicafvm" :style="{'transform': `scale(${scale})`}">
        <div v-for="(i) in 12" :key="`loading-item-${now}-${i}`" :style="{background: color}"></div>
        
    </div>
</div>
</template>

<script>
export default {
    name: 'LoadingIcon',
    props: {
        w: {
            required: true,
            type: String,
            default: '200'
        },
        margin: {
            type: String,
            default: ''
        },
        color: {
            type: String,
            default: '#85a2b6',
            required: false
        }
    },
    data() {
        return {
            scale: 1,
            now: Date.now()
        }

    },
    created() {
        this.scale = Number(this.w) / 200
    }
}
</script>
