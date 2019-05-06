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
      res.forEach(image => {
        const div = document.createElement('div');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');
        img.src = image.url;
        img.classList.add('gallery-img');
        figcaption.innerHTML = `uploaded by ${image.username}`;
        div.appendChild(img);
        div.appendChild(figcaption);
        gallery.appendChild(div);
      });
    });
}

function updatePage (isLoggedIn) {
  const navbarButtons = document.querySelector('#navbarButtons');
  const jumbotronButtons = document.querySelector('#jumbotronButtons');
  const imgForm = document.querySelector('#imgForm');

  if (isLoggedIn) {
    navbarButtons.innerHTML = `
    <li class="nav-item">
      <button type="button" class="btn btn-primary" id="logoutButton">Log out</button>
    </li>
    `;

    jumbotronButtons.innerHTML = `
      <button class="btn btn-primary my-2">View all images</button>
      <button class="btn btn-secondary my-2">View my images</button>
    `;

    imgForm.classList.remove('d-none');
  } else {
    navbarButtons.innerHTML = `
    <li class="nav-item">
      <a class="nav-link" href="/signup">Sign up</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="/login">Log in</a>
    </li>
    `;

    jumbotronButtons.innerHTML = `
      <a href="/signup" class="btn btn-primary my-2">Sign up</a>
      <a href="/login" class="btn btn-secondary my-2">Log in</a>
    `;
    imgForm.classList.add('d-none');
  }
}

function submitImage (e) {
  const authToken = window.localStorage.getItem('authToken');

  if (!authToken) {
    return false;
  }

  e.preventDefault();
  const input = document.querySelector('input');
  const curFiles = input.files;
  const formData = new FormData();
  formData.append('image', curFiles[0]);

  fetch('/api/images', {
    method: 'POST',
    body: formData,
    headers: { 'Authorization': `Bearer ${authToken}` }
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

function checkLogout (e) {
  if (e.target.id === 'logoutButton') {
    logout();
  }
}

function logout () {
  window.localStorage.removeItem('authToken');
  updatePage(false);
}

function isLoggedIn () {
  const authToken = window.localStorage.getItem('authToken');

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
const navbar = document.querySelector('#navbar');

// Add event listeners
if (imgForm) imgForm.addEventListener('submit', submitImage);
if (signupForm) signupForm.addEventListener('submit', signup);
if (loginForm) loginForm.addEventListener('submit', login);
if (navbar) navbar.addEventListener('click', checkLogout);

// Update gallery load
updateGallery();

// Add logout button to header if logged in
isLoggedIn().then(res => updatePage(res));