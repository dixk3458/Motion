import { BaseComponent, Component } from '../component.js';

export interface Composable {
  addChild(child: Component): void;
}

type OnCloseListener = () => void;

type DragState = 'start' | 'stop' | 'enter' | 'leave';

type OnDragStateListener<T extends Component> = (
  target: T,
  state: DragState
) => void;

type SectionContainerConstructor = {
  new (): SectionContainer;
};

interface SectionContainer extends Component, Composable {
  setOnCloseListener(listener: OnCloseListener): void;

  setOnDragStateListener(listener: OnDragStateListener<SectionContainer>): void;
  muteChildren(state: 'mute' | 'unmute'): void;
  getBoundingRect(): DOMRect;
  onDropped(): void;
}

export class PageComponent
  extends BaseComponent<HTMLElement>
  implements Composable
{
  private children = new Set<SectionContainer>();
  private dragTarget?: SectionContainer;
  private dropTarget?: SectionContainer;

  constructor(
    private pageItemContainerConstructor: SectionContainerConstructor
  ) {
    super(`<ul class="page"></ul>`);

    this.element.addEventListener('dragover', (event: DragEvent) => {
      event.preventDefault();
      this.onDragOver(event);
    });

    this.element.addEventListener('drop', (event: DragEvent) => {
      event.preventDefault();
      this.onDrop(event);
    });
  }

  onDragOver(event: DragEvent) {
    // console.log('dragover', event);
    console.log('dragover', event.target);
  }

  onDrop(event: DragEvent) {
    if (!this.dropTarget) {
      return;
    }
    if (this.dragTarget && this.dragTarget !== this.dropTarget) {
      const dropY = event.clientY;
      const srcElement = this.dragTarget.getBoundingRect();

      this.dragTarget.removeFrom(this.element);
      this.dropTarget.attach(
        this.dragTarget,
        dropY < srcElement.y ? 'beforebegin' : 'afterend'
      );
    }

    this.dropTarget.onDropped();
  }

  addChild(section: Component) {
    const item = new this.pageItemContainerConstructor();
    item.addChild(section);
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
      this.children.delete(item);
    });
    this.children.add(item);
    item.setOnDragStateListener(
      (target: SectionContainer, state: DragState) => {
        // 각 상태에 따라 다르게 행동
        switch (state) {
          case 'start':
            this.dragTarget = target;
            this.updateSections('mute');
            break;
          case 'stop':
            this.dragTarget = undefined;
            this.updateSections('unmute');
            break;
          case 'enter':
            this.dropTarget = target;
            console.log(target);
            break;
          case 'leave':
            console.log(target);
            this.dropTarget = undefined;
            break;
          default:
            throw new Error(`unsupported state : ${state}`);
        }
      }
    );
    item.attachTo(this.element, 'beforeend');
  }

  private updateSections(state: 'mute' | 'unmute') {
    this.children.forEach((section: SectionContainer) => {
      section.muteChildren(state);
    });
  }
}

export class PageItemComponent
  extends BaseComponent<HTMLElement>
  implements Composable, SectionContainer
{
  private closeListener?: OnCloseListener;

  private dragStateListener?: OnDragStateListener<PageItemComponent>;
  constructor() {
    super(`<li class="page-item" draggable="true">
            <section class="page-item__body"></section>
            <button class="close">&times;</button>
          </li>`);

    const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
    closeBtn.addEventListener('click', () => {
      this.closeListener && this.closeListener();
    });

    this.element.addEventListener('dragstart', (event: DragEvent) => {
      this.onDragStart(event);
    });

    this.element.addEventListener('dragend', (event: DragEvent) => {
      this.onDragEnd(event);
    });

    this.element.addEventListener('dragenter', (event: DragEvent) => {
      this.onDragEnter(event);
    });

    this.element.addEventListener('dragleave', (event: DragEvent) => {
      this.onDragLeave(event);
    });
  }

  // 만약 각 이벤트마다 처리해야할 동작을 작성했다면,
  //변경사항이 생길경우 각각 변경해주어야하기때문에 하나의 함수를 작성하여 공통으로 작성

  onDragStart(_: DragEvent): void {
    this.notifyDragObservers('start');
    this.element.classList.add('lifted');
  }

  onDragEnd(_: DragEvent): void {
    this.notifyDragObservers('stop');
    this.element.classList.remove('lifted');
  }

  onDragEnter(_: DragEvent): void {
    this.notifyDragObservers('enter');
    this.element.classList.add('drop-area');
  }

  onDragLeave(_: DragEvent): void {
    this.notifyDragObservers('leave');
    this.element.classList.remove('drop-area');
  }

  onDropped(): void {
    this.element.classList.remove('drop-area');
  }

  notifyDragObservers(state: DragState) {
    this.dragStateListener && this.dragStateListener(this, state);
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

  setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>) {
    this.dragStateListener = listener;
  }

  muteChildren(state: 'mute' | 'unmute') {
    if (state === 'mute') {
      this.element.classList.add('mute-children');
    } else {
      this.element.classList.remove('mute-children');
    }
  }

  getBoundingRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }
}
