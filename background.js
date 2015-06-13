// transition type listings
var linkTransitions = ["link", "manual_subframe", "form_submit"]
var rootTransitions = ["typed", "generated", "keyword", "keyword_generated", "auto_bookmark"]

// save a transition from one URL to another
// transitions FROM a null URL represent new roots
// transitions TO a null URL represent tab closes
function saveTransition(orig, dest) {

}


chrome.webNavigation.onCommitted.addListener(
	function(details)
	{
		var type = details.transitionType
		if(type !== "auto_subframe") {
			console.log("============================== NEW NODE ==============================")
			console.log("URL: ".concat(details.url))

			console.log("Type: ".concat(type))
			console.log("TabID: ".concat(details.tabId))

			if (details.transitionQualifiers.indexOf("forward_back") == -1)	// user didn't use forward/back arrows
			{
				if (linkTransitions.indexOf(type) != -1)		// user clicked link
				{
					console.log("LINK ACTION")
				}
				else if (rootTransitions.indexOf(type) != -1)	// user typed something into the box
				{
					console.log("ROOT ACTION")
				}

				//handleUserAction(details.tabId)
			}
		}
	}
)


// removes events from caches when tab is removed
function tabRemoved(tabId)
{
	console.log("~~~~~~~~~~~~~~~~~~ TAB REMOVED ~~~~~~~~~~~~~~~~~~")
	console.log("Tab Removed: ".concat(tabId))

}
chrome.tabs.onRemoved.addListener(tabRemoved)


// keep track of current active tab
var activeTab = -1

chrome.tabs.onActivated.addListener(
	function (activeInfo)
	{
		activeTab = activeInfo.tabId
	}
)