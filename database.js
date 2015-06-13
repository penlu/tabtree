// within a session, we associate tab IDs with node IDs
tabassocs = {}

/* add node to history tree
 *
 * url = the url of the new page
 * time = the time at which the new page was loaded
 * newtabid = the tab ID associated with this page
 * origtabid = the tab ID that originated this page (may be left blank for root)
 *
 * the return value is the SHA1 hash associated with this node
 */
function addNode(url, time, newtabid, origtabid) {
    
}

/* get the information associated with this node
 * returns a JSON object:
 * {
 *   "url": the url,
 *   "time": timestamp,
 *   "children": [a list of child nodes]
 * }
 */
function getNode(node) {
    
}

/* get roots of browsing tree
 * returns a list of parentless nodes
 */
function getRoots() {

}

function tabClose(tabid) {

}

