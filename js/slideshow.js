var currentSlide = 1;
showSlides(1);

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dotty");
  if (n > slides.length) {currentSlide = 1}
  if (n < 1) {currentSlide = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[currentSlide-1].style.display = "block";
  dots[currentSlide-1].className += " active";
  console.log(n)
}

// Next/previous controls
function plusSlides(n) {
  showSlides(currentSlide += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(currentSlide = n);
}