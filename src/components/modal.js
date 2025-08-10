export function initModal({ modalId, openButtonId }) {
    
    const modal = document.getElementById(modalId);
    const openBtn = document.getElementById(openButtonId);

    if (!modal || !openBtn) {
        console.warn(`Modal "${modalId}" or button "${openButtonId}" not found`);
        return;
    }

    const openModal = () => {
        if (!modal.open) modal.showModal();
    };

    const closeModal = () => {
        if (modal.open) modal.close();
    };

    openBtn.addEventListener('click', openModal);

    modal.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-close]');
        if (btn) closeModal();
    });

    modal.addEventListener('click', (e) => {
        const rect = modal.getBoundingClientRect();
        const isInDialog =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;

        if (!isInDialog) closeModal();
    });

    const saveBtn = modal.querySelector('#save-settings');

    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            saveBtn.disabled = true;
            try {
                closeModal();
            } finally {
                saveBtn.disabled = false;
            }
        });
    }
}
