import { BaseComponent, Component } from '../component.js';
import { Composable } from '../page/page';

type OnCloseListener = () => void;
type OnSubmitListener = () => void;

export class InputDialog
  extends BaseComponent<HTMLElement>
  implements Composable
{
  private closeListener?: OnCloseListener;
  private submitListener?: OnSubmitListener;
  constructor() {
    super(`<section class="dialog">
            <div class="dialog__container">
                <button class="close">&times;</button>
                <div class="dialog__body"></div>
                <button class="dialog__submit">Add</button>
            </div>
        </section>`);

    const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
    closeBtn.addEventListener('click', () => {
      this.closeListener && this.closeListener();
    });

    const submitBtn = this.element.querySelector(
      '.dialog__submit'
    )! as HTMLButtonElement;
    submitBtn.addEventListener('click', () => {
      this.submitListener && this.submitListener();
    });
  }

  setCloseListener(listener: OnCloseListener): void {
    this.closeListener = listener;
  }

  setSubmitListener(listener: OnSubmitListener): void {
    this.submitListener = listener;
  }

  addChild(child: Component): void {
    const body = this.element.querySelector('.dialog__body')! as HTMLElement;
    child.attachTo(body);
  }
}
