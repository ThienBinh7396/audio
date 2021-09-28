<template>
<div id="notfound">
    <div class="notfound">
        <div class="notfound-404">
            <h1>Oops!</h1>
            <h2>404 - The Page can't be found</h2>
        </div>
        <router-link to="/home">Go TO Homepage</router-link>
        <link href="https://fonts.googleapis.com/css?family=Gelasio|Montserrat&display=swap" rel="stylesheet">
    </div>
</div>
</template>

<script>
export default {
    created() {
        document.title = `404 - The Page can't be found`
    },
}
</script>

