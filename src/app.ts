import { Component } from './components/component.js';
import { InputDialog } from './components/dialog/dialog.js';
import { MediaSectionInput } from './components/dialog/input/media-input.js';
import { TextSectionInput } from './components/dialog/input/text-input.js';
import { ImageComponent } from './components/page/item/image.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';
import { VideoComponent } from './components/page/item/video.js';
import {
  Composable,
  PageCompoent,
  PageItemComponent,
} from './components/page/page.js';

class App {
  private readonly page: Component & Composable;
  constructor(appRoot: HTMLElement, dialogRoot: HTMLElement) {
    this.page = new PageCompoent(PageItemComponent);
    this.page.attachTo(appRoot);

    const imageBtn = document.querySelector('#new-image')! as HTMLButtonElement;
    imageBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const inputSection = new MediaSectionInput();

      dialog.addChild(inputSection);
      dialog.attachTo(dialogRoot);

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(dialogRoot);
      });

      dialog.setOnSubmitListener(() => {
        // 아이템을 만들어 추가
        const image = new ImageComponent(inputSection.title, inputSection.url);
        this.page.addChild(image);
        dialog.removeFrom(document.body);
      });

      dialog.attachTo(document.body);
    });

    const videoBtn = document.querySelector('#new-video')! as HTMLButtonElement;
    videoBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const inputSection = new MediaSectionInput();

      dialog.addChild(inputSection);
      dialog.attachTo(dialogRoot);

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(dialogRoot);
      });

      dialog.setOnSubmitListener(() => {
        // 아이템을 만들어 추가
        const video = new VideoComponent(inputSection.title, inputSection.url);
        this.page.addChild(video);
        dialog.removeFrom(dialogRoot);
      });

      dialog.attachTo(dialogRoot);
    });

    const noteBtn = document.querySelector('#new-note')! as HTMLButtonElement;
    noteBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const inputSection = new TextSectionInput();

      dialog.addChild(inputSection);
      dialog.attachTo(dialogRoot);

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(dialogRoot);
      });

      dialog.setOnSubmitListener(() => {
        // 아이템을 만들어 추가
        const note = new NoteComponent(inputSection.title, inputSection.body);
        this.page.addChild(note);
        dialog.removeFrom(dialogRoot);
      });

      dialog.attachTo(dialogRoot);
    });

    const todoBtn = document.querySelector('#new-todo')! as HTMLButtonElement;
    todoBtn.addEventListener('click', () => {
      const dialog = new InputDialog();
      const inputSection = new TextSectionInput();

      dialog.addChild(inputSection);
      dialog.attachTo(dialogRoot);

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(dialogRoot);
      });

      dialog.setOnSubmitListener(() => {
        // 아이템을 만들어 추가
        const todo = new TodoComponent(inputSection.title, inputSection.body);
        this.page.addChild(todo);
        dialog.removeFrom(dialogRoot);
      });

      dialog.attachTo(dialogRoot);
    });
  }
}

new App(document.querySelector('.document')! as HTMLElement, document.body);
