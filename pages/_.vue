<template>
  <article
    class="page"
  >
    <nuxt-content v-if="doc" :document="doc" />
  </article>
</template>

<script>
export default {
  async asyncData ({ $content, params, redirect }) {
    const path = `/${params.pathMatch || 'index'}`
    const docs = await $content({ deep: true }).where({ path }).fetch()
    if (docs.length >= 1 && docs[0]) {
      return {
        doc: docs[0]
      }
    }

    console.log('nothing here')
    redirect('/404')
    // return error({
    //   statusCode: 404,
    //   message: "There's nothing here."
    // })
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
