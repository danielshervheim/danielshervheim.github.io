<template>
  <div class="index">

    <TileContainer
      :tile-data="items"
    />
    
    <!-- Required to force Nuxt to generate routes for them. -->
    <ul hidden>
      <li v-for="page in allPages" :key="page.path">
        <a :href="page.path">{{page.path}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import TileContainer from '../components/TileContainer'

export default {
  name: 'Index',
  components: {
    TileContainer
  },
  data: function () {
    return {
      category: 'all'
    }
  },
  async asyncData ({ $content }) {
    const allPages = await $content('', { deep: true }).only(['path', 'title', 'order', 'hide', 'image']).fetch()

    for (const page of allPages) {
      if (!page.title) {
        page.title = 'Untitled'
      }

      if (!page.image) {
        page.image = '/placeholder.jpg'
      }
    }

    return {
      allPages
    }
  },
  computed: {
    displayedPages: function () {
      return this.allPages.filter(p => !p.hide && p.path)
    },
    projects: function () {
      return this.displayedPages
        .filter(p => p.path.startsWith('/projects/'))
        .sort((p1, p2) => (p1.order || this.displayedPages.length) - (p2.order || this.displayedPages.length))

    },
    coursework: function () {
      return this.displayedPages
        .filter(p => p.path.startsWith('/coursework/'))
        .sort((p1, p2) => (p1.order || this.displayedPages.length) - (p2.order || this.displayedPages.length))
    },
    items: function () {
      return this.projects.concat(this.coursework)
        .sort((p1, p2) => (p1.order || this.displayedPages.length) - (p2.order || this.displayedPages.length))
    }
  }
}
</script>