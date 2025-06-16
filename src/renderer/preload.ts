const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    // detect when 'Disconnect' button is pressed on Share Screen mode
    const targetButton = document.querySelector('[data-action="vnc#disconnect"]');
    if (targetButton) {
        targetButton.addEventListener('click', () => {
            ipcRenderer.sendToHost('disconnect-button-clicked');
        });
    }

    // Detect when 'exit' is typed on shell mode
    const parentDiv: HTMLElement = document.querySelector('[data-controller="shell"]');
    if (parentDiv) {
        const observer: MutationObserver = new MutationObserver((mutationsList: MutationRecord[]) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    const target: HTMLElement = mutation.target as HTMLElement;
                    const isHidden: boolean = target.classList.contains('hidden') || getComputedStyle(target).display === 'none';
                    if (isHidden) {
                        ipcRenderer.sendToHost('disconnect-button-clicked');
                    }
                }
            }
        });
        const childDiv: HTMLElement = parentDiv.querySelector('div');
        if (childDiv) {
            observer.observe(childDiv, {
                attributes: true,
                attributeFilter: ['class', 'style'],
            });
        }
    }

});