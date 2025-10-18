let projects = [];
let editingIndex = null;
let password = "eris2024"; // Replace with your actual password
let currentUser = '';


async function handleLogin() {
  const username = document.getElementById('admin-username').value.trim();
  const password = document.getElementById('admin-password').value;

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.success) {
      currentUser = data.user;
      localStorage.setItem('loggedInUser', currentUser);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('loginTimestamp', Date.now().toString());

      document.querySelector('.admin-login-container').style.display = 'none';
      document.getElementById('admin-dashboard').style.display = 'block';
      document.getElementById('admin-header').style.display = 'flex';
      document.querySelector('#logged-user strong').textContent = currentUser;

      loadProjects();
    } else {
      showNotification(data.message, 'error');
    }
  } catch (err) {
    showNotification('Login failed', 'error');
  }
}

// async function handleLogin() {
//   const username = document.getElementById('admin-username').value.trim();
//   const password = document.getElementById('admin-password').value;

//   try {
//     const res = await fetch('/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ username, password })
//     });

//     const data = await res.json();
//     if (data.success) {
//       currentUser = data.user;
//       localStorage.setItem('loggedInUser', currentUser);
//       localStorage.setItem('loginTimestamp', Date.now().toString());
//       document.querySelector('.admin-login-container').style.display = 'none';
//       document.getElementById('admin-dashboard').style.display = 'block';
//       document.getElementById('admin-header').style.display = 'flex';
//       document.querySelector('#logged-user strong').textContent = currentUser;

//        loadProjects();
//     } else {
//       showNotification(data.message, 'error');
//     }
//   } catch (err) {
//     showNotification('Login failed', 'error');
//   }
// }

function logout() {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('loginTimestamp');
  localStorage.removeItem('authToken', data.token);
  currentUser = '';
  document.getElementById('admin-dashboard').style.display = 'none';
  document.querySelector('.admin-login-container').style.display = 'flex';
  document.getElementById('admin-header').style.display = 'none';
}

// function validateLogin() {
//   const input = document.getElementById('admin-password').value;
//   if (input === password) {
//     document.querySelector('.admin-login-container').style.display = 'none';
//     document.getElementById('admin-dashboard').style.display = 'block';
//     loadProjects();
//   } else {
//     document.getElementById('login-error').textContent = 'Incorrect password';
//   }
// }
function showNotification(message, type = 'success') {
  const container = document.getElementById('notification-container');
  const note = document.createElement('div');
  note.className = `notification ${type}`;
  note.textContent = message;
  container.appendChild(note);
  setTimeout(() => note.remove(), 4000);
}

// function loadProjects() {
//   fetch('/api/projects')
//     .then(res => res.json())
//     .then(data => {
//       projects = data;
//       renderProjects();
//     });
// }
function loadProjects() {
  fetch('/api/projects')
    .then(res => {
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error('Invalid project data format');
      }

      // Sort: featured first, then by updatedAt (latest first)
      projects = data.sort((a, b) => {
        if (a.featured !== b.featured) {
          return b.featured - a.featured;
        }

        const dateA = new Date(a.lastUpdated || 0);
        const dateB = new Date(b.lastUpdated || 0);
        return dateB - dateA;
      });

      renderProjects();
    })
    .catch(err => {
      console.error('Error loading projects:', err);
      showNotification(`Failed to load projects: ${err.message}`);
    });
}


// function renderProjects() {
//   const container = document.getElementById('projects-list');
//   container.innerHTML = projects.map((p, i) => `
//     <div class="project-item">
//       <strong>${p.title}</strong>
      
//       <small>${p.description}</small>
//     <small>
//   Last updated: ${p.lastUpdated ? new Date(p.lastUpdated).toLocaleString() : 'N/A'}
//   ${p.lastUpdatedBy ? `by ${p.lastUpdatedBy}` : ''}
// </small>

//       <div class="image-preview-wrapper">
//         ${(p.images || []).map(img => `
//           <div class="thumb-wrapper">
//             <img class="thumb-img" src="/uploads/${img}" alt="">
//           </div>
//         `).join('')}
//       </div>
//       <button onclick="editProject(${i})">Edit</button>
//       <button onclick="confirmDeleteProject(${i})">Delete</button>
//     </div>
//   `).join('');
// }
function renderProjects() {
  const container = document.getElementById('projects-list');
  container.innerHTML = projects.map((p, i) => {
    const featuredIcon = p.featured ? ' <span class="featured-icon" title="Featured project">✔</span>' : '';
    return `
      <div class="project-item">
        <strong class="project-title">${p.title}${featuredIcon}</strong>
        
        <small>${p.description}</small>
        <small>
          Last updated: ${p.lastUpdated ? new Date(p.lastUpdated).toLocaleString() : 'N/A'}
          ${p.lastUpdatedBy ? `by ${p.lastUpdatedBy}` : ''}
        </small>

        <div class="image-preview-wrapper">
          ${(p.images || []).map(img => `
            <div class="thumb-wrapper">
              <img class="thumb-img" src="/uploads/${img}" alt="">
            </div>
          `).join('')}
        </div>
        <button onclick="editProject(${i})">Edit</button>
        <button onclick="confirmDeleteProject(${i})">Delete</button>
      </div>
    `;
  }).join('');
}

function editProject(index) {
    document.getElementById('admin-dashboard').scrollIntoView({ behavior: 'smooth' });

  const p = projects[index];
  document.getElementById('project-title').value = p.title;
  document.getElementById('project-description').value = p.description;
  document.getElementById('project-featured').checked = p.featured || false;
  editingIndex = index;
  renderImagePreview(p.images);
}

function renderImagePreview(images) {
  const preview = document.getElementById('image-preview');
  preview.innerHTML = images.map((img, i) => `
    <div class="thumb-wrapper">
      <img class="thumb-img" src="/uploads/${img}" alt="">
      <button class="remove-img" onclick="markImageForDeletion('${img}')">×</button>
    </div>
  `).join('');
}

let imagesToDelete = [];

function markImageForDeletion(filename) {
  imagesToDelete.push(filename);
  document.querySelectorAll(`.remove-img[onclick*="${filename}"]`).forEach(btn => {
    btn.parentElement.remove();
  });
  showNotification("Image removed from project.Click Save Project to save your changes", "success");
}

function cancelEdit() {
  editingIndex = null;
  imagesToDelete = [];
  document.getElementById('project-form').reset();
  document.getElementById('image-preview').innerHTML = '';
}

let pendingDeleteIndex = null;

function confirmDeleteProject(index) {
  pendingDeleteIndex = index;
  document.getElementById('confirm-modal').style.display = 'flex';
}

document.getElementById('confirm-yes').addEventListener('click', () => {
  if (pendingDeleteIndex !== null) {
    projects.splice(pendingDeleteIndex, 1);
    saveProjects();
    showNotification("Project deleted", "success");
    pendingDeleteIndex = null;
  }
  document.getElementById('confirm-modal').style.display = 'none';
});

document.getElementById('confirm-no').addEventListener('click', () => {
  pendingDeleteIndex = null;
  document.getElementById('confirm-modal').style.display = 'none';
});

document.getElementById('project-form')?.addEventListener('submit', e => {
  e.preventDefault();
  saveProject();
});
let selectedFiles = [];


 
 
document.getElementById('image-upload').addEventListener('change', function () {
  const preview = document.getElementById('image-preview');
  const files = this.files;
 selectedFiles = Array.from(files);
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const wrapper = document.createElement('div');
      wrapper.className = 'thumb-wrapper';

      const img = document.createElement('img');
      img.src = e.target.result;
      img.className = 'thumb-img';

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-img';
      removeBtn.textContent = '×';
      removeBtn.onclick = () => wrapper.remove();

      wrapper.appendChild(img);
      wrapper.appendChild(removeBtn);
      preview.appendChild(wrapper);
    };
    reader.readAsDataURL(file);
  });

  this.value = ''; // Reset input so same file can be reselected
});


function saveProjects() {
  const token = localStorage.getItem('authToken');
  fetch('/api/projects', {
    method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
    body: JSON.stringify(projects)
  })
  .then(() => {
    loadProjects();
    showNotification("Changes saved successfully", "success"); 
  })
  .catch(() => {
    showNotification("Failed to save changes", "error");
  });
}
function saveProject() {
  const title = document.getElementById('project-title').value.trim();
  const description = document.getElementById('project-description').value.trim();
  const featured = document.getElementById('project-featured').checked;
  
  // const imageInput = document.getElementById('image-upload');

  // const hasNewImages = imageInput.files.length > 0;
   const hasNewImages=selectedFiles.length > 0; 
  const hasExistingImages = editingIndex !== null && projects[editingIndex]?.images?.length > 0;

  if (!title || !description || (!hasNewImages && !hasExistingImages)) {
    showNotification("Please fill all fields and include at least one image", "error");
    return;
  }

  // const uploadImages = hasNewImages
  //   ? fetch('/api/upload', {
  //       method: 'POST',
  //       body: new FormData(document.getElementById('project-form'))
  //     }).then(res => res.json())
  //   : Promise.resolve({ uploaded: [] });
const uploadImages = selectedFiles.length
  ? (() => {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('featured', featured);

      selectedFiles.forEach(file => formData.append('images', file));
const token = localStorage.getItem('authToken');
 
       return fetch('/api/upload', {
          method: 'POST',
           headers: {
    'Authorization': `Bearer ${token}`
  },
   body:  formData 
          // body: formData
        }).then(res => {
          if (!res.ok)
          {
            showNotification('Failed to upload images! Please log out and login again', 'error');
             throw new Error('Upload failed');
          }

          return res.json();
        });
      })()
    : Promise.resolve({ uploaded: [] });
    



  uploadImages.then(data => {
    console.log('Upload response:', data);
    const newImages = data.uploaded || [];
    const project = {
      title,
      description,
      featured,
      images: [],
      lastUpdated: new Date().toISOString(),
      lastUpdatedBy: currentUser
    };

    if (editingIndex !== null) {
      const original = projects[editingIndex];
      const updatedImages = original.images.filter(img => !imagesToDelete.includes(img)).concat(newImages);
      project.images = updatedImages;
const token = localStorage.getItem('authToken');
      // Delete marked images from server
      imagesToDelete.forEach(filename => {
        fetch('/api/delete-image', {
          method: 'POST',
            headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
          body: JSON.stringify({ filename })
        });
      });

      projects[editingIndex] = project;
      editingIndex = null;
      imagesToDelete = [];
    } else {
      project.images = newImages;
      projects.push(project);
    }

    saveProjects();
    document.getElementById('project-form').reset();
    document.getElementById('image-preview').innerHTML = '';
    showNotification("Project saved successfully", "success");
  });
  selectedFiles = [];
document.getElementById('image-upload').value = ''; 

}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('admin-dashboard').style.display = 'none';

  const confirmYes = document.getElementById('confirm-yes');
  const confirmNo = document.getElementById('confirm-no');
  const confirmModal = document.getElementById('confirm-modal');

  if (confirmYes && confirmNo && confirmModal) {
    confirmYes.addEventListener('click', () => {
      if (pendingDeleteIndex !== null) {
        projects.splice(pendingDeleteIndex, 1);
        saveProjects();
        pendingDeleteIndex = null;
      }
      confirmModal.style.display = 'none';
    });

    confirmNo.addEventListener('click', () => {
      pendingDeleteIndex = null;
      confirmModal.style.display = 'none';
    });
  } else {
    console.error("Modal buttons not found in DOM.");
  }
});
document.getElementById('admin-login-form')?.addEventListener('submit', e => {
  e.preventDefault();
  handleLogin();
});
window.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem('loggedInUser');
  const loginTime = parseInt(localStorage.getItem('loginTimestamp'), 10);
  const now = Date.now();
  const sessionDuration = 60 * 60 * 1000; // 1 hour

  if (savedUser && loginTime && now - loginTime < sessionDuration) {
    currentUser = savedUser;
    document.querySelector('.admin-login-container').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    document.getElementById('admin-header').style.display = 'flex';
    document.querySelector('#logged-user strong').textContent = currentUser;
    loadProjects();
  } else {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loginTimestamp');
    document.getElementById('admin-header').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'none';
  }

  // Confirm modal setup...
});

