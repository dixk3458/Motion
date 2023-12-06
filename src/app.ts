// 애플리케이션을 실행하면 가장 먼저 실행되는 ts 파일
// 즉 애플리케이션의 시작점이다.

import { Component } from './Component/component.js';
import { Dialog } from './Dialog/dialog.js';
import { MediaSectionInput } from './Dialog/input/media-input.js';
import { TextSectionInput } from './Dialog/input/text-input.js';
import { ImageComponent } from './Main/item/image.js';
import { NoteComponent } from './Main/item/note.js';
import { TodoComponent } from './Main/item/todo.js';
import { VideoComponent } from './Main/item/video.js';

import { Composable, MainContainer, MainItem } from './Main/main.js';

// InputConstructor 타입은 Media,Text를 한정해서 만들수있는 생성자다.
type InputConstructor<T extends MediaSectionInput | TextSectionInput> = {
  new (): T;
};

// App 인스턴스 생성

class App {
  private readonly mainContainer: Component & Composable;
  constructor(main: HTMLElement) {
    this.mainContainer = new MainContainer(MainItem);
    this.mainContainer.attachTo(main, 'afterbegin');

    // App 인스턴스가 만들어질때
    // 각 Dialog에 이벤트가 등록된다.
    // closeBtn과 마찬가지로 이벤트를 외부에서 등록할수있도록해주자.

    // 중복된 코드가 너무 많다.
    // 각 dialogBtn마다 비슷한 역할을 하는데 , 재사용을 안하고있다.
    // 그리고 클래스 내부에서 Media,Text input을 고정해서 만들수있게 하지말고
    // 어떤 SectionInput을 만들지 생성자를 외부에서 전달해 만들수있도록하자.

    // 중복을 제거하기위해 함수를 이용할수있다.

    this.createDialog(
      '#new-image',
      MediaSectionInput,
      (dialogInput: MediaSectionInput) =>
        new ImageComponent(dialogInput.title, dialogInput.url)
    );

    this.createDialog(
      '#new-video',
      MediaSectionInput,
      (dialogInput: MediaSectionInput) =>
        new VideoComponent(dialogInput.title, dialogInput.url)
    );

    this.createDialog(
      '#new-note',
      TextSectionInput,
      (dialogInput: TextSectionInput) =>
        new NoteComponent(dialogInput.title, dialogInput.body)
    );

    this.createDialog(
      '#new-todo',
      TextSectionInput,
      (dialogInput: TextSectionInput) =>
        new TodoComponent(dialogInput.title, dialogInput.body)
    );
  }

  // 중복된 코드를 함수로 처리하자
  // 버튼이 클릭되면 해당하는 Dialog를 생성하는 동작이다.
  // 서로 다른 동작을 하는 부분을 인자로 받아오자.
  // 1. 어떤 버튼이 클릭되었는지.
  // 2. 어떤 input을 생성할지 생성자를 전달해주자.
  // 3. 어떤 아이템 컴포넌트를 만들지

  // 제네릭을 이용해 사용할때 그 타입을 이용하자.
  private createDialog<T extends MediaSectionInput | TextSectionInput>(
    selectedBtn: string,
    dialogInputConstructor: InputConstructor<T>,
    makeItem: (dialogInput: T) => Component
  ): void {
    const dialogBtn = document.querySelector(selectedBtn)! as HTMLButtonElement;

    dialogBtn.addEventListener('click', () => {
      const dialog = new Dialog();
      const dialogInput = new dialogInputConstructor();

      dialog.addChild(dialogInput);

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(document.body);
      });

      // submit 이 클릭되면 dialogInput의 getter를 이용해
      // item을 만들고 mainContainer 에 추가한다.
      dialog.setOnSubmitListener(() => {
        const item = makeItem(dialogInput);
        this.mainContainer.addChild(item);

        dialog.removeFrom(document.body);
      });
      dialog.attachTo(document.body);
    });
  }
}

// 애플리케이션 시작
// 생성자로 main 컨테이너 DOM을 받고
// 그곳에 작업을 해주자.
// 우리가 HTMl을 작성할때 미리 생성한 요소 main이기에 타입 assertion을 하자
new App(document.querySelector('.main')! as HTMLElement);

// const imageDialogBtn = document.querySelector(
//   '#new-image'
// )! as HTMLButtonElement;
// imageDialogBtn.addEventListener('click', () => {
//   // 클릭이 발생하면 Dialog를 생성하자.
//   // Dialog 역시 두 종류가 있기에 적절한 기준으로 나누자.

//   const dialog = new Dialog();
//   const dialogInput = new MediaSectionInput();

//   dialog.addChild(dialogInput);

//   dialog.setOnCloseListener(() => {
//     dialog.removeFrom(document.body);
//   });

//   // submit 이 클릭되면 dialogInput의 getter를 이용해
//   // item을 만들고 mainContainer 에 추가한다.
//   dialog.setOnSubmitListener(() => {
//     const item = new ImageComponent(dialogInput.title, dialogInput.url);
//     this.mainContainer.addChild(item);

//     dialog.removeFrom(document.body);
//   });
//   dialog.attachTo(document.body);
// });
