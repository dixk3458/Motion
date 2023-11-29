import { InputDialog, } from './components/dialog/dialog.js';
import { MediaSectionInput } from './components/dialog/input/media-input.js';
import { TextSectionInput } from './components/dialog/input/text-input.js';
import { ImageComponent } from './components/page/item/image.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';
import { VideoComponent } from './components/page/item/video.js';
import { PageCompoent, PageItemComponent, } from './components/page/page.js';
class App {
    constructor(appRoot, dialogRoot) {
        this.dialogRoot = dialogRoot;
        this.page = new PageCompoent(PageItemComponent);
        this.page.attachTo(appRoot);
        this.bindElementToDialog('#new-image', MediaSectionInput, (input) => new ImageComponent(input.title, input.url));
        this.bindElementToDialog('#new-video', MediaSectionInput, (input) => new VideoComponent(input.title, input.url));
        this.bindElementToDialog('#new-note', TextSectionInput, (input) => new NoteComponent(input.title, input.body));
        this.bindElementToDialog('#new-note', TextSectionInput, (input) => new TodoComponent(input.title, input.body));
    }
    bindElementToDialog(selector, InputComponent, makeSection) {
        const element = document.querySelector(selector);
        element.addEventListener('click', () => {
            const dialog = new InputDialog();
            const input = new InputComponent();
            dialog.addChild(input);
            dialog.attachTo(this.dialogRoot);
            dialog.setOnCloseListener(() => {
                dialog.removeFrom(this.dialogRoot);
            });
            dialog.setOnSubmitListener(() => {
                const section = makeSection(input);
                this.page.addChild(section);
                dialog.removeFrom(document.body);
            });
            dialog.attachTo(document.body);
        });
    }
}
new App(document.querySelector('.document'), document.body);
