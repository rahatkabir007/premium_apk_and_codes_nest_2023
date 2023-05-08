const { chromium } = require('playwright');
const { spawnSync } = require("child_process");
var page = null

export const getPrivateChromePage = async () => {
    console.log(`Chrome getPrivateChromePage`)
    spawnSync("npx", ["playwright", "install", "chromium"]);
    if (page == null) {
        console.log(`Chrome NULL`)
        const timeout = 1000 * 20
        const privateBrowser = await chromium.launch({
            headless: true,
            timeout: timeout
        });
        const context = await privateBrowser.newContext()

        context.setDefaultNavigationTimeout(timeout)
        context.setDefaultTimeout(timeout)

        page = await context.newPage();
    }

    return page
}
