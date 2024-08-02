const isDarkTheme = () => {
  console.log('local storage: ', localStorage.getItem('theme'))
  console.log('prefers: ', window.matchMedia('(prefers-color-scheme: dark)').matches)
  if (localStorage.getItem('theme') === 'light' || window.matchMedia('(prefers-color-scheme: light)').matches) {
    return false
  }
  return true
}

export default isDarkTheme
