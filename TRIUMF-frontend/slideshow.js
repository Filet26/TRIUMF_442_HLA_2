let index = 0;

slideshow();

function slideshow() {
  console.log("slideshow");

  let slides = document.getElementsByClassName("slide");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  index++;

  if (index > slides.length) {
    index = 1;
  }

  slides[index - 1].style.display = "flex";
  console.log(index);
  if (index == 4) {
    setTimeout(slideshow, 5000);
  } else {
    setTimeout(slideshow, 2000);
  }
}
