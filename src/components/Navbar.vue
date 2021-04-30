<template>
  <div class="navbar">
    <div class="navbar__left">
      <div class="navbar__logo">
        <div class="navbar__logo__icon"><icon-instagram /></div>
        <div class="navbar__logo__icon"><icon-github /></div>
        <div class="navbar__logo__text">@skadewdl3</div>
      </div>
    </div>
    <div class="navbar__right">
      <ul class="navbar__links">
        <li class="navbar__link">Projects</li>
        <li class="navbar__link">Skills</li>
        <li class="navbar__link">Blogs</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped lang="stylus">
.navbar
  position fixed
  top 0
  left 0
  width 100%
  height NAVBAR_HEIGHT
  padding 1rem 2rem
  display flex
  align-items center
  justify-content space-between

  &__logo
    display flex
    align-items center
    justify-content flex-start
    font-size 2rem
    div
      margin 0 1rem
      &:first-child
        margin-left 0
      &:last-child
        margin-right 0
  &__links
    list-style none
    display flex
    align-items center
    justify-content flex-end

  &__link
    color TEXT_COLOR
    padding 1rem 2rem
    font-size 2rem
</style>
