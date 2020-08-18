const documentObject = document.documentElement;
// Slide show scripts
let current_slide = 0;
const slide_timer_delay = 3000;
const backToTop = document.getElementById("scroll-to-top");
const hamburger = document.querySelector(".hamburger");
const hamburger_before = window.getComputedStyle(document.querySelector(".span-inner"), ':before');
const hamburger_after = window.getComputedStyle(document.querySelector(".span-inner"), ':after');
const slide_menu = document.querySelector(".slide-menu");
const header = document.getElementById("header");
const brand_name = document.getElementById("brand-name");
let targetCount;

fetch('users.json')
	.then(response => response.json())
	.then(function(data) {
		const slideShow_container = document.getElementById("slideshow-container");		
		const slide_item_cover = document.getElementById("slide-item-cover");		
		const dataLength = data.length;			
		for (let x = 0; x < dataLength; x++) {
			const slidesElem = document.createElement("div");
			slidesElem.className = "slides";
			const imgElem = document.createElement("img");
			imgElem.className = "responsiveImage";
			imgElem.alt = data[x].adminPic;
			imgElem.dataset.src = "Images/Slides/" + data[x].adminPic;
			const slideText = document.createElement("div");
			slideText.className = "slide-text";
			const slideTitlePositioning = document.createElement("div");
			slideTitlePositioning.className = "slide-title-positioning";
			const slideFontTitle = document.createElement("div");
			slideFontTitle.className = "slide-font-title";
			const slideFontSubtitle = document.createElement("div");
			slideFontSubtitle.className = "slide-font-subtitle";
			const indexDot = document.createElement("span");
			indexDot.className = "slide-item-selector";				
			const br = document.createElement("br");
			
			slideFontSubtitle__text = document.createTextNode(data[x].adminPosition);
			slideFontTitle__text = document.createTextNode(data[x].adminName);
			
			slideFontSubtitle.appendChild(slideFontSubtitle__text);
			if (documentObject.clientWidth < 702 ) {
				slideFontSubtitle.innerHTML = slideFontSubtitle.innerHTML.substring(0, 30);
			}
			slideFontTitle.appendChild(slideFontTitle__text);
			slideTitlePositioning.appendChild(slideFontTitle);
			slideTitlePositioning.appendChild(br);
			slideTitlePositioning.appendChild(slideFontSubtitle);
			slideText.appendChild(slideTitlePositioning);
			slidesElem.appendChild(imgElem);
			slidesElem.appendChild(slideText);
			slideShow_container.appendChild(slidesElem);
			slide_item_cover.appendChild(indexDot);
			
		}
		
		//	Slideshow directional controls
		document.getElementById("slide-cover").addEventListener("click", elem => {
			let current_slide_index;
			const slide_length = document.getElementsByClassName("slides").length;		
			const slide_items = document.getElementById("slide-item-cover");
			const slide_items_length = slide_items.children.length;		
			for (let i = 0; i < slide_items_length; i++) {
				((index) => {
					if (slide_items.children[i].className.includes("active")) {
						current_slide_index = index;
					}
				})(i);
			}
			if (elem.target.id.includes("right") || elem.target.parentNode.id.includes("right")) {
				current_slide = (current_slide_index + 1);
				if (current_slide > (slide_length - 1)) {current_slide = 0;}
				clearTimeout(slide_timer);
				slideShow(current_slide);
			} else if (elem.target.id.includes("left") || elem.target.parentNode.id.includes("left")) {
				current_slide = (current_slide_index - 1);
				if (current_slide < 0) {current_slide = (slide_length - 1);}
				clearTimeout(slide_timer);
				slideShow(current_slide);
			}
		});

		//	Slideshow function
		function slideShow(current_slide) {	
			const slide__container = document.getElementById('slideshow-container');
			const slide_item = slide__container.getElementsByClassName('slides');
			const slide_indicator = document.getElementsByClassName("slide-item-selector");		
			for (let j = 0; j < slide_indicator.length; j++) {
				slide_indicator[j].className = slide_indicator[j].className.replace(" slide-item-selector-active", "");
			}
			current_slide = Math.abs(current_slide);
			current_slide++;		
			slide_position = slide_item[current_slide - 1].offsetLeft;
			if (current_slide == 1) {
				slide__container.scrollTo({
					left:slide_position
				});	
			} else {
				slide__container.scrollTo({
					left:slide_position,
					behavior:"smooth"
				});
			}
			slide_indicator[current_slide - 1].className += " slide-item-selector-active";
			if (current_slide > (slide_item.length - 1)) {current_slide = 0;}		
			slide_timer = setTimeout(function() {
				slideShow(current_slide);
			}, slide_timer_delay);		
		}
		
		//	Instantiating and executing IntersectionObserver API
		let observer = new IntersectionObserver((entries, observer) => {		
			entries.forEach(entry => {			
				if (entry.isIntersecting) {
					entry.target.querySelector('.slide-text .slide-title-positioning .slide-font-title').classList.add("is-visible");
					entry.target.querySelector('.slide-text .slide-title-positioning .slide-font-subtitle').classList.add("is-visible");
					entry.target.querySelector("img").src = entry.target.querySelector("img").dataset.src;
				} else {
					entry.target.querySelector('.slide-text .slide-title-positioning .slide-font-title').classList.remove("is-visible");
					entry.target.querySelector('.slide-text .slide-title-positioning .slide-font-subtitle').classList.remove("is-visible");
				}			
			});		
		}, {root:document.querySelector('#slideshow-container'), rootMargin:"0px 0px 0px 0px", threshold:0.75});
		//	Observed elements
		document.querySelectorAll('#slideshow-container .slides').forEach(img => {
			observer.observe(img);
		});
		
		slideShow(current_slide);
	
	})
	.catch(err => console.log(err))
;

//	Alter header styles on scroll
const mutateHeader = () => {		
	// When the user scrolls down 80px from the top of the document, resize the navbar's padding and the logo's font size
	if (document.body.scrollTop > 80 || documentObject.scrollTop > 80) {
		header.classList.add("header-on-scroll");
		brand_name.classList.add("brand-name-on-scroll");
		hamburger_before.style.backgroundColor = "#0061A6";
                hamburger_after.style.backgroundColor = "#0061A6";
                slide_menu.classList.add("slide-menu-on-scroll");
	} else {
		header.classList.remove("header-on-scroll");
		brand_name.classList.remove("brand-name-on-scroll");
		hamburger_before.style.backgroundColor = "";
                hamburger_after.style.backgroundColor = "";
                slide_menu.classList.remove("slide-menu-on-scroll");
	}

	// When the user scrolls down 80px from the top of the document, resize the navbar's padding and the logo's font size
	if (document.body.scrollTop > 200 || documentObject.scrollTop > 200) {
		backToTop.style.display = "block";
	} else {
		backToTop.style.display = "none";
	}

}

//	Scroller options object
const scrollerOptions = {
	"testimonies":[
		"testimonies-container",
		"testimonies-cover",
		3,
		1
	],
	
	"excerpts":[
		"excerpts-slide",
		"excerpts-slide",
		4,
		1
	],
};

Object.keys(scrollerOptions).forEach((optionKey, index) => {
	document.getElementById(optionKey).addEventListener("click", option => {
		let window__width = documentObject.clientWidth;
		if (window__width < 702) {
			targetCount = scrollerOptions[optionKey][3];
		} else {
			targetCount = scrollerOptions[optionKey][2];
		}
		rootNode = optionKey;
		controlNode = scrollerOptions[optionKey][0];
		actionNode = scrollerOptions[optionKey][1];
		targetNode = option.target.id || option.target.parentNode.id;
		scroll_API(rootNode,controlNode,actionNode,targetNode,targetCount);
	});
});

function scroll_API(rootNode,controlNode,actionNode,targetNode,targetCount) {
	//	Testimonies section directional controls
	const item__width = document.getElementById(controlNode).clientWidth;
	if (targetNode.includes("left")) {
		document.getElementById(actionNode).scrollBy({left:(-item__width * targetCount), behavior:'smooth'});
	} else if (targetNode.includes("right")) {
		document.getElementById(actionNode).scrollBy({left:(item__width * targetCount), behavior:'smooth'});
	}
}	

//	Handles on scroll events
window.addEventListener('scroll', perform => {
	mutateHeader();
	//fadeHeader();		
});

backToTop.addEventListener("click", e => {
	window.scrollTo({top:0, behavior:"smooth"});
});

hamburger.addEventListener("click", function() {
	if (this.className.includes("is-active")) {
		this.classList.remove("is-active");
		document.getElementById("slide-menu").classList.remove("is-active-menu");
                document.getElementById("slide-menu").classList.add("is-inactive-menu");
		document.getElementById("overlay").style.display = "none";
	} else {
		this.classList.add("is-active");
		document.getElementById("slide-menu").classList.remove("is-inactive-menu");
                document.getElementById("slide-menu").classList.add("is-active-menu");
		document.getElementById("overlay").style.display = "block";
	}
});

function handleMarquee() {
	const marquee = document.querySelectorAll('.marquee');
	let speed = 1.5;
	let lastScrollPos = 0;
	let timer;
	marquee.forEach(function(el) {
		const container = el.querySelector('.marquee-content');
		const content = el.querySelector('.marquee-content > *');
		//Get total width
		const elWidth = content.offsetWidth;
		//Duplicate content
		let clone = content.cloneNode(true);
		container.appendChild(clone);
		let progress = parseInt(documentObject.clientWidth);
		function loop() {
		progress = progress - speed;
		if(progress <= elWidth * -1) {
			progress = 0;
		}
		container.style.transform = 'translateX(' + progress + 'px)';
		container.style.transform += 'skewX(' + speed * 0.4 + 'deg)';
		window.requestAnimationFrame(loop);
		}
		loop();
	});
	/**window.addEventListener('scroll', function() {
		 const maxScrollValue = 12;
		const newScrollPos = window.scrollY;
		let scrollValue = newScrollPos - lastScrollPos;
		if(scrollValue > maxScrollValue) scrollValue = maxScrollValue;
		else if(scrollValue < -maxScrollValue) scrollValue = -maxScrollValue;
		speed = scrollValue;
		clearTimeout(timer);
		timer = setTimeout(handleSpeedClear, 10);
	});**/
	function handleSpeedClear() {
		speed = 1.5;
	}
};

handleMarquee();
