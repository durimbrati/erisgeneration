

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
      document.body.classList.remove('dark-mode', 'blue-mode', 'blue2-mode','blue3-mode');
      const selected = e.target.value;

      if (selected === 'dark') {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
      } else if (selected === 'blue') {
        document.body.classList.add('blue-mode');
        localStorage.setItem('theme', 'blue-mode');
      } else if (selected === 'blue2') {
        document.body.classList.add('blue2-mode');
        localStorage.setItem('theme', 'blue2-mode');
      }
       else if (selected === 'blue3') {
        document.body.classList.add('blue3-mode');
        localStorage.setItem('theme', 'blue3-mode');
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
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menu-toggle');
  const navbar = document.querySelector('.navbar');

  if (toggle && navbar) {
    toggle.addEventListener('click', () => {
      navbar.classList.toggle('open');
    });
  }
});
document.querySelectorAll('#main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar.classList.contains('open')) {
      navbar.classList.remove('open');
    }
  });
});
document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(e.target);

  fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      location: formData.get('location'),
      message: formData.get('message')
    })
  })
  .then(res => res.json())
  .then(data => {
    showNotification('Thanks for getting in touch! We’ve received your message and will be in contact soon. In the meantime, feel free to explore our services or follow us on social media.', 'success');
    // alert(data.message);
    e.target.reset();
  })
  .catch(err => {
    console.error('Contact form error:', err);
     showNotification(
  "We couldn’t send your message at this time. Please reach out to us by phone or through our social media channels — we're here to help!",
  "error"
);

  });
});

function showNotification(message, type = 'success') {
  const container = document.getElementById('notification-container');
  const note = document.createElement('div');
  note.className = `notification ${type}`;
  note.textContent = message;
  container.appendChild(note);
  setTimeout(() => note.remove(), 4000);
}
// document.querySelector("form").addEventListener("submit", function (e) {
//   e.preventDefault();
//   alert("Thanks for reaching out! We'll get back to you soon.");
// });
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



