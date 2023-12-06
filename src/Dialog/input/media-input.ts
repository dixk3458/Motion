import { BaseComponent } from '../../Component/component.js';

export class MediaSectionInput extends BaseComponent<HTMLElement> {
  constructor() {
    super(`<section class="dialog__input__container">
            <div class="dialog__input">
                <label class="dialog__label" for="dialog__title">Title</label>
                <input type="text" id="dialog__title" />
            </div>
            <div class="dialog__input">
                <label class="dialog__label" for="dialog__url">URL</label>
                <input type="text" id="dialog__url" />
            </div>
            </section>
      `);
  }

  get title(): string {
    const title = this.element.querySelector(
      '#dialog__title'
    )! as HTMLInputElement;
    return title.value;
  }

  get url(): string {
    const url = this.element.querySelector('#dialog__url')! as HTMLInputElement;
    return url.value;
  }
}
