import { BaseComponent, Component } from '../component.js';

export interface Composable {
  addChild(child: Component): void;
}

type SectionContainerConstructor = {
  new (): SectionContainer;
};

interface SectionContainer extends Component, Composable {
  setOnCloseListener(listener: OnCloseListener): void;
}

export class PageComponent
  extends BaseComponent<HTMLElement>
  implements Composable
{
  constructor(
    private pageItemContainerConstructor: SectionContainerConstructor
  ) {
    super(`<ul class="page"></ul>`);
  }

  addChild(section: Component) {
    const item = new this.pageItemContainerConstructor();
    item.addChild(section);
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
    });
    item.attachTo(this.element, 'beforeend');
  }
}

type OnCloseListener = () => void;

export class PageItemComponent
  extends BaseComponent<HTMLElement>
  implements Composable, SectionContainer
{
  private closeListener?: OnCloseListener;

  constructor() {
    super(`<li class="page-item">
            <section class="page-item__body"></section>
            <button class="close">&times;</button>
          </li>`);

    const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
    closeBtn.addEventListener('click', () => {
      this.closeListener && this.closeListener();
    });
  }

  addChild(child: Component): void {
    const container = this.element.querySelector(
      '.page-item__body'
    )! as HTMLElement;
    child.attachTo(container);
  }

  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }
}
