<template>
  <Error v-if="!doc" />
  <article
    v-else
    class="page"
  >
    <nuxt-content :document="doc" />
  </article>
</template>

<script>
import Error from '../components/Error'

export default {
  components: {
    Error
  },
  transition: {
    name: 'slide-fade',
    mode: 'out-in'
  },
  async asyncData ({ $content, params }) {
    const path = `/${params.pathMatch || 'index'}`
    const docs = await $content({ deep: true }).where({ path }).fetch()
    try {
      return {
        doc: docs[0]
      }
    } catch (err) {
      return {
        doc: null
      }
    }
  }
}
</script>

<style scoped>
.page {
  width: 100%;
  max-width: var(--article-width);
  margin: 0px auto;
}
</style>
