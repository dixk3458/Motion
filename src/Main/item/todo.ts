import { BaseComponent } from '../../Component/component.js';
export class TodoComponent extends BaseComponent<HTMLElement> {
  constructor(title: string, todo: string) {
    super(`<section class="item-todo">
            <h3 class="todo__title"></h3>
            <input type="checkbox" class="todo__checkbox" />
        </section>
      `);

    // console.log(this.element);
    const titleElement = this.element.querySelector(
      '.todo__title'
    )! as HTMLHeadingElement;
    titleElement.textContent = title;

    const checkboxElement = this.element.querySelector(
      '.todo__checkbox'
    )! as HTMLInputElement;
    checkboxElement.insertAdjacentText('afterend', todo);
  }
}
