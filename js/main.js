let animationContainerElem = document.querySelector(".animation-container");
let canvasElem = document.querySelector(".canvas");
let characterElem = document.querySelector(".character");
let playButtonElem = document.querySelector(".play-button");

let position = { x: 0, y: 0 };
let history = [];

interact('.draggable').draggable({
  listeners: {
    start (event) {
      // console.log(event.type, event.target)
    },
    move (event) {
      position.x += event.dx;
      position.y += event.dy;

      let rect1 = interact.getElementRect(canvasElem);
      let rect2 = interact.getElementRect(characterElem);

      let translation = `translate(${position.x}px, ${position.y}px)`
      event.target.style.transform = translation;

      if (doesCollide(rect1, rect2)) {
        history.push(translation);
        animationContainerElem.classList.add("colliding");
      } else {
        animationContainerElem.classList.remove("colliding");
      }
    },
  }
})


function doesCollide (elemPos1, elemPos2) {
    return elemPos1.left < elemPos2.left + elemPos2.width 
            && elemPos1.left + elemPos1.width > elemPos2.left
            && elemPos1.top < elemPos2.top + elemPos2.height 
            && elemPos1.height + elemPos1.top > elemPos2.top;
}


playButtonElem.addEventListener("click", (event) => {
  gameLoop();
});


let currentLoop = 0;
function gameLoop() {

  if (currentLoop === history.length) {
    currentLoop = 0;
    return;
  }

  let currentTranslation = history[currentLoop];
  characterElem.style.transform = currentTranslation;
  currentLoop++

  window.requestAnimationFrame(gameLoop);
}











