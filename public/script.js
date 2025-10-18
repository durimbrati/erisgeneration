

// document.getElementById('theme-toggle').addEventListener('click', () => {
  // document.body.classList.toggle('dark-mode');
// });
document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('theme-selector');
  const savedTheme = localStorage.getItem('theme');

  // Apply saved theme on load
  if (savedTheme) {
    document.body.classList.add(savedTheme);
    if (selector) selector.value = savedTheme.replace('-mode', '');
  }

  // Listen for changes
  if (selector) {
    selector.addEventListener('change', (e) => {
      document.body.classList.remove('dark-mode', 'blue-mode');
      const selected = e.target.value;

      if (selected === 'dark') {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
      } else if (selected === 'blue') {
        document.body.classList.add('blue-mode');
        localStorage.setItem('theme', 'blue-mode');
      } else {
        localStorage.removeItem('theme');
      }
    });
  }
});

// document.getElementById('theme-selector').addEventListener('change', (e) => {
  // document.body.classList.remove('dark-mode', 'blue-mode');
  // if (e.target.value === 'dark') {
    // document.body.classList.add('dark-mode');
  // } else if (e.target.value === 'blue') {
    // document.body.classList.add('blue-mode');
  // }
// });
// document.addEventListener('DOMContentLoaded', () => {
  // const selector = document.getElementById('theme-selector2');
  // if (selector) {
    // selector.addEventListener('change', (e) => {
      // document.body.classList.remove('dark-mode', 'blue-mode');
      // if (e.target.value === 'dark') {
        // document.body.classList.add('dark-mode');
      // } else if (e.target.value === 'blue') {
        // document.body.classList.add('blue-mode');
      // }
    // });
  // } else {
    // console.warn('Theme selector not found');
  // }
// });
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Thanks for reaching out! We'll get back to you soon.");
});
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('nav a').forEach(el => el.classList.remove('active'));
    link.classList.add('active');
  });
});
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}` || link.getAttribute('href') === `index.html#${current}`) {
      link.classList.add('active');
    }
  });
});



