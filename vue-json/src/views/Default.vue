<template>
  <main>
    <Intro :title="page.title" />

    <div class="text" v-html="page.text.html" />
  </main>
</template>

<script>
import { usePage } from '../composables/use-page'
import Intro from '../components/Intro'

export default {
  name: 'Default',
  components: { Intro },
  setup: async () => ({ page: await usePage() })
}
</script>

<style scoped>
.text {
  max-width: 35rem;
  margin: 0 auto;
}
</style>
