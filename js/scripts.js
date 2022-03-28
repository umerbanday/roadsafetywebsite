var tag = document.createElement("script");
tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
  var i,
    frames,
    players = [];
  frames = document.getElementsByTagName("iframe");
  const arr = Array.from(frames);
  const arrnew = arr.filter((e) => {
    return e.src.indexOf("https://www.youtube.com/") == 0;
  });
  arrnew.forEach((ele, index) => {
    if (!ele.id) {
      ele.id = "embeddedvideoiframe" + index;
    }
    players.push(
      new YT.Player(ele.id, {
        events: {
          onStateChange: (event) => {
            console.log("Event is ");
            console.log(event);
            if (event.data == YT.PlayerState.PLAYING) {
              players.forEach((ply) => {
                if (ply.getPlayerState() == YT.PlayerState.PLAYING&&ply.getIframe().id != event.target.getIframe().id) {
                  ply.pauseVideo();
                }
              });
            }
          },
        },
      })
    );
  });
  console.log(document.getElementsByTagName("iframe"));
  console.log(players[0].getIframe().id);
}

//FOR COLLAPSIBLE MOBILE MENU

const nav = document.getElementById("navbar");

const mobilebtn = document.getElementById("mobile_menu");
const closebtn = document.getElementById("menu_close");

mobilebtn.addEventListener("click", () => {
  console.log("mob clicked");
  nav.style.display = "block";
});

closebtn.addEventListener("click", () => {
  nav.style.display = "none";
});

//FOR TABS

function openTab(evt, name, fromTop) {
  // Declare all variables
  var i, tabcontent, tablinks, tabimgs, fromtoptab, source;
  console.log(evt.currentTarget);

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    //Check if the parent class of triggering button aand the conmtent are same to separate upper and lower tabs
    if (
      evt.target.parentElement.classList[1] ==
      tabcontent[i].parentElement.classList[1]
    ) {
      tabcontent[i].style.display = "none";
    } else if (fromTop == true) {
      tabcontent[i].style.display = "none";
    }

    console.log(tabcontent[i].parentElement.classList[1]);
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    if (
      evt.target.parentElement.classList[1] ==
      tablinks[i].parentElement.classList[1]
    ) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    } else if (fromTop == true) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  }

  // Get all images with class="nutton_image" and change source
  tabimgs = document.getElementsByClassName("button_image");
  for (i = 0; i < tabimgs.length; i++) {
    if (
      !fromTop &&
      evt.target.parentElement.classList[1] ==
        tabimgs[i].parentElement.classList[1]
    ) {
      tabimgs[i].src = tabimgs[i].src.replace("_active.png", ".png");
    }
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(name).style.display = "block";
  if (!(name == "media" || name == "learning")) {
    document.getElementById(name + "_img").src = document
      .getElementById(name + "_img")
      .src.replace(".png", "_active.png");
  }

  evt.currentTarget.className += " active";
  console.log(evt.currentTarget);

  if (fromTop == true) {
    fromtoptab = document.getElementsByClassName(name);
    fromtoptab[0].className += " active";
    if (name == "learning") {
      fromtoptab = document.getElementsByClassName("messageTab");
      fromtoptab[0].className += " active";
      document.getElementById("message").style.display = "block";
    }
  }
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();
document.getElementById("defaultOpen_LOWER").click();

//FOR SLIDESHOW

var slideIndex = 1;

showSlides(slideIndex, "top");
showSlides(slideIndex, "bottom");

// Next/previous controls
function plusSlides(n, source) {
  showSlides((slideIndex += n), source);
}

// Thumbnail image controls
function currentSlide(n, source) {
  showSlides((slideIndex = n), source);
}

function showSlides(n, source) {
  var i;
  var slides = document.getElementsByClassName("mySlides" + "_" + source);
  var dots = document.getElementsByClassName("dot" + "_" + source);
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}
