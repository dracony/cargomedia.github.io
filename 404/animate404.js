function Animate404(canvasContainer, radius, delay) {
	this.canvasContainer = canvasContainer;
	this.radius = radius;
	this.delay = delay;
	
	this.messages = [
		{
			matrix: [this.symbols.four, this.symbols.zero, this.symbols.four],
			yOffset:2,
			r: 63, 
			g: 180, 
			b: 255
		},
		{
			matrix: [
					this.symbols.s, this.symbols.o, this.symbols.r, this.symbols.r, this.symbols.y],
			yOffset:13,
			r: 241, 
			g: 134, 
			b: 30
		},
		
	]
	
	this.nextFrame = null;
	
	
	this.canvas = canvasContainer.querySelector('canvas');
	
	this.context = this.canvas.getContext('2d');
	this.context.shadowBlur = 4; 
	this.context.shadowColor = "#ffffff";
	
	this.lines = [];
	this.step = 2*this.radius+1;
	
	window.addEventListener('resize', this.reset.bind(this) );
	this.reset();
}

Animate404.prototype.reset = function() {
	this.height = this.canvasContainer.offsetHeight;
	this.width = this.canvasContainer.offsetWidth;
	this.canvas.setAttribute('width', this.width);
	this.canvas.setAttribute('height', this.height);
	this.nextFrame = null;
	
	this.initGrid();
}

Animate404.prototype.initGrid = function() {
	this.lines = [];
	for(var i=0; i<=this.height/(this.radius*2);i++){
		this.lines[i] = [];
		for(var j=0; j<this.width/(this.radius*2);j++){
			this.lines[i][j] = this.getRandomAlpha();
		}
	}
	
	this.calculateMessageOffsets();
	
	this.requestFrame();
}

Animate404.prototype.requestFrame = function() {
	var self = this;
	if(window.requestAnimationFrame){
		requestAnimationFrame(this.frame.bind(this))
	}else{
		window.setTimeout(function(){
			self.frame(new Date().getTime());
		}, this.delay)
	}
	
}

Animate404.prototype.calculateMessageOffsets = function() {
	for(var i=0;i<this.messages.length;i++) {
		var messageWidth = 0;
		var matrix = this.messages[i].matrix;
		for(var j=0;j<matrix.length;j++){
			messageWidth=messageWidth+matrix[j][0].length+1;
		}
		this.messages[i].offset = Math.floor((this.lines[0].length-messageWidth)/2);
	}
}

Animate404.prototype.frame = function(timestamp) {
	if (this.nextFrame === null) 
		this.nextFrame = timestamp;
		
	if (this.nextFrame <= timestamp) {
		this.nextFrame = timestamp + this.delay;
		this.shiftLines();
		this.drawFrame();
	}
	this.requestFrame();
}

Animate404.prototype.getRandomAlpha = function() {
	return Math.floor(Math.random()*4)/10+0.1;
}

Animate404.prototype.symbols = {
	four: [
			[0,0,0,0,0,1,1,0,0],
			[0,0,0,0,1,1,1,0,0],
			[0,0,0,1,1,1,1,0,0],
			[0,0,1,1,0,1,1,0,0],
			[0,1,1,0,0,1,1,0,0],
			[1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1],
			[0,0,0,0,0,1,1,0,0],
			[0,0,0,0,0,1,1,0,0],
			[0,0,0,0,0,1,1,0,0],
		],
	zero: [
			[0,0,1,1,1,0,0],
			[0,1,1,1,1,1,0],
			[1,1,1,0,1,1,1],
			[1,1,0,0,0,1,1],
			[1,1,0,0,0,1,1],
			[1,1,0,0,0,1,1],
			[1,1,0,0,0,1,1],
			[1,1,1,0,1,1,1],
			[0,1,1,1,1,1,0],
			[0,0,1,1,1,0,0],
	], 
	s: [
		[0,1,1,1],
		[1,1,0,0],
		[0,0,1,1],
		[1,1,1,0]
	],
	o: [
		[0,1,1,0],
		[1,0,0,1],
		[1,0,0,1],
		[0,1,1,0]
	],
	r: [
		[1,1,1,0],
		[1,0,0,1],
		[1,1,1,0],
		[1,0,0,1]
	],
	y: [
		[1,0,0,1],
		[0,1,0,1],
		[0,0,1,0],
		[0,1,0,0]
	]
};

Animate404.prototype.drawFrame = function() {
	this.context.clearRect(0,0,this.width,this.height)
	for(var i=0; i<this.lines.length;i++){
		for(var j=0; j<this.lines[i].length;j++){
			this.drawCircle(j*this.step, i*this.step, "rgba(255, 255, 255, "+this.lines[i][j]+")");
		}
	}
	
	for(var i=0;i<this.messages.length;i++) {
		var message = this.messages[i];
		var offset = this.messages[i].offset;
		var matrix = this.messages[i].matrix;
		
		for(var j=0; j<matrix.length;j++){
			this.drawSymbol(matrix[j], offset, message.yOffset, message.r, message.g, message.b);
			offset = offset + matrix[j][0].length+1;
		}
	}
	
}

Animate404.prototype.drawCircle = function(x, y, color) {
	this.context.beginPath();
	this.context.arc(x+this.radius, y+this.radius, this.radius, 0, 2 * Math.PI, false);
	this.context.fillStyle = color;
	this.context.fill();
}

Animate404.prototype.drawSymbol = function(symbol, xOffset, yOffset, r, g, b) {
	for(var i=0; i<symbol.length;i++){
		for(var j=0; j<symbol[i].length;j++){
			if(symbol[i][j] == 1)
				this.drawCircle((j+xOffset)*this.step, (i+yOffset)*this.step, "rgba("+r+", "+g+", "+b+", "+(this.lines[i+yOffset][j+xOffset]+0.7)+")");
		}
	}
}

Animate404.prototype.shiftLines = function(lines) {
	for(var i=0; i<this.lines.length;i++){
		this.lines[i].splice(0,1);
		this.lines[i].push(this.getRandomAlpha());
	}
}