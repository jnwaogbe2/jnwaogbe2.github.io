var currentSlide = 1;
showDivs(currentSlide);

function plusDivs(n) {
  showDivs(currentSlide += n);
}

function currentDiv(n) {
  showDivs(currentSlide = n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  if (n > x.length) {currentSlide = 1}    
  if (n < 1) {currentSlide = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" w3-red", "");
  }
  x[currentSlide-1].style.display = "block";  
  dots[currentSlide-1].className += " w3-red";
}

// var previousSlide = 1;
// var currentSlide = 1;
// showSlides(1);

// function showSlides(n) {
//   let i;
//   let slides = document.getElementsByClassName("mySlides");
//   let dots = document.getElementsByClassName("dotty");
//   if (n > slides.length) {currentSlide = 1}
//   if (n < 1) {currentSlide = slides.length}
//   for (i = 0; i < slides.length; i++) {
//     slides[i].style.display = "none";
//   }
//   for (i = 0; i < dots.length; i++) {
//     dots[i].className = dots[i].className.replace(" active", "");
//   }

//   if (previousSlide < currentSlide) {
//     slides[currentSlide-1].classList.add("right");
//     slides[previousSlide-1].classList.add("right");
//   } else if (previousSlide > currentSlide) {
//     slides[currentSlide-1].classList.add("fade");
//     slides[previousSlide-1].classList.add("fade");
//   }

//   slides[currentSlide-1].style.display = "block";
//   dots[currentSlide-1].className += " active";
//   console.log(n)
// }

// // Next/previous controls
// function plusSlides(n) {
//   previousSlide = currentSlide;
//   showSlides(currentSlide += n);
// }

// // Thumbnail image controls
// function currentSlide(n) {
//   previousSlide = currentSlide;
//   showSlides(currentSlide = n);
// }