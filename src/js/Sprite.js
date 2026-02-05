export default class Sprite {
  constructor() {
    this.sprite = "sprite";
    this.positionSprite = -1;
    this.previousPosition = -1;
    this.imgElement = null;
    this.hit = false; // Флаг попадания
  }

  randomPositionSprite(size) {
    if (size <= 1) {
      console.warn("Размер поля должен быть больше 1");
      return;
    }

    const divs = document.querySelectorAll(".field");

    if (divs.length === 0) {
      console.error("Элементы .field не найдены");
      return;
    }

    if (divs.length !== size ** 2) {
      console.warn(
        `Ожидалось ${size ** 2} элементов .field, найдено ${divs.length}`,
      );
      return;
    }

    let randomInt;
    do {
      randomInt = Math.floor(Math.random() * size ** 2);
    } while (randomInt === this.previousPosition);

    // Удаляем старый img
    if (this.imgElement) {
      this.imgElement.remove();
      this.imgElement = null;
    }

    // Создаём новый img
    this.imgElement = document.createElement("img");
    this.imgElement.src = "../src/img/goblin.png";
    this.imgElement.alt = "Гоблин";
    this.imgElement.className = this.sprite;

    divs[randomInt].append(this.imgElement);

    this.positionSprite = randomInt;
    this.previousPosition = randomInt;
  }
}
