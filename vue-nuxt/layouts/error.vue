<template>
  <main>
    <Intro :title="page.title" />

    <div v-if="page.text" class="text" v-html="page.text.html" />
  </main>
</template>

<script>
import page from '../mixins/page'

export default {
  layout: 'default',
  mixins: [page],
  props: ['error'],
  created() {
    this.page = process.env.isStatic ? process.env.errorPage : this.error.page
  },
}
</script>

<style scoped>
.text {
  max-width: 35rem;
  margin: 0 auto;
}
</style>
