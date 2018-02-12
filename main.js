var selectColors = ["red", "black", "skyblue","lightgreen", "yellow", "hotpink","coral"];
		var colorCount = 0;
		var div = document.getElementsByClassName('select')[0], x1 = 0, y1 = 0, x2 = 0, y2 = 0;
		var imageDiv = document.getElementById("imgDiv");
		var iHt = getComputedStyle(imageDiv).getPropertyValue("height");
		var iWd = getComputedStyle(imageDiv).getPropertyValue("width");
		var rect = imageDiv.getBoundingClientRect();
		var imgDivTop = rect.top;
		var imgDivLeft = rect.left;
		var rects = [];
		var count = -1;
		var isNewRect = true;
		var allX = [], allY = [];
		var activeRect;
		var rectStack = [];

		function arrRemove(array, element) {
			const index = array.indexOf(element);
			
			if (index !== -1) {
				array.splice(index, 1);
			}
		}

		function findXMatch(val, dir, bound) {
			console.log(allX, val, dir, bound);
			if(val < bound){
				if(dir > 0){
					if(val >= allX[allX.length-1]) return val;
					else{
						for(var i = 0; i < allX.length; i++){
							if(val < allX[i] && allX[i] < bound) return allX[i];
						}				
						return val;
					}
				}
				else{
					if(val <= allX[0]) return val;
					else{
						for(var i = allX.length-1; i >= 0 ; i--){
							if(val > allX[i]) return allX[i];
						}
					}
				}
			}
			else{
				if(dir > 0){
					if(val >= allX[allX.length-1]) return val;
					else{
						for(var i = 0; i < allX.length; i++){
							if(val < allX[i]) return allX[i];
						}			
					}
				}
				else{
					if(val <= allX[0]) return val;
					else{
						for(var i = allX.length-1; i >= 0 ; i--){
							if(val > allX[i] && allX[i] > bound) return allX[i];
						}
						return val;
					}
				}
			}
		}
		function findYMatch(val, dir, bound) {
			console.log(allY, val, dir, bound);
			if(val < bound){
				if(dir > 0){
					if(val >= allY[allY.length-1]) return val;
					else{
						for(var i = 0; i < allY.length; i++){
							if(val < allY[i] && allY[i] < bound) return allY[i];
						}				
						return val;
					}
				}
				else{
					if(val <= allY[0]) return val;
					else{
						for(var i = allY.length-1; i >= 0 ; i--){
							if(val > allY[i]) return allY[i];
						}
					}
				}
			}
			else{
				if(dir > 0){
					if(val >= allY[allY.length-1]) return val;
					else{
						for(var i = 0; i < allY.length; i++){
							if(val < allY[i]) return allY[i];
						}			
					}
				}
				else{
					if(val <= allY[0]) return val;
					else{
						for(var i = allY.length-1; i >= 0 ; i--){
							if(val > allY[i] && allY[i] > bound) return allY[i];
						}
						return val;
					}
				}
			}
		}
		function isValid() {
			if (Math.abs(x1 - x2) > 10 && Math.abs(y1 - y2) > 10) {
				return true;
			}
			return false;
		}

		function resetSelectBox(){
			div.style.visibility = 'hidden';
			div.style.border = '2px dotted red';
			div.style.left = x1 + 'px';
			div.style.top = y1 + 'px';
			div.style.width = "0px";
			div.style.height = "0px";
			
			x1 = x2; y1 = y2;
		}
		function reCalc() {
			var x3 = Math.min(x1, x2);
			var x4 = Math.max(x1, x2);
			var y3 = Math.min(y1, y2);
			var y4 = Math.max(y1, y2);
			
			
			div.style.left = x3 + 'px';
			div.style.top = y3 + 'px';
			div.style.width = x4 - x3 + 'px';
			div.style.height = y4 - y3 + 'px';
			//console.log("reCalc : ",x1,y1, x2,y2);
			
			if( isCalibrationMode && (calibrationSide)){
				div.style.width = x4 - x3 - 4 + 'px';
				div.style.height = y4 - y3 - 4 + 'px';
			}
		}

		function drawRect() {
			if(isValid()) {
				var x3 = Math.round(Math.min(x1, x2));
				var x4 = Math.round(Math.max(x1, x2));
				var y3 = Math.round(Math.min(y1, y2));
				var y4 = Math.round(Math.max(y1, y2));
				count++;
				rects.push(document.createElement('div'));
				rects[count].style.backgroundColor = selectColors[(colorCount++)%selectColors.length];
				rects[count].style.left = x3 + 'px';
				rects[count].style.top = y3 + 'px';
				
				if( isRightCalibrated ){
					rects[count].style.width = x4 - x3 + 'px';
					isRightCalibrated = false;
				}else{
					rects[count].style.width = x4 - x3 + 4 + 'px'; 
				}
				if( isBottomCalibrated ){
					rects[count].style.height = y4 - y3 + 'px';
					isBottomCalibrated = false;
				} else {
					rects[count].style.height = y4 - y3 + 4 + 'px';
				}
				document.getElementById("imgDiv").appendChild(rects[count]);
				rects[count].classList.add('imgPortion');
				
				allX.push(Math.round(parseInt(getComputedStyle(rects[count]).getPropertyValue('left'))));
				allX.push(Math.round(rects[count].getBoundingClientRect().right +  pageXOffset));
				allX.sort(function (a, b) { return a - b; });
				allY.push(Math.round(parseInt(getComputedStyle(rects[count]).getPropertyValue('top'))));
				allY.push(Math.round(rects[count].getBoundingClientRect().bottom + pageYOffset));
				allY.sort(function (a, b) { return a - b; });
				
			}
		}
		
		onmouseover = function(e){
			//console.log(e.target);
			if(e.target.classList[0] === 'imgPortion'){
				e.stopPropagation();
				activeRect = e.target;
				e.target.addEventListener("mouseleave", function(){
					if(e.target.classList[1] === 'imgPortion-clicked'){
						//console.log("a");
						e.target.classList.remove('imgPortion-clicked');
					}
					activeRect = null;
				});
				
			}
		}
		
		function showImageInCanvas(){
			var trgtImg = document.getElementById('image');
			
			var left,top, leftExtra, topExtra, imgHeight, imgWidth, trgtImgHeight, trgtImgWidth,
			left = parseInt(activeRect.style.left);
			top = parseInt(activeRect.style.top);
			imgHeight = parseInt(activeRect.style.height);
			imgWidth = parseInt(activeRect.style.width);
			//boundaryCheck

			/*
			console.log(top,left);
			if( top < 31) { topExtra = 31 - top; top = 0; imgHeight -=topExtra; }
			if( left < 31) { leftExtra = 31 - left; left = 0; imgWidth -=leftExtra;}
			console.log(top,left, );
			*/

			var canvasDiv = document.getElementById('canvasDiv');
			canvasDiv.style.display = 'block';
			canvasDiv.style.width = imgWidth + 'px';
			canvasDiv.style.height = imgHeight + 30 + 'px';
			canvasDiv.style.marginLeft = '-' + (parseInt(activeRect.style.width)/2) + 'px';
			canvasDiv.style.marginTop = '-' + (parseInt(activeRect.style.height)/2 + 15) + 'px';

			var c = document.getElementById('myCanvas');
			c.style.width = parseInt(activeRect.style.width) + 'px';
			c.width = parseInt(activeRect.style.width) ;
			c.style.height = parseInt(activeRect.style.height) + 'px';
			c.height = parseInt(activeRect.style.height) ;
			var ctx=c.getContext('2d');
			ctx.clearRect(0, 0, c.width, c.height);

			ctx.drawImage(trgtImg,parseInt(activeRect.style.left)-30, parseInt(activeRect.style.top)-30,
								parseInt(activeRect.style.width),parseInt(activeRect.style.height),
								0,0,parseInt(activeRect.style.width),parseInt(activeRect.style.height)); 

		}

		onkeydown = function(e){
			if(e.ctrlKey){
				if(activeRect){
					//console.log("a");
					activeRect.classList.add('imgPortion-clicked');
					showImageInCanvas();
				}
			}
		}

		function performCloseBtnClick(){
			document.getElementById('canvasDiv').style.display = "";
			closeBtnClick = false;
		}
		
		var closeBtnClick = false;
		onmousedown = function (e) {
			if(e.target.id === 'closeBtn'){
				closeBtnClick = true;
			}
			e.preventDefault();
			calibrationReset();
			isNewRect = true;
			x1 = x2 = e.clientX + pageXOffset;
			y1 = y2 = e.clientY + pageYOffset;

			resetSelectBox();
			div.style.visibility = "visible";
		};

		onmousemove = function (e) {
			if (e.target.nodeName === 'BODY'){
				return;
			}
			if(!isCalibrationMode) {
				if(getComputedStyle(div).getPropertyValue("visibility") == "visible") {
					x2 = e.clientX + pageXOffset;
					y2 = e.clientY + pageYOffset;
					reCalc();
				}
			}
		};

		var calibrationSide = 0;
		var isCalibrationMode = false;
		var isRightCalibrated = false, isBottomCalibrated = false;
		function calibrationReset(){
			isCalibrationMode = false;
			isBottomCalibrated = false;
			isBottomCalibrated = false;
		}

		onmouseup = function (e) {
			if(closeBtnClick){
				performCloseBtnClick();
			}
			if(Math.abs(x2-x1) < 10 && Math.abs(y2-y1) < 10){
				resetSelectBox();
			}
			if(!isCalibrationMode) {
				if( x1 > x2 ) { var temp = x1; x1 = x2; x2 = temp; } 
				if( y1 > y2 ) { var temp = y1; y1 = y2; y2 = temp; } 
				isCalibrationMode = true; //left
				calibrationSide = 1;
				highLightSide("Left");
			}
		};
		
		
		
		function calibrate(dir){
			if(calibrationSide == 1){
				x1 = findXMatch(x1, dir, x2);
			} else if(calibrationSide == 2){
				isRightCalibrated = true;
				x2 = findXMatch(x2, dir, x1);
			} else if(calibrationSide == 3) {
				y1 = findYMatch(y1, dir, y2);
			} else if(calibrationSide == 4) {
				isBottomCalibrated = true;
				y2 = findYMatch(y2, dir, y1);
			}
		}
		
		function highLightSide(side){
			div.style.border = '2px dotted red';
			if(side !== "None") eval("div.style.border" + side + " = '2px solid yellow';");
		}
		
		onkeyup = function (e) {
			//console.log(e);
			document.getElementById("keyDiv").innerHTML = e.code;
			if ( e.keyCode == 32) {
					//console.log(window.x, window.y);
					//console.log("space : ",x1, y1, x2, y2);
			}

			if(getComputedStyle(div).getPropertyValue("visibility") == 'hidden'){
				if ( e.keyCode == 90 && e.ctrlKey) {
					document.getElementById("keyDiv").innerHTML = "ctrl + z";
					if(count >= 0){
						var x3 = parseInt(rects[count].style.left);
						var x4 = parseInt(rects[count].style.left) + parseInt(rects[count].style.width);
						var y3 = parseInt(rects[count].style.top);
						var y4 = parseInt(rects[count].style.top) + parseInt(rects[count].style.height);
						arrRemove(allX,x3);
						arrRemove(allX,x4);
						arrRemove(allY,y3);
						arrRemove(allY,y4);
						//console.log(allX, allY, x3, y3, x4, y4);
						rects[count].parentNode.removeChild(rects[count]);
						count--;
					}
				}
				if ( e.keyCode == 89 && e.ctrlKey) {
					document.getElementById("keyDiv").innerHTML = "ctrl + y";
					if(count < rects.length - 1){
						count++;
						document.getElementById("imgDiv").appendChild(rects[count]);
						var x3 = parseInt(rects[count].style.left);
						var x4 = parseInt(rects[count].style.left) + parseInt(rects[count].style.width);
						var y3 = parseInt(rects[count].style.top);
						var y4 = parseInt(rects[count].style.top) + parseInt(rects[count].style.height);
						allX.push(x3,x4); allX.sort(function (a, b) { return a - b; });
						allY.push(y3,y4); allY.sort(function (a, b) { return a - b; });
						//console.log(allX, allY, x3, y3, x4, y4);
					}
				}
			}
			if(!isCalibrationMode) return;
			
			if(e.keyCode == 8) {
				calibrationSide = 0;
				resetSelectBox();
				calibrationReset();
			} else if ( e.keyCode == 13) {
				calibrationSide = 0;
				drawRect();
				resetSelectBox();
				calibrationReset();
			} else if (e.keyCode == 87 ) {
				calibrationSide = 3;
				highLightSide("Top");
			} else if (e.keyCode == 68 ) {
				calibrationSide = 2;
				highLightSide("Right");
			} else if (e.keyCode == 83 ) {
				calibrationSide = 4;
				highLightSide("Bottom");
			} else if (e.keyCode == 65 ) {
				calibrationSide = 1;
				highLightSide("Left");
			}
			 

			if(calibrationSide == 1 || calibrationSide == 2){
				if(e.keyCode === 37) { 
					calibrate(-1);
					reCalc();
				} else if (e.keyCode === 39) {
					calibrate(1);
					reCalc();
				} else if( e.keyCode == 27){
					if(calibrationSide == 1){
						highLightSide("Right");
					} else{
						highLightSide("Top");
					}
					calibrationSide++;
				}
			} else if(calibrationSide == 3 || calibrationSide == 4) {
				if(e.keyCode === 38) { 
					calibrate(-1);
					reCalc();
				} else if (e.keyCode === 40) {
					calibrate(1);
					reCalc();
				} else if( e.keyCode == 27){
					if(calibrationSide == 3){
						highLightSide("Bottom");
					} else{
						highLightSide("None");
					}
					calibrationSide++;
				}
			}
			if(calibrationSide > 4) {
				calibrationSide = 0;
				drawRect();
				resetSelectBox();
				calibrationReset();
			}
		}