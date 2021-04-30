<template>
  <div
    class="fixed top-0 left-0 w-screen h-4 xl:px-36 lg:px-20 md:px-8 px-4 py-8 flex items-center justify-between"
  >
    <div class="flex align-center justify-start text-xl leading-none">
      <icon-instagram class="mx-2 ml-0" />
      <icon-github class="mx-2" />
      <span class="hidden mx-2 mr-0 md:inline-block">@skadewdl3</span>
    </div>
    <div class="">
      <ul
        class="navbar__links flex align-center justify-end text-xl leading-none"
      >
        <li class="navbar__link mx-2 ml-0">Projects</li>
        <li class="navbar__link mx-2">Skills</li>
        <li class="navbar__link mx-2 mr-0">Blogs</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>
