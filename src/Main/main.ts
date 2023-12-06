import { BaseComponent, Component } from '../Component/component.js';

type DragState = 'start' | 'end' | 'enter' | 'leave';

// 아무런 인자도 전달안받고 아무것도 반환하지 않는 함수이다.
type OnCloseListener = () => void;

// 제네릭을 사용하는 이유는 타입을 보장하면서 재사용성을 높이기위해
type OnDragStateListener<T extends Component> = (
  draggedTarget: T,
  state: DragState
) => void;

type ItemConstructor = {
  new (): Item;
};

interface Item extends Component, Composable {
  setOnCloseListener(listener: OnCloseListener): void;
  setOnDragStateListener(listener: OnDragStateListener<MainItem>): void;
  muteChildren(state: 'mute' | 'unmute'): void;
  getBoundingRect(): DOMRect;
}

// 공통된 메서드를 하나의 interface로 관리해 Composable만 구현하면
// addChild()를 사용할수있도록하자.
export interface Composable {
  addChild(Child: Component): void;
}
export class MainContainer
  extends BaseComponent<HTMLUListElement>
  implements Composable
{
  // 자식들의 포인터 이벤트를 처리하기위해
  private children = new Set<Item>();

  private draggedTarget?: Item;
  private droppedTarget?: Item;

  constructor(private itemConstructor: ItemConstructor) {
    super(`<ul class="mainContainer"></ul>`);

    // Dropzone으로 활용될 MainContainer에 dragover와 drop이벤트를 등록하자.
    // dragover와 drop을 이용할때는 event.preventDefault()가 필수이다.
    this.element.addEventListener('dragover', (event: DragEvent) => {
      event.preventDefault();
      this.onDragOver(event);
    });

    this.element.addEventListener('drop', (event: DragEvent) => {
      event.preventDefault();
      this.onDrop(event);
    });
  }

  onDragOver(_: DragEvent) {}

  onDrop(event: DragEvent) {
    // 드롭이벤트 발생
    // 유효성 검사
    // 드롭 타겟이 없으면 X
    if (!this.droppedTarget) {
      return;
    }

    // 드롭타겟과 드래그 타겟이 동일하다면 안된다.
    if (this.draggedTarget && this.draggedTarget !== this.droppedTarget) {
      // 추가될 위치 (drop될때 y위치)
      const prevY = this.draggedTarget.getBoundingRect().y;
      const dropY = event.clientY;
      // ul로부터 삭제
      this.draggedTarget.removeFrom(this.element);

      // 새로운 메서드를 만들자
      // 전달한 target을 droppedTarget 뒤에 추가
      // Item에 attach가 없으니 구현하자.
      // 이전 위치가 추가될 위치보다 위에 있었다면(작다면) afterend를 해서 아래로
      // 아래에 있었다면 beforebegin을 해서 요소 위로 이동
      this.droppedTarget.attach(
        this.draggedTarget,
        prevY < dropY ? 'afterend' : 'beforebegin'
      );
    }
  }

  //   mainContainer는 MainItem을 생성해야한다.
  // 인자로 MainItem의 body에 들어갈 내용을 작성하자.
  addChild(item: Component) {
    // element는 ul을 가리킨다.

    //  MainContainer가 생성될때 클래스 내부에서 MainItem 요소만 만들수있도록
    // 고정되어있다.
    // 이것을 클래스 밖에서 정해줄수있도록하자
    // 그렇게 하여 재사용성을 높이자.
    // 다양한 Item을 담는 li를 만들수있다.

    // 외부에서 생성자를 받아와 이곳에서 인스턴스화를 해주자.
    // 즉 클래스 내부에 mainItemConstructor라는 프로퍼티에 생성자가 담겨있다.
    const mainItem = new this.itemConstructor();
    mainItem.addChild(item);
    this.children.add(mainItem);
    // setOnCloseListener()는 인자로 OnCloseListener 타입의 콜백함수를 전달받아
    // MainItem의 closeListener에 등록하는것이다.
    // 즉 클릭이 발생하면 아래의 콜백이 발생
    mainItem.setOnCloseListener(() => {
      this.children.delete(mainItem);
      mainItem.removeFrom(this.element);
    });

    // mainItem을 만들때 드래그 이벤트 등록
    // mainItem을 생성할때 외부에서 전달받는 제네릭 생성자를 이용하기때문에 수정
    // mainItem이 드래그 될때 발생할 이벤트를 등록
    // 어떤 이벤트냐면, draggTarget과 state를 인자로해서 무언가를 하는 이벤트
    // mainItem내부적으로는 this와 state를 인자로 해서 함수 dragStateLister 호출
    // 즉 바로 아래 함수 호출
    mainItem.setOnDragStateListener(
      (draggedTarget: MainItem, state: DragState) => {
        // 자식으로 부터 발생한 state에 따라서 다른 행동을 수행하자.

        switch (state) {
          case 'start':
            // start 및 다른 상태일때 드래그 및 드롭 요소를 기억하고있어야한다.
            this.draggedTarget = draggedTarget;
            this.updatePointerEvent('mute');
            break;
          case 'end':
            this.draggedTarget = undefined;
            this.updatePointerEvent('unmute');
            break;
          case 'enter':
            this.droppedTarget = draggedTarget;
            break;
          case 'leave':
            this.droppedTarget = undefined;
            break;
          default:
            throw new Error(`not supported state : ${state}`);
        }
      }
    );

    mainItem.attachTo(this.element, 'beforeend');
  }

  private updatePointerEvent(state: 'mute' | 'unmute'): void {
    this.children.forEach((item: Item) => {
      item.muteChildren(state);
    });
  }
}

// MainContainer 안에 들어갈 각 li를 담을 MainItem 컴포넌트

export class MainItem
  extends BaseComponent<HTMLLIElement>
  implements Composable
{
  private closeListener?: OnCloseListener;
  private dragStateListener?: OnDragStateListener<MainItem>;
  // 마찬가지로 MainItem은 자기 element를 생성하고 MainContainer에 붙어야한다.
  constructor() {
    // 드래그 될수있다는 것을 명시해야한다.
    super(`<li class="main-item" draggable="true">
            <button class="main-item__closeBtn">&times;</button>
            <section class="main-item__body"></section>
          </li>`);

    const closeBtn = this.element.querySelector(
      '.main-item__closeBtn'
    )! as HTMLButtonElement;

    closeBtn.addEventListener('click', () => {
      // 클래스 내부에서 이벤트를 결정하지말고
      // 외부에서 사용자가 이벤트를 결정할수있게해주자.
      // 그렇게 하면  다른 행동을 수행하는 MainItem을 구현할수있다.
      this.closeListener && this.closeListener();
    });

    // li가 생성될때 이벤트를 등록해야한다.
    // 하지만 생성자에서 많은 일을 하는것은 좋지 않다.
    // 단순히 무언가를 하라고 호출만해주자.
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

  //   main-item__body에 붙어야하기때문에 Component 타입을 이용
  addChild(item: Component) {
    const mainItemBody = this.element.querySelector(
      '.main-item__body'
    )! as HTMLElement;
    item.attachTo(mainItemBody, 'beforeend');
  }

  // 드래그가 발생하면 외부에서 등록한 dragStateListener를 호출해주자.
  onDragStart(_: DragEvent) {
    this.notifyDragState('start');
  }
  onDragEnd(_: DragEvent) {
    this.notifyDragState('end');
  }
  onDragEnter(_: DragEvent) {
    this.notifyDragState('enter');
  }
  onDragLeave(_: DragEvent) {
    this.notifyDragState('leave');
  }

  // 각 drag이벤트마다 바로 행동을 작성해도되지만, 변경사항이있다면 한곳에서 수정할수있게 함수 작성
  notifyDragState(state: DragState): void {
    // 나와 상태를 알려준다.
    // 외부에서 등록한 콜백함수의 인자로 this,와 state를 사용
    this.dragStateListener && this.dragStateListener(this, state);
  }

  muteChildren(state: 'mute' | 'unmute'): void {
    if (state === 'mute') {
      this.element.classList.add('mute-children');
    } else {
      this.element.classList.remove('mute-children');
    }
  }

  getBoundingRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }

  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }

  // 외부에서 나를 구현하고 내가 drag가 될때 내가 누구고 어떤 상태인지를 알려주기 위해
  // 이벤트를 등록할수있는 메서드를 만들자

  setOnDragStateListener(listener: OnDragStateListener<MainItem>) {
    // 외부에서 콜백함수를 전달하면 내가 가지고있다가 특정 일(드래그)를 할때 호출할께
    this.dragStateListener = listener;
  }
}
