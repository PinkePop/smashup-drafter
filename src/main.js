
import './styles/main.scss';
import { initLangage } from './lang.js';

document.addEventListener('DOMContentLoaded', () => {

  initLangage();

  const year_element = document.getElementById('year');
  const lang_button = document.getElementById('lang-toggle-button');

  year_element.textContent = new Date().getFullYear();

  lang_button.addEventListener('click', () => {
    initLangage();
  });
});