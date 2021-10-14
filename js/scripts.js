///////////////////////////////////////////// Fadeup
AOS.init();

///////////////////////////////////////////// hamburger
var el = document.querySelector('.hamburger');
var nav = document.querySelector('#header nav');
el.onclick = function() {
  el.classList.toggle('is-active');
  nav.classList.toggle('open');
}
var clo = document.querySelectorAll('#header nav a');
  clo.forEach(function(a) {
    a.onclick = function() {
      nav.classList.remove('open');
      el.classList.remove('is-active');
    }
  });
///////////////////////////////////////////// Oferta
var tog = document.querySelector('.toggle p');
var tab = document.querySelector('.nav-tabs');
tog.onclick = function() {
  // el.classList.toggle('is-active');
  tab.classList.toggle('openTab');
}
var tabHref = document.querySelectorAll('.nav-tabs li a');
  tabHref.forEach(function(a) {
    a.onclick = function() {
      tab.classList.remove('openTab');
    }
  });
///////////////////////////////////////////// Slider
var swiper = new Swiper(".slider-home", {
    loop:true,
    effect: "fade",
    speed: 1000,
    autoplay: {
      enabled: true,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});
/////////////////////////////////////////////// scroll to top
(function() {
  'use strict';
  function trackScroll() {
    var scrolled = window.pageYOffset;
    var coords = document.documentElement.clientHeight;

    if (scrolled > coords) {
      goTopBtn.classList.add('upDisplay');
    }
    if (scrolled < coords) {
      goTopBtn.classList.remove('upDisplay');
    }
  }
  var goTopBtn = document.querySelector('.goToTop');
  window.addEventListener('scroll', trackScroll);
})();
///////////////////////////////////////////// scroll spy adding class to nav elements
(function() {
  'use strict';
  var section = document.querySelectorAll(".section");
  var sections = {};
  var i = 0;
  Array.prototype.forEach.call(section, function(e) {
    sections[e.id] = e.offsetTop - 150;
  });
  window.onscroll = function() {
    var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

    for (i in sections) {
      if (sections[i] <= scrollPosition) {
        document.querySelector('.active').setAttribute('class', ' ');
        document.querySelector('a[href*=' + i + ']').setAttribute('class', 'active');
      }
    }
  };
})();

// Oferta tabs
window.addEventListener("load", function() {
	// store tabs variable
	var myTabs = document.querySelectorAll("ul.nav-tabs > li");
  function myTabClicks(tabClickEvent) {
		for (var i = 0; i < myTabs.length; i++) {
			myTabs[i].classList.remove("active");
		}
		var clickedTab = tabClickEvent.currentTarget;
		clickedTab.classList.add("active");
		tabClickEvent.preventDefault();
		var myContentPanes = document.querySelectorAll(".tab-pane");
		for (i = 0; i < myContentPanes.length; i++) {
			myContentPanes[i].classList.remove("active");
		}
		var anchorReference = tabClickEvent.target;
		var activePaneId = anchorReference.getAttribute("href");
		var activePane = document.querySelector(activePaneId);
		activePane.classList.add("active");
	}
	for (i = 0; i < myTabs.length; i++) {
		myTabs[i].addEventListener("click", myTabClicks)
	}
});


/*///////////////////////////////////////////// Slider and lightbox gallery
part one - Swiper initialization
part two - photoswipe initialization
part three - photoswipe define options
part four - extra code (update swiper index when image close and micro changes)

/* 1 of 4 : SWIPER ################################### */
var mySwiper = new Swiper(".gallery", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 20,
  // centeredSlides: true,
  slideToClickedSlide: false,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false 
  },
  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  // keyboard control
  keyboard: {
    enabled: true,
  },
  breakpoints: {
    300: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

// 2 of 4 : PHOTOSWIPE #######################################

var initPhotoSwipeFromDOM = function(gallerySelector) {
  var parseThumbnailElements = function(el) {
    var thumbElements = el.childNodes,
        numNodes = thumbElements.length,
        items = [],
        figureEl,
        linkEl,
        size,
        item;

    for (var i = 0; i < numNodes; i++) {
      figureEl = thumbElements[i]; // <figure> element

      // include only element nodes
      if (figureEl.nodeType !== 1) {
        continue;
      }

      linkEl = figureEl.children[0]; // <a> element

      size = linkEl.getAttribute("data-size").split("x");

      // create slide object
      item = {
        src: linkEl.getAttribute("href"),
        w: parseInt(size[0], 10),
        h: parseInt(size[1], 10)
      };

      if (figureEl.children.length > 1) {
        // <figcaption> content
        item.title = figureEl.children[1].innerHTML;
      }

      if (linkEl.children.length > 0) {
        // <img> thumbnail element, retrieving thumbnail url
        item.msrc = linkEl.children[0].getAttribute("src");
      }

      item.el = figureEl; // save link to element for getThumbBoundsFn
      items.push(item);
    }

    return items;
  };

  // find nearest parent element
  var closest = function closest(el, fn) {
    return el && (fn(el) ? el : closest(el.parentNode, fn));
  };

  // triggers when user clicks on thumbnail
  var onThumbnailsClick = function(e) {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);

    var eTarget = e.target || e.srcElement;

    // find root element of slide
    var clickedListItem = closest(eTarget, function(el) {
      return el.tagName && el.tagName.toUpperCase() === "LI";
    });

    if (!clickedListItem) {
      return;
    }
    var clickedGallery = clickedListItem.parentNode,
        childNodes = clickedListItem.parentNode.childNodes,
        numChildNodes = childNodes.length,
        nodeIndex = 0,
        index;

    for (var i = 0; i < numChildNodes; i++) {
      if (childNodes[i].nodeType !== 1) {
        continue;
      }

      if (childNodes[i] === clickedListItem) {
        index = nodeIndex;
        break;
      }
      nodeIndex++;
    }

    if (index >= 0) {
      openPhotoSwipe(index, clickedGallery);
    }
    return false;
  };
  var photoswipeParseHash = function() {
    var hash = window.location.hash.substring(1),
        params = {};

    if (hash.length < 5) {
      return params;
    }

    var vars = hash.split("&");
    for (var i = 0; i < vars.length; i++) {
      if (!vars[i]) {
        continue;
      }
      var pair = vars[i].split("=");
      if (pair.length < 2) {
        continue;
      }
      params[pair[0]] = pair[1];
    }

    if (params.gid) {
      params.gid = parseInt(params.gid, 10);
    }

    return params;
  };

  var openPhotoSwipe = function(
  index,
   galleryElement,
   disableAnimation,
   fromURL
  ) {
    var pswpElement = document.querySelectorAll(".pswp")[0],
        gallery,
        options,
        items;

    items = parseThumbnailElements(galleryElement);
    // #################### 3/4 define photoswipe options (if needed) #################### 
    options = {
      closeEl: true,
      captionEl: true,
      fullscreenEl: true,
      zoomEl: true,
      shareEl: false,
      counterEl: false,
      arrowEl: true,
      preloaderEl: true,
      galleryUID: galleryElement.getAttribute("data-pswp-uid"),
      getThumbBoundsFn: function(index) {
        var thumbnail = items[index].el.getElementsByTagName("img")[0],
            pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop,
            rect = thumbnail.getBoundingClientRect();

        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
      }
    };

    if (fromURL) {
      if (options.galleryPIDs) {
    
        for (var j = 0; j < items.length; j++) {
          if (items[j].pid == index) {
            options.index = j;
            break;
          }
        }
      } else {
        // in URL indexes start from 1
        options.index = parseInt(index, 10) - 1;
      }
    } else {
      options.index = parseInt(index, 10);
    }

    // exit if index not found
    if (isNaN(options.index)) {
      return;
    }

    if (disableAnimation) {
      options.showAnimationDuration = 0;
    }

    // Pass data to PhotoSwipe and initialize it
    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();

    /* ########### PART 4 - EXTRA CODE  ########### */
    gallery.listen("unbindEvents", function() {
      let getCurrentIndex = gallery.getCurrentIndex();
      mySwiper.slideTo(getCurrentIndex, 0, false);
      mySwiper.autoplay.start();
    });
    gallery.listen('initialZoomIn', function() {
      if(mySwiper.autoplay.running){
        mySwiper.autoplay.stop();
      }
    });
  };
  var galleryElements = document.querySelectorAll(gallerySelector);

  for (var i = 0, l = galleryElements.length; i < l; i++) {
    galleryElements[i].setAttribute("data-pswp-uid", i + 1);
    galleryElements[i].onclick = onThumbnailsClick;
  }
  var hashData = photoswipeParseHash();
  if (hashData.pid && hashData.gid) {
    openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
  }
};
initPhotoSwipeFromDOM(".my-gallery");

// map
 function initMap() {
        var uluru = {lat: 50.222168, lng: 19.0670185};
        var map = new google.maps.Map(document.getElementById('mapa-it'), {
          zoom: 15,
          center: {lat: 50.2231978, lng: 19.0568391},
          
          styles:[
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#ee9e9e"
            },
            {
                "visibility": "on"
            }
        ]
    }
]
        });

        var marker = new google.maps.Marker({
          position: uluru,
          map: map,
          title: 'Restauracja Dworek „Pod Lipami”',
          icon:'/img/pin.png',
        });
      }