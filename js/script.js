'use strict';

//
// --------------------------- ON REFRESH ---------------------------
//

const myStorage = window.sessionStorage;

window.onbeforeunload = function (e) {
  myStorage.setItem(`prevScrollY`, scrollY);
};

const prevScrollY = +myStorage.getItem(`prevScrollY`);
setTimeout(function () {
  window.scrollTo(0, prevScrollY);
}, 100);

// ------------- NAV VARIABLES -------------

const nav = document.querySelector(`.nav`);
const navHeight = nav.getBoundingClientRect().height;
const sectionHero = document.querySelector(`.section-hero`);

//
// --------------------------- SMOOTH PAGE NAV ---------------------------
//

document.querySelectorAll(`.nav-item`).forEach(el => {
  el.addEventListener(`click`, function (e) {
    e.preventDefault();
    const link = e.target.closest(`.link`);

    if (!link) return;

    const href = link.getAttribute(`href`);
    const section = document.querySelector(href);
    const translateY = !section.classList.contains(`section--hidden`)
      ? 0
      : +getComputedStyle(section)
          .transform.split(` `)
          [getComputedStyle(section).transform.split(` `).length - 1].slice(
            0,
            -1
          );
    const sectionEl = section.getBoundingClientRect();
    if (section.classList.contains(`section--hidden`))
      console.log(`target hidden`);
    if (href !== '#cta') {
      window.scrollTo({
        left: sectionEl.left + window.scrollX,
        top: sectionEl.top + window.scrollY - translateY,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        left: sectionEl.left + window.scrollX,
        top: sectionEl.top + window.scrollY - translateY - navHeight,
        behavior: 'smooth',
      });
    }
  });
});

//
// --------------------------- STICKY NAV BAR ---------------------------
//

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add(`sticky`);
  else nav.classList.remove(`sticky`);
};

const heroObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

heroObserver.observe(sectionHero);

//
// --------------------------- MOBILE NAV ---------------------------
//

const btnNav = document.querySelector('.btn-mobile-nav');
const header = document.querySelector('.header');

btnNav.addEventListener('click', function () {
  header.classList.toggle('nav-open');
});

//
// --------------------------- MODAL WINDOW ---------------------------
//

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnsCloseModal = document.querySelectorAll('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnsCloseModal.forEach(btn => btn.addEventListener(`click`, closeModal));

overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    btnsOpenModal.forEach(btn => btn.blur());
    closeModal();
  }
});

//
// --------------------------- REVEAL SECTIONS ---------------------------
//

const allSections = document.querySelectorAll(`.reveal`);

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove(`section--hidden`);
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  if (prevScrollY > 42) {
    return;
  } else {
    section.classList.add(`section--hidden`);
  }
});

//
// --------------------------- FOCUS ON SECTION ENTRY ---------------------------
//

const sectionHow = document.querySelector(`.section-how`);
const sectionTestimonials = document.querySelector(`.section-testimonials`);
const sectionPricing = document.querySelector(`.section-pricing`);

const focusLink = function (entries) {
  const [entry] = entries;
  const link = document.querySelector(
    `a[href="#${entry.target.getAttribute(`id`)}"]`
  );
  if (entry.isIntersecting) {
    link.blur();
    link.classList.add(`focus`);
  } else link.classList.remove(`focus`);
};

const observerHow = new IntersectionObserver(focusLink, {
  root: null,
  threshold: 0.5,
});
observerHow.observe(sectionHow);

const observerTestimonials = new IntersectionObserver(focusLink, {
  root: null,
  threshold: 0.5,
});
observerTestimonials.observe(sectionTestimonials);

const observerPricing = new IntersectionObserver(focusLink, {
  root: null,
  threshold: 0.5,
});
observerPricing.observe(sectionPricing);

//
// --------------------------- SLIDER ---------------------------
//

// ------------- VARIABLES -------------

const slider = document.querySelector(`.slider`);
const slides = document.querySelectorAll(`.slide`);
const btnLeft = document.querySelector(`.btn-round--left`);
const btnRight = document.querySelector(`.btn-round--right`);
const dotContainer = document.querySelector(`.dots`);
const maxSlide = slides.length - 1;
let curSlide = 0;

// ------------- FUNCTIONS -------------

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      `beforeend`,
      `<button class="dot" data-slide="${i}">&nbsp;</button>`
    );
  });
};
createDots();

const activateDot = function (slide) {
  document
    .querySelectorAll(`.dot`)
    .forEach(dot => dot.classList.remove(`dot--fill`));
  document
    .querySelector(`.dot[data-slide="${slide}"]`)
    .classList.add(`dot--fill`);
};
activateDot(0);

const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    const transitionTime = +getComputedStyle(s)
      .transition.split(` `)[1]
      .slice(0, -1);
    if (!s.style.transform) {
      if (i !== 0) {
        s.style.display = `none`;
      }
    }
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
    if (s.style.display === `none`) {
      setTimeout(() => {
        s.style.display = `block`;
      }, 1000 * transitionTime);
    }
  });
};
goToSlide(0);

// --- Next slide

const nextSlide = function () {
  if (curSlide === maxSlide) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

// --- Previous slide

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

// ------------- EVENT HANDLERS -------------

// --- Button events

btnRight.addEventListener(`click`, nextSlide);
btnLeft.addEventListener(`click`, prevSlide);

// --- Keys events

document.addEventListener(`keydown`, function (e) {
  e.key === `ArrowLeft` && prevSlide();
  e.key === `ArrowRight` && nextSlide();
});

// --- Dots events

dotContainer.addEventListener(`click`, function (e) {
  if (e.target.classList.contains(`dot`)) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});

// --- Touch events

slider.addEventListener('touchstart', handleTouchStart, false);
slider.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function getTouches(evt) {
  return (
    evt.touches || // browser API
    evt.originalEvent.touches
  ); // jQuery
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  const xUp = evt.touches[0].clientX;
  const yUp = evt.touches[0].clientY;

  const xDiff = xDown - xUp;
  const yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      // console.log(`right swipe`);
      nextSlide();
      /* right swipe */
    } else {
      // console.log(`left swipe`);
      prevSlide();
      /* left swipe */
    }
  } else {
    if (yDiff > 0) {
      // console.log(`down swipe`);
      /* down swipe */
    } else {
      // console.log(`up swipe`);
      /* up swipe */
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}

//
// --------------------------- SET CURRENT YEAR ---------------------------
//

const yearEl = document.querySelector(`.year`);
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;
