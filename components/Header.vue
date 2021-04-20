<template>
  <header
    class="header"
    aria-label="Navigation"
  >
    <div class="header-item title">
      <NuxtLink to="/">
        <h1>Daniel Shervheim</h1>
      </NuxtLink>
    </div>

    <div class="header-item expander" />

    <div class="header-item nav-item">
      <NuxtLink to="/">
        Home
      </NuxtLink>
    </div>

    <div class="header-item nav-item">
      <NuxtLink to="/about">
        About
      </NuxtLink>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
  .header {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    margin: 0px auto 60px;
    padding: 30px 0px;
    border-bottom: 1px solid #eeeeee;
  }

  .title a {
    color: #24292e;
    transition: color 0.2s ease;
    text-decoration: none;
  }

  .title a:hover {
    color: #0365d6;
  }

  .title h1 {
    border-bottom: none;
    padding-bottom: 0px;
  }

  .expander {
    flex-grow: 1;
  }

  .nav-item {
    margin-right: 1em;

    font-size: 12px;
    text-transform: uppercase;
  }

  .nav-item:last-of-type {
    margin-right: 0em;
  }

  @media only screen and (max-width: 768px) {
    .header {
      display: block;
      text-align: center;
    }

    .header-item {
      margin-bottom: 1em;
    }

    .header-item:last-of-type {
      margin-bottom: 0em;
    }

    .nav-item {
      margin-right: 0em;
    }

    .expander {
      display: none;
    }
  }
</style>
