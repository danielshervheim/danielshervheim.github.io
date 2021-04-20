<template>
  <div
    class="tile-container"
  >
    <masonry
      :cols="{default: 3, 1050: 2, 768: 1}"
      :gutter="{default: 25, 768: 0}"
    >
      <Tile
        v-for="tile in tileData"
        :key="tile.title"
        class="tile"
        :src="tile.image"
        :title="tile.title"
        :path="tile.path"
        :overlay-caption="true"
      />
    </masonry>
  </div>
</template>

<script>
import Tile from './Tile'

export default {
  name: 'TileContainer',
  components: {
    Tile
  },
  props: {
    columns: {
      type: Number,
      required: false,
      default: 3
    },
    tileData: {
      type: Array,
      required: true,
      validator (obj) {
        for (const tile of obj) {
          if (!('image' in tile && 'title' in tile && 'path' in tile)) {
            return false
          }
        }
        return true
      }
    }
  },
  computed: {
    styleObject () {
      return {
        '--n-cols': this.columns
      }
    }
  }
}
</script>

<style scoped>
  .tile {
    margin-bottom: 25px;
  }
</style>
