
function checkURL(urlstr) {
    return urlstr.includes("teaching.applysquare.com") && ( urlstr.includes("T-Work-treviewinfo") || urlstr.includes("S-Lesson-index"))
}

function sendUpdatedSettings() {
    chrome.storage.sync.get("settings", function (items) {
        
        console.log("[Info][background] Load Settings.")

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            console.log(tabs[0])
            chrome.tabs.sendMessage(tabs[0].id, {cmd: 'update', info: items.settings}, function(response) {
                console.log("[Send][background->contentscripts] Send you something new!")
                console.log(response) //发送给contentscript设置
            });  

        })
    })
}

function clickMode(id) {
    
    /* 设置点击运行模式 */

    console.log("[Info][background] Change to Click Mode.")

    /* 改变按钮样式 */
    chrome.browserAction.enable(id)
    chrome.browserAction.setTitle({title:"当前正以点击模式运行",tabId:id},function () {})
    chrome.browserAction.setBadgeText({text:"Click",tabId:id}, function(){})
    chrome.browserAction.setBadgeBackgroundColor({color:"#4a90e2",tabId:id}, function(){})


    
}

function clickModeScript(id) {

    /* 点击模式 */

    /* 监听按钮点击事件，是对应网站则执行 */

    chrome.browserAction.onClicked.addListener(function setClickMode(tab) {
        if (checkURL(tab.url)) {

            chrome.tabs.executeScript(null, { file: "contentscript.js" })

        }else{

            console.log("[Info][background] Only work on specific page.")
        }
        
    })
}

function backgroundMode(id) {

    console.log("[Info][background] Change to Background Mode.")

    chrome.browserAction.enable(id)
    chrome.browserAction.setTitle({title:"当前正以背景模式运行",tabId:id},function () {})
    chrome.browserAction.setBadgeText({text:"On",tabId:id}, function(){})
    chrome.browserAction.setBadgeBackgroundColor({color:"#2d8652",tabId:id}, function(){})
}

function backgroundModeScript(id) {

    /* 背景模式 */
    
}


function commonMode(id) {

    console.log("[Info][background] Change to Common Mode.")

    chrome.browserAction.setTitle({title:"当前非可用页面",tabId:id},function () {})
    chrome.browserAction.setBadgeText({text:"",tabId:id}, function(){})
    chrome.browserAction.disable(id)

}

function loadSettings() {
    
chrome.storage.sync.get("settings", function (items) {

    console.log("[Info][background] Load Settings.")

    
    if ('{}' === JSON.stringify(items)) {

        /* 第一次运行设置 */
        console.log("[Pass][background] First run.")

    }else {
        
        storage = JSON.parse(items.settings)

        if (!storage.totalControl){

            console.log("[Info][background] Run in Click Mode.")

        }else{

            console.log("[Info][background] Run in Background Mode.")
        }
    }
})
}

function reloadSettings() {
    
    chrome.storage.sync.get("settings", function (items) {
    
        console.log("[Info][background] Reload Settings.")

        storage = JSON.parse(items.settings)

        if (!storage.totalControl){

            clickMode()

        }else{

            backgroundMode()
        }
    })
}

function setIcon() {

    commonMode()

    chrome.tabs.onActivated.addListener(function (info) {

        chrome.storage.sync.get("settings", function (items) {

            

            if ('{}' === JSON.stringify(items)) {

                console.log("[Info][background] No Settings.")

            }else{
    
            console.log("[Info][background] Load Settings.")

            storage = JSON.parse(items.settings)
    
            chrome.tabs.get(info.tabId,function (tab) {
                if (checkURL(tab.url)) {
    
                        if (!storage.totalControl){

                            clickMode(tab.tabId)
                
                        }else{

                            backgroundMode(tab.tabId)
                        }
    
                    }else{


                        commonMode(tab.tabId)
                        console.log("[Info][background] Only work on specific page.")
                    }
                })
            }
        })
    })

    chrome.tabs.onUpdated.addListener(function (id, change, tab) {
        
        if (tab.active && checkURL(tab.url) ){

            chrome.storage.sync.get("settings", function (items) {

                if ('{}' === JSON.stringify(items)) {
    
                    console.log("[Info][background] No Settings.")
    
                }else{
        
                console.log("[Info][background] Load Settings.")
    
                storage = JSON.parse(items.settings)

                if (!storage.totalControl){
                                
                    console.log(!storage.totalControl)

                    clickMode(tab.id)
        
                }else{
                    
                    console.log(!items.totalControl)

                    backgroundMode(tab.id)
                }
        
                }
            })
        }else{

            commonMode(tab.tabId)
            console.log("[Info][background] Only work on specific page.")

        }

    })

}



/* 监听设置改变的消息，立即发送更新数据 */
chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log("[Info][background] Update storage.")
    sendUpdatedSettings()
})


/* 监听来自content的消息，无论什么情况一旦唤醒立即发送更新数据 */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){

    if ("wakeup" == message){
        sendUpdatedSettings()
    }
    sendResponse(sender, "[Recv][background->contentscripts] I am awake.")

})

console.log("[Info][background] Load extension.")

chrome.contextMenus.create({
    title: "设置功能",
    contexts: ["browser_action"],
    id: 'openSetting'},function () {})

chrome.contextMenus.onClicked.addListener(function (callback) {
    if ('openSetting' == callback.menuItemId){
        chrome.runtime.openOptionsPage()
    }
})

chrome.runtime.onInstalled.addListener(function (details) {
    if ("install" == details.reason){
            /* 第一次运行设置，当然这个基本没用 */
            console.log("[Info][background] First run settings.")
            chrome.runtime.openOptionsPage()
    }
    
})

loadSettings()
setIcon()