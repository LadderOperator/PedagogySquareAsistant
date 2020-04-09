console.log("Load extension.")

chrome.contextMenus.create({
    title: "设置功能",
    contexts: ["browser_action"],
    id: 'openSetting'},function () {})

chrome.contextMenus.onClicked.addListener(function (callback) {
    if ('openSetting' == callback.menuItemId){
        chrome.runtime.openOptionsPage()
    }
})

loadSettings()

function sendUpdatedSettings() {
    chrome.storage.sync.get("settings", function (items) {
        
        console.log("Reload Settings.")

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            console.log(tabs[0])
            chrome.tabs.sendMessage(tabs[0].id, {cmd: 'update', info: items.settings}, function(response) {
                console.log(response) //发送给contentscript设置
            });  

        })
    })
}

function clickMode() {
    
    /* 设置点击运行模式 */

    /* 改变按钮样式 */
    chrome.browserAction.setBadgeText({text:"Click"}, function(){})
    chrome.browserAction.setBadgeBackgroundColor({color:"#098b54"}, function(){})


    
}

function clickModeScript() {

    clickMode()

    /* 监听按钮点击事件，是对应网站则执行 */

    chrome.browserAction.onClicked.addListener(function setClickMode(tab) {
        if (tab.url.includes("teaching.applysquare.com") && 
        ( tab.url.includes("T-Work-treviewinfo") ||
        tab.url.includes("S-Lesson-index"))) {

            chrome.tabs.executeScript(null, { file: "contentscript.js" })

        }else{

            console.log("Only work on specific page.")
        }
        chrome.browserAction.onClicked.removeListener(setClickMode)
        
    })
}

function backgroundMode() {
    chrome.browserAction.setBadgeText({text:"On"}, function(){})
    chrome.browserAction.setBadgeBackgroundColor({color:"#283349"}, function(){})
}


function loadSettings() {
    
chrome.storage.sync.get("settings", function (items) {

    console.log("Load Settings.")

    if ('{}' === JSON.stringify(items)) {

        /* 第一次运行设置 */
        console.log("No settings, perhaps first run.")
        chrome.runtime.openOptionsPage()
    }else {
        console.log(items.settings)
        if (!items.settings.totalControl){

            clickModeScript()

        }else{

            backgroundMode()
        }
    }
})
}

function reloadSettings() {
    
    chrome.storage.sync.get("settings", function (items) {
    
        console.log("Load Settings.")
    
        if ('{}' === JSON.stringify(items)) {
    
            /* 第一次运行设置 */
            console.log("No settings, perhaps first run.")
            chrome.runtime.openOptionsPage()
        }else {
            console.log(items.settings)
            if (!items.settings.totalControl){
                clickMode()
            }else{
                backgroundMode()
            }
        }
    })
    }


chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log("Update storage.")
    sendUpdatedSettings()
})


    /* 监听来自content的消息，一旦唤醒立即发送更新数据 */
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){

        if ("wakeup" == message){
            sendUpdatedSettings()
        }
        sendResponse(sender, "Background:OK")

    })