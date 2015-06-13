// within a session, we associate tab IDs with node IDs
tabassocs = {}

function showerrors() {
    if (typeof chrome.runtime.lastError != "undefined") {
        console.log("!!! DB ERROR adding node: " + chrome.runtime.lastError)
    }
}

/* add node to history tree
 *
 * url = the url of the new page
 * time = the time at which the new page was loaded
 * newtabid = the tab ID associated with this page
 * origtabid = the tab ID that originated this page (may be left blank for root)
 *
 * the return value is the SHA1 hash associated with this node
 */
function addNode(url, time, origtabid, newtabid) {
    nodeid = Sha1.hash(url + "\0" + time.toString()) // a hash of the url and the time
    tabassocs[newtabid] = nodeid
    chrome.storage.sync.set({nodeid : {
        "url" : url,
        "time" : time,
        "children" : []
    }}, showerrors)

    if (origtabid != null) {
        console.log("DB ADDNODE: origtabid is " + origtabid)
        orignodeid = tabassocs[origtabid] // TODO check if this doesn't exist
        orignode = chrome.storage.sync.get(orignodeid, function (items) {
            items[orignodeid].children.push(nodeid)
            chrome.storage.sync.set({orignodeid : items[orignodeid]}, showerrors)
        }) // TODO asynchronous callbacks :/
    } else {
        chrome.storage.sync.get("rootlist", function (items) {
            if (typeof items["rootlist"] == "undefined") {
                items["rootlist"] = []
            }
            items["rootlist"].push(nodeid)
            chrome.storage.sync.set({"rootlist" : items["rootlist"]}, showerrors)
        })
    }
}

/* get the information associated with the node that has the given ID
 * unfortunately the storage API is asynchronous so you must pass in a handler
 * handler is passed a JSON object:
 * {
 *   "url": the url,
 *   "time": timestamp,
 *   "children": [a list of child nodes]
 * }
 */
function getNode(node, handler) {
    chrome.storage.sync.get(node, function (items) {
        handler(items[node])
    })
}

/* get roots of browsing tree
 * handler is passed a list of parentless nodes
 */
function getRoots(handler) {
    chrome.storage.sync.get("rootlist", function (items) {
        handler(items["rootlist"])
    })
}

function tabClosed(tabid) {
    delete tabassocs[tabid]
}

