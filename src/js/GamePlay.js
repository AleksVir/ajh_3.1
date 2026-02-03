/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
import Board from './Board';
import Sprite from './Sprite';

export default class GamePlay {
  constructor() {
    this.size = 4;
    this.modalEl = document.getElementById('modal');
    this.countDead = null;
    this.countLost = null;
    this.count = 0;          // Инициализируем счётчик появлений
    this.intervalId = null;  // ID интервала
    this.sprite = null;      // Экземпляр спрайта
  }

  startGame() {
    // Инициализируем игровое поле
    const board = new Board();
    board.initiationBoard(this.size);

    // Создаём экземпляр спрайта (но не показываем сразу!)
    this.sprite = new Sprite();

    // Настраиваем обработчики
    this.onCellClick();
    this.onButtonClick();

    // Запускаем интервал: первое появление — через 1 сек, затем каждые 1 сек
    this.intervalId = setInterval(() => {
      this.spawnSprite();  // Появление спрайта внутри интервала
    }, 1000);
  }

  spawnSprite() {
    // Увеличиваем счётчик появлений
    this.count++;

    // Размещаем спрайт на поле
    this.sprite.randomPositionSprite(this.size);

    // Обновляем счётчик промахов (если нужно)
    this.countLost.textContent = +this.countLost.textContent + 1;

    // Проверяем победу/поражение
    this.checkWinner();
  }

  onCellClick() {
    const fields = document.querySelectorAll('.field');

    this.countDead = document.getElementById('dead');
    this.countLost = document.getElementById('lost');

    if (!this.countDead || !this.countLost) {
      throw new Error('Required DOM elements not found!');
    }

    fields.forEach(field => {
      field.addEventListener('click', () => {
        if (field.classList.contains('sprite')) {
          field.classList.remove('sprite');
          this.countDead.textContent = +this.countDead.textContent + 1;
        } else {
          // Промах: уже учтён в spawnSprite(), но можно добавить логику
        }
        this.checkWinner();
      });
    });
  }

  onButtonClick() {
    const resetButtons = document.querySelectorAll('.reset');

    resetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!this.modalEl.classList.contains('hidden')) {
          this.modalEl.classList.add('hidden');
        }
        this.reset();
        this.startGame();  // Запускаем игру заново
      });
    });
  }

  reset() {
    // Останавливаем интервал
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Обнуляем счётчики
    this.count = 0;
    this.countDead.textContent = 0;
    this.countLost.textContent = 0;

    // Удаляем спрайт с поля (если есть)
    const spriteElement = document.querySelector('.sprite');
    if (spriteElement) {
      spriteElement.classList.remove('sprite');
    }
  }

  checkWinner() {
    const deadCount = parseInt(this.countDead.textContent, 10);
    const lostCount = parseInt(this.countLost.textContent, 10);

    if (deadCount >= 5) {
      this.stopGame();
      this.showWinner('🍾 Победа! 🍾');
    }

    if (lostCount >= 5) {
      this.stopGame();
      this.showWinner('Вы проиграли!');
    }
  }

  stopGame() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  showWinner(status) {
    const header = this.modalEl.getElementsByTagName('h2')[0];
    header.textContent = status;
    this.modalEl.classList.remove('hidden');
  }
}
