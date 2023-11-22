interface Component {
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
}

// 중복된 코드를 제거
// 컴포넌트를 내부적으로 생성하는것을 캡슐화해줬다.

export class BaseComponent<T extends HTMLElement> implements Component{
  protected readonly element: T;
  constructor(htmlString: string) {
    const template = document.createElement('template');
    template.innerHTML = htmlString;
    this.element = template.content.firstChild as T;
  }

  attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
    parent.insertAdjacentElement(position, this.element);
  }
}
