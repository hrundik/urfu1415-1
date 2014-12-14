// author MrEqu
;
window.onload=function()
{
	
	(function(jQuery){
		  function svgWrapper(el) {
		    this._svgEl = el;
		    this.__proto__ = el;
		    Object.defineProperty(this, "className", {
		      get:  function(){ return this._svgEl.className.baseVal; },
		      set: function(value){    this._svgEl.className.baseVal = value; }
		    });
		    Object.defineProperty(this, "width", {
		      get:  function(){ return this._svgEl.width.baseVal.value; },
		      set: function(value){    this._svgEl.width.baseVal.value = value; }
		});
		    Object.defineProperty(this, "height", {
		      get:  function(){ return this._svgEl.height.baseVal.value; },
		      set: function(value){    this._svgEl.height.baseVal.value = value; }
		    });
		    Object.defineProperty(this, "x", {
		      get:  function(){ return this._svgEl.x.baseVal.value; },
		      set: function(value){    this._svgEl.x.baseVal.value = value; }
		    });
		    Object.defineProperty(this, "y", {
		      get:  function(){ return this._svgEl.y.baseVal.value; },
		      set: function(value){    this._svgEl.y.baseVal.value = value; }
		    });
		    Object.defineProperty(this, "offsetWidth", {
		      get:  function(){ return this._svgEl.width.baseVal.value; },
		      set: function(value){    this._svgEl.width.baseVal.value = value; }
		    });
		    Object.defineProperty(this, "offsetHeight", {
		      get:  function(){ return this._svgEl.height.baseVal.value; },
		      set: function(value){    this._svgEl.height.baseVal.value = value; }
		    });
		  };

		jQuery.fn.wrapSvg = function() {
		  return this.map(function(i, el) {
		   if (el.namespaceURI == "http://www.w3.org/2000/svg" && !('_svgEl' in el)) 
		     return new svgWrapper(el);
		   else
		     return el;
		   });
		 };
		})(window.jQuery);

	var width = 800,
	    height= 500;
	
	
	//creates svg inner tag
	function makeSVG(tag, attrs) {
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        applyAttributes(el,attrs);
        return el;
    };
    
    function applyAttributes(el,attrs){
    	 for (var k in attrs)
             el.setAttribute(k, attrs[k]);
    }

  
    //SCENE contains graphical objects
    //methods:
    //addShape - adds shape
    //delShape - deletes shape
	function Scene(width,height)
	{
		this.svg =$("<svg id='svg' style='background-color:black':></svg>");
		this.svg.css( "width",width);
		this.svg.css( "height",height);
		this.svg.appendTo("body");
		
		this.objects={};
		this.width = width;
		this.height = height;
		
		this.shapes = {};
		this.addShape=function(name,shape){this.shapes[name]=shape;};
		this.getShape = function(name) {return shapes[name];};
		
		this.addFigure = function(name,type,params,is_material){
			var element =  makeSVG(type,params);
			this.svg.append(element);
			if(is_material)
				this.objects[name] =element;
			
			
			return element;
		};
		this.get = function(name){return this.objects[name];};
		
	};
	
	//scene - Scene
	//position - left = false |right = true 
	function Player(name,position,scene)
	{
		this.scene = scene;
		this.position = position;
		this.width = 30;
		this.height = 100;
		this.name = name;
		this.h = 0;
	
		this.lastMovement = [0,0];
		
		if(position)
		{		this.p1 = {	x: 10, y: (this.scene.height-this.height)/2,
					width: this.width, height: this.height,
					style:"fill:blue;stroke:pink;stroke-width:5;\
							fill-opacity:0.1;stroke-opacity:0.9"
				 };
		}
		else
		{		this.p1 = {	x:  this.scene.width -this.width - 10, y: (this.scene.height-this.height)/2,
					width: this.width, height: this.height,
					style:"fill:blue;stroke:pink;stroke-width:5;\
							fill-opacity:0.1;stroke-opacity:0.9"
				 };
		};
		this.x = this.p1.x;
		this.y = this.p1.y;
		this.shape = this.scene.addFigure("player1","rect",this.p1,true);
		
		this.left   =  function() { return this.x;  };
		this.right  =  function() { return this.x + this.width; };
		this.top    =  function() { return this.y ; };
		this.bottom =  function() { return this.y + this.height; };	
		
		
		this.move = function(direct){
			if( direct<0 && ((this.y+ direct) >= -20)||
				direct>0 && ((this.y+this.height/2 + direct) <= this.scene.height) ){
					this.y+=direct;
					this.lastMovement[0] = getTimeStamp();
					this.lastMovement[1] = direct;
					this.update();
			}
			//alert("kuku"+direct+" "+this.h+" "+this.x+" "+this.p1.x)
		};
		
		this.update = function()
		{
			this.p1['x'] = this.x;
			this.p1['y'] = this.y;
			 applyAttributes(this.shape,this.p1);
		};
		
		this.scene.addShape(name,this);
		
		
		
	};

	//Mathematical vector
	function Vector(x,y){
		
		this.x = x;
		this.y = y;
		
		
		this.len = function(){
			return Math.sqrt(this.x*this.x+this.y*this.y);
		};
		
		this.normalize = function(){
			var l = this.len();
			this.x = this.x/l;
			this.y = this.y/l;
		};
		
		//subtraction of this vector and other
		this.sub = function(other){
			return new Vector(this.x - other.x,this.y - this.y);
		};
		
		//addition of this vector and other
		this.add = function(other){
			return new Vector(this.x + other.x,this.y + this.y);
		};
		
		//multiplication real coefficient
		this.coeff = function(coeff){
			return new Vector(coeff*this.x,coeff*this.y);
		};
		
		//dot product
		this.dot = function(other){
			return new Vector(other.x*this.x,other.y*this.y);
		};
		
	};
	
	//return reflected vector from given vector
	//params:
	//vector::(float,float) - vecor to reflect
	//side::int - side of rect, sides of the rect must be parralell to the axes 
	//
	//_________1_________
	//|					|
	//|					|
	//4					2
	//|					|
	//|________3________|
	function getReflected(vector,side){
		switch(side){
		case 1:
			vector.y = - vector.y;
			break;
		case 2:
			vector.x = - vector.x;
			break;
		case 3:
			vector.y = - vector.y;
			break;
		case 4:
			vector.x = - vector.x;
			break;
		default: break;
			
		}
		vector.normalize();
		return vector;
	};
	
	//shapeSides - array of real numbers, {"left":left,"right":right,"top":top,"bottom":bottom}
	//pointi:: Vector - section
	//returns true if has collision else returns false
	function checkCollision(shapeSides,x1,y1,x2,y2){
		var l,r,t,b;
		var dx,dy;
		l = shapeSides["left"];
		r = shapeSides["right"];
		t = shapeSides["top"];
		b = shapeSides["bottom"];
		
		if(l>=x1&&l>=x2)
			return false;
		
		if(r<=x1&&r<=x2)
			return false;
		
		if(t>=y1&&t>=y2)
			return false;
		if(b<=y1&&b<=y2)
			return false;
		
		if(t>=y1&&r<=x1&&t>=y2&&r<=x2)
			return false;
		if(t>=y1&&l>=x1&&t>=y2&&l>=x2)
			return false;
		if(b<=y1&&r<=x1 && b<=y2&&r<=x2)
			return false;
		if(b<=y1&&l>=x1 && b<=y2&&l>=x2)
			return false;
		
		
		dx = x2-x1;
		dy = y2-y1;
		if(x1 >= r && y2 < t||(x1 >= r && y2 > b))
		{
			y2=y2+(x2-r)/dx*dy;
			x2 = r;
			if( y2<t && y2>b)return false;
		}
		
		if(x2 > r && y1 < t || x2 > r && y1 > b)
		{
			y1=y1+(x1-r)/dx*dy;
			x1 = r;
			if( y1<=t && y1>=b)return false;
		}
		if(x1 < l && y2 < t ||x1 < l && y2 > b )
		{
			y2=y2+(x2-l)/dx*dy;
			x2 = l;
			if( y2<t && y2>b)return false;
		}
		
		if(x2 < l && y1 < t||x2 < l && y1 > b)
		{
			y1=y1+(x1-l)/dx*dy;
			x1 = l;
			if( y1<t && y1>b)return false;
		}
		
		return true;
	}
	

	function Ball(name,radius,direction,speed,scene){
		
		//ball appears in the center
		this.x = width/2;
		this.y = height/2;
		this.radius = radius;
		
		this.direction = direction;
		this.speed = speed;
		//scene has all visible objects
		this.scene = scene;

		//add into scene the ball object
		this.scene.addShape(name,this);
		
		//name of the ball;
		this.name = name;

		//out event listeners listen to count scores
		this.outEventListeners = [];
		
		//ball css stype
		this.p =  {cx: this.x, cy: this.y, r:radius, stroke: 'black', 'stroke-width': 2, fill: 'red'};

		//ball as dom object
		this.shape = this.scene.addFigure(name,"circle",this.p,true);
		
		//check the point is on the shape
		this.isOnShape = function(x,y)
		{
			var cx = x - this.x;
			var cy = y - this.y;
			return cx*cx + cy*cy < this.radius * this.radius;
		};
		
		//checks that the location from next movement is in the the scene rect
		//if the next move will be out of that rect then it returns index of side 
		//else returns 0
		this.isInScene = function()
		{
			var x = this.x +this.direction.x*this.speed;
			var y = this.y +this.direction.y*this.speed;
						
			if((x - this.radius)<0)
				return 4; 
			if((x + this.radius)>width)
				return 2; 
			if((y - this.radius)<0)
				return 1;
			
			//alert("is in scene="+((y+ this.radius)- height));
			if((y + this.radius)>height)
				return 3; 
			
			
			return 0;
			
		};
		
		//for each shape in shapes
		//checks intersection
		//returns intersection shape
		this.hasInsctnWithOtherShape = function(){
			var s ;
			var sl,sr,st,sb;
			
			for(var k in this.scene.shapes)
			{
				if(k!=this.name)
				{
					s = this.scene.shapes[k];
					sl = s.left();
					sr = s.right();
					st = s.top();
					sb = s.bottom();
					
					//alert(s.name)
					//alert(c1+" "+c2+" "+c3+" "+c4)
					if(checkCollision({left:sl,right:sr,top:st,bottom:sb},
							this.x,this.y,
							this.x+this.direction.x*this.speed,
							this.y+this.direction.y*this.speed))
					{
					    //alert("direct="+this.direction.x+ " " +this.direction.y)
						return s;
					}
				}
			}
			return null;
		};
		
		//get the border coordinate
		this.left   =  function() { return this.x - this.radius; };
		this.right  =  function() { return this.x + this.radius; };
		this.top    =  function() { return this.y - this.radius; };
		this.bottom =  function() { return this.y + this.radius; };	
		

		//moves the ball, check the intersections, and changes the direction
		//if ball go out to the left/right side, calls OnOut() function for each outEventLestener
		this.move = function(){

			var side = this.isInScene();
			var shape ;
			var dx=0,dy=0;
			if(side)
			{
				
				switch(side)
				{
				case 1:
					//alert("side="+side );
					dy =  -this.y ;
					dx = dy/this.direction.y*this.direction.x;
					this.x = dx+this.x;
					this.y = dy+this.y;
					//alert("dx="+dx+" dy="+dy);
					this.direction = getReflected(this.direction,side);
					break;
				case 3:
					dy = height - this.y ;
					dx = dy/this.direction.y*this.direction.x;
					this.x = dx+this.x;
					this.y = dy+this.y;
					//alert("dx="+dx+" dy="+dy+"side="+side);
					//alert("dirx="+this.direction.x+" diry="+this.direction.y+" side="+side);
					this.direction = getReflected(this.direction,side);
					//alert("dirx="+this.direction.x+" diry="+this.direction.y+" side="+side);
					break;
				case 2:
				case 4:
					//alert("42case dx="+dx+" dy="+dy);
						for(var i = 0;i< this.outEventListeners.length;i++)
						{
							//alert( this.outEventListeners[i]);
							this.outEventListeners[i].OnOut(side);
						}
						this.reset(side-3);
						this.x = width/2;
						this.y = height/2;
					break;
					
				};
				while(this.isInScene() === side){
					this.x = this.x + 0.01*this.direction.x *speed;
					this.y = this.y + 0.01*this.direction.y *speed;
				};
			}
			else if((shape = this.hasInsctnWithOtherShape())!==null)
			{
				if(this.direction.x > 0)
				{
					dx = shape.left()-this.x;
					dy = dx/this.direction.x*this.direction.y;
					this.direction = getReflected(this.direction,4);
					if(getTimeStamp()-shape.lastMovement[0]<500)
						this.direction.y += 0.1*shape.lastMovement[1]/(shape.lastMovement[1]!=0?Math.abs(shape.lastMovement[1]):1);
					
					//alert("dx="+dx+"  dy="+dy);
					//alert("dx="+this.direction.x + "  dy="+this.direction.y);
				}
				else if(this.direction.x < 0)
				{
					dx = shape.right()-this.x;
					dy = dx/this.direction.x * this.direction.y;
					this.direction = getReflected(this.direction,2);
					if(getTimeStamp()-shape.lastMovement[0]<500)
						this.direction.y += 0.1*shape.lastMovement[1]/(shape.lastMovement[1]!=0?Math.abs(shape.lastMovement[1]):1);
					//alert("dx="+dx+"  dy="+dy);
					//alert("dx="+this.direction.x + "  dy="+this.direction.y);
				}
				
				this.x = dx+this.x;
				this.y = dy+this.y;
				
				this.direction.normalize();
				//alert("x="+this.x +"  y="+this.y );
				
				this.x = this.x + this.direction.x *speed;
				this.y = this.y + this.direction.y *speed;
			}
			else
			{
				this.x =this.x + this.direction.x*speed;
				this.y =this.y + this.direction.y*speed;
			}
			
			this.update();
		};
		
		//resets direction 
		this.reset = function(direct) {
			this.direction.x = direct/Math.abs(direct);
			this.direction.y = 0;
		};
		
		//updates image, or dom object
		this.update = function()
		{
			this.p['cx'] = this.x;
			this.p['cy'] = this.y;
			 applyAttributes(this.shape,this.p);
		};
	};
	
	//returns current time
	function getTimeStamp()
	{
		var time = new Date();
		return time.getTime();
	}
	
	
	
	function getChar(event) {
			//alert(event.charCode);
			  if (event.which == null) {
			    return String.fromCharCode(event.keyCode); // IE
			  } else if (event.which!=0 ) {
			    return String.fromCharCode(event.which)  ; // the rest
			  } else {
			    return null; // special key
			  }
			};
			
	function PingPong()
	{
		this.scene = new Scene(width,height);
		
		
		this.player1Score = 0;
		this.player2Score = 0;
		this.player1ScoreElement = this.scene.addFigure("player1score",
				'text',{ x:width*1/4,   y:height/2 ,
						style:"fill:white;font-size:50;fill-opacity:0.6;"}
				,false);
		this.player2ScoreElement = this.scene.addFigure("player2score",
				'text',{x:width*3/4,y:height/2 ,
						style:"fill:white;font-size:50;fill-opacity:0.6;"},
				false);
		
		this.player1ScoreElement.id = "player1";
		this.player2ScoreElement.id = "player2"
		
		this.update = function(){
			this.player1ScoreElement.innerHTML = this.player1Score;
			this.player2ScoreElement.innerHTML = this.player2Score;
		};
		
		
		
		this.player1 =new Player("p1",true,this.scene);
		this.player2 =new Player("p2",false,this.scene);
		this.interval = 3000;
		this.OnOut = function(this_){
			var _this = this_;
			
			return function(side){
			if(side === 2){
				_this.interval = 3000;
				//console.log("player2 + 1");
				_this.showMessage("player1 + 1",1500);
				_this.player1Score++;
			} else if(side===4){
				_this.interval = 3000;
				_this.showMessage("player2 + 1",1500);
				_this.player2Score++;
			};
			_this.update();
		};
		
		}(this);
		this.keydownhandleFunc = function(_this_){
			var _this = _this_;
			//alert("dsaf");
			return function(event){keyPressEvent(_this.player1,_this.player2,event);};
		}(this);

		this.keyuphandleFunc = function(_this_){
			var _this = _this_;
			return function(event){keyUpEvent(_this.player1,_this.player2,event);};
		}(this);
		
		this.ball =new Ball("test",10,new Vector(1,0),15,this.scene);
		
		this.reset = function(){
			this.player1Score = 0;
			this.player2Score = 0;
		};
		
		
		
		//this.message = "START";
		this.messageHTMLElem = this.scene.addFigure("message",
				'text',{x:width/2-100,y:height/2 ,
						style:"fill:white;font-size:0;fill-opacity:0.0;"},
				false);
		this.messageHTMLElem.id = "message";
		this.messageHTMLElem.innerHTML = this.message;
		
		this.showMessage =function(_this){
			var this_ = _this;

		    return function(message,durat) {
					this_.messageHTMLElem.innerHTML = message;
					$( "#message" ) 
					.stop(true,true)
					.animate({
					    fontSize:50,
					    fillOpacity:0.5
					}, {
						duration: durat/2,
						complete: function() {
							$( "#message" ) 
							.stop(true,true).css({
							    fontSize:0,
							    fillOpacity:0.0
							});
							this_.messageHTMLElem.innerHTM = "";
						}
					})

					
			};
		}(this);
		//alert($("circle").attr('cy'));
		this.ball.outEventListeners.push(this);
		setTimeout( function(_this_){
			
				var _this = _this_;
				
				return function F(){ 
							_this.ball.move();
							setTimeout(F,_this.interval);
							if(_this.interval !== 25)
								_this.interval = 25;
							
						};
				}(this) 
				,this.interval );
	}
	
	
	var keys= { 
		w:false,
		s:false,
		o:false,
        	l:false,
	};


	function keyPressEvent(player1,player2,event){
		var c =  getChar(event);
		if(keys[c])return;
		var player=null,speed;
		switch( c ){
		case 'W':
			player = player1;
			speed = -10;
			break;
		case 'S': 
			player = player1;
			speed = 10;
			break;
		case 'O': 
			player = player2;
			speed = -10;
			break;
		case 'L': 
			player = player2;
			speed = 10;
			break;
		};
		//
		keys[c]  = true;
		if(player!==null)
			(function F(){
				//alert(keys[c])
				if(keys[c]){
					
					player.move(speed);
					setTimeout(F,30);	
				}
			})();
			
		
	};

	function keyUpEvent(player1,player2,event){
		c =  getChar(event);
		switch(c){
		case 'W':
		case 'S': 
		case 'O': 
		case 'L': 
			keys[c]=false;
		default:break;
		};
	};
		

	
	var game = new PingPong();
	game.showMessage("START",3000);
	$('body').keydown(game.keydownhandleFunc);
	$('body').keyup(game.keyuphandleFunc);
	
	//setTimeout(function(){game.showMessage("emir");},5000);
};
