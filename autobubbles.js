var linkElementId = "linkhere";
var svgElementId = "svgBackground";
var circlesColor = "#fff";
var backgroundColor = "#304049";
var maxWidth = 1440;

function img_and_link() {
  $('#'+linkElementId).append(
    $('<a>')
      .attr('href-lang', 'image/svg+xml')
      .attr('href', 'data:image/svg+xml;utf8,' +  unescape($('svg')[0].outerHTML).split("#").join("%23"))
      .text('Download')
  );
}
/** my code **/
function DisplaySphere(containerRadius, childrenRadius){
	this.x = Math.random() * containerRadius;
  this.y = Math.random() * containerRadius;
  this.depthValue = Math.random() * .5;
  this.z = this.depthValue * containerRadius;
  this.radius = childrenRadius;
  this.maxLines = 2;
  this.currentLines = 0;
  
  this.calculateDepthRadius = function() {
  	return this.radius * this.depthValue;
  }
  
  this.canAddLine = function() {
  	if (this.currentLines < this.maxLines){
    	this.currentLines++;
      return true;
    } else {
    	return false;
    }
  }
}

function DisplayLine(originSphere, destinationSphere){
	this.pointOne = originSphere;
  this.pointTwo = destinationSphere;
}

function ContainerArea(containerRadius) {
	this.radius = containerRadius;
  this.children = [];
  this.lines = [];
  
   this.createChildren = function(numberOfChildren, childrenRadius, connectRadius){
    for (var i = 0; i < numberOfChildren; i++){
      this.children.push(new DisplaySphere(this.radius, childrenRadius));	
    }
    this.makeConnections(connectRadius);
  }
  
  //build the lines between two points based on the connect radius, do not make lines to itself
  this.makeConnections = function(connectRadius) {
  	for (var i = 0; i < this.children.length; i++){
      for (var i2 = 0; i2 < this.children.length; i2++){
      	if ((i == i2) ||
        (Math.abs(this.children[i].x-this.children[i2].x) > connectRadius || Math.abs(this.children[i].y-this.children[i2].y) > connectRadius || Math.abs(this.children[i].z-this.children[i2].z) > connectRadius)){
  	       continue;
        }
        if (!this.children[i].canAddLine() && !this.children[i2].canAddLine()){
        	continue;
        }
        
        this.lines.push(new DisplayLine(this.children[i], this.children[i2]))
    	}
    }
  }
  
  this.render = function(svgElement, backgroundColor, detailColor) {
  var graphicsHTML='';
	
  	//create gradient
    var gradientAttributes=""
    graphicsHTML+='<defs><radialGradient id="backgroundGradient" cx=".65" cy=".55" r=".75"><stop offset="0%" stop-color="'+detailColor+'"/><stop offset="0%" stop-color="'+backgroundColor+'"/></radialGradient></defs>'

		//render background
  	var backgroundAttributes=" width='"+this.radius+"' height='"+this.radius+"'   fill='url(#backgroundGradient)'";
  	graphicsHTML+="<rect "+backgroundAttributes+"></rect>";
    
    //render circles
    for (var i = 0; i < this.children.length; i++){
    	var circleAttributes=" cx='"+this.children[i].x+"' cy='"+this.children[i].y+"' r='"+this.children[i].calculateDepthRadius()+"' stroke='"+detailColor+"' fill='"+detailColor+"' style='opacity:"+this.children[i].depthValue+";'";
    	graphicsHTML+= "<circle "+circleAttributes+"></circle>"
    }
    
    //render lines
    for (var i = 0; i < this.lines.length; i++) {
    	var lineAttributes=" x1='"+this.lines[i].pointOne.x+"' y1='"+this.lines[i].pointOne.y+"' x2='"+this.lines[i].pointTwo.x+"' y2='"+this.lines[i].pointTwo.y+"' stroke='"+detailColor+"' stroke-width='2' style='opacity:"+this.lines[i].pointTwo.depthValue+"'"
      graphicsHTML+="<line "+lineAttributes+"></line>"
      
    }
    
    //add it all to svg
    svgElement.innerHTML = graphicsHTML;
  }
}

var container = new ContainerArea(maxWidth);
container.createChildren(555, 25, 90);
container.render(document.getElementById(svgElementId), backgroundColor, circlesColor);
img_and_link();
