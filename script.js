const menu = document.querySelector('.menu');
const links = document.querySelector('.nav-links');

if (menu && links) {
  menu.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }));
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mljgdepe';

function formDataToObject(form) {
  const data = {};
  new FormData(form).forEach((value, key) => { data[key] = value; });
  return data;
}

async function handleForm(form) {
  const status = form.querySelector('.form-status');
  const button = form.querySelector('.form-submit');
  const type = form.dataset.formType || 'enquiry';

  if (!status || !button) return;

  status.className = 'form-status';
  status.textContent = '';

  button.disabled = true;
  button.style.opacity = '.65';

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(formDataToObject(form))
    });

    if (!response.ok) throw new Error('Submission failed');

    form.reset();
    status.className = 'form-status success';
    status.textContent = type === 'feedback'
      ? 'Thank you. Your recommendation has been received.'
      : 'Thank you. Your enquiry has been sent successfully.';
  } catch (error) {
    status.className = 'form-status error';
    status.textContent = 'We could not send the form right now. Please use WhatsApp or email below.';
  } finally {
    button.disabled = false;
    button.style.opacity = '1';
  }
}

document.querySelectorAll('form[data-form-type]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    handleForm(form);
  });
});
