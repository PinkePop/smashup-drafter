export const initLangage = async () => {

    const lang = localStorage.getItem('lang');
    const new_lang = (lang === 'en' ? 'fr' : 'en');

    document.documentElement.setAttribute('lang', new_lang);

    await setLangage(new_lang);
};

const setLangage = async (lang) => {

    localStorage.setItem('lang', lang);

    const langUsed = await loadLangage(lang);

    applyLangage(langUsed);
};

const loadLangage = async (lang) => {

    const result = await fetch(`/locales/${lang}.json`);
    const data = await result.json();

    return data;
};

const templating = (string, values = {}) => string.replace(/\{(\w+)\}/g, (_, name) => (values[name] ?? ''));

const applyLangage = (langUsed) => {

    document.querySelectorAll('[data-lang]').forEach(elem => {

        const key = elem.getAttribute('data-lang');

        if (langUsed[key]) elem.textContent = templating(langUsed[key], { year: new Date().getFullYear() });
    });
};