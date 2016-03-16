// ver 2.2.2
// +++ Globals +++ //

var data, crossWords, dataSet = {};
var loLines, correctAnswers, allHits = [];
var loSubject, loClass, loTitle, loSubTitle, hiddenWord, output, code = "";
var maxHit = 0;
var browser = get_browser();
var isIE = false;

// +++ data and init +++ //

$(document).ready(function () {
	init(data); // init crosswords w response
	setInterval(function () {
		$("#wrap").center().fadeIn(500);
	}, 100);
});

// +++ INIT LO +++ //

function init(crossWords) {

	if (browser == 'IE' || browser == 'MSIE') {
		isIE = true;
	}
	loLines = crossWords.lines;
	loSubject = crossWords.loSubject;
	loClass = crossWords.loClass;
	loTitle = crossWords.loTitle;
	loSubTitle = crossWords.loSubTitle;
	hiddenWord = crossWords.hiddenWord;
	correctAnswers = [];
	output = "";
	var toggle;

	// title and heading
	$("title").html(loSubject + " " + loClass + " | " + loTitle);
	$("#loSubTitle").html(loSubTitle);

	// define max hit
	for (i = 0; i < loLines.length; i++) {
		allHits.push(loLines[i].hit + " ");
	}
	maxHit = Math.max.apply(null, allHits);

	// output crosswords rows html
	for (i = 0; i < loLines.length; i++) {
		//array of all words
		correctAnswers.push(loLines[i].word.toUpperCase());
		//process crosswords.lines properties
		cssLength = loLines[i].word.length;
		cssHit = loLines[i].hit;
		htmlDesc = loLines[i].descr;
		cssOffset = maxHit - cssHit;
		//output
		output += '<div id="row-' + i + '" class="row offset-' + cssOffset + ' width-' + (cssLength) + '">';
		output += '<div class="clearRow">×</div>';
		output += '<div class="description">';
		output += '<span class="tooltip">';
		output += htmlDesc + ' (' + cssLength + '&nbsp;betű)';
		output += '</span>';
		output += '</div>';
		for (j = 1; j <= cssLength; j++) {
			output += '<input id="input-' + i + '-' + j + '"';
			output += ' maxlength="1"';
			output += ' class="inputField dataSet-' + i;
			if (cssHit == j) {
				output += ' hit" />';
			} else {
				output += '" />';
			};
		};
		output += '</div>';
	};
	$("#crossWords").html(output);

	// show description events
	$(".row").focusin(function () {
		$(this).find(".tooltip").css({
			"zIndex": "200"
		}).fadeIn(250);
	}).focusout(function () {
		$(this).find(".tooltip").fadeOut(250);
	});
	$(".inputField").focusin(function () {
		$(this).parent().find(".tooltip").stop();
	}).focusout(function () {
		$(this).parent().find(".tooltip").stop();
	});
	//assign input value to attributes and mime keystroke behaviours
	$('.inputField').keydown(function (e) {
		$(this).find(".tooltip").stop();
	});
	$('.inputField').keyup(function (e) {
		//console.log(e.keyCode);
		code = e.keyCode || e.which;
		if (code == 8) { //backspace
			console.log('toggle: ', toggle);
			if (toggle || !$(this).is(':last-child')) {
				$(this).prev().focus();
				$(this).prev().attr("value", "");
				$(this).prev().val("");
				toggle = false;
			} else {
				toggle = true;
			};
		} else if (code <= 46 && code >= 16 || code == 9) { //tab and others
			return;
		} else if (code == 13) { //enter
			$(this).parent().next().find(">:nth-child(3)").focus();
		} else if (isIE) {
			$(this).next().focus(); // if it's IE force stepping into the next input text box
		};
	});
	$('.inputField').keypress(function (e) {
		code = e.keyCode || e.which;
		if (code != 8 && !isIE) {
			$(this).next().focus();
		} else {
			return
		};
	});
	$(".clearRow").click(function () {
			//console.log('cls');
			$(this).offsetParent().find(".inputField").attr("value", "");
			$(this).offsetParent().find(".inputField").val("");
		})
		//center on resize
	$(window).resize(function () {
		$("#wrap").center();
	});

}; // end init

// +++ FRAME FUNCTIONS +++ //

// restart
function restart() {
		init(data);
	}
	// correctAnswer
function correctAnswer() {
		inputs = $('input');
		for (i = 0; i < inputs.length; i++) {
			inputs[i].placeholder = (correctAnswers.join(""))[i];
		}
	}
	// check
function check() {
	userInput = [];
	for (i = 0; i < loLines.length; i++) {
		inputValue = [];
		dataSet = $(".dataSet-" + i);
		for (j = 0; j < dataSet.length; j++) {
			inputValue.push(dataSet[j].value);
		}
		userInput.push(inputValue.join("").toLocaleUpperCase());
	};
	//console.log(userInput);
	// Compare initial and actual array values and call opener.FeedBack();
	//if (parent.feedBackFromJs) {
	var feedbackCorrect = "Ügyes vagy, a megfejtés: " + hiddenWord + "."
	if (userInput.join() == correctAnswers.join()) {
		parent.feedBackFromJs("5", feedbackCorrect);
	} else if (userInput.indexOf("") != -1) {
		parent.feedBackFromJs("1", "Minden sort fejts meg! Jó fejtörést!");
	} else if (userInput.join() != correctAnswers.join()) {
		parent.feedBackFromJs("1", "Nem ez a megfejtés. Nem baj, próbáld újra!");
	}
	//	} else {
	//		if (userInput.join() == correctAnswers.join()) {
	//			console.log("5", "Ügyes vagy, a megfejtés: " + hiddenWord + ".");
	//		} else if (userInput.indexOf("") != -1) {
	//			console.log("4", "Minden sort fejts meg! Jó fejtörést!");
	//		} else if (userInput.join() != correctAnswers.join()) {
	//			console.log("1", "Nem ez a megfejtés. Nem baj, próbáld újra!");
	//		}
	//	}
}

// correctAnswer
function solveIt() {
	inputs = $('input');
	for (i = 0; i < inputs.length; i++) {
		inputs[i].value = (correctAnswers.join(""))[i];
	}
}

function stepBack(elem) {
	elem.prev().focus();
};

function logg(arg) {
	$("#log").append(arg);
};
//center #wrap
$.fn.center = function () {
	var stage = ('#wrap');
	var titleHeight = $('#loTitle').outerHeight() + $('#loSubTitle').outerHeight() + $('#loTitle').offset().top;
	var matrixRegex = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/;
	matches = ($(stage).css('-webkit-transform') || $(stage).css('-moz-transform') || $(stage).css('-ms-transform') || $(stage).css('-o-transform') || $(stage).css('transform')).match(matrixRegex);

	var heightRatio = ($(window).height() != 0) ? (this.outerHeight() - titleHeight) / $(window).height() : matches[1];
	var widthRatio = ($(window).width() != 0) ? this.outerWidth() / $(window).width() : matches[2];
	this.css({
		position: 'fixed',
		margin: 0,
		top: (50 * (1 - heightRatio)) + "%",
		left: (50 * (1 - widthRatio)) + "%"
	});
	return this;
}

function get_browser() {
	var ua = navigator.userAgent,
		tem,
		M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
		return 'IE';
	}
	if (M[1] === 'Chrome') {
		tem = ua.match(/\bOPR\/(\d+)/)
		if (tem != null) {
			return 'Opera'
		}
	}
	M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
	if ((tem = ua.match(/version\/(\d+)/i)) != null) {
		M.splice(1, 1, tem[1]);
	}
	return M[0];
}

console.log(browser);