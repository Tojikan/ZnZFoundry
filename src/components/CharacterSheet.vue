<script lang="ts" setup>
import { ref, toRaw } from "vue";
import StatusBar from "./sections/StatusBar.vue";
const props = defineProps(['context', 'actor'])
console.log(toRaw(props));
console.log(toRaw(props.context));
console.log(toRaw(props.actor));


// const name = ref('World');

</script>

<template>
    <div>Hello {{props.actor.name}}!</div>
    <input type="text" name="name" v-model="props.actor.name" placeholder="Name"/>

    <StatusBar />
</template>

<style scoped>
    .test-all{
        display: block;
    }

</style>