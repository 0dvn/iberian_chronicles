const quill = new Quill('#quill-editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ header: [3, 4, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'link'],
      ['clean'],
    ],
  },
  placeholder: 'Write your article here...',
});

const form = document.querySelector('.editor-form');
const contentInput = document.getElementById('content-input');

form.addEventListener('submit', () => {
  contentInput.value = quill.root.innerHTML;
});

const featuredInput = document.getElementById('featuredImage');
const featuredPreview = document.getElementById('featuredPreview');

if (featuredInput && featuredPreview) {
  featuredInput.addEventListener('change', () => {
    featuredPreview.innerHTML = '';
    if (featuredInput.files[0]) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(featuredInput.files[0]);
      img.style.opacity = '0';
      img.style.transform = 'scale(0.98)';
      img.style.transition = 'opacity 220ms ease, transform 220ms ease';
      featuredPreview.appendChild(img);
      window.requestAnimationFrame(() => {
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
      });
    }
  });
}

const galleryInput = document.getElementById('gallery');
const galleryPreview = document.getElementById('galleryPreview');

if (galleryInput && galleryPreview) {
  galleryInput.addEventListener('change', () => {
    const existing = galleryPreview.querySelectorAll('.gallery-thumb-new');
    existing.forEach(el => el.remove());
    Array.from(galleryInput.files).forEach(file => {
      const div = document.createElement('div');
      div.className = 'gallery-thumb gallery-thumb-new';
      div.style.opacity = '0';
      div.style.transform = 'translateY(8px)';
      div.style.transition = 'opacity 220ms ease, transform 220ms ease';
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      div.appendChild(img);
      galleryPreview.appendChild(div);
      window.requestAnimationFrame(() => {
        div.style.opacity = '1';
        div.style.transform = 'translateY(0)';
      });
    });
  });
}

const mapInput = document.getElementById('mapQuery');
const mapPreview = document.getElementById('mapPreview');

if (mapInput && mapPreview) {
  let timeout;
  mapInput.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (mapInput.value.trim()) {
        mapPreview.innerHTML = `<iframe src="https://www.google.com/maps?q=${encodeURIComponent(mapInput.value)}&output=embed" width="100%" height="250" loading="lazy" title="Map preview for ${mapInput.value.replace(/"/g, '&quot;')}"></iframe>`;
        mapPreview.style.opacity = '0';
        mapPreview.style.transform = 'translateY(8px)';
        mapPreview.style.transition = 'opacity 220ms ease, transform 220ms ease';
        window.requestAnimationFrame(() => {
          mapPreview.style.opacity = '1';
          mapPreview.style.transform = 'translateY(0)';
        });
      } else {
        mapPreview.innerHTML = '';
      }
    }, 800);
  });
}
