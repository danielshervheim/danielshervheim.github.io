<template>
  <div
    class="tile"
    :class="{ 'overlay': overlayTitle }"
  >
    <NuxtLink
      :to="path"
      class="image-container"
    >
        <img
          :src="src"
          :alt="title"
        />
    </NuxtLink>
    <NuxtLink
      :to="path"
      class="caption-container"
    >
      <div
        class="caption"
      >
        {{ title }}
      </div>
    </NuxtLink>
  </div>
</template>

<script>
export default {
  name: 'Tile',
  props: {
    src: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    overlayTitle: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style scoped>
.caption {
  text-align: center;
  margin-top: 0.25em;
}

/* https://stackoverflow.com/questions/52742466/detect-if-a-client-device-supports-hover-and-focus-states */
/* Primary input device can hover with ease */
@media (hover: hover) {
  .overlay {
    position: relative;
    display: block;
  }

  .overlay a {
    text-decoration: none;
    color: #ffffff;
  }

  .overlay .caption-container {
    position: absolute;
    top: 0; right: 0;
    bottom: 0; left: 0;

    display: flex;
    justify-content: space-around;
    align-items: center;

    opacity: 0;

    transition: all 0.125s ease;
    -webkit-transition: all 0.125s ease;
    -moz-transition: all 0.125s ease;
    -o-transition: all 0.125s ease;
  }

  .overlay:hover .caption-container {
    opacity: 1;
    background-color: rgba(0,0,0,0.666);
  }

  .overlay .caption {
    display: block;
    margin-top: 0px;

    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.05em;
  }
}
</style>
