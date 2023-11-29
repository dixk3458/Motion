import { BaseComponent } from '../../component.js';

export class NoteComponent extends BaseComponent<HTMLElement> {
  // 사용자로부터 입력을 받는 컴포넌트이다.
  // 그리고 내부적으로 무언가를 만들고 어딘가에 붙는 컴포넌트이기때문에
  // BaseComponent를 이용할수있따.
  constructor(title: string, body: string) {
    super(`<section class="note">
                <h3 class="page-item__title note__title"></h3>
                <div class="note__body"></div>
        </section>`);

    const titleElement = this.element.querySelector(
      '.note__title'
    )! as HTMLParagraphElement;
    titleElement.textContent = title;

    const bodyElement = this.element.querySelector(
      '.note__body'
    )! as HTMLDivElement;
    bodyElement.textContent = body;
  }
}
