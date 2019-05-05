// Function to update the gallery
function updateGallery (){
  const gallery = document.querySelector('#gallery');
  if (!gallery) {
    return;
  }

  while (gallery.firstChild) {
    gallery.removeChild(gallery.firstChild);
  }

  fetch('/api/images')
    .then(res => res.json())
    .then(res => {
      res.forEach(imageURL => {
        const div = document.createElement('div');
        const img = document.createElement('img');
        img.src = imageURL;
        img.classList.add('gallery-img');
        div.appendChild(img);
        gallery.appendChild(div);
      });
    });
}

function updateNavbarButtons (isLoggedIn) {
  const navbarButtons = document.querySelector('#navbarButtons');

  if (isLoggedIn) {
    navbarButtons.innerHTML = `
    <li class="nav-item">
      <button type="button" class="btn btn-primary" id="logoutButton">Log out</button>
    </li>
    `;

    const logoutButton = document.querySelector('#logoutButton');
    if (logoutButton) logoutButton.addEventListener('click', logout);
  }
}

function submitImage (e) {
  e.preventDefault();
  const input = document.querySelector('input');
  const curFiles = input.files;
  const formData = new FormData();
  formData.append('image', curFiles[0]);

  fetch('/api/images', {
    method: 'POST',
    body: formData
  }).then(() => updateGallery());
  input.value = null;
}

function signup (e) {
  e.preventDefault();
  const username = document.querySelector('#signupForm #inputUsername').value;
  const password = document.querySelector('#signupForm #inputPassword').value;
  fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  }).then(res => res.json())
    .then(authToken => window.localStorage.setItem('authToken', authToken))
    .then(() => window.location.replace('/'));
}

function login (e) {
  e.preventDefault();
  const username = document.querySelector('#loginForm #inputUsername').value;
  const password = document.querySelector('#loginForm #inputPassword').value;
  fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  }).then(res => res.json())
    .then(authToken => window.localStorage.setItem('authToken', authToken))
    .then(() => window.location.replace('/'));
}

function logout () {
  console.log('logging out');
}

function isLoggedIn () {
  const authToken = window.localStorage.getItem('authToken');
  let result;

  if (!authToken) {
    return false;
  }

  return fetch('/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  }).then(res => res.json())
    .then(res => {
      if (res.name === 'AuthenticationError') {
        window.localStorage.removeItem('authToken');
        return false;
      } else {
        window.localStorage.setItem('authToken', res);
        return true;
      }
    })
    .catch(err => console.err(err));
}

// Get elements
const imgForm = document.querySelector('#imgForm');
const signupForm = document.querySelector('#signupForm');
const loginForm = document.querySelector('#loginForm');
const logoutButton = document.querySelector('#logoutButton');
if (logoutButton) logoutButton.addEventListener('click', logout);

// Add event listeners
if (imgForm) imgForm.addEventListener('submit', submitImage);
if (signupForm) signupForm.addEventListener('submit', signup);
if (loginForm) loginForm.addEventListener('submit', login);

// Update gallery load
updateGallery();

// Add logout button to header if logged in
isLoggedIn()
  .then(res => {
    updateNavbarButtons(res);
  });