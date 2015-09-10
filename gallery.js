var imgList = [];
var imgDims = [];
var currentIndex;

function enlargen(pic) {
	dimScreen();

	// add main image
	var copy = document.createElement("img");
	copy.src = pic.src;
	$(pic).after(copy);
	$(copy).attr("class", "large");
	$(copy).removeAttr("onclick");
	currentIndex = parseInt(pic.id);
	resize(copy, true);

	// add arrows to scroll through pics
	addArrows();
}

function addArrows() {
	var leftArrow = document.createElement("div");
	var rightArrow = document.createElement("div");
	$(".large").after(leftArrow);
	$(".large").after(rightArrow);
	$(leftArrow).attr("class", "left");
	$(rightArrow).attr("class", "right");
	leftArrow.setAttribute("onclick", "leftClicked()");
	rightArrow.setAttribute("onclick", "rightClicked()");	
}

function leftClicked() {
	$(".large").stop();
	if(currentIndex - 1 < 0) {
		currentIndex = imgList.length - 1;
	}
	else {
		currentIndex -= 1;
	}
	$(".large").attr("src", imgList[currentIndex]);
	resize($(".large")[0], false);
	
}

function rightClicked() {
	$(".large").stop();
	if(currentIndex + 1 >= imgList.length) {
		currentIndex = 0;
	}
	else {
		currentIndex += 1;
	}
	$(".large").attr("src", imgList[currentIndex]);
	resize($(".large")[0], false);
}

function minimize() {
	undimScreen();
	$(".large").remove();
	$("div.left").remove();
	$("div.right").remove();
}

function dimScreen() {
	var bg = document.createElement("div");
	$("body").prepend(bg);
	$(bg).attr("class", "cover");
	$(bg).attr("onclick", "minimize()");
	$(bg).animate({"opacity": ".7"}, 500);
}

function undimScreen() {
	var bg = $(".cover");
	bg.animate({"opacity": "0"}, 500, function() {bg.remove();});
}

function resize(el, first) {
	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;
	var windowRatio = windowHeight/windowWidth;
	var elRatio = el.naturalHeight/el.naturalWidth;
	var w;
	var h;
	if(windowRatio < elRatio) {
		w = Math.round(windowHeight*.9/elRatio);
		h = Math.round(windowHeight*.9);
	}
	else {
		w = Math.round(windowWidth*.9);
		h = Math.round(windowWidth*.9*elRatio);
	}
	if(w > el.naturalWidth) {
		w = el.naturalWidth;
	}
	if(h > el.naturalHeight) {
		h = el.naturalHeight;
	}
	
	if(!first) {
		$(el).animate({
			"margin-left": -w/2,
			"margin-top": -h/2,
			"width": w,
			"height": h,
			}, 1000); 
	}
	else {
		$(el).width(w);
		$(el).height(h);
		console.log(currentIndex);
		$(el).css("margin-left", function() {return -$(el).width()/2;});
		$(el).css("margin-top", function() {return -$(el).height()/2;});
	}
}

function setDim(el, dimW, dimH, i) {
	if(imgDims[i][0] > imgDims[i][1]) {
		$(el).width("auto");
		$(el).height(dimH);
	}
	else {
		$(el).width(dimW);
		$(el).height("auto");
	}
	$(el).css("max-height", "100%");
	$(el).css("max-width", "100%");
	$(el).css("min-height", 100);
	$(el).css("min-width", 100);
}

$(document).ready(function() {
	window.addEventListener("resize", function() {
		if($(".large").length > 0) {
			resize($(".large")[0], true);
		}
	});
	window.onkeydown = function(e) {
		var key = event.keyCode || event.which;
		if($(".large").length > 0) {
			if(key === 37) {
				leftClicked();
			}
			else if(key === 39) {
				rightClicked();
			}
		}
	};
	
	var imgs = $(".thumb");
	var i = 0;
	imgs.each(function() {
		imgList.push(this.src);
		// sets width and height of thumbnail
		imgDims.push([$(this).width(), $(this).height()]);
		setDim(this, 100, 100, i);
		this.setAttribute("onclick", "enlargen(this)");
		this.setAttribute("id", i);
		i += 1;
	});
});