<template>
<div class="preload-wrapper">
    <div class="loadingio-spinner-bean-eater-orvmqd49jl mx-auto" >
        <div class="ldio-3882ls1jz1e">
            <div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </div>

</div>
</template>

<script>
export default {
    mounted(){
        setTimeout(() => {
            let div = document.querySelector('.preload-wrapper');
            if(div){
                div.classList.add('hide');
            }
        }, 1500);
    }
}
</script>

<style>

</style>
