import { BaseComponent } from '../../Component/component.js';

export class ImageComponent extends BaseComponent<HTMLElement> {
  // 외부에서 title과 url을 전달받아 li에 들어갈 내용을 생성
  // 역시 자기자신의 내용을 가지고 부모인 li에 붙어야하기때문에
  // BaseComponent를 상속
  constructor(title: string, url: string) {
    // 생성자에서 바로 전달해도 되지만, 사용자로부터 입력을 받아 DOM요소
    // 자체에 접근하는것은 좋지못하다.
    super(`<section class="item-image">
                <div class="image__holder">
                    <img class="image__thumbnail" />
                    <h3 class="image__title"></h3>
                </div>
            </section>
  `);
    const imageElement = this.element.querySelector(
      '.image__thumbnail'
    )! as HTMLImageElement;
    imageElement.src = url;
    imageElement.alt = title;

    const titleElement = this.element.querySelector(
      '.image__title'
    )! as HTMLHeadingElement;
    titleElement.textContent = title;
  }
}
