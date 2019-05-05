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
    .then(res => console.log(res))
    .then(res => window.location.replace('/'));
}

function login (e) {
  e.preventDefault();
  console.log('login');
}

// Forms
const imgForm = document.querySelector('#imgForm');
const signupForm = document.querySelector('#signupForm');
const loginForm = document.querySelector('#loginForm');

// Add event listeners
if (imgForm) imgForm.addEventListener('submit', submitImage);
if (signupForm) signupForm.addEventListener('submit', signup);
if (loginForm) loginForm.addEventListener('submit', login);

// Sign up form
updateGallery();