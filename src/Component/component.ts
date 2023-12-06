// 다양한 곳에서 attachTo를 사용하기위해 interface를 규약해자.
// Component를 구현한 모든것은 attachTo를 사용가능하다.
export interface Component {
  attachTo(parent: HTMLElement, position: InsertPosition): void;

  removeFrom(parent: HTMLElement): void;

  attach(component: Component, position?: InsertPosition): void;
}

export class BaseComponent<T extends HTMLElement> implements Component {
  protected readonly element: T;
  constructor(htmlString: string) {
    const template = document.createElement('template');
    template.innerHTML = htmlString;
    this.element = template.content.firstChild! as T;
  }
  // 상위 요소에 붙을수있는 attachTo()
  // 기본값 지정
  attachTo(parent: HTMLElement, position: InsertPosition = 'beforeend') {
    //  요소의 어느곳에 붙을지 결정
    parent.insertAdjacentElement(position, this.element);
  }

  removeFrom(parent: HTMLElement): void {
    // 유효성 검사
    if (parent !== this.element.parentElement) {
      throw new Error('Parent Mismatch!');
    }
    // MainItem li가 호출을 하기때문에 parent는 ul이 되고 this.element는 li이다.
    parent.removeChild(this.element);
  }

  attach(component: Component, position: InsertPosition): void {
    component.attachTo(this.element, position);
  }
}
