(function () {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('contact-form-status');

  if (!form || !statusEl) return;

  const submitBtn = form.querySelector('.btn-submit');
  const defaultSubmitText = submitBtn ? submitBtn.textContent : 'Send Message';
  let suppressNextResetStatus = false;

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = 'form-status ' + type;
  }

  function setSendingState(isSending) {
    if (!submitBtn) return;
    submitBtn.disabled = isSending;
    submitBtn.textContent = isSending ? 'Sending...' : defaultSubmitText;
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const subjectField = form.querySelector('#subject');
    const subjectValue = subjectField && subjectField.value ? subjectField.value : (payload.subject || 'general');
    const subjectLabel = subjectField && subjectField.selectedOptions && subjectField.selectedOptions[0]
      ? subjectField.selectedOptions[0].textContent.trim()
      : subjectValue;
    const endpoint = form.dataset.endpoint || form.getAttribute('action');
    const isFormspree = /formspree\.io/i.test(endpoint || '');

    setSendingState(true);
    setStatus('', 'info');

    if (!endpoint) {
      return;
    }

    try {
      let requestPayload = payload;

      if (isFormspree) {
        const enrichedMessage = [
          'Name: ' + (payload.name || 'N/A'),
          'Email: ' + (payload.email || 'N/A'),
          'Subject: ' + subjectLabel + ' (' + subjectValue + ')',
          '',
          payload.message || ''
        ].join('\n');

        requestPayload = {
          name: payload.name || '',
          email: payload.email || '',
          _subject: 'Website Contact: ' + subjectLabel,
          message: enrichedMessage
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }

      suppressNextResetStatus = true;
      form.reset();
      setStatus('Form submitted successfully.', 'success');
    } catch (error) {
      setStatus('Could not send the message. Please try again.', 'error');
    } finally {
      setSendingState(false);
    }
  });

  form.addEventListener('reset', function () {
    if (suppressNextResetStatus) {
      suppressNextResetStatus = false;
      return;
    }
    setStatus('Form cleared.', 'info');
  });
}());
