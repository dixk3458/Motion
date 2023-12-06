import { BaseComponent, Component } from '../Component/component.js';
import { Composable } from '../Main/main.js';

type OnCloseListener = () => void;
type OnSubmitListener = () => void;

// 역시 BaseComponent를 상속받아 자신의 element를 어딘가에 붙인다.
export class Dialog extends BaseComponent<HTMLElement> implements Composable {
  private closeListener?: OnCloseListener;
  private submitListener?: OnSubmitListener;
  constructor() {
    super(`<section class="dialog">
            <div class="dialog__container">
              <button class="dialog__closeBtn">&times;</button>
              <div class="dialog__body"></div>
              <button class="dialog__submit">ADD</button>
            </div>
        </section>
      `);

    const closeBtn = this.element.querySelector(
      '.dialog__closeBtn'
    )! as HTMLButtonElement;
    closeBtn.addEventListener('click', () => {
      // closeListener 가 있으면 호출해줘
      this.closeListener && this.closeListener();
    });

    const submitBtn = this.element.querySelector(
      '.dialog__submit'
    )! as HTMLButtonElement;
    submitBtn.addEventListener('click', () => {
      this.submitListener && this.submitListener();
    });
  }

  // 외부에서 closeListener를 등록할수있도록함
  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }

  // 외부에서 submitListener를 등록할수있도록함
  setOnSubmitListener(listener: OnSubmitListener) {
    this.submitListener = listener;
  }

  addChild(child: Component) {
    const dialogBody = this.element.querySelector(
      '.dialog__body'
    )! as HTMLElement;
    child.attachTo(dialogBody, 'beforeend');
  }
}
