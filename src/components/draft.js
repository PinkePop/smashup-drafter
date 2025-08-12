import setsData from '../datas/sets.json';
import {
    getFactionPool,
    buildDraftFromPool,
    evaluateDraft
} from '../utils/draft-stats.js';

function getOwnedSetIds() {
    try {
        return localStorage.getItem('ownedSets') ?? [];
    } catch {
        return [];
    }
}

function tName(nameObj, lang = 'en') {
    return nameObj?.[lang] ?? nameObj?.en ?? nameObj?.fr ?? '(unknown)';
}

export function generateDraftWithBalance({ rng = Math.random, lang = (localStorage.getItem('lang') ?? 'en') } = {}) {
    const owned = getOwnedSetIds();
    const pool = getFactionPool(setsData, owned);

    if (pool.length < 2) {
        return { error: 'Not enough factions in pool', poolCount: pool.length };
    }

    const draft = buildDraftFromPool(pool, rng);
    const balance = evaluateDraft(pool, draft);

    const pretty = (rows) =>
        rows.map(r => ({
            imposed: `${tName(r.imposed.name, lang)} (${r.imposed.rating})`,
            option: `${tName(r.option.name, lang)} (${r.option.rating})`,
            mean: r.mean,
            z: r.z,
            tag: r.tag
        }));

    return { pool, draft, balance };
}

export function renderDraftOptions({ balance, lang = 'en' }) {
    const $p1 = document.getElementById('p1-options');
    const $p2 = document.getElementById('p2-options');
    if (!$p1 || !$p2) return;

    const cls = (tag) =>
        tag === 'balanced' ? 'ok' : tag === 'partially_balanced' ? 'mid' : 'bad';

    const row = (r) => `
    <li data-z="${r.z}" data-tag="${r.tag}">
      <strong>${r.mean}</strong> (z=${r.z})
      — ${tName(r.imposed.name, lang)} + ${tName(r.option.name, lang)}
      <span class="${cls(r.tag)}"> ${r.tag.replace('_', ' ')} </span>
    </li>
  `;

    $p1.innerHTML = `<ul>${balance.p1.map(row).join('')}</ul>`;
    $p2.innerHTML = `<ul>${balance.p2.map(row).join('')}</ul>`;
}
