let activeSlide = 4;

async function changeActiveSlidePicture() {
  const slide1 = document.querySelector(".slide1");
  const slide2 = document.querySelector(".slide2");
  const slide3 = document.querySelector(".slide3");
  const slide4 = document.querySelectorAll(".slide4");
  if (activeSlide == 1) {
    setTimeout(() => {}, 45000);
    activeSlide++;
    slide1.style.display = "none";
    slide2.style.display = "inline-block";
    slide2.style.width = "99%";
    slide2.style.height = "99%";
    return;
  }
  if (activeSlide == 2) {
    activeSlide++;
    slide2.style.display = "none";
    slide3.style.display = "inline-block";
    slide3.style.width = "99%";
    slide3.style.height = "99%";
    return;
  }
  if (activeSlide == 3) {
    activeSlide++;
    slide3.style.display = "none";
    for (const item of slide4) {
      item.style.display = "inline-block";
    }
    return;
  }
  if (activeSlide == 4) {
    activeSlide = 1;
    for (const item of slide4) {
      item.style.display = "none";
    }

    slide1.style.display = "inline-block";
    slide1.style.width = "99%";
    slide1.style.height = "99%";
    return;
  }
}

setInterval(() => {
  changeActiveSlidePicture();
}, 15000);
