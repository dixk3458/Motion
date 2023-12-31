# Motion

### 프로젝트 셋업 & 컴파일러 설정

---

프로젝트를 시작하기 전에 git을 초기화 하여 프로젝트의 버전을 관리할수있도록 하자. 그리고 TypeScript의 설정을 하기위해 tsconfig.json을 생성하자.

- `git init`
- `tsc --init`
- src, style, assets 디렉터리를 생성한다.
- index.html파일을 생성

tsconfig 파일에서 브라우저의 호환성에 맞게 설정을 해주어야한다.

- “target” : “es6” // 타입 스크립트 코드가 자바스크립트로 실제로 컴파일되는 버전
- “module”: “ES2015” // 자바스크립트로 컴파일된 코드가 사용할 모듈의 타입
- “outDir”: “./dist”
- “rootDir”:”./src” // root디렉터리를 명시한다.
- “removeComments” : true
- “noEmitOnError”: true // 컴파일 에러가 발생하면 더이상 컴파일 하지않도록 한다.
- “strict” : true
- “noUnusedLocals”:true,
- “noUnusedParameters”:true
- “noImplicitReturns”:true
- “noFallthroughtCasesInSwitch” : true
- “noUncheckedIndexedAccess” : true

### 프로젝트 구현 플랜

---

클래스를 이용해 개별적으로 연관된 데이터와, 메서드를 갖는 컴포넌트를 생성해서 조립하는형식으로 프로젝트를 진행한다.

- App
    - 애플리케이션에 전반적으로 필요한 데이터를 담당하고 또 다른 컴포넌트를 갖는다.
- PageComponent
    - 사용자가 동적으로 데이터를 추가해 또 다른 컨테이너 컴포넌트를만들고 추가하는 컴포넌트이다.
- Dilog
    - App의 버트는 클릭했을때 생기는 컴포넌트이다.
- Image, Note, Video, Todo Component
    - 입력받은 데이터를 기반으로 생겨난 컴포넌트이다.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d3cf9fec-22fc-4497-8749-8a20369906be/d24db9a0-d139-4e88-8e33-48bb474109d2/Untitled.png)

### 레이아웃 & PageComponent 생성

---

- index.html 파일의 header를 작성한다.
    - title
    - script
        - 프로젝트를 컴파일하면 생성되는 js파일을 연결해주자.
        - 다수의 js파일을 연결하기때문에 `type=”module”` 설정
        - defer라는 속성을 줘서 비동기적으로 다운로드 받아질수있도록하자.
    - link

- index.html 파일의 body 작성
    - 스타일링을 하기위해 애플리케이션을 한 단계 감싸는 div 생성
    - header 태그를 만들고 내부에 title과 control-panel을 생성하자.
    - main 태그를 만들고 나중에 동적으로 데이터를 추가할수있도록 하자.
    - footer 생성

- 스타일링
    
    ```
    :root {
      --bg-main-color: #00000080;
      --bg-accent-color: #2d2d2d;
      --accent-color: #f64435;
      --text-accent-color: #ffe498;
      --text-edit-bg-color: #575757;
      --border-color: #3f3f3f;
      --shadow-color: #202020;
      --document-bg-color: #68686850;
      --component-bg-gradient: radial-gradient(circle, #646464e6 0%, #363636e6 100%);
      --smokywhite: #dddbd8;
      --black: #000000;
      --translucent-black: #00000099;
    }
    
    li {
      list-style: none;
      padding-left: 0;
    }
    
    p {
      color: var(--smokywhite);
    }
    
    label {
      color: var(--text-accent-color);
    }
    
    * {
      outline: 0;
      box-sizing: border-box;
    }
    
    body {
      background: url('../assets/background.png') center/cover no-repeat;
      font-family: Roboto, Oxygen, sans-serif;
      display: flex;
      justify-content: center;
      height: 100vh;
      overflow: hidden;
      font-size: 1.25rem;
      margin: 0;
    }
    
    .app {
      width: 100%;
      max-width: 1000px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .banner {
      background: var(--bg-main-color);
      border-bottom: 1px solid var(--bg-accent-color);
      text-align: center;
    }
    
    .banner__title {
      margin: 20px;
      color: var(--accent-color);
    }
    
    .control-panel {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .create-button {
      margin: 0.1em 0.2em;
      text-align: center;
      user-select: none;
      padding: 1em 3em;
      text-transform: uppercase;
      font-weight: 600;
      font-size: 0.8rem;
      color: white;
      background-color: var(--accent-color);
      border-color: var(--accent-color);
      border-radius: 2px;
    }
    
    .document {
      height: 100%;
      overflow-y: auto;
      background-color: var(--document-bg-color);
      /* Firefox */
      scrollbar-width: 6px;
      scrollbar-color: var(--bg-accent-color);
      scrollbar-face-color: var(--accent-color);
    }
    
    .document::-webkit-scrollbar {
      /* Safari and Chrome */
      background-color: var(--bg-accent-color);
      width: 6px;
    }
    
    .document::-webkit-scrollbar-thumb {
      /* Safari and Chrome */
      background-color: var(--accent-color);
    }
    
    .footer {
      background: var(--bg-main-color);
      border-top: 1px solid var(--border-color);
      text-align: center;
    }
    ```
    

- AppComponent
    - 애플리케이션을 나타내는 컴포넌트이다.
    
    ```tsx
    import { PageCompoent } from './components/page.js';
    
    class App {
      private readonly page: PageCompoent;
      constructor(appRoot: HTMLElement) {
        this.page = new PageCompoent();
        this.page.attachTo(appRoot);
      }
    }
    
    new App(document.querySelector('.document')! as HTMLElement);
    ```
    

- PageComponent
    
    ```
    export class PageCompoent {
      private element: HTMLUListElement;
      constructor() {
        this.element = document.createElement('ul');
        this.element.setAttribute('class', 'page');
        this.element.textContent = 'This is PageComponent';
      }
    
      // page컴포넌트는 App 컴포넌트 등 다른 컴포넌트에 붙어야한다.
    
      attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
        parent.insertAdjacentElement(position, this.element);
      }
    }
    ```
    

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d3cf9fec-22fc-4497-8749-8a20369906be/abd690fe-eaf7-40cd-b1cc-456e877f0d04/Untitled.png)

### 이미지 컴포넌트 생성

---

내부적으로 Element를 생성하고 parent요소에 붙는 컴포넌트이다.
추가적으로 사용자로부터 title, url 데이터를 받아 동적으로 생성된다.

내부적으로 html 요소를 생성할때 template요소를 활용하면 더욱 효율적이다.

- 일일이 DOM 요소를 만들 필요가 없다.
- 한번에 text 형태로 작성하고 필요한 데이터만 추가해주면된다.
    - 사용자로부터 데이터를 입력할때는 주의!

- ImageComponent
    
    ```tsx
    export class ImageComponent {
      private element: HTMLElement;
      constructor(title: string, url: string) {
        const template = document.createElement('template');
        template.innerHTML = `<section class="image">
        <div class="image__holder">
          <img class="image__thumbnail" />
          <p class="image__title"></p>
        </div>
      </section>
      `;
        this.element = template.content.firstChild! as HTMLElement;
    
        const imageElement = this.element.querySelector(
          '.image__thumbnail'
        )! as HTMLImageElement;
    
        imageElement.src = url;
        imageElement.alt = title;
    
        const titleElement = this.element.querySelector(
          '.image__title'
        )! as HTMLParagraphElement;
        titleElement.textContent = title;
      }
    
      attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
        parent.insertAdjacentElement(position, this.element);
      }
    }
    ```
    

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d3cf9fec-22fc-4497-8749-8a20369906be/c9454ae1-353c-4c13-af3d-fb3dff565742/Untitled.png)

- ImageComponent와 PageComponent가 굉장히 비슷하다.
    - 중복을 어떻게 해결할까?
    

### 베이스 컴포넌트 생성

---

ImageComponent와 PageComponent의 중복된 코드를 줄이기위해 부모 클래스를 생성하자.

두 컴포넌트 모두 내부적으로 요소를 만들고 부모요소에 붙는 컴포넌트이다.

그리고 **attachTo라는 함수는 따로 Compnent라는 인터페이스로 정의해** 둠으로써, 추후에 BaseComponent가 아니라, 다른 FlexibleComponent나 SimpleComponent등 어딘가에 attachTo(자기 자신을 추가 할 수 있는) 함수를 구현하는 다른 종류의 클래스들도 만들어 볼 수 있다.

- 상속을 할때 다양한 Element를 사용자가 정할수있도록 제네릭을 이용하였다.
- 클래스끼리 상호작용을할때 지켜야하는 interface를 작성하여 더욱 재사용성을 높였다.

- AppComponent
    
    ```tsx
    import { ImageComponent } from './components/page/item/image.js';
    import { PageCompoent } from './components/page/page.js';
    
    class App {
      private readonly page: PageCompoent;
      constructor(appRoot: HTMLElement) {
        this.page = new PageCompoent();
        this.page.attachTo(appRoot);
    
        const image = new ImageComponent(
          'imageComponent',
          'https://images.unsplash.com/photo-1700335739138-150bf313be41?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8'
        );
    
        image.attachTo(appRoot, 'beforebegin');
      }
    }
    
    new App(document.querySelector('.document')! as HTMLElement);
    ```
    

- BaseComponent
    
    ```tsx
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
    ```
    

- PageComponent
    
    ```tsx
    import { BaseComponent } from '../component.js';
    
    export class PageCompoent extends BaseComponent<HTMLUListElement> {
      constructor() {
        super('<ul class="page">This is PageComponent</ul>');
      }
    }
    ```
    

- ImageComponent
    
    ```tsx
    import { ImageComponent } from './components/page/item/image.js';
    import { PageCompoent } from './components/page/page.js';
    
    class App {
      private readonly page: PageCompoent;
      constructor(appRoot: HTMLElement) {
        this.page = new PageCompoent();
        this.page.attachTo(appRoot);
    
        const image = new ImageComponent(
          'imageComponent',
          'https://images.unsplash.com/photo-1700335739138-150bf313be41?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8'
        );
    
        image.attachTo(appRoot, 'beforebegin');
      }
    }
    
    new App(document.querySelector('.document')! as HTMLElement);
    ```
    

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d3cf9fec-22fc-4497-8749-8a20369906be/d49aba47-3ec0-405d-b1a7-ff410e92f867/Untitled.png)

### Video Component 생성

---

VideoComponent는 사용자로부터 video url을 전달받아 해당 video를 만들어줘야한다.
video url은 다양한 형태로 올수있기때문에 다양한 문자열 url에서 video id를 추출해야한다.
즉 문자열 패턴에서 특정 문자열을 가져올수있는 정규 표현식을 이용해서 따로 메서드를 만들어주자.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d3cf9fec-22fc-4497-8749-8a20369906be/23316c7c-8256-4095-9634-cc38b74230bc/Untitled.png)

### PageItemComponent 생성

---

ItemComponent가 추가될 PageItemComponent 컨테이너를 만들어 주자.

각 아이템은 ul 태그 안에 li 형태로 추가되어야한다.

그렇게 하기위해 li 태그로 구성되어있어야한다. 그리고 close button 역시 공통으로 존재한다.

다른 컴포넌트와 동일하게 어딘가에 추가되어야하기때문에 Component를 상속해주자.

그리고 어떠한 데이터를 본인에 부착할 Composable을 구현해주면된다.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d3cf9fec-22fc-4497-8749-8a20369906be/f15fbf34-6471-44d1-a20e-628c82134b44/Untitled.png)

왜 PageItemComponent를 추가할까?

- close button을 재사용해서 사용할수없다.

interface를 정의하는 이유

- 클래스 관계가 복잡해질때 , 서로간의 자세한 사항을 클래스간에 서로의 이름을 알고 있는것은 커플링을 유발한다.
- 클래스들 간에 서로 지나치게 밀접하게 연관되어져 있으면(커플링이 심하게 되어 있으면) 유지 보수성, 확정성이 떨어진다.
- 따라서 클래스에서 주된 규격사항들을 인터페이스로 정의하고 클래스에서 그 인터페이스의 규격을 따라 가도록 구현해 놓고
사용하는 곳에서(다른 클래스 안에서 이 클래스를 사용하거나, 인자로 전달하거나 등등) 클래스 이름의 타입이 아니라
인터페이스 이름의 타입으로 지정해 두면, 다음에 다른 구현상항이 생기면 쉽게 다른 클래스로 변환이 가능하다.
- 인터페이스로 정의해서 클래스간에 인터페이스를 통해서 대화하는것이 좋다.

### 아이템 삭제 기능구현

---

- close button을 클릭하면 해당 아이템이 삭제된다.
- PageItemComponent의 close button을 클릭하면 자신의 element를 삭제해주자.
- PageitemComponent에 Click Event Listener를 외부로부터 받아오는 함수 setOnCloseListener()를 이용해 외부로부터 필요한 행동을 받아오자.

**생성자는 인스턴스를 만들기 위해서 정말 꼭! 필요한 요소들만 인자로 받아오는 것이 좋아요.**

### DI 디펜던시 인젝션 리팩터링

---

- 내부에서 타입을 결정해 해당 타입만 만들수있도록 하지말고 외부에서 원하는 타입을 전달해 내부에서는 그것을 만들기만하게 해주자.
- 확장성을 높일수있다.

- 외부에서 생성자를 전달해 내부에서는 만들기만 하면된다.

```jsx
import { BaseComponent, Component } from '../component.js';

export interface Composable {
  addChild(child: Component): void;
}

type OnCloseListener = () => void;

type SectionContainerConstructor = {
  new (): SectionContainer;
};

interface SectionContainer extends Component, Composable {
  setOnCloseListener(listener: OnCloseListener): void;
}
export class PageItemComponent
  extends BaseComponent<HTMLElement>
  implements SectionContainer
{
  private closeListener?: OnCloseListener;
  constructor() {
    super(`<li class="page-item">
            <section class="page-item__body"></section>
              <div class="page-item__controls">
                <button class="close">&times;</button>
              </div>
          </li>
  `);

    const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    };
  }

  addChild(child: Component) {
    const container = this.element.querySelector(
      '.page-item__body'
    )! as HTMLElement;
    child.attachTo(container);
  }

  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }
}
export class PageCompoent
  extends BaseComponent<HTMLUListElement>
  implements Composable
{
  constructor(
    private pageItemContainerConstructor: SectionContainerConstructor
  ) {
    super('<ul class="page"></ul>');
  }

  addChild(section: Component) {
    const item = new this.pageItemContainerConstructor();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend');
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
    });
  }
}
```

**문제는** PageComponent안에서 자체적으로 PageItemComponent를 만들고 있었어요. DI도 없었고 또 클래스들간의 커플링이 심하게 되어 있었다.

**문제를 해결하기 위해서** PageItemComponent를 대표할 수 있는, 그 규격사항을 정의 할 수 있는 **SectionContainer** 라는 인터페이스를 만들어서

PageComponent안에서 **PageItemComponent**를 바로 쓰는것이 아니라,

**SectionContainer** 라는 인터페이스 타입으로 썼어요 :)

**ageComponent**는 **SectionContainer**라는 인터페이스의 규격을 따라가는 그 어떤 클래스라도! :)

추가할 수 있는 짱 유연한 클래스가 되었다.

**클래스들 간에 서로 지나치게 밀접하게 연관되어져 있으면 (커플링이 심하게 되어 있으면) 유지보수성, 확정성이 떨어진다.**

**인터페이스로 정의해서 클래스간에 인터페이스를 통해서 대화하는것이 좋아요 ✨**

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d3cf9fec-22fc-4497-8749-8a20369906be/e04fdf8e-705b-4aa3-be14-c626fba5f00e/Untitled.png)

### Diaglog 생성

---

InputDiglog 역시 동적으로 HTMl 요소를 만들기때문에 BaseComponent를 상속하고 그 요소안에 특정 요소를 추가해야하기에 Composable을 구현했다.

그리고 Diglog 자체적으로 결정하지 않고 무엇을 보여줄지, 클릭이벤트는 무엇인지는 외부에서 사용자가 결정하도록하여 재사용성을 높였다.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d3cf9fec-22fc-4497-8749-8a20369906be/efd9437c-5961-4acd-8d68-c5fe04fbc097/Untitled.png)

### Dialog 리팩터링 (중복제거)

---

Dialog를 생성하는 각 버튼마다 유사한 코드가 작성되어있다. 즉 코드 중복이 발생했다.

이것을 처리해보자.

코드중복을 해결하는 TIP

- 함수를 만들어 코드 중복을 처리하자.
    - 변화가 필요한 부분은 함수의 인자로 받아 처리하자.
- 내부에서 특정 타입을 결정하지 말고 외부에서 생성자를 전달해 재사용성을 높이자.
- 제네릭 타입을 결정할때 클래스 자체를 이용하지말고 클래스가 구현하는 interface를 이용하면 한층더 재사용성을 높일수있다.

```tsx
private bindElementToDialog<T extends (MediaData | TextData) & Component>(
    selector: string,
    InputComponent: InputComponentConstructor<T>,
    makeSection: (input: T) => Component
  ) {
    const element = document.querySelector(selector)! as HTMLButtonElement;
    element.addEventListener('click', () => {
      const dialog = new InputDialog();
      const input = new InputComponent();

      dialog.addChild(input);
      dialog.attachTo(this.dialogRoot);

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(this.dialogRoot);
      });

      dialog.setOnSubmitListener(() => {
        // 아이템을 만들어 추가
        const image = makeSection(input);
        this.page.addChild(image);
        dialog.removeFrom(document.body);
      });

      dialog.attachTo(document.body);
    });
  }
```

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d3cf9fec-22fc-4497-8749-8a20369906be/3a704e57-400a-497c-af13-3d9fa8d5f9ae/Untitled.png)

### Motion Drag & Drop event

---

```tsx
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
}ㅁ
```