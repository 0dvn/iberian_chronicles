function pulseButton(btn) {
  btn.style.transition = 'transform 180ms ease, box-shadow 180ms ease';
  btn.style.transform = 'scale(0.96)';
  btn.style.boxShadow = '0 0 0 0 rgba(192, 57, 43, 0.24)';
  window.setTimeout(() => {
    btn.style.transform = 'scale(1)';
    btn.style.boxShadow = '';
  }, 90);
}

function setButtonBusy(btn, isBusy) {
  btn.disabled = isBusy;
  btn.setAttribute('aria-busy', String(isBusy));
}

function syncLikeButtonState(btn, liked, count, iconSelector, countSelector, labelSelector, onLabel, offLabel, solidClass, regularClass) {
  const icon = btn.querySelector(iconSelector + ' i');
  const countEl = btn.querySelector(countSelector);
  const labelEl = labelSelector ? btn.querySelector(labelSelector) : null;

  if (icon) {
    icon.className = liked ? solidClass : regularClass;
  }
  if (countEl && typeof count === 'number') {
    countEl.textContent = count;
  }
  if (labelEl) {
    labelEl.textContent = liked ? onLabel : offLabel;
  }
  btn.classList.toggle('liked', liked);
  btn.classList.toggle('bookmarked', liked);
  btn.setAttribute('aria-pressed', liked ? 'true' : 'false');
  btn.setAttribute('aria-label', liked ? onLabel : offLabel);
}

document.querySelectorAll('.btn-like-comment').forEach(btn => {
  btn.addEventListener('click', async () => {
    const commentId = btn.dataset.commentId;
    setButtonBusy(btn, true);
    pulseButton(btn);

    try {
      const res = await fetch('/api/comments/' + commentId + '/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) return;
      const data = await res.json();
      syncLikeButtonState(btn, data.liked, data.count, '.like-icon', '.like-count', null, 'Unlike comment', 'Like comment', 'fa-solid fa-heart', 'fa-regular fa-heart');
    } finally {
      setButtonBusy(btn, false);
    }
  });
});

document.querySelectorAll('.btn-like-article').forEach(btn => {
  btn.addEventListener('click', async () => {
    const articleId = btn.dataset.articleId;
    setButtonBusy(btn, true);
    pulseButton(btn);

    try {
      const res = await fetch('/api/articles/' + articleId + '/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) return;
      const data = await res.json();
      syncLikeButtonState(btn, data.liked, data.count, '.like-icon', '.like-count', null, 'Unlike article', 'Like article', 'fa-solid fa-heart', 'fa-regular fa-heart');
    } finally {
      setButtonBusy(btn, false);
    }
  });
});

document.querySelectorAll('.btn-bookmark').forEach(btn => {
  btn.addEventListener('click', async () => {
    const articleId = btn.dataset.articleId;
    setButtonBusy(btn, true);
    pulseButton(btn);

    try {
      const res = await fetch('/api/articles/' + articleId + '/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) return;
      const data = await res.json();
      syncLikeButtonState(btn, data.bookmarked, null, '.bookmark-icon', null, '.bookmark-label', 'Remove bookmark', 'Save article', 'fa-solid fa-bookmark', 'fa-regular fa-bookmark');
    } finally {
      setButtonBusy(btn, false);
    }
  });
});
