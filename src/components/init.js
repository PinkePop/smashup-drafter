import { initLangage } from './lang.js';
import { initModal } from './modal.js';
import { initSetsList } from './sets.js';
import { generateDraftWithBalance } from './draft.js';

export const initSmashApp = () => {
  initLangage(true);
  addClickEventToLangButton();
  setCurrentYear();
  initModals();
  initSetsList();
  initDraftUI();
};

const setCurrentYear = () => {
  const year_element = document.getElementById('year');
  year_element.textContent = new Date().getFullYear();
};

const initModals = () => {
  initModal({ modalId: 'settings-modal', openButtonId: 'settings-button' });
  initModal({ modalId: 'settings-modal', openButtonId: 'open-settings-link' });
};

const addClickEventToLangButton = () => {
  const lang_button = document.getElementById('lang-toggle-button');
  lang_button.addEventListener('click', () => {
    initLangage();
    initSetsList();
  });
};

const initDraftUI = () => {
  const btn = document.getElementById('btn-draft');
  btn?.addEventListener('click', () => {
    runDraftAndShow();
  });
};

const runDraftAndShow = () => {
  const lang = localStorage.getItem('lang') ?? 'en';
  const res = generateDraftWithBalance({ lang });

  if (res?.error) {
    console.warn(res.error);
    return;
  }

  showDraftArea();
  renderPlayerPack('#p1-pack', res.draft.p1, lang);
  renderPlayerPack('#p2-pack', res.draft.p2, lang);
};

const showDraftArea = () => {
  const draftArea = document.getElementById('draft-area');
  const stepsSection = document.querySelector('.steps-section');
  const howItWorks = document.querySelector('.how-it-works');

  stepsSection?.setAttribute('hidden', '');
  howItWorks?.setAttribute('hidden', '');
  draftArea?.removeAttribute('hidden');
};

const tName = (nameObj, lang) => nameObj?.[lang] ?? nameObj?.en ?? nameObj?.fr ?? '(unknown)';

const renderPlayerPack = (rootSelector, pack, lang) => {
  const root = document.querySelector(rootSelector);
  if (!root || !pack) return;

  const imposedEl = root.querySelector('.imposed');
  const optionsEl = root.querySelector('.options');

  if (pack.imposed) {
    imposedEl.innerHTML = `
      <p><strong>Imposed:</strong> ${tName(pack.imposed.name, lang)} <small>(${pack.imposed.rating})</small></p>
    `;
  } else {
    imposedEl.textContent = 'No imposed faction.';
  }

  optionsEl.innerHTML = (pack.options || [])
    .map(opt => `
      <li>
        ${tName(opt.name, lang)} <small>(${opt.rating})</small>
      </li>
    `)
    .join('');
};