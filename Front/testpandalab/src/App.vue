<script>
import MainPage from './views/MainPage.vue';

export default {
  components: {
    MainPage,
  },
};
</script>

<template>
  <v-app class="app-dark-gray">
    <v-main>
      <MainPage />
    </v-main>
  </v-app>
</template>

<style>
  .app-dark-gray {
    background-color: #FC4445 !important;
  }
</style>