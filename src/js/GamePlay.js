import Board from "./Board";
import Sprite from "./Sprite";

export default class GamePlay {
  constructor() {
    this.size = 4;
    this.modalEl = document.getElementById("modal");
    this.countDead = null;
    this.countLost = null;
    this.count = 0;
    this.intervalId = null;
    this.sprite = null;
  }

  startGame() {
    // Инициализируем поле
    const board = new Board();
    board.initiationBoard(this.size);

    // Создаём спрайт
    this.sprite = new Sprite();

    // Получаем счётчики
    this.countDead = document.getElementById("dead");
    this.countLost = document.getElementById("lost");

    if (!this.countDead || !this.countLost) {
      throw new Error("Required DOM elements not found!");
    }

    // Сразу размещаем гоблина на поле
    this.sprite.randomPositionSprite(this.size);

    // Настраиваем обработчики
    this.onCellClick();
    this.onButtonClick();

    // Запускаем таймер: через 1 сек и далее каждые 1 сек
    this.intervalId = setInterval(() => {
      this.spawnSprite();
    }, 1000);
  }

  onCellClick() {
    const fields = document.querySelectorAll(".field");
    fields.forEach((field) => {
      field.addEventListener("click", () => {
        const hasSprite = field.querySelector(".sprite");
        if (hasSprite) {
          this.sprite.hit = true;
          hasSprite.remove();
          this.spawnSprite(); // Сразу перемещаем
        } else {
          this.countLost.textContent = +this.countLost.textContent + 1;
          this.checkWinner();
        }
      });
    });
  }

  spawnSprite() {
    if (this.sprite.hit) {
      this.countDead.textContent = +this.countDead.textContent + 1;
      this.sprite.hit = false;
    } else {
      this.countLost.textContent = +this.countLost.textContent + 1;
    }
    this.sprite.randomPositionSprite(this.size);
    this.checkWinner();
  }

  onButtonClick() {
    const resetButtons = document.querySelectorAll(".reset");

    resetButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!this.modalEl.classList.contains("hidden")) {
          this.modalEl.classList.add("hidden");
        }
        this.reset();
        this.startGame();
      });
    });
  }

  reset() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.count = 0;
    this.countDead.textContent = 0;
    this.countLost.textContent = 0;

    const spriteElement = document.querySelector(".sprite");
    if (spriteElement) {
      spriteElement.remove();
    }

    this.sprite.hit = false; // Сбрасываем флаг
  }

  checkWinner() {
    const deadCount = parseInt(this.countDead.textContent, 10);
    const lostCount = parseInt(this.countLost.textContent, 10);

    if (deadCount >= 5) {
      this.stopGame();
      this.showWinner("🍾 Победа! 🍾");
    }

    if (lostCount >= 5) {
      this.stopGame();
      this.showWinner("Вы проиграли!");
    }
  }

  stopGame() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  showWinner(status) {
    const header = this.modalEl.getElementsByTagName("h2")[0];
    header.textContent = status;
    this.modalEl.classList.remove("hidden");
  }
}
