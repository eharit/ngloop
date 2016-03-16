//Copyright © 2015 Volume Ltd. All rights reserved.  http://www.volumeglobal.com
//This software may contain code obtained from the Public Domain. 
/****************************** Version info *************************************/
//For new features update the 1st number. For bug fixes update the second number.
var customJSversion = "19.1";
var customJSLastUpdatedBy = "Simon Bench";
var customJSLastUpdated = "01/05/15";
// 15 amended syntax error (14 not in use so no need to worry. updatePanel. 
// 15.1 Fixed Firefox alpha redraw issue by forcing selected rgba divs with alpha 0.00 to alpha 0.01.
// 15.2 click event handlers were not scoping correctly.  Now use the function.apply method instead.  - adClickEvent etc 
// 15.3 Dynamic panels are broken in FireFox as it considers render stacks differently to Chrome.  Updated to new method. 
// 16 Added glowMe function back in.
// 17 New playRootSoundSubbed function that shows subtitles.
// 17.1 Uncommented setScale & getScale lines so functions work correctly with Chrome 36.0
// 17.2 added ability to turn subtitles on and off with course settings
// 18 new post message for getting dynamic content which is saved in an XLS
// 18.1 changed the opacity of subtitle background.
// 18.2 amended local dynamic variable access
// 18.3 highlightText is now class compatible 
// 18.4 playRootSoundSubbed updated to include a minimum wait time of 2 seconds
// 18.5 adjusted left position of subtitleDiv in playRootSoundSubbed to allow for padding
// 18.6 Increased z-index for sub titles. 
// 19.0 new post message to skip page
// 19.1 updated custom panel to use top middle and bottom
/*********************************************************************************/
 
(function($){
	/*  Post Message Listener and screen init functions  */
	//do not add var to this.  If you do Edge cannot look at it.
	waitSylCountMulti = 0.1
	waitSecsDiv = 1;
	resourcesButtonCentre = 0;
	glossaryButtonCentre = 0;
	subtitlesOn = true;
	
	var loadInterval;
	
	var postMessageReturnOrigin;
	var startCallBack;
	var queryString;
	
	UNKNOWN = 0;
	AUDIO_OFF = 1;
	AUDIO_LOADING = 2;
	AUDIO_READY = 3;
	
	audioStatus = UNKNOWN;
	var dividersSet = false;
	var resourceButSet = false;
	var glossaryButSet = false;
	var touchSet = false;
	var subtitleSet = false;
	
	var timedWindowCallBack;
	
	var trustedDomains = ["http://rory", "http://192.168.10.1"];
	var localMode = false;
	var _this = this;
	
	function postMessageReceiver(e){
		var data = e.originalEvent.data;
		var origin = e.originalEvent.origin;
		var source = e.originalEvent.source;		
		
		if(trustedDomains.indexOf(origin) > -1){
			//Came from trusted site.
			switch(data){
				case 'audioStatus_off':
					audioStatus = AUDIO_OFF;
				break;
				case 'audioStatus_false':
					audioStatus = AUDIO_LOADING;
				break;
				case 'audioStatus_true':
					audioStatus = AUDIO_READY;
				break;
				case 'timedWindowClosed':
					timedWindowCallBack();
				break;
				default:
					//check for variable data
					var splitData = data.split(',');
					if(splitData[0] == 'waitDividers'){
						//this is the returning waitDividers
						waitSylCountMulti = parseFloat(splitData[1]);
						waitSecsDiv = parseFloat(splitData[2]);
						dividersSet = true;
					}else if(splitData[0] == 'audioComplete'){
						if(endFunctions[splitData[1]] != undefined){
							//this audio had end function saved.  RUN IT
							endFunctions[splitData[1]].call.apply(_this, endFunctions[splitData[1]].arg)
						}
					}else if(splitData[0] == 'resourcesButtonCentre'){
						resourceButSet = true;
						resourcesButtonCentre = parseInt(splitData[1]);
					}else if(splitData[0] == 'glossaryButtonCentre'){
						glossaryButSet = true;
						glossaryButtonCentre = parseInt(splitData[1]);
					}else if(splitData[0] == 'touchEnabled'){
						if(splitData[1] == 'true'){
							touchTest = true;
						}else{
							touchTest = false;
						}
						touchSet = true;
					}else if(splitData[0] == 'varDelivery'){
						//varDelivery,foo,123
						var convertedValue;
						var jsonString = splitData[2];
						
						if(jsonString !== "undefined"){
							jsonString = jsonString.replace(/\*/g, ',');
							convertedValue = $.parseJSON(jsonString);
						}else{
							convertedValue = undefined;
						}
						
						$(window).trigger('rootVarGet', [splitData[1], convertedValue]);
					}else if(splitData[0] == 'subtitleStatus'){	
						if(splitData[1] == 'true'){
							subtitlesOn = true;
						}else{
							subtitlesOn = false;
						}
						subtitleSet = true;
					}else if(splitData[0] == 'dynamicDelivery'){
						var convertedValue;
						var jsonString = splitData[2];
						
						if(jsonString !== "undefined"){
							jsonString = jsonString.replace(/\*/g, ',');
							convertedValue = $.parseJSON(jsonString);
						}else{
							convertedValue = undefined;
						}
						$(window).trigger('rootDynmicGet', [splitData[1], convertedValue]);
					}
				break; 
			}
		}
	}
	
	connectToInterface = function(callBack){
		forceAlpha();

		startCallBack = callBack;
		queryString = getQS();
		if(queryString.returnOrigin == undefined || queryString.localMode == 'true'){
			//not using the interface	
			trace('queryString.returnOrigin undefined.  No interface');
			localMode = true;
			
			try{
				waitSylCountMulti = parent.settings.waitSylCountMultiplier;
				waitSecsDiv = parent.settings.waitSecsDivider;
				touchTest = parent.touchEnabled;
				subtitlesOn = parent.settings.subtitlesEnabled;
				resourcesButtonCentre = parent.$('#resource_button').offset().left + (parent.$('#resource_button').width()/2) - parent.$('#contentFrame').offset().left;
				glossaryButtonCentre = parent.$('#glossary_button').offset().left + (parent.$('#glossary_button').width()/2) - parent.$('#contentFrame').offset().left;
				
				
				
			}catch(e){
				console.log('settings error ' + e.toString())
				resourcesButtonCentre = 0;
				glossaryButtonCentre = 0;
			}
			
			if(parent.settings !== undefined && parent.settings.audioEnabled){
				loadInterval = setInterval(function(){
					if(parent.audioLoaded == true){
						//Content is ready to play.
						parent.screenReadyAndPlaying();
						startCallBack();
						clearInterval(loadInterval);
					}
				}, 10);
			}else{
				try{
					parent.screenReadyAndPlaying();
				}catch(e){}
				startCallBack();
			}
		}else{
			//using the interface.
			trace('Connecting to Interface via postMessage.');
			$(window).on('message', postMessageReceiver);

			trustedDomains.push(queryString.returnOrigin);
			parent.postMessage('getWaitDividers', queryString.returnOrigin);
			parent.postMessage('resourcesButtonCentre', queryString.returnOrigin);
			parent.postMessage('glossaryButtonCentre', queryString.returnOrigin);
			parent.postMessage('touchEnabled', queryString.returnOrigin);
			parent.postMessage('subtitleStatus', queryString.returnOrigin);
			//now wait for all settings		
			loadInterval = setInterval(function(){
				if(audioStatus == AUDIO_OFF || audioStatus == AUDIO_READY){
					if(dividersSet == true && resourceButSet == true && glossaryButSet == true && touchSet == true && subtitleSet == true){
						//Content is ready to play.
						parent.postMessage('screenReadyAndPlaying', queryString.returnOrigin);
						startCallBack();
						clearInterval(loadInterval);
					}
				}else{
					parent.postMessage('audioStatus', queryString.returnOrigin);
				}
			}, 10);
		}
	}
	

	/* communicate to the interface */
	var soundFuncDelay;
	var isTimingout = false;
	var souondEndFunction;
	var soundArguments;
	
	var endFunctions = {};
	
	playRootSound = function(soundName, defaultTime, endFunction, arguments){
		var argsPass = arguments;
		soundArguments = argsPass;
		souondEndFunction = endFunction;
		try{
			if(localMode){
				parent.soundManager(soundName, endFunction, 0.2, defaultTime, argsPass);
			}else{
				var hasEndFunction = false;
				if(endFunction != undefined){
					endFunctions[soundName] = {call:endFunction, arg:arguments}
					hasEndFunction = true;
				}
				parent.postMessage('playAudio,'+soundName+','+defaultTime+','+hasEndFunction, queryString.returnOrigin);
			}
		}catch(e){
			console.log("Would play sound : "+ soundName);
			if(defaultTime != undefined){
				//waitSeconds(symLink.getSymbol(this),2);
				isTimingout = true;
				soundFuncDelay = setTimeout(function(){ 
					endFunction.apply(this, argsPass);
					isTimingout = false;
				}, defaultTime*1000);
			}
		}		
	}
	
	var subbedEndFunction;
	var subtitleDiv;

	
	
	playRootSoundSubbed = function(soundName, defaultTime, endFunction, arguments, subTitle){
		if(subtitlesOn){
			subbedEndFunction = {call:endFunction, arg:arguments};
			
			//create the visuals
			
			subtitleDiv = document.createElement('div');
	
			$(subtitleDiv).append(document.createElement('p'));
	
			$(subtitleDiv).find('p').text(subTitle);
			
			$(subtitleDiv).css({position:'absolute', height:'auto', width:'900', bottom:30, left:50, padding:10, backgroundColor:'rgba(30,30,30,0.9)', opacity:0, 'z-index':10000});
			
			$(subtitleDiv).find('p').css({color:'#FFFFFF', textShadow:'0px 0px 5px #000000', padding:0, margin:0, fontFamily:'Verdana, Arial, sans-serif'});
			
			$('body').append(subtitleDiv);
			
			TweenMax.to(subtitleDiv, .5, {opacity:1, onComplete:function(){
				var newDefaultTime = (defaultTime < 2) ? 2 : defaultTime;
				playRootSound(soundName, newDefaultTime, subbedSoundEnded, null);
			}});
			
		}else{
			playRootSound(soundName, defaultTime, endFunction, arguments);
		}
	}
	
	subbedSoundEnded = function(){
		TweenMax.to(subtitleDiv, .5, {opacity:0, onComplete:function(){
			$(subtitleDiv).remove();
			subbedEndFunction.call.apply(_this, subbedEndFunction.arg);
		}});
	}
	
	stopAllSounds = function(args){
		var argsPass = args;
		try{
			if(localMode){
				parent.rootStopAllSounds(argsPass);
			}else{
				if(args == undefined){
					args = false;
				}
				parent.postMessage('rootStopAllSounds,'+args, queryString.returnOrigin);
			}
		}catch(e){
			if(isTimingout){
				clearTimeout(soundFuncDelay);
				if(args == true){
					if(souondEndFunction != undefined){
						souondEndFunction.apply(this, soundArguments);
						souondEndFunction = undefined;
					}
				}
			}
			//console.log("Stop all sounds does not exist");	
		}
	}
	
	rootNextPage = function(){
		console.log('Screen completed. Next page has been called.');
		try{
			if(localMode){
				parent.nextPage();
			}else{
				parent.postMessage('nextPage', queryString.returnOrigin);
			}
		}catch(e){

		}
	}
	
	rootSkipPage = function (){
		console.log('Skipping page.');
		try{
			if(localMode){
				parent.skipPage();
			}else{
				parent.postMessage('skipPage', queryString.returnOrigin);
			}
		}catch(e){
			console.log('Could not skip page, maybe not in interface');
		}
	}
	
	playOn = function(symbolToPlay){
		symbolToPlay.play();
	}
	
	
	/* openTimedWindow new for 8.5.1*/
	openTimedWindow = function (id, callback) {
		timedWindowCallBack = callback;
		
		if(localMode){
			try{
				parent.openTimedWindow(id, callback);
			}catch(e){
				trace("Could not contact interface");
				console.log(e.toString());
				callback();
			}
		}else{
			parent.postMessage('openTimedWindow,'+id, queryString.returnOrigin);
			
		}
	}
	
	rootSetVar = function(name, value, lmsSave){
		if(lmsSave == undefined){
			lmsSave = false;	
		}
		//json-2 the value to a json string
		var jsonValue = JSON.stringify(value);
		//commas are used to split the data at the other end so change commas to stars
		jsonValue = jsonValue.replace(/,/g,'*');
		
		if(localMode){
			try{
				parent.saveRootVar(name, jsonValue, lmsSave);
			}catch(e){
				console.log(e.toString());
				trace('Could not save root var. parent.saveRootVar undefined');
			}
		}else{
			parent.postMessage('setVar,' + name + ',' + jsonValue + ',' + String(lmsSave), queryString.returnOrigin);
		}
	}
	
	rootGetVar = function(varName){
		if(localMode){
			try{
				var tmp = parent.loadRootVar(varName);
				$(window).trigger('rootVarGet', [varName, tmp]);
			}catch(e){
				console.log(e.toString());
				trace('Could not get root var. parent.loadRootVar undefined');
				$(window).trigger('rootVarGet', [varName, null]);
			}
		}else{
			parent.postMessage('getVar,' + varName, queryString.returnOrigin);
		}
	}
	
	rootGetDynamic = function(varName){
		if(localMode){
			try{
				var tmp = parent.dynamicData['_'+varName];
				$(window).trigger('rootDynmicGet', [varName, tmp]);
			}catch(e){
				console.log(e.toString());
				trace('Could not get root dynamic. parent.dynamicData undefined');
				$(window).trigger('rootDynmicGet', [varName, null]);
			}
		}else{
			parent.postMessage('getDynamic,_'+varName, queryString.returnOrigin);
		}
	}
	
	stopFlashingNext = function(){
		if(localMode){
			try{
				parent.render.stopFlashingNext();
			}catch(e){
				trace('No interface to stop the flashing button.');
			}
		}else{
			parent.postMessage('stopFlashingNext', queryString.returnOrigin);
		}
	}
	
	/* makes life easier */
	function getQS(){
		var queryString = String(window.location).split("?")[1];
		if(queryString == undefined){
			queryString = "";
		}
		
		queryString = queryString.split("&");
		var queryObj = {};
		
		for(var i = 0; i < queryString.length; i ++){
			var qPair = queryString[i].split("=");
			queryObj[qPair[0]] = qPair[1];
		}
		return queryObj;
	}
	
	
	waitSeconds = function(symb,secondsToWait) {
		var WSsymbol;
		waitTime = secondsToWait;
		WSsymbol = symb;
		WSsymbol.stop();
		WSsymbol.timer = setTimeout(function(){WSsymbol.play()},(secondsToWait * 1000)); //1000 = 1 second
	}
	
	getWaitSyls = function(numOfSyls) {
		secsToWait = numOfSyls * waitSylCountMulti;
		secsToWait = secsToWait/waitSecsDiv;
		return secsToWait;
	};
	
	/* fade instructions and flash them thrice */
	
	flashInst = function(targ){		
		targ.show();
		TweenMax.fromTo(targ, 1, {autoAlpha: 0}, {autoAlpha: 1, immediateRender: true});				
		TweenMax.fromTo(targ, 0.01, {visibility: "hidden"}, {visibility: "visible", delay: 1.3, yoyo:true,  repeat:6, repeatDelay: 0.15});
	}
	
	fadeInst = function(targ){		
		TweenMax.killTweensOf(targ)
		TweenMax.to(targ, .5, {autoAlpha: 0});				
	}
	
	jQuery.fn.flashInst = function(){
		flashInst($(this));
	}
	
	jQuery.fn.fadeInst = function(){
		fadeInst($(this));
	}
	
	jQuery.fn.fadeIn = function(endFunction){
		var toVars = {autoAlpha:1};
		if(endFunction){
			toVars.onComplete = endFunction;
		}
		TweenMax.fromTo($(this), 0.5, {autoAlpha:0}, toVars);
	}
	
	jQuery.fn.fadeOut = function(endFunction){
		var toVars = {autoAlpha:0};
		if(endFunction){
			toVars.onComplete = endFunction;
		}
		TweenMax.fromTo($(this), 0.5, {autoAlpha:1}, toVars);
	}
	
	/* a 'trace' function a la Flash */
	
	trace=function(msg){
		try{
		console.log(msg);
		}catch(e){
		}
	}
	
	
	
	var symLink = undefined;
	setLink = function(theSym){
		symLink = theSym;
	}
	
	
	jQuery.fn.setScale = function(scaleX, scaleY){
		if($(this).css('transform')) $(this).css('transform','scale('+scaleX+','+scaleY+')');
		if($(this).css('-webkit-transform')) $(this).css('-webkit-transform','scale('+scaleX+','+scaleY+')');
		if($(this).css('-moz-transform')) $(this).css('-moz-transform','scale('+scaleX+','+scaleY+')');
		if($(this).css('-ms-transform')) $(this).css('-ms-transform','scale('+scaleX+','+scaleY+')');
		if($(this).css('-o-transform')) $(this).css('-o-transform','scale('+scaleX+','+scaleY+')');
	}
	
	jQuery.fn.getScale = function(){		
		if($(this).css('transform')) return makeScaleObject(String($(this).css('transform')));
		if($(this).css('-webkit-transform')) return makeScaleObject(String($(this).css('-webkit-transform')));
		if($(this).css('-moz-transform')) return makeScaleObject(String($(this).css('-moz-transform')));
		if($(this).css('-ms-transform')) return makeScaleObject(String($(this).css('-ms-transform')));
		if($(this).css('-o-transform')) return makeScaleObject(String($(this).css('-o-transform')));
	}
	
	makeScaleObject = function(str){		
		str = str.slice(str.indexOf('(')+1,str.lastIndexOf(')'));
		var theArr = str.split(',');
		var scaleObj = {scaleX:parseFloat(theArr[0]), scaleY:parseFloat(theArr[3])}
		return scaleObj;
	}
	
	jQuery.fn.name = function(){
		return $(this).data("originalId");
	}
	
	jQuery.fn.left = function(val){
		if(val == undefined){
			return parseFloat($(this).css("left"));
		}else{
			$(this).css("left",val+"px");
		}
	}

	jQuery.fn.top = function(val){
		if(val == undefined){
			return parseFloat($(this).css("top"));
		}else{
			$(this).css("top",val+"px");
		}
	}
	
	jQuery.fn.findMcNum = function(){
		return $(this).data("originalId").replace(/\D/g,'');
	}
  
	jQuery.fn.highlightText = function(textColour, boldIt, underlineIt){
		try {
			if (textColour == undefined){
				textColour = "#222222";
			}
			if (boldIt == undefined){
				boldIt = true;
			}
			if (underlineIt == undefined){
				underlineIt = false;
			}
			
			this.each(function(index, element){
				var openJoin = "";
				openJoin +='<span style="color:'+textColour+'">';
				if(boldIt){
					openJoin += "<b>";
				}
				if (underlineIt){
					openJoin += "<u>";
				}

				var closeJoin = "";
				if (underlineIt){
					closeJoin += "</u>";
				}
				if(boldIt){
					closeJoin += "</b>";
				}
				closeJoin += "</span>";

				var textContent = $(element).html();
				var origId = $(element).data("originalId");
				
				textContent = textContent.split('{{').join(openJoin);
				textContent = textContent.split('}}').join(closeJoin);
		  
				//New addition to include bold, underlines and italics tags
				textContent = textContent.split('[b]').join('<b>');
				textContent = textContent.split('[/b]').join('</b>');
				textContent = textContent.split('[u]').join('<u>');
				textContent = textContent.split('[/u]').join('</u>');
				textContent = textContent.split('[i]').join('<i>');
				textContent = textContent.split('[/i]').join('</i>');
		  
				// New code to add in spans for resources text - see 'addToResources' function
				if (textContent.indexOf('[r]') != -1){
					var tempStr = textContent.split('[r]');
					var tempStr2 = tempStr[1].split('[/r]');
					var tempStr3 = tempStr2[0].replace('<span ', '<span id="resourceStart_'+origId+'" ');
					var tempStr4 = tempStr3.replace('</span>', '<span id="resourceEnd_'+origId+'"></span></span>');
					textContent = tempStr[0]+tempStr4+tempStr2[1];
				}			
		  
				$(element).html(textContent);
			});
		} catch(e){
		}
	}
	
	jQuery.fn.addToResources = function(){
		
		var theBracket = $('#Stage_res_bracket');
		var buttonPos = {xPos:0, yPos:0};
		var textID = this.data("originalId");
		var resourceText = $('#resourceStart_'+textID);
		var startX = resourceText.offset().left;
		var startY = resourceText.offset().top;
		var endX = $('#resourceEnd_'+textID).offset().left;   
		var origColor = resourceText.css('color');
		
		// Set the bracket's correct size based on the start and end positions of the spans
		theBracket.setScale((endX-startX)/100, 1);
		
		// Bring the bracket to the top
		theBracket.css('z-index', 8000);
		
		var scaleTo = (100/theBracket.getScale().scaleX)/100;
		var origScale = theBracket.getScale().scaleX*100;   
		var realWidth = (theBracket.width()/100)*origScale;
		var leftOffset = (realWidth-theBracket.width())/2;
		
		// Position the bracket based on the offset of the first span
		theBracket.left(startX+leftOffset);
		theBracket.top(startY-1);
		
		// Tween the flashing of the resourceText
		var flashResTween = TweenMax.to(resourceText, 0.2, {css:{'color':'#ef892d'}, onComplete:
		  function(){
			TweenMax.to(resourceText, 0.5, {css:{'color':origColor}, delay:0.5});
		  }
			});
			flashResTween.repeat(6).yoyo(true);
		
		// Work out position of the resources button relative to the stage
		buttonPos.yPos = $('#Stage').outerHeight();
		buttonPos.xPos = resourcesButtonCentre;
		
		// Tween the bracket to the resources button
		TweenMax.delayedCall(1.2, function(){
		  TweenMax.set(theBracket, {autoAlpha:1});
		  symLink.getSymbol(theBracket).getSymbol('resources_inner').play(0);
		  TweenMax.to(symLink.getSymbol(theBracket).$('resources_inner'), 0.5, {scaleX:scaleTo, ease:Power2.easeInOut, onComplete:
			function(){
			  var tweenTime = 1;
			  var targX = buttonPos.xPos - (theBracket.width()/2);
			  TweenMax.to(theBracket, tweenTime, {left:targX, top:buttonPos.yPos, ease:Power2.easeInOut, onComplete:
				function(){
				  theBracket.css('visibility','hidden');
				  symLink.getSymbol(theBracket).getSymbol('resources_inner').stop(0);
				}
			  });
			  TweenMax.to(theBracket, tweenTime*0.3, {autoAlpha:0, delay:tweenTime*0.7, ease:Power2.easeOut});
			  TweenMax.delayedCall(tweenTime*0.5, function(){
				// Flash the resources button
				if(localMode){
					try{
						parent.render.flashResourceButton();
					}catch(e){}
				}else{
					parent.postMessage('resourcesButtonFlash', queryString.returnOrigin);
				}
			  });
			}
		  });
		});
	}
	
	jQuery.fn.setHyperLinks = function(){
		var html = $(this).html();
		var openCount = html.match(/\[link\]/g);
		var closeCount = html.match(/\[\/link\]/g);

		if(openCount.length == closeCount.length){
			while(html.indexOf('[link]') != -1){
				//get the link
				var tmpLink = html.slice(html.indexOf('[link]')+6, html.indexOf('[/link]'))
				//validate http on link
				if(tmpLink.toLowerCase().indexOf('http://') == -1){
					tmpLink = "http://"+tmpLink;
				}
				//create the link
				html = html.replace(/\[link\]/,'<a href = "'+ tmpLink+'" target="_blank" class="courseLink">');
				html = html.replace(/\[\/link\]/,'</a>');
			}
			
			$(this).html(html);
			
		}else{
			console.log("Number of open and close statements does not match");
			console.log(openCount.length + " open statements");
			console.log(closeCount.length + " close statements");
		}

	}

	jQuery.fn.normaliseLT = function(returnAValue) {
		var theMatrix;
		if(returnAValue == undefined){
			returnAValue = false;
		}
		if($(this).css('transform')) theMatrix = String($(this).css('transform'));
		if($(this).css('-webkit-transform')) theMatrix = String($(this).css('-webkit-transform'));
		if($(this).css('-moz-transform')) theMatrix = String($(this).css('-moz-transform'));
		if($(this).css('-ms-transform')) theMatrix = String($(this).css('-ms-transform'));
		if($(this).css('-o-transform')) theMatrix = String($(this).css('-o-transform'));
		
		if(theMatrix != "none"){
			theMatrix = theMatrix.slice(theMatrix.indexOf('(')+1,theMatrix.lastIndexOf(')'));
		}else{
			theMatrix = "0,0,0,0,0,0";
		}
		
		var myMatrix = theMatrix.split(',');
		
		var thisLeft = parseFloat($(this).css('left'));
		var thisTop = parseFloat($(this).css('top'));
		
		var newLeft = thisLeft + parseFloat(myMatrix[4]);
		var newTop = thisTop + parseFloat(myMatrix[5]);
		
		if(returnAValue){
			return {l:newLeft, t:newTop};
		}else{
			$(this).data('oldLeft' ,thisLeft);
			$(this).data('oldTop' ,thisTop);
			$(this).data('oldMatrix' ,makeMatrixString(myMatrix));
			
			myMatrix[4] = "0";
			myMatrix[5] = "0";
			
			var matrixString = makeMatrixString(myMatrix);
			
			$(this).css({left:newLeft+"px", top:newTop+"px"});
			
			if($(this).css('transform')) $(this).css('transform',matrixString);
			if($(this).css('-webkit-transform')) $(this).css('-webkit-transform',matrixString);
			if($(this).css('-moz-transform')) $(this).css('-moz-transform',matrixString);
			if($(this).css('-ms-transform')) $(this).css('-ms-transform',matrixString);
			if($(this).css('-o-transform')) $(this).css('-o-transform',matrixString);
		}
	}
	
	function makeMatrixString(data){
		var str = "matrix(";
		
		for(var i = 0; i < data.length; i ++){
			
			str += data[i];
			str += ",";
		}
		str = str.slice(0,str.length-1);
		str+=')';
		return str;
	}
	
	jQuery.fn.restoreTransform = function() {
		//console.log('old matrix ' + $(this).data('oldMatrix'));
		$(this).css({left:$(this).data('oldLeft'), top:$(this).data('oldTop')});
		var oldData = $(this).data('oldMatrix');
		if($(this).css('transform')) $(this).css('transform',oldData);
		if($(this).css('-webkit-transform')) $(this).css('-webkit-transform',oldData);
		if($(this).css('-moz-transform')) $(this).css('-moz-transform',oldData);
		if($(this).css('-ms-transform'))  $(this).css('-ms-transform',oldData);
		if($(this).css('-o-transform'))  $(this).css('-o-transform',oldData);
	}
	
	jQuery.fn.hitTest = function(obj) {
		aPos = {x:parseInt($(this).css('left')), y:parseInt($(this).css('top'))};
		bPos = {x:parseInt(obj.css('left')), y:parseInt(obj.css('top'))};
		return aPos.x < bPos.x + obj.width() &&
		aPos.x + $(this).width() > bPos.x &&
		aPos.y < bPos.y + obj.height() &&
		aPos.y + $(this).height() > bPos.y
	}
	
	var shownHitTestMsg = false;
	jQuery.fn.hitTestMouse = function(mouseX, mouseY ,ltgObj) {
		try{
			if (!shownHitTestMsg){
				shownHitTestMsg = true;
				console.log('hitTestMouse is deprecated, use hitTestPoint instead');
			}
		}catch(e){};
		
		if(ltgObj == undefined){
			ltgObj = {l:$(this).left(), t:$(this).top(), w:$(this).width(), h:$(this).height()};
		}	
		return mouseX < ltgObj.l + ltgObj.w &&
		mouseX > ltgObj.l &&
		mouseY < ltgObj.t + ltgObj.h &&
		mouseY > ltgObj.t
	}
	
	//Duplicate of hitTestMouse
	jQuery.fn.hitTestPoint = function(pointX, pointY ,ltgObj) {
		if(ltgObj == undefined){
			ltgObj = {l:$(this).left(), t:$(this).top(), w:$(this).width(), h:$(this).height()};
		}	
		return pointX < ltgObj.l + ltgObj.w &&
		pointX > ltgObj.l &&
		pointY < ltgObj.t + ltgObj.h &&
		pointY > ltgObj.t
	}

	jQuery.fn.localToGlobal = function(){		
		var targetElement = $('#Stage');
		var curElement = $(this).parent();
		var normalPos = $(this).normaliseLT(true);
		var leftPos = normalPos.l;
		var topPos = normalPos.t
		
		while(curElement.attr("id") != targetElement.attr("id")){
			var pos = curElement.normaliseLT(true);
			leftPos += pos.l;
			topPos += pos.t;
			curElement = curElement.parent();
		}
		
		return {l:leftPos, t:topPos, w:$(this).width(), h:$(this).height()};
	}
	
	jQuery.fn.globalToLocal = function(x, y){
		var targetElement = $('#Stage');
		var curElement = $(this).parent();
		var leftPos = x;
		var topPos = y;
		
		var parentsArr = [];
		
		while(curElement.attr("id") != targetElement.attr("id")){
			var pos = curElement.normaliseLT(true);
			parentsArr.push([pos.l,pos.t]);
			curElement = curElement.parent();	
		}
		
		for(var i = parentsArr.length-1; i >= 0; i --){
			leftPos -= parentsArr[i][0];
			topPos -= parentsArr[i][1];
		}
		return {l:leftPos, t:topPos, w:$(this).width(), h:$(this).height()};
	}
	
	shuffleArray = function(theArray){
		var len = theArray.length;
		var i = len;
		while (i--) {
			var p = parseInt(Math.random()*len);
			var t = theArray[i];
			theArray[i] = theArray[p];
			theArray[p] = t;
		}
	};
	
	jQuery.fn.addClickEvent = function(handler){
		$(this).on('click touchend touchcancel', function(e){
			e.preventDefault();
			var mp = vol_mousePosition(e);
			handler.apply(this, [e, mp]);
		});
	}
	
	jQuery.fn.addStartEvent = function(handler){
		$(this).on('mousedown touchstart', function(e){
			e.preventDefault();
			var mp = vol_mousePosition(e);
			handler.apply(this, [e, mp]);
		});
	}
	jQuery.fn.addMoveEvent = function(handler){
		$(this).on('mousemove touchmove', function(e){
			e.preventDefault();
			var mp = vol_mousePosition(e);
			handler.apply(this, [e, mp]);
		});
	}
	jQuery.fn.addEndEvent = function(handler){
		$(this).on('mouseup touchend touchcancel', function(e){
			e.preventDefault();
			var mp = vol_mousePosition(e);
			handler.apply(this, [e, mp]);
		});
	}
	
	vol_mousePosition = function(e){
		var mp = {};
		
		if(e.pageX != undefined){
			mp = {x:e.pageX, y:e.pageY};
		}else{
			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			mp = {x:touch.pageX, y:touch.pageY};
		}
		
		var matrix = symLink.$('#Stage').css('transform');
		if(matrix !='none'){//if the stage is responisve then adjust the mouse position for scale.
			matrix = matrix.split(',')[0].replace('matrix(','');
			var scale = parseFloat(matrix);
			
			var leftPos = (mp.x - symLink.$('#Stage').offset().left);
			var topPos = (mp.y - symLink.$('#Stage').offset().top);
			
			mp.x = leftPos * (1 / scale );
			mp.y = topPos * (1 / scale );
		}
		
		return mp;
	}
	
	/*  Code for panel code - supported by the helper css*/
	var panelAnimType = '' //top middle bottom
	
	
	jQuery.fn.initPanel = function(panelSymbol, textSymbol, autoPlay, expandFrom){
		if(panelAnimType === true){
			panelAnimType = 'middle'
		}else{
			panelAnimType = expandFrom;
		}
		
		panelSymbol.getSymbolElement().removeClass('auto-height');
		panelSymbol.getSymbolElement().css({height:0, opacity:0});
		this.data('panelSymbolRef', panelSymbol);
		this.data('textSymbolRef', textSymbol);
		
		this.data('totalWidth', panelSymbol.getSymbolElement().width());
		this.data('initialHeight', textSymbol.getSymbolElement().outerHeight());	
		this.data('initialLeft', panelSymbol.getSymbolElement().left());
		this.data('initialTop', panelSymbol.getSymbolElement().top());
		
		
		if(panelAnimType == true || panelAnimType =='middle'){
			panelSymbol.getSymbolElement().css({width:0, left:'+='+(panelSymbol.getSymbolElement().width()/2),  top:'+='+(textSymbol.getSymbolElement().outerHeight()/2)});
		}
		
		if(autoPlay){
			this.updatePanel();
		}
	}
	jQuery.fn.updatePanel = function(){
		//var newHeight = $(this).get(0).scrollHeight;
		var panelSymbol = this.data('panelSymbolRef');
		var textSymbol = this.data('textSymbolRef');
		
		var newHeight = 0;
		if(parseInt(panelSymbol.getSymbolElement().css('width')) == 0){
			//initial reveal
			trace("initial");
			newHeight = this.data('initialHeight');
			TweenMax.to(panelSymbol.getSymbolElement(), .5, {ease:Power1.easeInOut, height:newHeight, width:this.data('totalWidth'), left:this.data('initialLeft'), top:this.data('initialTop'), opacity:1, onComplete:function(){
				textSymbol.play();
			}});
		}else{
			trace("update : " + panelAnimType);
			newHeight = textSymbol.getSymbolElement().outerHeight();
			
			switch(panelAnimType){
				case 'top':
				case 'bottom':
					TweenMax.to(panelSymbol.getSymbolElement(), .5, {ease:Power1.easeInOut, height:newHeight, opacity:1, onComplete:function(){
						textSymbol.play();
					}});
				break;
				case 'middle':
					var yOff = newHeight - panelSymbol.getSymbolElement().outerHeight();
					
					TweenMax.to(panelSymbol.getSymbolElement(), .5, {ease:Power1.easeInOut, height:newHeight, top:'-='+(yOff/2), opacity:1, onComplete:function(){
						textSymbol.play();
					}});
				break;
			}
		}
		
	}
	
	jQuery.fn.closePanel = function(){
		
		var panelSymbol = this.data('panelSymbolRef');
		var textSymbol = this.data('textSymbolRef');
		
		var leftTarget = this.data('initialLeft');
		var topTarget = this.data('initialTop');
		var targetWidth = panelSymbol.getSymbolElement().width();
		
		switch(panelAnimType){
			case 'top':
			case 'bottom':
				TweenMax.to(panelSymbol.getSymbolElement(), .5, {ease:Power1.easeInOut, height:0, opacity:0, onComplete:function(){
					textSymbol.play();
				}});
			break;
			case 'middle':
				topTarget = '+='+ panelSymbol.getSymbolElement().outerHeight()/2;
				leftTarget = '+='+ (panelSymbol.getSymbolElement().height()/2);
				
				TweenMax.to(panelSymbol.getSymbolElement(), .5, {ease:Power1.easeInOut, height:0, width:0, top:topTarget, left:leftTarget, opacity:0, onComplete:function(){
					textSymbol.play();
				}});
			break;
		}
	}
	
	forceAlpha = function(){
		$("div[style*='background-color']").each(function(i, el){
			if(el.id != 'Stage' && el.id != 'Stage_guide_rect'){
				var bgcValue = $(el).css('background-color');
				if(bgcValue.toLowerCase().indexOf('rgba') != -1){
					var bgcAlpha = parseFloat(bgcValue.split(',')[3].replace(')',''));	
					if(bgcAlpha == 0){
						$(el).css('background-color', 'rgba(255,255,255,0.01)');
					}
				}
				if(bgcValue.toLowerCase() == "transparent"){
					$(el).css('background-color', 'rgba(255,255,255,0.01)');
				}

			}
		});
	}
	
	/*  In developement and not documented */
	/*sweet little function to replace your svg graphics with ones that can be interacted with retaining shape flags*/
	importSVG = function(targ, img, myFunc, args){
		
		var loadComplete = function(){			
			
			/* if you're loading in multiple instances of the same SVG at once 
			(e.g. replacing a series of buttons) each SVG and its child elements 
			will share the same ID which is not ideal, as IDs should be unique.  
			The code below finds every child of targ, swaps the ID for Class and then 
			removes the ID completely */
			
			targ.find('*').each(function(){
				var currentID = $(this).attr('id');
				$(this).attr("class", currentID).removeAttr("id");				
			});
		
			if (myFunc){
			
				myFunc.apply(this, args);			
			}		
		}
		
		targ.svg({});
        var svg = targ.svg('get');
        svg.load('images/' +img, { 
			addTo: false, //this is meant to replace the SVG already in there with the loaded one, but doesn't at the moment
			changeSize: false,
			onLoad: loadComplete

		});
	}
	
	glowMe = function (what, bool){
    	TweenMax.killTweensOf(what);
    	
    	if(bool==false){
       TweenMax.to(what, .5, {autoAlpha: 0});	
    	}else{
        $(what).css('background-color','rgba(255,255,255,0.01)');
        TweenMax.to(what, .5, {autoAlpha: 1, repeat:-1, yoyo:true, startAt:{autoAlpha: 0}});	
    	}
	}

})(jQuery);
