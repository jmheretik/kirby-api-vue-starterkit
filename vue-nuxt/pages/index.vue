<template>
  <main>
    <Intro :title="page.title" />

    <ul v-if="photography" class="grid">
      <li v-for="album in photography.children" :key="album.uri">
        <nuxt-link :to="'/' + album.uri">
          <figure>
            <span v-if="album.coverHome" v-html="album.coverHome.html" />

            <figcaption>
              <span>
                <span class="example-name">{{ album.title }}</span>
              </span>
            </figcaption>
          </figure>
        </nuxt-link>
      </li>
    </ul>
  </main>
</template>

<script>
import mergeAsyncData from 'nuxt-merge-asyncdata'
import page from '../mixins/page'
import { useKirby } from '../composables/use-kirby'

export default mergeAsyncData({
  mixins: [page],
  async asyncData({ app }) {
    return { photography: await useKirby().getPage('photography') }
  },
})
</script>

<style>
.grid {
  display: grid;
  list-style: none;
  grid-gap: 1rem;
  line-height: 0;
  grid-template-columns: repeat(1, 1fr);
  grid-auto-flow: dense;
}
.grid li {
  position: relative;
  --cols: 1;
  --rows: 1;

  overflow: hidden;
  background: #000;
  line-height: 0;
}
.grid li:first-child {
  --cols: 2;
  --rows: 2;
}
.grid li:nth-child(5) {
  --cols: 2;
}
.grid li:nth-child(6) {
  --rows: 2;
}
.grid li:nth-child(7) {
  --cols: 2;
}
.grid a {
  display: block;
  height: 10rem;
}
.grid img {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s;
}
.grid figcaption {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  color: #fff;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  line-height: 1;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.125em;
  font-weight: 600;
}

@media screen and (min-width: 45em) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .grid li {
    grid-column-start: span var(--cols);
    grid-row-start: span var(--rows);
  }
  .grid a {
    padding-bottom: 52.65%;
  }
}
</style>
