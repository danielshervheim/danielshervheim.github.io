<template>
  <div class="app markdown-body">
    <Header />
    <main
      class="content"
      aria-label="Content"
    >
      <Nuxt />
    </main>
  </div>
</template>

<script>
import Header from '../components/Header'

export default {
  components: {
    Header
  },
  transition: {
    name: 'slide-fade',
    mode: 'out-in',
    appear: true
  }
}
</script>

<style scoped>
.app {
  width: calc(100% - calc(2 * var(--spacing)));
  max-width: var(--content-width);
  margin: 0px auto 60px;
}
</style>
