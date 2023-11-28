import { InputDialog } from './components/dialog/dialog.js';
import { MediaSectionInput } from './components/dialog/input/media-input.js';
import { TextSectionInput } from './components/dialog/input/text-input.js';
import { ImageComponent } from './components/page/item/image.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';
import { VideoComponent } from './components/page/item/video.js';
import { PageCompoent, PageItemComponent, } from './components/page/page.js';
class App {
    constructor(appRoot, dialogRoot) {
        this.page = new PageCompoent(PageItemComponent);
        this.page.attachTo(appRoot);
        const imageBtn = document.querySelector('#new-image');
        imageBtn.addEventListener('click', () => {
            const dialog = new InputDialog();
            const inputSection = new MediaSectionInput();
            dialog.addChild(inputSection);
            dialog.attachTo(dialogRoot);
            dialog.setOnCloseListener(() => {
                dialog.removeFrom(dialogRoot);
            });
            dialog.setOnSubmitListener(() => {
                const image = new ImageComponent(inputSection.title, inputSection.url);
                this.page.addChild(image);
                dialog.removeFrom(document.body);
            });
            dialog.attachTo(document.body);
        });
        const videoBtn = document.querySelector('#new-video');
        videoBtn.addEventListener('click', () => {
            const dialog = new InputDialog();
            const inputSection = new MediaSectionInput();
            dialog.addChild(inputSection);
            dialog.attachTo(dialogRoot);
            dialog.setOnCloseListener(() => {
                dialog.removeFrom(dialogRoot);
            });
            dialog.setOnSubmitListener(() => {
                const video = new VideoComponent(inputSection.title, inputSection.url);
                this.page.addChild(video);
                dialog.removeFrom(dialogRoot);
            });
            dialog.attachTo(dialogRoot);
        });
        const noteBtn = document.querySelector('#new-note');
        noteBtn.addEventListener('click', () => {
            const dialog = new InputDialog();
            const inputSection = new TextSectionInput();
            dialog.addChild(inputSection);
            dialog.attachTo(dialogRoot);
            dialog.setOnCloseListener(() => {
                dialog.removeFrom(dialogRoot);
            });
            dialog.setOnSubmitListener(() => {
                const note = new NoteComponent(inputSection.title, inputSection.body);
                this.page.addChild(note);
                dialog.removeFrom(dialogRoot);
            });
            dialog.attachTo(dialogRoot);
        });
        const todoBtn = document.querySelector('#new-todo');
        todoBtn.addEventListener('click', () => {
            const dialog = new InputDialog();
            const inputSection = new TextSectionInput();
            dialog.addChild(inputSection);
            dialog.attachTo(dialogRoot);
            dialog.setOnCloseListener(() => {
                dialog.removeFrom(dialogRoot);
            });
            dialog.setOnSubmitListener(() => {
                const todo = new TodoComponent(inputSection.title, inputSection.body);
                this.page.addChild(todo);
                dialog.removeFrom(dialogRoot);
            });
            dialog.attachTo(dialogRoot);
        });
    }
}
new App(document.querySelector('.document'), document.body);
