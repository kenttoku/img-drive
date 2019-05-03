// function fetchImages (){
//   while (gallery.firstChild) {
//     gallery.removeChild(gallery.firstChild);
//   }

//   fetch('/images')
//     .then(res => res.json())
//     .then(res => {
//       res.forEach(image => {
//         const div = document.createElement('div');
//         const img = document.createElement('img');
//         img.src = `/images/${image}`;
//         img.classList.add('gallery-img');
//         div.appendChild(img);
//         gallery.appendChild(div);
//       });
//     });
// }

function submitImage (e) {
  e.preventDefault();
  const input = document.querySelector('input');
  const curFiles = input.files;
  const formData = new FormData();
  formData.append('image', curFiles[0]);

  fetch('/api/image', {
    method: 'POST',
    body: formData
  }).then(res => console.log(res));
  input.value = null;
}

const form = document.querySelector('form');
const gallery = document.querySelector('#gallery');

form.addEventListener('submit', submitImage);