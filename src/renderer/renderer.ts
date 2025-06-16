// Sends information to the the process.
const sendToProcess = (eventType: string, ...data: any[]): Promise<void> => {
    return window.ipc.sendToProcess(eventType, data);
}

window.ipc.onProcessEvent((eventType: string, data: any[]) => {
    switch (eventType) {
        case "params": {
            const { url, userAgent, partition } = data[0];

            const html: string = `
                <webview 
                    src="${url}"
                    id="view"
                    partition="${partition}" 
                    userAgent="${userAgent}"
                    preload="./preload.js"
                >
                </webview>
            `
            document.getElementById("app").insertAdjacentHTML('beforeend', html);
            const webview = document.getElementById('view');

            const homeButton: HTMLElement = document.getElementById('home-button')
            homeButton.addEventListener('click', () => (webview as any).loadURL(url));

            webview.addEventListener('did-finish-load', () => {
                if (webview.getAttribute('src').endsWith("screen-sharing-session")) {
                    homeButton.style.left = "175px";
                    webview.addEventListener('ipc-message', (event) => {
                        if ((event as any).channel === 'disconnect-button-clicked') {
                            (webview as any).loadURL('https://connect.raspberrypi.com/devices');
                        }
                    });
                    (webview as any).insertCSS(`
                        [data-controller="vnc"] > div {
                            @media (prefers-color-scheme: dark) {
                                background-color: #2b2b2b;
                            }
                        }
                        `)
                } else if (webview.getAttribute('src').endsWith('remote-shell-session')) {
                    homeButton.style.left = "unset";
                    homeButton.style.right = "5px";
                    homeButton.style.backgroundColor = "white";

                } else {
                    homeButton.style.backgroundColor = "";
                    homeButton.style.left = "5px";
                }
            });

            break;
        }
        default: {
            console.warn("Uncaught message: " + eventType + " | " + data)
            break;
        }
    }
});

sendToProcess("init");

