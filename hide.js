var curNode = $( "div:contains('Recommended articles'):last" );
console.log(curNode.get(0));
if (curNode) {
    curNode.hide();
}
