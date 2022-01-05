let characterElems = document.querySelectorAll(".character");

let animationOutputElems = document.querySelectorAll(".animation-container[data-input-from]");
let animationInputElems = document.querySelectorAll(".animation-container[data-output-to]");
let animationOutputElemsCount = animationOutputElems.length;

// file inputs
let backgroundImageInputElem = document.querySelector("[name='background-image']");
let characterImageInputElem = document.querySelector("[name='character-image']");

function init () {
  animationOutputElems.forEach(el => {
    let selector = `[data-output-to="${el.getAttribute("data-input-from")}"]`;
    el.isAnimationOutputElem = true;
    el.animationInputElem = document.querySelector(selector);

    el.animationHistory = [];
    el.animationIndex = 0;
  });

  animationInputElems.forEach(el => {
    let selector = `[data-input-from="${el.getAttribute("data-output-to")}"]`;
    el.isAnimationInputElem = true;
    el.animationOutputElem = document.querySelector(selector);
  });

  characterElems.forEach(el => {
    el.animationContainerElem = el.closest(".animation-container");
    el.animationContainerElem.characterElem = el;
    
    if (el.animationContainerElem.isAnimationInputElem) {
      el.animationOutputElem = el.animationContainerElem.animationOutputElem;
    } else {
      el.animationInputElem = el.animationContainerElem.animationInputElem;
    }

    el.backgroundElem = el.animationContainerElem.querySelector(".canvas");
    el.positionX = 0;
    el.positionY = 0;
    el.throttleMovementIndex = 0;
  });
}

init();


interact('.draggable').draggable({
  listeners: {
    move (event) {
      let characterElem = event.currentTarget;
      let backgroundElem = characterElem.backgroundElem;

      characterElem.positionX += event.dx;
      characterElem.positionY += event.dy;

      characterElem.style.transform = `translate(${characterElem.positionX}px, ${characterElem.positionY}px)`;


      let characterRect = interact.getElementRect(characterElem);
      let backgroundRect = interact.getElementRect(backgroundElem);
      if (doesCollide(characterRect, backgroundRect)) {
        // don't record every movement to save space
        let throttleMovementIndex = characterElem.throttleMovementIndex;

        if (throttleMovementIndex % 2 === 0) {
          // make character movement relative to background
          // TODO convert this to relative units -- PERCENTAGES
          characterElem.animationOutputElem.animationHistory.push([(characterRect.left - backgroundRect.left) * 4, (characterRect.top - backgroundRect.top) * 4]);
        }

        throttleMovementIndex++;
      }
    },
  }
})



function gameLoop() {

  // loop through the animation output elements
  for (let i = 0; i < animationOutputElemsCount; i++) {
    let animationOutputElem = animationOutputElems[i];

    if (animationOutputElem.animationHistory.length === 0) {
      return;
    }

    if (animationOutputElem.animationIndex === animationOutputElem.animationHistory.length) {
      animationOutputElem.animationIndex = 0;
    }

    let currentTranslation = animationOutputElem.animationHistory[animationOutputElem.animationIndex];
    animationOutputElem.characterElem.classList.remove("hide");
    animationOutputElem.characterElem.style.transform = `translate(${currentTranslation[0]}px, ${currentTranslation[1]}px)`;
    animationOutputElem.animationIndex++;
  }

  window.requestAnimationFrame(gameLoop);
}

gameLoop();


// let dataurl;
// backgroundImageInputElem.addEventListener("change", (event) => {
//   const file = backgroundImageInputElem.files[0];
//   const reader = new FileReader();

//   reader.addEventListener("load", function () {
//     // preview.src = reader.result;
//     dataurl = reader.result;
//   }, false);

//   if (file) {
//     reader.readAsDataURL(file);
//   }
// });


// characterImageInputElem







// UTILS

function doesCollide (elemPos1, elemPos2) {
    return elemPos1.left < elemPos2.left + elemPos2.width 
            && elemPos1.left + elemPos1.width > elemPos2.left
            && elemPos1.top < elemPos2.top + elemPos2.height 
            && elemPos1.height + elemPos1.top > elemPos2.top;
}








