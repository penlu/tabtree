// transition type listings
var linkTransitions = ["link", "manual_subframe", "form_submit"]
var rootTransitions = ["typed", "generated", "keyword", "keyword_generated", "auto_bookmark"]

// save a transition from one URL to another
// transitions FROM a null URL represent new roots
// transitions TO a null URL represent tab closes
function saveTransition(orig, dest) {

}

// cache storage for navigation events
var navigationEventType = {}

chrome.webNavigation.onCommitted.addListener(
	function(details)
	{
		console.log("============================== NEW NODE ==============================")
		console.log("URL: ".concat(details.url))

		var type = details.transitionType
		console.log("Type: ".concat(type.toUpperCase()))

		if (details.transitionQualifiers.indexOf("forward_back") == -1)	// user didn't use forward/back arrows
		{
			if (linkTransitions.indexOf(type) != -1)		// user clicked link
			{
				console.log("LINK ACTION")
				navigationEventType[details.tabId] = "link"
			}
			else if (rootTransitions.indexOf(type) != -1)	// user typed something into the box
			{
				console.log("ROOT ACTION")
				navigationEventType[details.tabId] = "root"
			}

			handleUserAction(details.tabId)
		}
	}
)

// cache storage for tab events, specifically URL data
var tabEventUrl = {}

chrome.tabs.onUpdated.addListener(
	function(tabId, changeInfo, tab)
	{
		console.log("~~~~~~~~~~~~~~~~~~ TAB UPDATED ~~~~~~~~~~~~~~~~~~")
		console.log("Tab URL: ".concat(changeInfo.url))

		if (typeof changeInfo.url !== "undefined")
		{
			tabEventUrl[tabId] = changeInfo.url
		}

		// attempt to handle an action
		handleUserAction(tabId)
	}
)

chrome.tabs.onReplaced.addListener(
	function(addedTabId, removedTabId)
	{
		console.log("~~~~~~~~~~~~~~~~~~ TAB REPLACED ~~~~~~~~~~~~~~~~~~")
		console.log("Added Tab: ".concat(addedTabId))
		console.log("Removed Tab: ".concat(removedTabId))

		var addedTabInfo = chrome.tabs.get(addedTabId,
			function(tab)
			{
				console.log("Added Tab URL: ".concat(tab.url))
				if (typeof tab.url !== "undefined")
				{
					tabEventUrl[addedTabId] = tab.url
				}

				console.log("Added tab status: ".concat(tab.status))
		
				// asynchronous callback needs synchronization
				tabRemoved(removedTabId)

				if (tab.status == "complete") {
					handleUserAction(addedTabId) // handle preloaded pages
				}
			}
		)
	}
)

// removes events from caches when tab is removed
function tabRemoved(tabId)
{
	console.log("~~~~~~~~~~~~~~~~~~ TAB REMOVED ~~~~~~~~~~~~~~~~~~")
	console.log("Tab Removed: ".concat(tabId))

	delete navigationEventType[tabId]
	delete tabEventUrl[tabId]
}
chrome.tabs.onRemoved.addListener(tabRemoved)

// called after piece of user data has been contributed
// if all user data has been aggregated, then perform navigation saving etc
function handleUserAction(tabId) {
	console.log("Handle user action call, tab ID: ".concat(tabId))
	if (typeof navigationEventType[tabId] !== "undefined" && typeof tabEventUrl[tabId] !== "undefined")
	{
		console.log("!!!!!!!!!!!! HANDLING NOW !!!!!!!!!!!!")
		var userAction =
		{
			"url": tabEventUrl[tabId],
			"actiontype": navigationEventType[tabId]
		}
		console.log("Handled URL: ".concat(userAction.url))
		console.log("Handled Transition Type: ".concat(userAction.actiontype))

		// remove entries after use
		delete navigationEventType[tabId]
		delete tabEventUrl[tabId]
	}
}



// keep track of current active tab
var activeTab = -1

chrome.tabs.onActivated.addListener(
	function (activeInfo)
	{
		activeTab = activeInfo.tabId
	}
)