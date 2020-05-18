function debug(param) {
    if (globalDebugMode) {
        console.log(param)
    }
}

function checkURL(urlstr) {
    return urlstr.includes("teaching.applysquare.com") && (urlstr.includes("T-Work-treviewinfo") || urlstr.includes("S-Lesson-index"))
}

function sendUpdatedSettings() {

    chrome.storage.sync.get("settings", function (items) {

        debug("[Info][background] Load Settings.")

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            //debug(tabs[0])
            chrome.tabs.sendMessage(tabs[0].id, { cmd: 'update', info: items.settings }, function (response) {
                debug("[Send][background->contentscripts] Send you something new!")
                debug(response) //发送给contentscript设置
            });

        })
    })

}

function setClickMode(tab) {

    if (checkURL(tab.url)) {

        debug("[Info][background] Execute Content Scripts.")
        chrome.tabs.executeScript(tab.id, { file: "contentscript.js" })

    } else {

        commonMode(tab.id)
        debug("[Info][background] Only work on specific page.")

    }
}

function clickMode(id) {

    /* 设置点击运行模式 */

    debug("[Info][background] Change to Click Mode.")

    /* 改变按钮样式 */
    chrome.browserAction.enable(id)
    chrome.browserAction.setTitle({ title: "当前正以点击模式运行", tabId: id }, function () { })
    chrome.browserAction.setBadgeText({ text: "Click", tabId: id }, function () { })
    chrome.browserAction.setBadgeBackgroundColor({ color: "#4a90e2", tabId: id }, function () { })


}

function clickModeScript() {

    /* 点击模式 */

    if (chrome.tabs.onUpdated.hasListener(setBgMode)) {
        chrome.tabs.onUpdated.removeListener(setBgMode)
    }
    if (chrome.tabs.onUpdated.hasListener(setClickMode)) {
        chrome.tabs.onUpdated.removeListener(setClickMode)
    }
    chrome.browserAction.onClicked.addListener(setClickMode)
    bgMode = false
}

function setBgMode(id, change, tab) {

    if (tab.active && checkURL(tab.url) && "complete" == change.status) {

        chrome.storage.sync.get("settings", function (items) {

            if ('{}' === JSON.stringify(items)) {

                debug("[Info][background] No Settings.")

            } else {

                debug("[Info][background] Load Settings.")
                debug("[Info][background] Execute Content Scripts.")
                chrome.tabs.executeScript(tab.id, { file: "contentscript.js", runAt: "document_end" })

            }
        })
    }else{
        commonMode(id)
        debug("[Info][background] Only work on specific page.")
    }

}

function backgroundMode(id) {

    debug("[Info][background] Change to Background Mode.")

    chrome.browserAction.enable(id)
    chrome.browserAction.setTitle({ title: "当前正以背景模式运行", tabId: id }, function () { })
    chrome.browserAction.setBadgeText({ text: "On", tabId: id }, function () { })
    chrome.browserAction.setBadgeBackgroundColor({ color: "#2d8652", tabId: id }, function () { })

}

function backgroundModeScript(id) {

    /* 背景模式 */

    if (chrome.tabs.onUpdated.hasListener(setBgMode)) {
        chrome.tabs.onUpdated.removeListener(setBgMode)
    }
    if (chrome.tabs.onUpdated.hasListener(setClickMode)) {
        chrome.tabs.onUpdated.removeListener(setClickMode)
    }
    chrome.tabs.onUpdated.addListener(setBgMode)

}


function commonMode(id) {

    debug("[Info][background] Change to Common Mode.")

    chrome.browserAction.setTitle({ title: "当前非可用页面", tabId: id }, function () { })
    chrome.browserAction.setBadgeText({ text: "", tabId: id }, function () { })
    chrome.browserAction.disable(id)

}

function loadSettings() {

    chrome.storage.sync.get("settings", function (items) {

        debug("[Info][background] Load Settings.")


        if ('{}' === JSON.stringify(items)) {

            /* 第一次运行设置 */
            debug("[Pass][background] First run.")

        } else {

            storage = JSON.parse(items.settings)

            if (!storage.enableBgMode) {

                debug("[Info][background] Click Mode.")
                clickModeScript()


            } else {


                debug("[Info][background] Background Mode.")
                backgroundModeScript()


            }
        }
    })
}


function setIcon() {

    commonMode()

    chrome.tabs.onActivated.addListener(function (info) {

        chrome.storage.sync.get("settings", function (items) {



            if ('{}' === JSON.stringify(items)) {

                debug("[Info][background] No Settings.")

            } else {

                debug("[Info][background] Load Settings.")

                storage = JSON.parse(items.settings)

                chrome.tabs.get(info.tabId, function (tab) {
                    if (checkURL(tab.url)) {

                        if (!storage.enableBgMode) {

                            clickMode(tab.tabId)

                        } else {

                            backgroundMode(tab.tabId)
                        }

                    } else {


                        commonMode(tab.tabId)
                        debug("[Info][background] Only work on specific page.")
                    }
                })
            }
        })
    })

    chrome.tabs.onUpdated.addListener(function (id, change, tab) {

        if (tab.active && checkURL(tab.url) && "complete" == change.status) {

            chrome.storage.sync.get("settings", function (items) {

                if ('{}' === JSON.stringify(items)) {

                    debug("[Info][background] No Settings.")

                } else {

                    debug("[Info][background] Load Settings.")

                    storage = JSON.parse(items.settings)

                    if (!storage.enableBgMode) {

                        debug(!storage.enableBgMode)

                        clickMode(tab.id)

                    } else {

                        debug(!items.enableBgMode)

                        backgroundMode(tab.id)
                    }

                }
            })
        } else {

            commonMode(tab.tabId)
            debug("[Info][background] Only work on specific page.")

        }

    })

}



/* 监听设置改变的消息*/
chrome.storage.onChanged.addListener(function (changes, namespace) {

    debug("[Info][background] Update storage.")

    loadSettings()
})


/* 监听来自content的消息，立即发送更新数据 */
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if ("wakeup" == message) {
        sendUpdatedSettings()
        sendResponse(sender, "[Recv][background->contentscripts] I am awake.")
    } else if ("done" == message) {
        sendResponse(sender, "[Recv][background->contentscripts] Good job.")
    }

})

debug("[Info][background] Load extension.")



/* 监听菜单设置事件 */

chrome.contextMenus.onClicked.addListener(function (callback) {
    if ('openSetting' == callback.menuItemId) {
        chrome.runtime.openOptionsPage()
    } else if ('feedback' == callback.menuItemId) {

        chrome.tabs.create({ url: "https://support.qq.com/product/142808" })

    }
})

var storage

/* 第一次运行设置，当然这个基本没用 */

chrome.runtime.onInstalled.addListener(function (details) {
    if ("install" == details.reason) {

        debug("[Info][background] First run settings.")
        chrome.runtime.openOptionsPage()
    }

    chrome.contextMenus.create({

        title: "设置功能",
        contexts: ["browser_action"],
        id: 'openSetting'
    }, function () { })

    chrome.contextMenus.create({

        title: "反馈建议",
        contexts: ["browser_action"],
        id: 'feedback'
    }, function () { })


})

var globalDebugMode = true


loadSettings()//载入

setIcon()//设置图标规则