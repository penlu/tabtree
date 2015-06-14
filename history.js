getRoots(function (rootList){
	alert(rootList.length)
	for(i = 0; i < rootList.length; i++){
		getNode(rootList[i], function (node){
			addUrl(node, document.getElementsByTagName('body')[0], 0);
		});
	}
});

function addUrl(node, parentTag, indent){
	var divTag = document.createElement("div");
	var aTag = document.createElement("a");
	divTag.style.textIndent = indent.toString() + "px";
	aTag.setAttribute("href", node.url);
	aTag.innerText = node.url;
	divTag.appendChild(aTag);
	parentTag.appendChild(divTag);
	if(node.children.length != 0){
		for(i = 0; i < node.children.length; i++){
			getNode(node.children[i], function (childNode){
				addUrl(childNode, divTag, indent + 10);
			});
		}
	}
}