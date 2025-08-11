
import './styles/main.scss';
import { initLangage } from './components/lang.js';
import { initModal } from './components/modal.js';
import { initSetsList } from './components/sets.js';

document.addEventListener('DOMContentLoaded', () => {

  initLangage(true);

  addClickEventToLangButton();

  setCurrentYear();
  initModals();

  initSetsList();
});

const setCurrentYear = () => {
  const year_element = document.getElementById('year');
  year_element.textContent = new Date().getFullYear();
}

const initModals = () => {
  initModal({
    modalId: 'settings-modal',
    openButtonId: 'settings-button'
  });

  initModal({
    modalId: 'settings-modal',
    openButtonId: 'open-settings-link'
  });
}

const addClickEventToLangButton = () => {
  const lang_button = document.getElementById('lang-toggle-button');

  lang_button.addEventListener('click', () => {
    initLangage();
    initSetsList();
  });
}