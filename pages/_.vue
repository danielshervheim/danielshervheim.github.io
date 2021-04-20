<template>
  <article
    class="page"
  >
    <nuxt-content :document="doc" />
  </article>
</template>

<script>
export default {
  async asyncData ({ $content, params, error }) {
    const path = `/${params.pathMatch || 'index'}`
    const docs = await $content({ deep: true }).where({ path }).fetch()
    if (docs.length >= 1 && docs[0]) {
      return {
        doc: docs[0]
      }
    }

    return error({
      statusCode: 404,
      message: "There's nothing here."
    })
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
