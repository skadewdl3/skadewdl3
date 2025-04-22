// src/directives/visible-only.js
export default (load, options, element) => {
  const observer = new IntersectionObserver((entries) => {
    const [entry] = entries
    if (entry.isIntersecting) {
      observer.disconnect()
      load()
    }
  })

  observer.observe(element)

  return {
    destroy() {
      observer.disconnect()
    },
  }
}
