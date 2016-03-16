
(function($,Edge,compId){var Composition=Edge.Composition,Symbol=Edge.Symbol;
//Edge symbol: 'stage'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",750,function(sym,e){sym.stop();var questions=[0,1,2,3,4,5,6],answers=[0,1,2,3,4,5,6],questionObjs={},answerObjs={},hitCount=0;function init(){var defaultConnectorColor=sym.getSymbol('Connector').$('connector').css('background-color');questions.shuffle();answers.shuffle();for(var i=0;i<questions.length;i++){sym.createChildSymbol('Question','questionContainer');var dynamicSymbol=sym.getSymbol('Stage').aSymbolInstances[i+5];var content=sym.getSymbol('texts').$('question_'+questions[i]).text();var topMargin=content.length<65?'10px':'0';dynamicSymbol[0].quizID=questions[i];$(dynamicSymbol[0]).find('.text').text(content+' / '+questions[i]).css('margin-top',topMargin);questionObjs[questions[i]]=dynamicSymbol[0];sym.$('questionContainer').css('opacity',1);TweenMax.set($(dynamicSymbol[0]),{position:'absolute',top:i*60});TweenMax.from($(dynamicSymbol[0]),.5,{left:-($(dynamicSymbol[0]).width()+$(dynamicSymbol[0]).offset().left),delay:i*.1});}
for(var i=0;i<answers.length;i++){sym.createChildSymbol('Answer','answerContainer');var dynamicSymbol=sym.getSymbol('Stage').aSymbolInstances[i+12];var content=sym.getSymbol('texts').$('answer_'+answers[i]).text();var topMargin=content.length<8?'10px':'0';dynamicSymbol[0].quizID=answers[i];$(dynamicSymbol[0]).find('.text').text(content+' / '+answers[i]).css('margin-top',topMargin);answerObjs[answers[i]]=dynamicSymbol[0];sym.$('answerContainer').css('opacity',1);TweenMax.set($(dynamicSymbol[0]),{position:'absolute',top:i*60});TweenMax.from($(dynamicSymbol[0]),.5,{left:$(dynamicSymbol[0]).width()+sym.$('Stage').width(),delay:i*.1});}
TweenMax.set($('.center'),{backgroundColor:defaultConnectorColor});TweenMax.delayedCall(1,function(){flashInst(sym.$('inst_1'));playRootSound(sym.screenId+'_vo_02');glowMe($('.glow-question'));glowMe($('.glow-answer'),false);});$('.dummy').each(function(index,value){var startingPoint={};var connector;var dummy;Draggable.create(value,{type:"x,y",cursor:'pointer',bounds:sym.$('Stage'),onPress:function(e){dummy=$(e.target);},onDragStart:function(e){glowMe($('.glow-question'),false);glowMe($('.glow-answer'));startingPoint=dummy.parent().find('.startingpoint').offset();startingPoint.width=dummy.parent().find('.startingpoint').width();startingPoint.height=dummy.parent().find('.startingpoint').height();connector=createConnector(startingPoint);connector.css('position','absolute');$.each(questionObjs,function(i,v){glowMe($(v).find('.blue-glow'),false);});},onDrag:function(e){drawConnector(e,connector,startingPoint,0);},onDragEnd:function(e){var isHit=false;var guessNumber=dummy.parent()[0].quizID;var hitTest=this.hitTest;$('.hit-area').each(function(index,value){if(hitTest(value,"51%")){var endPoint=$(value).parent().find('.endpoint');var startPoint=dummy.parent().find('.startingpoint');var connectorObjs=[connector.find('.line'),endPoint.find('.center'),startPoint.find('.center')];var glowObjs=[endPoint.find('.blue-glow'),startPoint.find('.blue-glow')];var hitNumber=$(value).parent()[0].quizID;sym.$('arc').text('hit!!!'+guessNumber+'/'+hitNumber);if(guessNumber==hitNumber){isHit=true;var endCoors={pageX:endPoint.offset().left+endPoint.width()/2,pageY:endPoint.offset().top+endPoint.height()/2};TweenMax.to(connectorObjs,.5,{backgroundColor:'rgba(122,184,0,1.00)'});playRootSound(sym.screenId+'_vo_03');sym.$('text_feedback').text('Correct');TweenMax.to(sym.$('text_feedback'),.5,{autoAlpha:1,onComplete:function(){TweenMax.to(sym.$('text_feedback'),.5,{autoAlpha:0,delay:1});}});TweenMax.to(sym.$('text_feedback'),.5,{autoAlpha:1,onComplete:function(){TweenMax.to(sym.$('text_feedback'),.5,{autoAlpha:0,delay:1});}});drawConnector(endCoors,connector,startingPoint,1);endPoint.find('.blue-glow').detach();startPoint.find('.blue-glow').detach();dummy.detach();$(value).detach();}else{console.log(connectorObjs);playRootSound(sym.screenId+'_vo_04');sym.$('text_feedback').text('Incorrect, try again');TweenMax.to(sym.$('text_feedback'),.5,{autoAlpha:1,onComplete:function(){TweenMax.to(sym.$('text_feedback'),.5,{autoAlpha:0,delay:1});}});TweenMax.to(connectorObjs,.01,{backgroundColor:'rgba(206,17,38,1.00)',onComplete:function(){TweenMax.to(connectorObjs,1,{backgroundColor:defaultConnectorColor,ease:Quint.easeIn});}});}}});if(!isHit){TweenMax.set(dummy,{x:0,y:0});TweenMax.to(connector,.5,{width:0,ease:Quint.easeOut,onComplete:function(){connector.detach();TweenMax.to(sym.$('nail'),.5,{rotation:0});}});}else{hitCount++;console.log(hitCount);isHit=false;if(hitCount==questions.length){endScene();}}
glowMe($('.glow-question'));glowMe($('.glow-answer'),false);}})});}
function endScene(){glowMe($('.blue-glow'),false);console.log('+ + + Scene Ended + + +');TweenMax.staggerTo($('.line'),.05,{autoAlpha:0,scaleX:0},.05,function(){var aLength=answerObjs.length;$.each(questionObjs,function(i,v){TweenMax.to(v,.5,{top:i*60,delay:.1*i});TweenMax.to(answerObjs[i],.5,{top:i*60,delay:.1*i,onComplete:function(){if(i==6){$.each(answerObjs,function(i,v){TweenMax.to($(v),.5,{left:'-=150',delay:.1*i,onComplete:function(){if(i==6){$('.line').each(function(i,v){TweenMax.set($(v).parent(),{rotation:0})});TweenMax.staggerTo($('.line'),.05,{autoAlpha:1,scaleX:1,width:'190px'},.05,function(){carryOn();});}}});});}}});});s});}
function drawConnector(e,connector,startingPoint,tween){var relPageX=e.pageX-startingPoint.left-startingPoint.width/2;var relPageY=e.pageY-startingPoint.top-startingPoint.height/2;var arc=limitedRotationInDegrees(relPageY,relPageX).arc;var connectorLength=limitedRotationInDegrees(relPageY,relPageX).length;if(!tween){TweenMax.set(connector,{width:connectorLength,rotation:arc});}else{TweenMax.to(connector,.1,{width:connectorLength,rotation:arc});}
sym.$('arc').text(Math.round(arc)+'°');TweenMax.set(sym.$('nail'),{rotation:arc});}
function createConnector(startingPoint){sym.createChildSymbol('Connector','Stage');var allSymbols=sym.getSymbol('Stage').aSymbolInstances;var dynamicSymbol=allSymbols[allSymbols.length-1];startX=startingPoint.left+startingPoint.width/2;startY=startingPoint.top+startingPoint.height/2-dynamicSymbol.height()/2;TweenMax.set(dynamicSymbol,{left:startX,top:startY,transformOrigin:"0 50%"});return dynamicSymbol;}
function limitedRotationInDegrees(y,x){if(x<0){this.arc=(Math.atan(y/x)*180/Math.PI)+180;this.length=Math.cos(Math.atan(x/y))*y+Math.sin(Math.atan(x/y))*x;}else{this.arc=Math.atan(y/x)*180/Math.PI;this.length=Math.sin(Math.atan(y/x))*y+Math.cos(Math.atan(y/x))*x;}
return this;}
Array.prototype.shuffle=function(){var i=this.length,j,temp;if(i==0)return this;while(--i){j=Math.floor(Math.random()*(i+1));temp=this[i];this[i]=this[j];this[j]=temp;}
return this;}
function carryOn(){playRootSound(sym.screenId+'_vo_05');TweenMax.to(sym.$('dynamic_panel'),1,{display:'block',autoAlpha:1,onComplete:function(){sym.play();}});}
init();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"document","compositionReady",function(sym,e){sym.$('#Stage').hide();sym.$('#Stage').css('background-color','rgba(255,255,255,0)');sym.$('#Stage').attr('onselectstart','return false;');if(typeof connectToInterface!='undefined'&&typeof TweenMax!='undefined'){connectToInterface(startScreen);}else{alert('Could not connect to interface.  Ensure customPlugin & TweenMax are present.');}
function startScreen(){setLink(sym);sym.play();}});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){var screenLoc=window.location.toString().split("?")[0];var screenName=screenLoc.substring(screenLoc.lastIndexOf("/")+1);sym.screenId=screenName.substring(0,screenName.indexOf("__")+5);$('.hide-at-start, .inst').css({visibility:'hidden',opacity:0});$('.none-at-start').css('display','none');$('.black-bold').highlightText('#000000',true,false);$('.align-cent-container, .align-vert-container,  .align-horz-container').css('-webkit-transform','');sym.$('#Stage').show();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",500,function(sym,e){sym.stop();playRootSound(sym.screenId+'_vo_01',0,playOn,[sym]);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1000,function(sym,e){sym.stop();rootNextPage();});
//Edge binding end
})("stage");
//Edge symbol end:'stage'

//=========================================================

//Edge symbol: 'my_panel'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.stop('start');});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1000,function(sym,e){sym.stop();waitSeconds(sym,1);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2000,function(sym,e){sym.stop();sym.getSymbolElement().updatePanel();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2500,function(sym,e){sym.stop();waitSeconds(sym,1);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",5500,function(sym,e){sym.stop();sym.getSymbolElement().closePanel();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",5750,function(sym,e){sym.stop();sym.getParentSymbol().play();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1250,function(sym,e){sym.stop();sym.getSymbolElement().updatePanel();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1500,function(sym,e){sym.stop();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2750,function(sym,e){sym.stop();sym.getSymbolElement().updatePanel();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3000,function(sym,e){sym.stop();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3500,function(sym,e){sym.stop();sym.getSymbolElement().updatePanel();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4000,function(sym,e){sym.stop();waitSeconds(sym,1);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4500,function(sym,e){sym.stop();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4250,function(sym,e){sym.stop();sym.getSymbolElement().updatePanel();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",250,function(sym,e){});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",500,function(sym,e){try{sym.getSymbolElement().initPanel(sym.getParentSymbol(),sym,false,'bottom');}catch(e){console.log(e.toString());}});
//Edge binding end
})("dynamic_panel_1_content");
//Edge symbol end:'dynamic_panel_1_content'

//=========================================================

//Edge symbol: 'button'
(function(symbolName){})("dynamic_panel_button_holder");
//Edge symbol end:'dynamic_panel_button_holder'

//=========================================================

//Edge symbol: 'dynamic_panel'
(function(symbolName){})("dynamic_panel_1");
//Edge symbol end:'dynamic_panel_1'

//=========================================================

//Edge symbol: 'btn_blue_next_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){var visibleAtStart=false;var enabledAtStart=true;var disableAfter=true;var hideAfter=true;var clickEvent="touchend touchcancel click";sym.enableButton=function(){sym.getSymbolElement().unbind();sym.play('flashing');sym.getSymbolElement().css({'visibility':'visible','cursor':'pointer'});sym.$('buttonText').css({'visibility':'inherit','cursor':'pointer'});sym.getSymbolElement().on('mouseover',function(e){e.preventDefault();sym.stop('over');sym.$('buttonText').css('cursor','pointer');});sym.getSymbolElement().on('mouseout',function(e){e.preventDefault();sym.play('flashing');});sym.getSymbolElement().on(clickEvent,function(e){e.preventDefault();if(disableAfter){sym.disableButton();}
if(hideAfter){sym.hideMe();}
sym.getParentSymbol().play();sym.getParentSymbol().$('inst_1').fadeInst();});}
sym.disableButton=function(){sym.getSymbolElement().unbind();sym.stop('disabled');sym.getSymbolElement().css('cursor','default');sym.$('buttonText').css('cursor','default');}
sym.hideMe=function(){sym.getSymbolElement().css('visibility','hidden');}
if(visibleAtStart){(enabledAtStart)?sym.enableButton():sym.disableButton();}else{(enabledAtStart)?sym.enableButton():sym.disableButton();sym.hideMe();}});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1750,function(sym,e){sym.play('flashing');});
//Edge binding end
})("btn_blue_continue");
//Edge symbol end:'btn_blue_continue'

//=========================================================

//Edge symbol: 'Question'
(function(symbolName){})("Question");
//Edge symbol end:'Question'

//=========================================================

//Edge symbol: 'Answer'
(function(symbolName){})("Answer");
//Edge symbol end:'Answer'

//=========================================================

//Edge symbol: 'endpoint'
(function(symbolName){})("endpoint_Q");
//Edge symbol end:'endpoint_Q'

//=========================================================

//Edge symbol: 'endpoint_1'
(function(symbolName){})("endpoint_A");
//Edge symbol end:'endpoint_A'

//=========================================================

//Edge symbol: 'Connector'
(function(symbolName){})("Connector");
//Edge symbol end:'Connector'

//=========================================================

//Edge symbol: 'texts'
(function(symbolName){})("texts");
//Edge symbol end:'texts'

//=========================================================

//Edge symbol: 'questionContainer'
(function(symbolName){})("questionContainer");
//Edge symbol end:'questionContainer'

//=========================================================

//Edge symbol: 'questionContainer_1'
(function(symbolName){})("answerContainer");
//Edge symbol end:'answerContainer'

//=========================================================

//Edge symbol: 'endpoint_1'
(function(symbolName){})("endpoint_1");
//Edge symbol end:'endpoint_1'
})(jQuery,AdobeEdge,"plantronics_template");