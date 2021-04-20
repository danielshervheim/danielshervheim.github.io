<template>
  <div class="404">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.message }}</p>
    <NuxtLink to="/">Take me home.</NuxtLink>
  </div>
</template>

<script>
export default {
    props: {
        error: {
            type: Object,
            required: false,
            default: function () {
                return {
                    statusCode: 404,
                    message: "There's nothing here."
                }
            }
        }
    }
}
</script>