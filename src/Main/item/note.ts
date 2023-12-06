import { BaseComponent } from '../../Component/component.js';

export class NoteComponent extends BaseComponent<HTMLElement> {
  constructor(title: string, body: string) {
    super(`<section class="item-note">
            <h3 class="note__title"></h3>
            <div class="note__body"></div>
            </section>`);

    const titleElement = this.element.querySelector(
      '.note__title'
    )! as HTMLHeadingElement;
    titleElement.textContent = title;

    const bodyElement = this.element.querySelector(
      '.note__body'
    )! as HTMLDivElement;
    bodyElement.textContent = body;
  }
}
