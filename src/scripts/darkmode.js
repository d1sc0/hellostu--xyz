document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('darkmode-toggle');
  toggle?.addEventListener('click', function (e) {
    e.preventDefault();
    document.body.classList.toggle('dark-mode');
    // Optionally, save preference:
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });

  // On load, set theme from localStorage
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
});
