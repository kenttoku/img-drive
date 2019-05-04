function updateGallery (){
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
  }).then(res => res.json())
    .then(res => console.log(res));
  input.value = null;
}

const form = document.querySelector('form');
const gallery = document.querySelector('#gallery');

form.addEventListener('submit', submitImage);
updateGallery();