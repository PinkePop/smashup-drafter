export const mean = (arr) =>
    arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : 0;

export const stddevPop = (arr, mu = mean(arr)) => {
    if (!arr.length) return 0;
    const variance = arr.reduce((s, x) => s + (x - mu) ** 2, 0) / arr.length;
    return Math.sqrt(variance);
};

export const zscoreAbs = (value, mu, sigma) => {
    if (!isFinite(sigma) || sigma === 0) return 0;
    return Math.abs((value - mu) / sigma);
};

export const averageRating = (rating) => {
    const { fr, en } = rating ?? {};
    const nums = [fr, en].filter((v) => typeof v === 'number');
    return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
};

export function getFactionPool(setsData, ownedSetIds = []) {
    const sets = Array.isArray(setsData?.sets) ? setsData.sets : [];
    const owned = ownedSetIds;
    const factions = [];

    for (const set of sets) {
        if (!owned.includes(set.id)) continue;
        for (const f of set.factions || []) {
            const avg = averageRating(f.rating);
            if (avg != null) {
                factions.push({
                    id: `${set.id}:${f.id}`,
                    name: f.name,
                    rating: avg
                });
            }
        }
    }
    return factions;
}

export function shuffleInPlace(arr, rng = Math.random) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function buildDraftFromPool(pool, rng = Math.random) {
    const N = Math.min(16, pool.length);
    const picks = shuffleInPlace([...pool], rng).slice(0, N);

    if (picks.length < 2) {
        return { p1: null, p2: null, picks };
    }

    const half = Math.ceil(picks.length / 2);
    const p1Arr = picks.slice(0, half);
    const p2Arr = picks.slice(half);

    const mkPack = (arr) => ({
        imposed: arr[0] ?? null,
        options: arr.slice(1, 8)
    });

    return {
        p1: mkPack(p1Arr),
        p2: mkPack(p2Arr),
        picks
    };
}

export function classifyZ(zAbs) {
    if (zAbs < 0.5) return 'balanced';
    if (zAbs < 1) return 'partially_balanced';
    return 'unbalanced';
}

export function evaluatePlayerPack(pack, mu, sigma) {
    if (!pack?.imposed) return [];
    const imposed = pack.imposed;

    return pack.options.map(opt => {
        const mixMean = mean([imposed.rating, opt.rating]);
        const z = zscoreAbs(mixMean, mu, sigma);

        return {
            imposed,
            option: opt,
            mean: Math.round(mixMean * 10) / 10,
            z: Math.round(z * 100) / 100,
            tag: classifyZ(z)
        };
    });
}

export function evaluateDraft(pool, draft) {
    const poolRatings = pool.map(f => f.rating);
    const mu = Math.round(mean(poolRatings) * 10) / 10;
    const sigma = Math.round(stddevPop(poolRatings) * 100) / 100;

    const p1 = draft.p1 ? evaluatePlayerPack(draft.p1, mu, sigma) : [];
    const p2 = draft.p2 ? evaluatePlayerPack(draft.p2, mu, sigma) : [];

    return { mu, sigma, p1, p2 };
}
