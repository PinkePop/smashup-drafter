
import './styles/main.scss';

document.addEventListener('DOMContentLoaded', () => {

  const year_element = document.getElementById('year');

  year_element.textContent = new Date().getFullYear();
});