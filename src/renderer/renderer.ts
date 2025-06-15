// Sends information to the the process.
const sendToProcess = (eventType: string, ...data: any[]): Promise<void> => {
    return window.ipc.sendToProcess(eventType, data);
}

// Handle events from the process.
const handleEvent = (eventType: string, data: any[]) => {
    switch (eventType) {
        case 'sample-setting': {
            const html: HTMLElement = document.getElementById('counter-display');

            html.style.color = data[0] ? 'green' : 'red';
            html.innerText = data[0] ? 'on' : 'off'
            break;
        }
        default: {
            console.warn("Uncaught message: " + eventType + " | " + data)
            break;
        }
    }
}

// Attach event handler.
window.ipc.onProcessEvent((eventType: string, data: any[]) => {
    handleEvent(eventType, data);
});


// Instruct the module process to initialize once the renderer is ready.
sendToProcess("init");


let counter = 0;
const setCounter = (count: number) => {
    counter = count;
    document.getElementById("counter").innerHTML = `count is ${counter}`;
}
setCounter(0);

document.getElementById("counter").addEventListener("click", () => setCounter(counter + 1));

const sendButton: HTMLElement = document.getElementById("send-button")
sendButton.addEventListener("click", () => sendToProcess("count", counter));

