
(function($,Edge,compId){var Composition=Edge.Composition,Symbol=Edge.Symbol;
//Edge symbol: 'stage'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",750,function(sym,e){sym.stop();playRootSound('plan__06a_vo_01',getWaitSyls(67),playOn,[sym]);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1000,function(sym,e){sym.stop();flashInst(sym.$('inst_1'));playRootSound('plan__06a_vo_02');var magnifier=sym.$('magnifier');var panel=sym.$('myPanel');var glow=sym.getSymbol('magnifier').$('glow');var display=null;var end=false;var hotspotsNum=sym.$('.hotspots').length;var hotspotsShown=[];for(j=0;j<hotspotsNum;j++){hotspotsShown.push(Boolean(0));};if(!end){glowMe(glow);}
Draggable.create(magnifier,{type:"top,left",bounds:sym.$('Stage'),edgeResistance:.5,onPress:function(e){if(!end){glowMe(glow,false);}},onDrag:function(e){var lens=sym.getSymbol('magnifier').$('lens');for(i=0;i<hotspotsNum;i++)
if(myHitTest(lens,sym.$('hotspot_'+(i+1)),20)){if(display==null){var actualContent=sym.$('text_'+(i+1)).html();console.log('panel '+(i+1));sym.getSymbol('myPanel').getSymbol('content').$('textBox').html(actualContent);TweenMax.to(panel,.5,{display:'block',autoAlpha:1});display=i;if(!hotspotsShown[i]){hotspotsShown[i]=true;increaseCounter(i);sym.getSymbol('hotspot_'+(i+1)).$('text').html(i+1);TweenMax.to(sym.$('hotspot_'+(i+1)),.5,{autoAlpha:1});}
if(hotspotsShown.indexOf(false)==-1&&!end){fadeInst(sym.$('inst_1'));end=true;carryOn();}}}else if(display==i){console.log('out');TweenMax.to(panel,.5,{display:'none',autoAlpha:0});display=null;};followElement(lens,panel);},onDragEnd:function(){if(!end){glowMe(glow);}}});function myHitTest(obj1,obj2,threshold){var l1=parseInt(obj1.offset().left),l2=parseInt(obj2.offset().left),t1=parseInt(obj1.offset().top),t2=parseInt(obj2.offset().top);var w1=obj1.width(),h1=obj1.height(),w2=obj2.width(),h2=obj2.height();var tr=threshold;return t2+h2>t1+tr&&l2+w2>l1+tr&&t2<t1+h1-tr&&l2<l1+w1-tr;};function increaseCounter(i){switch(i){case 5:case 6:case 7:case 8:pNum=2;max=4;break
case 9:case 10:case 11:case 12:pNum=4;max=4;break
case 13:case 14:case 15:case 16:pNum=3;max=4;break
default:pNum=1;max=5;};count=parseInt(sym.getSymbol('polaroid_'+(pNum)).$('text').html().split('/')[0]);sym.getSymbol('polaroid_'+(pNum)).$('text').html((++count)+'/'+max);if(count==max){flashInst(sym.getSymbol('polaroid_'+(pNum)).$('text'));}}
function followElement(lens,panel){var lSpike=sym.getSymbol('myPanel').$('spike_left'),rSpike=sym.getSymbol('myPanel').$('spike_right');var lLeft=lens.offset().left,lWidth=lens.width(),pWidth=panel.width();var lTop=lens.offset().top,lHeight=lens.height(),pHeight=panel.height();if(lLeft>sym.$('Stage').width()/2){panelLeft=lLeft-pWidth-rSpike.width()+15;rSpike.css('display','block');lSpike.css('display','none');}
else{panelLeft=lLeft+lWidth+lSpike.width()-15;rSpike.css('display','none');lSpike.css('display','block');}
panelTop=lTop+lHeight/2-pHeight/2;panel.offset({'left':panelLeft,'top':panelTop});}
function carryOn(){sym.play();}});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2250,function(sym,e){sym.stop();rootNextPage();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"document","compositionReady",function(sym,e){sym.$('#Stage').hide();sym.$('#Stage').css('background-color','rgba(255,255,255,0)');sym.$('guide_rect').remove();sym.$('#Stage').attr('onselectstart','return false;');if(typeof connectToInterface!='undefined'&&typeof TweenMax!='undefined'){connectToInterface(startScreen);}else{alert('Could not connect to interface.  Ensure customPlugin & TweenMax are present.');}
function startScreen(){setLink(sym);sym.play();}});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){$('.hide-at-start, .inst').css({visibility:'hidden',opacity:0});$('.none-at-start').css('display','none');$('.black-bold').highlightText('#000000',true,false);$('.align-cent-container, .align-vert-container,  .align-horz-container').css('-webkit-transform','');sym.$('#Stage').show();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2000,function(sym,e){sym.stop();playRootSound('plan__06a_vo_03',getWaitSyls(29),playOn,[sym]);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",250,function(sym,e){sym.stop();var elements=[sym.$('polaroid_1'),sym.$('polaroid_2'),sym.$('polaroid_3'),sym.$('polaroid_4'),sym.$('magnifier')];TweenMax.staggerFromTo(elements,.5,{scale:0,autoAlpha:0},{scale:1,autoAlpha:1,ease:Back.easeOut},.2,function(){sym.play()});});
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

//Edge symbol: 'myPanel'
(function(symbolName){})("myPanel");
//Edge symbol end:'myPanel'

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

//=========================================================

//Edge symbol: 'pop1_content'
(function(symbolName){})("popup_1_content");
//Edge symbol end:'popup_1_content'

//=========================================================

//Edge symbol: 'popup1'
(function(symbolName){})("popup_1");
//Edge symbol end:'popup_1'

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

//Edge symbol: 'green_dot'
(function(symbolName){})("green_dot");
//Edge symbol end:'green_dot'

//=========================================================

//Edge symbol: 'hotspot'
(function(symbolName){})("hotspot");
//Edge symbol end:'hotspot'

//=========================================================

//Edge symbol: 'magnifier'
(function(symbolName){})("magnifier");
//Edge symbol end:'magnifier'
})(jQuery,AdobeEdge,"plantronics_template");