
(function($,Edge,compId){var Composition=Edge.Composition,Symbol=Edge.Symbol;
//Edge symbol: 'stage'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",500,function(sym,e){sym.stop();playRootSound('plan__07a_vo_01',getWaitSyls(45),playOn,[sym]);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1250,function(sym,e){sym.stop();var globalEase=Quint;var globalAnimTime=.5;var globalDelay=.2;var localDelay;var draggablesShown=false;var solutions=[[1,2,3,5],[4],[7,8,9],[6]];var polaroids=[sym.$('polaroid_1'),sym.$('polaroid_2'),sym.$('polaroid_3'),sym.$('polaroid_4')];var draggables=[sym.$('drag_1'),sym.$('drag_2'),sym.$('drag_3'),sym.$('drag_4'),sym.$('drag_5'),sym.$('drag_6'),sym.$('drag_7'),sym.$('drag_8'),sym.$('drag_9'),];var temporarlyUndraggable=[];var sceneDrag=[{left:43,top:139,scale:.9,autoAlpha:1,rotation:-1,ease:globalEase.easeOut},{left:391,top:255,scale:.36,autoAlpha:1,rotation:7,ease:globalEase.easeOut},{left:535,top:235,scale:.36,autoAlpha:1,rotation:-4,ease:globalEase.easeOut},{left:652,top:271,scale:.36,autoAlpha:1,rotation:2,ease:globalEase.easeOut}];var sceneEnd=[{left:-50,top:160,scale:.5,autoAlpha:1,rotation:-1,ease:globalEase.easeOut},{left:150,top:160,scale:.5,autoAlpha:1,rotation:7,ease:globalEase.easeOut},{left:350,top:160,scale:.5,autoAlpha:1,rotation:-4,ease:globalEase.easeOut},{left:550,top:160,scale:.5,autoAlpha:1,rotation:2,ease:globalEase.easeOut}];var fadeOut=[{autoAlpha:0,scale:0,ease:globalEase.easeOut}];TweenMax.staggerFromTo(polaroids,.5,{scale:0,autoAlpha:0},{scale:.6,autoAlpha:1,ease:Back.easeOut},.2,function(){playScene(sceneDrag,polaroids,4,finishScene,true);});function playScene(scene,elems,repeat,finalCallback,enabledrag){console.log(scene,elems,repeat);console.log('turn '+repeat);if(repeat<1){finalCallback();return;};repeat--;for(i=0;i<elems.length;i++){if(scene.length!=1){act=scene[i];}else{act=scene[0];}
act.delay=globalDelay*i;act.onComplete=endTurn;act.onCompleteParams=[i];TweenMax.set(elems[i],{zIndex:i});TweenMax.to(elems[i],globalAnimTime,act);}
TweenMax.to(sym.$('hitArea'),.5,scene[0]);function endTurn(i){if(i==elems.length-1){console.log('turn ends');elems=shiftElems(elems);if(enabledrag){startDrag(scene,elems,repeat,finalCallback);}else{finalCallback();}}};function shiftElems(arr){data=arr.shift();arr.push(data);return arr;console.log(arr);}}
function startDrag(scene,elems,repeat,finalCallback){var polaroidName=elems[elems.length-1].data('originalId');var polaroidNum=parseInt(polaroidName.split('_')[1]);var classToHide='hide-with-'+polaroidName;var count=0;var solutionsCount=solutions[polaroidNum-1].length;sym.getSymbol(polaroidName).$('text').fadeIn();console.log(polaroidName,polaroidNum,solutionsCount);if(!draggablesShown){TweenMax.staggerFromTo($('.draggables'),.25,{scale:0,autoAlpha:0},{scale:1,autoAlpha:1,ease:Back.easeOut},.1,function(){enableDrag();draggablesShown=true;TweenMax.fromTo(sym.getSymbol('hitArea').$('band'),.5,{autoAlpha:0},{autoAlpha:1,delay:.85});});flashInst(sym.$('inst_1'));playRootSound('plan__07a_vo_03');}else{TweenMax.fromTo(sym.getSymbol('hitArea').$('band'),.5,{autoAlpha:0},{autoAlpha:1});flashInst(sym.$('inst_1'));enableDrag();}
function enableDrag(){var draggable;var glow=$('.glow');var drop=sym.getSymbol('hitArea').$('glow');glowMe(glow);if(count==solutionsCount){glowMe(glow,false);fadeInst(sym.$('inst_1'));TweenMax.to(sym.getSymbol('hitArea').$('band'),.5,{autoAlpha:0});TweenMax.staggerTo($('.hide-with-'+polaroidName),.25,{scale:0,autoAlpha:0,ease:globalEase.easeOut},.1,function(){TweenMax.to([$('.cross'),sym.getSymbol(polaroidName).$('text')],.5,{autoAlpha:0});TweenMax.to(sym.$(polaroidName),.25,{scale:0,auoAlpha:0,onComplete:function(){playScene(scene,elems,repeat,finalCallback,true);}});});}else{temporarlyUndraggable=[];Draggable.create($('.draggables'),{type:"x,y",bounds:sym.$("Stage"),onPress:function(e){draggable=$(e.currentTarget);},onDragStart:function(){glowMe(glow,false);glowMe(drop);},onDragEnd:function(e){glowMe(drop,false);var obj=($(this.target));var objNum=parseInt(obj.data('originalId').split('_')[1]);if(this.hitTest('.hits')&& arrayContains(solutions[polaroidNum-1],objNum)){$('.draggables').each(function(i,v){Draggable.get(v).disable();});obj.removeClass('draggables');draggable.find('.glow').removeClass('glow');draggable.addClass(classToHide);revealPopup(objNum,polaroidNum);count++;console.log('HIT',count);sym.getSymbol(polaroidName).$('text').text(count+'/'+solutions[polaroidNum-1].length);playRootSound('plan__07a_vo_0'+randomNum(7,9));var rectToSnap=(sym.getSymbol('hitArea').$('place_'+count));var finalLeft=(rectToSnap.offset().left+rectToSnap.width()/2)-draggable.width()/2;var finalTop=(rectToSnap.offset().top+rectToSnap.height()/2)-draggable.height()/2;TweenMax.to(draggable,.5,{x:0,y:0,top:finalTop,left:finalLeft,rotation:-1,ease:globalEase.easeOut});}else{playRootSound('plan__07a_vo_'+randomNum(10,12));TweenMax.delayedCall(.01,function(){console.log(obj);temporarlyUndraggable.push(obj);TweenMax.to(obj.find('.cross'),.5,{autoAlpha:1});TweenMax.to(obj,.5,{x:0,y:0,ease:globalEase.easeOut,onComplete:enableDrag});});}}});}
function revealPopup(j,k){var panel=sym.$('myPanel');var actualContent=sym.$('text_'+k+'_'+j).html();sym.getSymbol('myPanel').getSymbol('content').$('textBox').html(actualContent);TweenMax.set(panel,{display:'block',zIndex:10000});TweenMax.to(panel,.5,{autoAlpha:1});console.log('revealing panel '+j+' in '+k);sym.getSymbol('myPanel').getSymbol('dynamic_panel_button_holder').$('btn_continue').addClickEvent(function(){TweenMax.to(panel,.5,{autoAlpha:0,onComplete:function(){enableDrag();}});});}}}
function finishScene(){playScene(sceneEnd,polaroids,1,carryOn,false);}
function carryOn(){TweenMax.staggerTo([sym.$('body_2'),sym.$('body_1')],.5,{autoAlpha:0},.2,function(){sym.play();});}
function arrayContains(array,element){return array.indexOf(parseInt(element))!=-1?true:false;}
function randomNum(a,b){return Math.floor(Math.random()*((b+1)-a))+a;};});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3500,function(sym,e){sym.stop();rootNextPage();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"document","compositionReady",function(sym,e){sym.$('#Stage').hide();sym.$('#Stage').css('background-color','rgba(255,255,255,0)');sym.$('guide_rect').remove();sym.$('#Stage').attr('onselectstart','return false;');if(typeof connectToInterface!='undefined'&&typeof TweenMax!='undefined'){connectToInterface(startScreen);}else{alert('Could not connect to interface.  Ensure customPlugin & TweenMax are present.');}
function startScreen(){setLink(sym);sym.play();}});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){$('.hide-at-start, .inst').css({visibility:'hidden',opacity:0});$('.none-at-start').css('display','none');$('.black-bold').highlightText('#000000',true,false);$('.align-cent-container, .align-vert-container,  .align-horz-container').css('-webkit-transform','');sym.$('#Stage').show();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1000,function(sym,e){sym.stop();playRootSound('plan__07a_vo_02',getWaitSyls(28),playOn,[sym]);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2000,function(sym,e){sym.stop();playRootSound('plan__07a_vo_04',getWaitSyls(64),playOn,[sym]);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2500,function(sym,e){sym.stop();playRootSound('plan__07a_vo_05',getWaitSyls(97),playOn,[sym]);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3000,function(sym,e){sym.stop();playRootSound('plan__07a_vo_06',getWaitSyls(46),playOn,[sym]);});
//Edge binding end
})("stage");
//Edge symbol end:'stage'

//=========================================================

//Edge symbol: 'btn_regular_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){var visibleAtStart=false;var enabledAtStart=true;var disableAfter=true;var hideAfter=true;sym.$('buttonText').css('cursor','inherit');sym.enableButton=function(){sym.getSymbolElement().off();sym.play('flashing');sym.getSymbolElement().css({visibility:'visible',cursor:'pointer'});sym.$('buttonText').css({visibility:'inherit',cursor:'pointer'});sym.getSymbolElement().on('mouseover',function(e){e.preventDefault();sym.stop('over');});sym.getSymbolElement().on('mouseout',function(e){e.preventDefault();sym.play('flashing');});sym.getSymbolElement().addClickEvent(function(e,mp){if(disableAfter){sym.disableButton();}
if(hideAfter){sym.hideMe();}
sym.getParentSymbol().play();sym.getParentSymbol().$('inst_1').fadeInst();});}
sym.disableButton=function(){sym.getSymbolElement().off();sym.stop('disabled');sym.getSymbolElement().css('cursor','default');}
sym.hideMe=function(){sym.getSymbolElement().css('visibility','hidden');}
sym.hideMe();if(visibleAtStart){(enabledAtStart)?sym.enableButton():sym.disableButton();sym.getSymbolElement().css('cursor','visible');}else{(enabledAtStart)?sym.enableButton():sym.disableButton();sym.hideMe();}});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1750,function(sym,e){sym.play('flashing');});
//Edge binding end
})("btn_continue");
//Edge symbol end:'btn_continue'

//=========================================================

//Edge symbol: 'my_panel'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.stop('start');});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",500,function(sym,e){try{sym.getSymbolElement().initPanel(sym.getParentSymbol(),sym,false,'bottom');}catch(e){console.log(e.toString());}});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1000,function(sym,e){sym.stop();waitSeconds(sym,1);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2000,function(sym,e){sym.stop();sym.getSymbolElement().updatePanel();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2500,function(sym,e){sym.stop();waitSeconds(sym,1);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",5500,function(sym,e){sym.stop();sym.getSymbolElement().closePanel();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",5750,function(sym,e){sym.stop();sym.getParentSymbol().getParentSymbol().play();});
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
})("dynamic_panel_1_content");
//Edge symbol end:'dynamic_panel_1_content'

//=========================================================

//Edge symbol: 'button'
(function(symbolName){})("dynamic_panel_button_holder");
//Edge symbol end:'dynamic_panel_button_holder'

//=========================================================

//Edge symbol: 'btn_continue_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){var visibleAtStart=true;var enabledAtStart=true;var disableAfter=false;var hideAfter=false;sym.$('buttonText').css('cursor','inherit');sym.enableButton=function(){sym.getSymbolElement().off();sym.play('flashing');sym.getSymbolElement().css({visibility:'visible',cursor:'pointer'});sym.$('buttonText').css({visibility:'inherit',cursor:'pointer'});sym.getSymbolElement().on('mouseover',function(e){e.preventDefault();sym.stop('over');});sym.getSymbolElement().on('mouseout',function(e){e.preventDefault();sym.play('flashing');});sym.getSymbolElement().addClickEvent(function(e,mp){if(disableAfter){sym.disableButton();}
if(hideAfter){sym.hideMe();}
sym.getParentSymbol().getParentSymbol().play();});}
sym.disableButton=function(){sym.getSymbolElement().off();sym.stop('disabled');sym.getSymbolElement().css('cursor','default');}
sym.hideMe=function(){sym.getSymbolElement().css('visibility','hidden');}
sym.hideMe();if(visibleAtStart){(enabledAtStart)?sym.enableButton():sym.disableButton();sym.getSymbolElement().css('cursor','visible');}else{(enabledAtStart)?sym.enableButton():sym.disableButton();sym.hideMe();}});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1750,function(sym,e){sym.play('flashing');});
//Edge binding end
})("btn_next");
//Edge symbol end:'btn_next'

//=========================================================

//Edge symbol: 'dynamic_panel'
(function(symbolName){})("dynamic_panel_1");
//Edge symbol end:'dynamic_panel_1'

//=========================================================

//=========================================================

//=========================================================

//=========================================================

//Edge symbol: 'polaroid5_1'
(function(symbolName){})("polaroid_1");
//Edge symbol end:'polaroid_1'

//=========================================================

//Edge symbol: 'polaroid_bg'
(function(symbolName){})("polaroid_bg");
//Edge symbol end:'polaroid_bg'

//=========================================================

//Edge symbol: 'polaroid_2'
(function(symbolName){})("polaroid_2");
//Edge symbol end:'polaroid_2'

//=========================================================

//Edge symbol: 'polaroid_3'
(function(symbolName){})("polaroid_3");
//Edge symbol end:'polaroid_3'

//=========================================================

//Edge symbol: 'polaroid_4'
(function(symbolName){})("polaroid_4");
//Edge symbol end:'polaroid_4'

//=========================================================

//Edge symbol: 'audio326-and-blackwire_6'
(function(symbolName){})("drag_6");
//Edge symbol end:'drag_6'

//=========================================================

//Edge symbol: 'cs540_5'
(function(symbolName){})("drag_5");
//Edge symbol end:'drag_5'

//=========================================================

//Edge symbol: 'savi_2'
(function(symbolName){})("drag_2");
//Edge symbol end:'drag_2'

//=========================================================

//Edge symbol: 'ptt-amp-ca12cd_4'
(function(symbolName){})("drag_4");
//Edge symbol end:'drag_4'

//=========================================================

//Edge symbol: 'charging_base_3'
(function(symbolName){})("drag_3");
//Edge symbol end:'drag_3'

//=========================================================

//Edge symbol: 'voyager_1'
(function(symbolName){})("drag_1");
//Edge symbol end:'drag_1'

//=========================================================

//=========================================================

//Edge symbol: 'myPanel'
(function(symbolName){})("myPanel");
//Edge symbol end:'myPanel'

//=========================================================

//=========================================================

//Edge symbol: 'pop1_content'
(function(symbolName){})("popup_1_content");
//Edge symbol end:'popup_1_content'

//=========================================================

//=========================================================

//Edge symbol: 'popup_2'
(function(symbolName){})("popup_2");
//Edge symbol end:'popup_2'

//=========================================================

//Edge symbol: 'popup_5'
(function(symbolName){})("popup_5");
//Edge symbol end:'popup_5'

//=========================================================

//Edge symbol: 'popup_7_content_1'
(function(symbolName){})("popup_8_content");
//Edge symbol end:'popup_8_content'

//=========================================================

//Edge symbol: 'popup_8'
(function(symbolName){})("popup_8");
//Edge symbol end:'popup_8'

//=========================================================

//Edge symbol: 'prod_BackBeatFit_1'
(function(symbolName){})("img_BackBeatFit");
//Edge symbol end:'img_BackBeatFit'

//=========================================================

//Edge symbol: 'prod_VoyagerEdge_1'
(function(symbolName){})("img_VoyagerEdgeAndLegend");
//Edge symbol end:'img_VoyagerEdgeAndLegend'

//=========================================================

//Edge symbol: 'btn_regular_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){var visibleAtStart=true;var enabledAtStart=true;var disableAfter=false;var hideAfter=false;sym.$('buttonText').css('cursor','inherit');sym.enableButton=function(){sym.getSymbolElement().off();sym.play('flashing');sym.getSymbolElement().css({visibility:'visible',cursor:'pointer'});sym.$('buttonText').css({visibility:'inherit',cursor:'pointer'});sym.getSymbolElement().on('mouseover',function(e){e.preventDefault();sym.stop('over');});sym.getSymbolElement().on('mouseout',function(e){e.preventDefault();sym.play('flashing');});}
sym.disableButton=function(){sym.getSymbolElement().off();sym.stop('disabled');sym.getSymbolElement().css('cursor','default');}
sym.hideMe=function(){sym.getSymbolElement().css('visibility','hidden');}
sym.hideMe();if(visibleAtStart){(enabledAtStart)?sym.enableButton():sym.disableButton();}else{(enabledAtStart)?sym.enableButton():sym.disableButton();sym.hideMe();}});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1750,function(sym,e){sym.play('flashing');});
//Edge binding end
})("btn_continue_1");
//Edge symbol end:'btn_continue_1'

//=========================================================

//Edge symbol: 'popup_3'
(function(symbolName){})("popup_3");
//Edge symbol end:'popup_3'

//=========================================================

//Edge symbol: 'popup_5_content_1'
(function(symbolName){})("popup_6_content");
//Edge symbol end:'popup_6_content'

//=========================================================

//Edge symbol: 'button'
(function(symbolName){})("dynamic_panel_button_holder_1");
//Edge symbol end:'dynamic_panel_button_holder_1'

//=========================================================

//Edge symbol: 'Popups'
(function(symbolName){})("popup_panel");
//Edge symbol end:'popup_panel'

//=========================================================

//Edge symbol: 'prod_VoyagerLegendUc_1'
(function(symbolName){})("img_VoyagerLegendUc");
//Edge symbol end:'img_VoyagerLegendUc'

//=========================================================

//Edge symbol: 'popup_2_content_1'
(function(symbolName){})("popup_3_content");
//Edge symbol end:'popup_3_content'

//=========================================================

//Edge symbol: 'prod_VoyagerFocusUc_1'
(function(symbolName){})("img_VoyagerFocusUc");
//Edge symbol end:'img_VoyagerFocusUc'

//=========================================================

//Edge symbol: 'popup_7'
(function(symbolName){})("popup_7");
//Edge symbol end:'popup_7'

//=========================================================

//Edge symbol: 'prod_Savi_1'
(function(symbolName){})("img_Savi");
//Edge symbol end:'img_Savi'

//=========================================================

//Edge symbol: 'popup_6_content_1'
(function(symbolName){})("popup_7_content");
//Edge symbol end:'popup_7_content'

//=========================================================

//Edge symbol: 'prod_BackBeatPro_1'
(function(symbolName){})("img_BackBeatPro");
//Edge symbol end:'img_BackBeatPro'

//=========================================================

//Edge symbol: 'prod_BlackWire_1'
(function(symbolName){})("img_BlackWire");
//Edge symbol end:'img_BlackWire'

//=========================================================

//=========================================================

//Edge symbol: 'pop1_content'
(function(symbolName){})("popup_1_content_1");
//Edge symbol end:'popup_1_content_1'

//=========================================================

//Edge symbol: 'prod_Calisto_1'
(function(symbolName){})("img_Calisto");
//Edge symbol end:'img_Calisto'

//=========================================================

//Edge symbol: 'popup_4_content_1'
(function(symbolName){})("popup_5_content");
//Edge symbol end:'popup_5_content'

//=========================================================

//Edge symbol: 'popup_4'
(function(symbolName){})("popup_4");
//Edge symbol end:'popup_4'

//=========================================================

//Edge symbol: 'popup_1_content_1'
(function(symbolName){})("popup_2_content");
//Edge symbol end:'popup_2_content'

//=========================================================

//Edge symbol: 'popup_3_content_1'
(function(symbolName){})("popup_4_content");
//Edge symbol end:'popup_4_content'

//=========================================================

//Edge symbol: 'popup1'
(function(symbolName){})("popup_1");
//Edge symbol end:'popup_1'

//=========================================================

//Edge symbol: 'popup_6'
(function(symbolName){})("popup_6");
//Edge symbol end:'popup_6'

//=========================================================

//Edge symbol: 'hitArea'
(function(symbolName){})("hitArea");
//Edge symbol end:'hitArea'

//=========================================================

//Edge symbol: 'cross'
(function(symbolName){})("cross");
//Edge symbol end:'cross'
})(jQuery,AdobeEdge,"plantronics_template");