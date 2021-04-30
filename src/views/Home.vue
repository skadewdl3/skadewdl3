<template>
  <Navbar />
  <About />
</template>

<script>
import Navbar from '@/components/Navbar'
import About from '@/components/About'

export default {
  name: 'Home',
  components: {
    Navbar,
    About
  }
}
</script>
