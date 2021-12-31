
//FOR TABS

function openTab(evt, name,fromTop) {
    // Declare all variables
    var i, tabcontent, tablinks;
    console.log(evt.target.parentElement.classList[1])

   
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++)
     {
       //Check if the parent class of triggering button aand the conmtent are same to separate upper and lower tabs
       if(evt.target.parentElement.classList[1]==tabcontent[i].parentElement.classList[1]){
        tabcontent[i].style.display = "none";
       }else if(fromTop==true){
        tabcontent[i].style.display = "none";
       }
      
      console.log(tabcontent[i].parentElement.classList[1])
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      if(evt.target.parentElement.classList[1]==tabcontent[i].parentElement.classList[1]){
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(name).style.display = "block";
    evt.currentTarget.className += " active";   
  
  } 

  // Get the element with id="defaultOpen" and click on it
 // document.getElementById("defaultOpen").click();
  document.getElementById("defaultOpen_LOWER").click();


  //FOR SLIDESHOW

  var slideIndex = 1;
showSlides(slideIndex,'top');
showSlides(slideIndex,'bottom');

// Next/previous controls
function plusSlides(n,source) {
  showSlides(slideIndex += n,source);
}

// Thumbnail image controls
function currentSlide(n,source) {
  showSlides(slideIndex = n,source);
}

function showSlides(n,source) {
  var i;
  var slides = document.getElementsByClassName("mySlides"+"_"+source);
  var dots = document.getElementsByClassName("dot"+"_"+source);
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
} 

//FOR COLLAPSIBLE MOBILE MENU

const nav = document.getElementById("navbar")

const mobilebtn = document.getElementById("mobile_menu")
const closebtn = document.getElementById("menu_close")

mobilebtn.addEventListener('click',()=>{
  console.log("mob clicked")
  nav.style.display="block"
})

closebtn.addEventListener('click',()=>{
  nav.style.display="none"
})

