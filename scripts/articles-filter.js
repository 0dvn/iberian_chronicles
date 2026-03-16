(function () {
  const select = document.getElementById('city-select');
  const items = document.querySelectorAll('#articles-list .blog-item');

  if (!select || !items.length) return;

  function applyFilter(city) {
    items.forEach(function (item) {
      if (city === 'all' || item.classList.contains('city-' + city)) {
        item.classList.remove('is-hidden');
      } else {
        item.classList.add('is-hidden');
      }
    });
  }

  select.addEventListener('change', function () {
    applyFilter(select.value);
  });

  applyFilter(select.value);
}());
