import { InputDialog } from './components/dialog/dialog.js';
import { MediaSectionInput, } from './components/dialog/input/media-input.js';
import { TextSectionInput, } from './components/dialog/input/text-input.js';
import { ImageComponent } from './components/page/item/image.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';
import { VideoComponent } from './components/page/item/video.js';
import { PageComponent, PageItemComponent, } from './components/page/page.js';
class App {
    constructor(appRoot, documentRoot) {
        this.documentRoot = documentRoot;
        this.page = new PageComponent(PageItemComponent);
        this.page.attachTo(appRoot);
        this.page.addChild(new ImageComponent('이미지', 'https://plus.unsplash.com/premium_photo-1697898008701-e103bd39792d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8'));
        this.page.addChild(new VideoComponent('Video', 'https://youtu.be/SPNJgjqqUnI'));
        this.bindElementToDialog('#new-image', MediaSectionInput, (input) => new ImageComponent(input.title, input.url));
        this.bindElementToDialog('#new-video', MediaSectionInput, (input) => new VideoComponent(input.title, input.url));
        this.bindElementToDialog('#new-note', TextSectionInput, (input) => new NoteComponent(input.title, input.body));
        this.bindElementToDialog('#new-todo', TextSectionInput, (input) => new TodoComponent(input.title, input.body));
    }
    bindElementToDialog(selector, InputComponent, makeSection) {
        const element = document.querySelector(selector);
        element.addEventListener('click', () => {
            const dialog = new InputDialog();
            const input = new InputComponent();
            dialog.addChild(input);
            dialog.setCloseListener(() => {
                dialog.removeFrom(this.documentRoot);
            });
            dialog.setSubmitListener(() => {
                const itemComponent = makeSection(input);
                this.page.addChild(itemComponent);
                dialog.removeFrom(this.documentRoot);
            });
            dialog.attachTo(this.documentRoot);
        });
    }
}
new App(document.querySelector('.document'), document.body);
