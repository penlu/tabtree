Current problems:
 - Tab ID was/is given as 32 when clicking a link but not opening in a new tab, which is not a tab ID that exists, until it is, in which case our kludge now attributes some tab opens to the wrong tab and crashes
 - Chrome omnibox google search prefetches the search page without the query
 - back/forward buttons cause refreshes or link clicks-- either way, does not result in a new node being added...
