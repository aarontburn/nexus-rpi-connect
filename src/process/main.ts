import * as path from "path";
import { Process } from "@nexus-app/nexus-module-builder"
import { session } from "electron";

// These is replaced to the ID specified in export-config.js during export. DO NOT MODIFY.
const MODULE_ID: string = "{EXPORTED_MODULE_ID}";
const MODULE_NAME: string = "{EXPORTED_MODULE_NAME}";
// ---------------------------------------------------
const ICON_PATH: string = path.join(__dirname, "./rpi-connect-logo.png");


export default class ChildProcess extends Process {
    public constructor() {
        super({
            moduleID: MODULE_ID,
            moduleName: MODULE_NAME,
            paths: {
                iconPath: ICON_PATH,
                htmlPath: path.join(__dirname, "../renderer/index.html"),
            },
            httpOptions: {
                userAgent: session
                    .fromPartition(`persist:${MODULE_ID}`)
                    .getUserAgent()
                    .replace(/Electron\/*/, ''),
                partition: `persist:${MODULE_ID}`
            }
        });

    }

    public async initialize(): Promise<void> {
        this.sendToRenderer("params", {
            url: 'https://connect.raspberrypi.com/devices',
            userAgent: session.fromPartition(`persist:${MODULE_ID}`).getUserAgent().replace(/Electron\/*/, ''),
            partition: `persist:${MODULE_ID}`,
            preload: path.join(__dirname, "../renderer/preload.js")
        })
    }

    public async handleEvent(eventType: string, data: any[]): Promise<any> {
        switch (eventType) {
            case "init": this.initialize();
        }
    }


}