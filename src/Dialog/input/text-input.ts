import { BaseComponent } from '../../Component/component.js';

export class TextSectionInput extends BaseComponent<HTMLElement> {
  constructor() {
    super(`<section class="dialog__input__container">
            <div class="dialog__input">
                <label class="dialog__label" for="dialog__title"> Title </label>
                <input type="text" id="dialog__title" />
            </div>
            <div class="dialog__input">
                <label class="dialog__label" for="dialog__body">Body</label>
                <input type="text" id="dialog__body" />
            </div>
        </section>
      `);
  }

  get title(): string {
    const titleElement = this.element.querySelector(
      '#dialog__title'
    )! as HTMLInputElement;
    return titleElement.value;
  }

  get body(): string {
    const bodyElement = this.element.querySelector(
      '#dialog__body'
    )! as HTMLInputElement;
    return bodyElement.value;
  }
}
