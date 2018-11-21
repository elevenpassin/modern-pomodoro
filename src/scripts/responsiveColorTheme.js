if ('ondevicelight' in window) {
  window.addEventListener('devicelight', (event) => {
    const body = document.querySelector('body');

    if (event.value < 50) {
      body.classList.remove('default_theme');
      body.classList.add('dark_theme');
    } else {
      body.classList.remove('dark_theme');
      body.classList.add('default_theme');
    }
  })
}