//Copyright © 2014 Volume Ltd. All rights reserved.  http://www.volumeglobal.com
//This software may contain code obtained from the Public Domain. 
/****************************** Version info *************************************/

var customJSversion = "4.19";
var customJSLastUpdatedBy = "Simon Bench";
var customJSLastUpdated = "05/05/2015";
// v1.0 file create from functions copied out of the custom plugin.
// v2 Added video playback function
// v2.1 add controls to videos
// v3 Add the promptClick  pageComplete functions - made avatar value store in parent window object
// v4 Added audio loading and playback support. Completed avatar integration for offline app.
// v4.1 Added stop all soudns which is called when fadeInst is ran.
// v4.2 Added glowMe function.
// v4.3 Added allowed audio load bypass when error.
// v4.4 Added background color to glowMe function.
// v4.5 Hopefully a fix for FireFox audio not loading.
// v4.6 updated vido playback to allow the new play, read and skip options.
// v4.7 added file ref in bottom right.
// v4.8 Updated glowMe function to set startAt autoAlpha
// v4.9 Updated glowMe so that the 1% colour is now white
// v4.10 Attempted fix to prevent local copies from freezing on audio loading.
// v4.11 Fixed various bugs for AIR and also clearing HASH after complete calls come in.
// v4.12 Amended video options so that window opens in user driven event. This fixes window opens for AIR.
// v4.13 updated the ref tag so that it can deal with names that start vmb_ and vmb__
// v4.14 Added functionality to clickPrompt allowing either a symbol or function to be executed.
// v4.15 highlightText is now class compatible.
// v4.16 Added functionality to flashInst allowing a specified number of lines to be passed instead of pixel width.
// v4.17 Added while limit for flash inst.
// v4.18 Made fix to the css for video playback.  IE keeps adding scroll bars because it's useless.
// v4.19 Cleared the currentInst value when fade inst is called

(function($){
	
	//Put the name in the bottom
	
	var screenRefTag = document.createElement('p');
	var screenName = String(window.location)
	screenName = screenName.substr(screenName.lastIndexOf('/')+1);
	screenName = screenName.replace('vmb__', '');
	screenName = screenName.replace('vmb_', '');
	screenName = screenName.replace('.html','');
	screenName = screenName.split('_');
	if(screenName.indexOf('level') == -1){
		$(screenRefTag).text(screenName[0] +'_0');
	}else{
		$(screenRefTag).text(screenName[0] +'_'+screenName[screenName.length-1]);
	}
	
	
	$(screenRefTag).css({position:'absolute', bottom:0, right:0,fontSize:10, textAlign:'right', fontFamily:'Arial, Helvetica, sans-serif', margin:0, padding:0, color:'#c2c2c2'});
	$('body').append(screenRefTag);
	
	
	var userAgent = String(navigator.userAgent).toLowerCase();
	
	//make sure that the hash object exists
	
	waitSylCountMulti = 0.1;
	waitSecsDiv = 4;
	var symLink
	setSymLink = function(theSym){
		symLink = theSym;
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
	
	var offlineAvatarStatus = false;
	
	getAvatar = function(){
		if(userAgent.match(/air/)){
			//this is the offline app.
			if(window.location.hash.match(/avatarStatus/)){
				if(window.location.hash.split('=')[1] == 'true'){
					offlineAvatarStatus = true;
				}else{
					offlineAvatarStatus = false;
				}
			}
			return offlineAvatarStatus;
		}else{
			if(window.parent != window){
				if(window.parent.volid_avatar == undefined){
					window.parent.volid_avatar = true;
				}
				return window.parent.volid_avatar;
			}else{
				if(window.volid_avatar == undefined){
					window.volid_avatar = true;
				}
				return window.volid_avatar	
			}
		}
	}

	setAvatar = function(value){
		if(userAgent.match(/air/g)){
			//this is the offline app. 
			offlineAvatarStatus = value;
			window.location.hash = 'setAvatarStatus___'+String(value);
		}else{
			if(window.parent.volid_avatar != undefined){
				window.parent.volid_avatar = value;
			}else{
				window.volid_avatar = value;	
				
			}
		}
	}
	
	getAvatar();

	var avatarRunOnce = false;
	var avatarTop;
	var avatarBubLeft;
	var avatarOn = true;
	var currentInst;
	var avatarTalkTimeout;
	var avatarVis = false;
	var instActive = false;

	toggleAvatar = function() {
		var curVal = getAvatar();
		setAvatar(!curVal);
		if (currentInst != undefined){
			TweenMax.killTweensOf(symLink.getSymbol('Avatar').$('Avatar_char'));
			TweenMax.killTweensOf(symLink.getSymbol('Avatar').getSymbol('Avatar_char').$('Avatar_bubble'));
			if (getAvatar() == true){
				symLink.getSymbol('Avatar').getSymbol('Avatar_but').stop('turnOff');
			} else {
				symLink.getSymbol('Avatar').getSymbol('Avatar_but').stop('turnOn');
			}
			if (instActive){
				if (getAvatar() == true){
					TweenMax.set(currentInst, {autoAlpha: 0});
					TweenMax.set(symLink.getSymbol('Avatar').$('Avatar_char'), {autoAlpha: 1});	
					TweenMax.set(symLink.getSymbol('Avatar').getSymbol('Avatar_char').$('Avatar_bubble'), {autoAlpha: 1});
					avatarVis = true;
				} else {
					TweenMax.set(currentInst, {autoAlpha: 1});
					TweenMax.set(symLink.getSymbol('Avatar').$('Avatar_char'), {autoAlpha: 0});
					TweenMax.set(symLink.getSymbol('Avatar').getSymbol('Avatar_char').$('Avatar_bubble'), {autoAlpha: 0});
					avatarVis = false;
				}
			}
		}
	}
	var avatarAudioName = '';
	//flashInst = function(targ, bubWidth, stance, talkTime){
	flashInst = function(targ, bubWidth, stance, audioName){
		var talkTime = 2;
		var avatarBub = symLink.getSymbol('Avatar').getSymbol('Avatar_char').$('Avatar_bubble');
		avatarAudioName = audioName;
		currentInst = targ;
		if (avatarRunOnce == false){
			avatarRunOnce = true;
			avatarTop = parseInt(symLink.getSymbol('Avatar').$('Avatar_char').css('top'));
			avatarBubLeft = parseInt(avatarBub.css('left'));
		}
		clearTimeout(avatarTalkTimeout);
		TweenMax.killTweensOf(symLink.getSymbol('Avatar').$('Avatar_char'));
		TweenMax.killTweensOf(avatarBub);
		instActive = true;
		avatarVis = false;
		if (bubWidth == undefined){
			console.log("'bubWidth' hasn't been specified!");
			bubWidth = 400;
		}
		if (stance == undefined){
			console.log("'stance' hasn't been specified!");
			stance = "still_talk";
		}
		symLink.getSymbol('Avatar').getSymbol('Avatar_char').getSymbol('Avatar_bubble').getSymbol('Avatar_bubble_text').$('ins_text').html(targ.html());

		if (bubWidth <= 10){

			avatarBub.css('white-space', 'nowrap');
			avatarBub.css('width', 'auto');

			var lineH = parseInt(avatarBub.css('height'));
			var newWidth = (parseInt(avatarBub.css('width'))/bubWidth)+10;

			avatarBub.css('white-space', 'normal');
			avatarBub.css('width', newWidth);
			

			if (parseInt(avatarBub.css('height')) != lineH*bubWidth){
				var whileLimit = 0;
				while(parseInt(avatarBub.css('height')) != lineH*bubWidth && whileLimit < 100){
					whileLimit++;
					avatarBub.css('width', "+=1");
				}
			}

		} else {
			avatarBub.css('width', bubWidth);
		}

		var bodyPose = stance.split("_")[0];
		var facialExp = stance.split("_")[1];
		symLink.getSymbol('Avatar').getSymbol('Avatar_char').getSymbol('Avatar_body').stop(bodyPose);
		symLink.getSymbol('Avatar').getSymbol('Avatar_char').getSymbol('Avatar_face').stop(facialExp);
		if (facialExp == "talk"){
			symLink.getSymbol('Avatar').getSymbol('Avatar_char').getSymbol('Avatar_face').getSymbol('Avatar_talk').stop(0);
		}
		if (getAvatar() == true){
			TweenMax.set(targ, {autoAlpha: 0});	
			if (!avatarVis){
				symLink.getSymbol('Avatar').$('Avatar_char').css('top', avatarTop);
				TweenMax.fromTo(symLink.getSymbol('Avatar').$('Avatar_char'), 0.5, {autoAlpha: 0, top:"+=10"}, {autoAlpha: 1, top:"-=10", onComplete:function(){
					avatarVis = true;
					initAvatarTalk(facialExp, talkTime);
				}});
				avatarBub.css('left', avatarBubLeft);
				TweenMax.fromTo(avatarBub, 0.5, {autoAlpha: 0, left:"-=10"}, {autoAlpha: 1, left:"+=10", delay:0.5});
			} else {
				initAvatarTalk(facialExp, talkTime);
			}
		} else {
			TweenMax.set(targ, {autoAlpha: 1});
			TweenMax.fromTo(targ, 1, {autoAlpha: 0}, {autoAlpha: 1, immediateRender: true});				
			TweenMax.fromTo(targ, 0.01, {visibility: "hidden"}, {visibility: "visible", delay: 1.3, yoyo:true,  repeat:6, repeatDelay: 0.15});
		}
	}

	initAvatarTalk = function(facialExp, talkSecs){
		if (facialExp == "talk"){
			if (talkSecs == undefined){
				console.log("'talkTime' hasn't been specified!");
				talkSecs = 2;
			}
			
			avatarTalk();
			
			if(avatarAudioName && useAudio==true){
				playAudio(avatarAudioName, avatarStopTalk);
			}else{
				setTimeout(avatarStopTalk, (talkSecs*1000));
			}			
		}
	}
	avatarStopTalk = function(){
		clearTimeout(avatarTalkTimeout);
		symLink.getSymbol('Avatar').getSymbol('Avatar_char').getSymbol('Avatar_face').getSymbol('Avatar_talk').stop(0);
	}

	avatarTalk = function(){
		var randomTalk = Math.round((Math.random() * 5))*1000;
		symLink.getSymbol('Avatar').getSymbol('Avatar_char').getSymbol('Avatar_face').getSymbol('Avatar_talk').stop(randomTalk);
		var randomTime = Math.floor((Math.random() * 100) + 50);
		avatarTalkTimeout = setTimeout(avatarTalk, randomTime);
	}
	
	fadeInst = function(targ){
		currentInst = undefined;
		if(avatarAudioName){
			stopAllSounds();
		}else{
			clearTimeout(avatarTalkTimeout);
		}
		
		if (getAvatar() == false){		
			TweenMax.killTweensOf(targ)
			TweenMax.to(targ, .5, {autoAlpha: 0});	
		} else {
			avatarVis = false;
			instActive = false;
			TweenMax.to(symLink.getSymbol('Avatar').$('Avatar_char'), 0.5, {autoAlpha: 0});
			TweenMax.to(symLink.getSymbol('Avatar').getSymbol('Avatar_char').$('Avatar_bubble'), 0.5, {autoAlpha: 0});
			TweenMax.set(targ, {autoAlpha: 0});
		}		
	}
	
	jQuery.fn.flashInst = function(bubWidth, stance, talkTime){
		flashInst($(this), bubWidth, stance, talkTime);
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
	
	/*  video playback  */
	
	function checkVideo(){
		var videoSupport = false;
		if(!!document.createElement('video').canPlayType){
			var vidTest=document.createElement("video");
			oggTest=vidTest.canPlayType('video/ogg; codecs="theora, vorbis"');
			if (!oggTest){
				h264Test=vidTest.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
				if (!h264Test){
					videoSupport = false;
				} else   {
					if (h264Test=="probably"){
						videoSupport = true;
					} else  {
						videoSupport = true;
					}
				}
			}else{
				if (oggTest=="probably"){
					videoSupport = true;
				}else{
					videoSupport = true;
				}
			}
		}else{
			videoSupport = false;
		}
		return videoSupport;
	}
	
	
	function checkAudio(){
		var audioSupport = false;
		if(!!document.createElement('audio').canPlayType){
			var audioTest=document.createElement("audio");
			oggTest=audioTest.canPlayType('audio/ogg');
			if (!oggTest){
				mp3Test=audioTest.canPlayType('audio/mpeg');
				if (!mp3Test){
					audioSupport = false;
				} else   {
					if (mp3Test=="probably"){
						audioSupport = true;
					} else  {
						audioSupport = true;
					}
				}
			}else{
				if (oggTest=="probably"){
					audioSupport = true;
				}else{
					audioSupport = true;
				}
			}
		}else{
			audioSupport = false;
		}
		return audioSupport;
	}
	
	promptClick = function (symbolToPlay){
		//add the next icon
		var nextImg = document.createElement('img');
		nextImg.src = 'images/vmb_common/click_prompt.jpg';
		nextImg.alt = 'Click to continue';
		$(nextImg).css({position:'fixed', top:519, left:0, margin:0, padding:0});
		nextImg.id = 'clickPrompt';
		$('body').append(nextImg);
		
		$(document).on('click touchend touchcancel', function(e){
			$(document).off();
			if(typeof(symbolToPlay) == 'function'){
				symbolToPlay();
			}else{
				symbolToPlay.play();
			}
			$('#clickPrompt').remove();
		});
	}
	
	pageComplete = function (){
		//add the complete icon
		var completeImg = document.createElement('img');
		completeImg.src = 'images/vmb_common/complete_prompt.jpg';
		completeImg.alt = 'Screen completed';
		$(completeImg).css({position:'fixed', top:519, left:0, margin:0, padding:0});
		completeImg.id = 'completePrompt';
		$('body').append(completeImg);
	}
	
	var curPDFName = '';
	var fadeOutVideo=false;
	var videoAssetLocation = '';
	var videoCallBack;
	var videoThisRef;
	var videoURL='';
	$('head').append('<style>.playbackOption:hover{color:#ff0000;}</style>');
	
	//playVideo = function(url, callback, andFade){
	playVideo = function(url, callback, andFade, pdfName){
		videoThisRef = this;
		videoCallBack = callback;
		videoURL = url;
		var justPlay = false;
		
		if(andFade == undefined){
			fadeOutVideo = true;
		}else{
			fadeOutVideo = andFade;
		}
		if(pdfName == 'justPlay'){
			justPlay = true;
			curPDFName = undefined;
		}else{
			curPDFName = pdfName;
		}
		
		if(checkVideo()){
			var videoDiv = document.createElement('div');
			$(videoDiv).css({position:'absolute',top:'0px',left:'0px',width:'960px',height:'547px'});
			
			videoDiv.id = 'videoDiv';
			var videoPlayer = document.createElement('video');
			videoPlayer.id = 'videoElement';
			videoPlayer.width = 960;
			videoPlayer.height = 547;
			
			var tabletDevice = false;
			if(/(ios|iphone|ipod|ipad|android|silk)/g.test(userAgent)){
				tabletDevice = true;
			}
			
			if(!justPlay){
				videoPlayer.controls = 'controls';
			}else{
				if(!tabletDevice){
					videoPlayer.autoplay = 'true';
				}
			}
			if(!justPlay || tabletDevice){
				$(videoDiv).css({display:'none'});
			}
			
			videoPlayer.poster = videoAssetLocation+url+'.png';
			
			$(videoPlayer).css({position:'absolute'});
			
			var source_one = document.createElement('source');
			source_one.src = videoAssetLocation+url+'.mp4';
			source_one.type = 'video/mp4';
			
			var source_two = document.createElement('source');
			source_two.src = videoAssetLocation+url+'.webm';
			source_two.type = 'video/webm';
			
			//create the options area
			
			if(!justPlay || tabletDevice){
				var optionsDiv = document.createElement('div');
				optionsDiv.id = 'optionsDiv';
				
				
				$(optionsDiv).css({zIndex:1,position:'absolute',height:'auto', backgroundColor:'#ffffff', color:'#c2c2c2'});
				
				var playoption = document.createElement('div');
				$(playoption).html('<img id="watch" src = "images/video_icon_1.png"/><h1>WATCH</h1>');
				$(playoption).addClass('playbackOption');
				
				if(!justPlay){
					if(pdfName){
						var pdfOption = document.createElement('div');
						$(pdfOption).html('<img id="read" src = "images/video_icon_2.png"/><h1>READ</h1>');
						$(pdfOption).addClass('playbackOption');
					}
				
				
					var skipOption = document.createElement('div');
					$(skipOption).html('<img id="skip" src = "images/video_icon_3.png" /><h1>SKIP</h1>');
					$(skipOption).addClass('playbackOption');
				}
				
				$(optionsDiv).append(playoption);
				if(pdfName){
					$(optionsDiv).append(pdfOption);
				}
				$(optionsDiv).append(skipOption);
				
				$('body').append(optionsDiv);
				
				//content width 960
				var optionsWidth = $('.playbackOption').length * (123+80)
				$(optionsDiv).css('width', optionsWidth);
				$(optionsDiv).css('left', (960 - optionsWidth) /2);
				//content height 547
				$(optionsDiv).css('top', (547 - $('.playbackOption').height()) /2);
				
				$('.playbackOption').css({width:123, float:'left', marginLeft:40, marginRight:40,'cursor':'pointer'});
				$('.playbackOption').find('h1').css({color:'inherit',fontSize:20, textAlign:'center', fontFamily:'Arial, Helvetica, sans-serif','-webkit-user-select':'none','-moz-user-select':'none','-mz-user-select':'none', '-webkit-font-smoothing':'antialiased'});
				
				TweenMax.staggerFrom($('.playbackOption'), 0.5, {opacity:0}, 0.2, videoOptionReady);
			}
			
			$(videoPlayer).on("ended", videoCompleted);
			
			$(videoPlayer).append(source_one);
			$(videoPlayer).append(source_two);
			
			$(videoDiv).append(videoPlayer);
			
			$('body').append(videoDiv);
			
			
			
		}else{
		
			if(!justPlay){
				var optionsDiv = document.createElement('div');
				optionsDiv.id = 'optionsDiv';
				$(optionsDiv).css({zIndex:1,position:'absolute',top:'50%',left:'50%',height:'auto', backgroundColor:'#ffffff', '-moz-transform':'translate(-50%,-50%)', '-ms-transform':'translate(-50%,-50%)', '-webkit-transform':'translate(-50%,-50%)', 'transform':'translate(-50%,-50%)', color:'#c2c2c2'});
				
				var playoption = document.createElement('div');
				$(playoption).html('<img id="watch" src = "images/video_icon_1.png"/><h1>WATCH</h1>');
				$(playoption).addClass('playbackOption');
				
				if(!justPlay){
					if(pdfName){
						var pdfOption = document.createElement('div');
						$(pdfOption).html('<img id="read" src = "images/video_icon_2.png"/><h1>READ</h1>');
						$(pdfOption).addClass('playbackOption');
					}
				
				
					var skipOption = document.createElement('div');
					$(skipOption).html('<img id="skip" src = "images/video_icon_3.png" /><h1>SKIP</h1>');
					$(skipOption).addClass('playbackOption');
				}
				
				$(optionsDiv).append(playoption);
				if(pdfName){
					$(optionsDiv).append(pdfOption);
				}
				$(optionsDiv).append(skipOption);
				
				$('body').append(optionsDiv);
				
				$(optionsDiv).css('width', $('.playbackOption').length * (123+80));
				
				$('.playbackOption').css({width:123, float:'left', marginLeft:40, marginRight:40,'cursor':'pointer'});
				$('.playbackOption').find('h1').css({color:'inherit',fontSize:20, textAlign:'center', fontFamily:'Arial, Helvetica, sans-serif','-webkit-user-select':'none','-moz-user-select':'none','-mz-user-select':'none', '-webkit-font-smoothing':'antialiased'});
				
				TweenMax.staggerFrom($('.playbackOption'), 0.5, {opacity:0}, 0.2, videoOptionReady);
			}else{
				window.location.hash='playVideo___' + videoURL + '.mp4___'+fadeOutVideo;	
				var hashInterval = setInterval(function(){
					if(window.location.hash.replace(/#/g,'') == 'videoCompleted'){
						window.location.hash = 'null';
						clearInterval(hashInterval);
						videoCallBack.apply(videoThisRef);
					}
				},10);
			}
		}
	}
	
	function videoOptionReady(){
		$('.playbackOption').addClickEvent(function(e, mp){
			$('.playbackOption').off();
			if(/(ios|iphone|ipod|ipad|android|silk)/g.test(userAgent)){
				$('.playbackOption').css('display','none');
				$('#videoDiv').css('display','block');
				$('#videoElement').get(0).play();
				$('#optionsDiv').remove();
			}else{
				TweenMax.staggerTo($('.playbackOption'), 0.5, {opacity:0}, 0.2, doVideoAction, [$(e.currentTarget).find('img')[0].id]);
				
				if($(e.currentTarget).find('img')[0].id == 'read'){
					window.open('media/'+curPDFName ,'_blank');
				}
			}
		});
	}
	function doVideoAction(action){
		switch(action){
			case 'watch':
				if(checkVideo()){
					$('#videoDiv').css('display','block');
					$('#videoElement').get(0).play();
				}else{
					window.location.hash='playVideo___' + videoURL + '.mp4___'+fadeOutVideo;	
					var hashInterval = setInterval(function(){
						if(window.location.hash.replace(/#/g,'') == 'videoCompleted'){
							window.location.hash = 'null';
							clearInterval(hashInterval);
							videoCallBack.apply(videoThisRef);
						}
					},10);
				}
			break;
			case 'read':
				//window.open('media/'+curPDFName ,'_blank');
				videoCompleted();
			break;
			case 'skip':
				videoCompleted();
			break;	
		}
		$('#optionsDiv').remove();
	}
	
	function videoCompleted () {
		if(fadeOutVideo){
			TweenMax.to($('#videoElement'), 0.5, {opacity:0, onComplete:function(){
				$('#videoDiv').remove();
				$('#videoElement').off();
				videoCallBack.apply(videoThisRef);
				videoDiv = undefined;
			}});
		}else{
			$('#videoDiv').remove();
			$('#videoElement').off();
			videoCallBack.apply(videoThisRef);
			videoDiv = undefined;
		}
	}
	
	var audioCallBack;
	var audioThisRef;
	var audioPath='';
	var audioJSON;
	var audioElement;
	var curAudioName ='';
	var useAudio = true;
	var progressInterval;
	
	//loadAudio('media/audio/training/vmb__01a_vo', loadDone);
	loadAudio = function (name, callback){
		audioThisRef = this;
		audioCallBack = callback;
		audioPath = name.split('/').splice(0, name.split('/').length -1).join('/');
		
		//no matter if this audio is being loaded by flash or HTML a loader will be displayed.
		var loaderIcon = document.createElement('img');
		loaderIcon.id = 'audioLoadIcon';
		loaderIcon.src = 'images/audioLoader.gif';
		$(loaderIcon).addClass('align-cent-container');
		$(loaderIcon).css('position','absolute');
		$('body').append(loaderIcon);
		
		if(checkAudio()){
			//audio is available so put in a loader
			$.ajax({
				url:name+'.json',
				crossDomain:true,
				xhrFields: {withCredentials: true},
				type:'GET',
				contentType:'application/json; charset=UTF-8',
				dataType:'json',
				error: function(){
					useAudio = false;
					audioCallBack.apply(audioThisRef);
					$('#audioLoadIcon').remove();
				}, 
				success: function(data){
					audioJSON = data;
					audioElement = document.createElement('audio');
					audioElement.id = 'screenAudio';
					audioElement.preload = 'true';
					for(var i = 0; i < audioJSON.resources.length; i ++){
						var tmpSrc = document.createElement('source');
						tmpSrc.src = (audioPath+'/'+audioJSON.resources[i]);
						if(data.resources[i].match(/ogg/)){
							tmpSrc.type = "audio/ogg"
						}else{
							tmpSrc.type = "audio/mpeg"
						}
						$(audioElement).append(tmpSrc);
					}
					
					if(/(ios|iphone|ipod|ipad|android|silk)/g.test(userAgent)){
						//tablet/mobile device
						var confirmBox = document.createElement('div');
						confirmBox.id = 'audioConfirm';
						$(confirmBox).html('<h1>WARNING</h1><p>This screen uses audio which may cause heavy data usage on mobile networks. Would you like to enable the audio for this screen?</p><div class="confirm_container"><div class="confirm_button">YES</div><div class="confirm_button">NO</div>');
						$(confirmBox).addClass('align-cent-container');
						$(confirmBox).css({width:250, height:'auto', position:'absolute', fontFamily:'Arial, Helvetica, sans-serif', backgroundColor:'#FFFFFF', padding:20, boxShadow:'0px 0px 10px 1px rgba(0,0,0,.5)', '-webkit-user-select':'none','-moz-user-select':'none','-mz-user-select':'none', '-webkit-font-smoothing':'antialiased', cursor:'default'});
						
						$(confirmBox).find('h1').css({ fontSize:'20px', color:'#ff0000', padding:0, margin:0, marginBottom:20 });
						$(confirmBox).find('p').css({ fontSize:'15px', color:'#000000', padding:0, margin:0, marginBottom:20 });
						
						$(confirmBox).find('div[class=confirm_container]').css({marginLeft:'50%', width:130, '-moz-transform':'translateX(-50%)', '-webkit-transform':'translateX(-50%)', '-ms-transform':'translateX(-50%)', '-transform':'translateX(-50%)'});
						$(confirmBox).find('div[class=confirm_button]').css({backgroundColor:'#3c143c', width:40, padding:5, float:'left', color:'#ffffff', fontSize:15, lineheight:15, fontWeight:'bold', textAlign:'center', cursor:'pointer'});
						$(confirmBox).find('div[class=confirm_button]:first-child').css({marginRight:30})
						
						$(confirmBox).find('div[class=confirm_button]').on('click touchend touchcancel', function(e){
							$(confirmBox).find('div[class=confirm_button]').css('cursor','default').off();
							$(confirmBox).remove();
							if(parseInt($(this).css('margin-right')) == 0){
								//console.log('no');
								useAudio = false;
								audioCallBack.apply(audioThisRef);
							}else{
								//console.log('yes');
								$(audioElement).on('canplaythrough', audioLoaded);
								audioElement.play();
								var tOut = setTimeout(function(){
									audioElement.pause();
									if(audioElement.readyState == 4){
										$(audioElement).off();
										audioLoaded();
									}
								}, 100);
								
							}
						});
						
						$('body').append(audioElement);
						$('body').append(confirmBox);
					}else{
						//desktop just do it.
						$('body').append(audioElement);
						$(audioElement).on('canplaythrough', audioLoaded);
						
						audioElement.play();
						var tOut = setTimeout(function(){
							audioElement.pause();
							if(audioElement.readyState == 4){
								$(audioElement).off();
								audioLoaded();
							}
						}, 100);
					}
				}
			});
		}else{
			window.location.hash='loadAudio___' + name;	
			var hashInterval = setInterval(function(){
				if(window.location.hash.replace(/#/g,'') == 'audioLoaded'){
					window.location.hash = 'null';
					$('#audioLoadIcon').remove();
					console.log('Audio Loaded Via AIR');
					audioCallBack.apply(audioThisRef);
					clearInterval(hashInterval);
				}
			},10);
		}
	}
	audioLoaded = function(){
		console.log('Audio Loaded');
		$('#audioLoadIcon').remove();
		audioCallBack.apply(audioThisRef);	
		
		$(audioElement).off();
	}
	
	
	playAudio = function (name, callback){
		if(useAudio){
			clearInterval(progressInterval);
			audioThisRef = this;
			if(callback){
				audioCallBack = callback;
			}else{
				audioCallBack = null;
			}
			
			curAudioName = name;
			
			if(checkAudio()){			
				if(audioJSON.spritemap[curAudioName]){			
					audioElement.pause();
					audioElement.currentTime = (audioJSON.spritemap[curAudioName].start -.2);
					audioElement.play();
					
					progressInterval = setInterval(function (){
						if(audioElement.currentTime >= Math.ceil(audioJSON.spritemap[curAudioName].end)+.2){
							audioElement.pause();
							clearInterval(progressInterval);
							if(audioCallBack != null){
								audioCallBack.apply(audioThisRef);
							}
						}
					}, 2);
				}else{
					console.log('No audio found');
					if(audioCallBack!=null){	
						audioCallBack.apply(audioThisRef);
					}
				}
			}else{
				//flash deals with it
				window.location.hash='playAudio___' + curAudioName;	
				if(audioCallBack != null){	
					var hashInterval = setInterval(function(){
						if(window.location.hash.replace(/#/g,'') == 'audioPlayed'){
							window.location.hash = 'null';
							audioCallBack.apply(audioThisRef);
							clearInterval(hashInterval);
						}
					},10);
				}
			}
		}else{
			callback.apply(this);
		}
	}
	
	stopAllSounds = function (){
		if(useAudio){
			if(checkAudio()){	
				try{
				clearInterval(progressInterval);	
				}catch(e){
				}
				audioElement.pause();
			}else{
				window.location.hash='stopAllSounds';
			}
		}
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