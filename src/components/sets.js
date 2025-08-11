import setsData from '../datas/sets.json';

export const initSetsList = () => {

    const lang = localStorage.getItem('lang') ?? 'en';
    const setsContainer = document.getElementById('sets-root');

    [...setsContainer.children].forEach(child => {
        if (child.tagName.toLowerCase() !== 'legend') child.remove();
    });

    getSetsDatas(lang).forEach(set => {
        setsContainer.appendChild(getSetElement(set, lang));
    });
}

export const restoreSets = () => {

    const sets = document.getElementsByName('sets');
    const ownedSets = JSON.parse(localStorage.getItem('ownedSets')) || [];

    sets.forEach(set => {
        set.checked = ownedSets.includes(set.id);
    });
}

const getSetElement = (set, lang) => {
    const setLabel = document.createElement('label');
    const setInput = document.createElement('input');

    setInput.type = 'checkbox';
    setInput.id = set.id;
    setInput.name = 'sets';
    setInput.addEventListener('change', updateSetOwnedStatus);

    setLabel.appendChild(setInput);
    setLabel.append(set.name?.[lang]);

    return setLabel;
}

const updateSetOwnedStatus = () => {

    const sets = document.getElementsByName('sets');
    const ownedSets = [];

    sets.forEach(set => {
        if (set.checked) {
            ownedSets.push(set.id);
        }
    });

    localStorage.setItem('ownedSets', JSON.stringify(ownedSets));
}

const getSetsDatas = (lang) => {

    let sets = Array.isArray(setsData.sets) ? setsData.sets : [];

    return sortedSets(sets, lang);
}

const toTime = (set, lang) => {

    const setRelease = set?.release_date?.[lang] ?? '';
    const setReleaseTime = Date.parse(setRelease);
    return Number.isFinite(setReleaseTime) ? setReleaseTime : -Infinity;
}

const sortedSets = (sets, lang) => {
    return datedSets(sets, lang).sort((a, b) => toTime(a, lang) - toTime(b, lang))
}

const datedSets = (sets, lang) => {
    return [...sets].filter(s => s.release_date?.[lang]);
}