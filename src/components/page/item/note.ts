import { BaseComponent } from '../../component.js';

export class NoteComponent extends BaseComponent<HTMLElement> {
  constructor(title: string, body: string) {
    super(`<section class="note">
                <h3 class="page-item__title note__title"></h3>
                <div class="note__body"></div>
            </section>
      `);

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
