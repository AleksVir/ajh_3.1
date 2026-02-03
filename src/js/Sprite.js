export default class Sprite {
  constructor() {
    this.sprite = 'sprite';
    this.positionSprite = -1;
    this.previousPosition = -1;
  }

  randomPositionSprite(size) {

    if (size <= 1) {
      console.warn('Размер поля должен быть больше 1');
      return;
    }

    const divs = document.querySelectorAll('.field');


    let randomInt;
    do {
      randomInt = Math.floor(Math.random() * (size ** 2));
    } while (randomInt === this.previousPosition);

    if (this.positionSprite >= 0) {
      divs[this.positionSprite].classList.remove(this.sprite);
    }

    divs[randomInt].classList.add(this.sprite);
    this.positionSprite = randomInt;
    this.previousPosition = randomInt;
  }
}
