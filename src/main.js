
import './styles/main.scss';
import { initLangage } from './components/lang.js';
import { initModal } from './components/modal.js';

document.addEventListener('DOMContentLoaded', () => {

  initLangage(true);

  const year_element = document.getElementById('year');
  const lang_button = document.getElementById('lang-toggle-button');

  year_element.textContent = new Date().getFullYear();

  lang_button.addEventListener('click', () => {
    initLangage();
  });

  initModal({
    modalId: 'settings-modal',
    openButtonId: 'settings-button'
  });

  initModal({
    modalId: 'settings-modal',
    openButtonId: 'open-settings-link'
  });
});