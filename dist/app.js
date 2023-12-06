import { Dialog } from './Dialog/dialog.js';
import { MediaSectionInput } from './Dialog/input/media-input.js';
import { TextSectionInput } from './Dialog/input/text-input.js';
import { ImageComponent } from './Main/item/image.js';
import { NoteComponent } from './Main/item/note.js';
import { TodoComponent } from './Main/item/todo.js';
import { VideoComponent } from './Main/item/video.js';
import { MainContainer, MainItem } from './Main/main.js';
class App {
    constructor(main) {
        this.mainContainer = new MainContainer(MainItem);
        this.mainContainer.attachTo(main, 'afterbegin');
        this.createDialog('#new-image', MediaSectionInput, (dialogInput) => new ImageComponent(dialogInput.title, dialogInput.url));
        this.createDialog('#new-video', MediaSectionInput, (dialogInput) => new VideoComponent(dialogInput.title, dialogInput.url));
        this.createDialog('#new-note', TextSectionInput, (dialogInput) => new NoteComponent(dialogInput.title, dialogInput.body));
        this.createDialog('#new-todo', TextSectionInput, (dialogInput) => new TodoComponent(dialogInput.title, dialogInput.body));
    }
    createDialog(selectedBtn, dialogInputConstructor, makeItem) {
        const dialogBtn = document.querySelector(selectedBtn);
        dialogBtn.addEventListener('click', () => {
            const dialog = new Dialog();
            const dialogInput = new dialogInputConstructor();
            dialog.addChild(dialogInput);
            dialog.setOnCloseListener(() => {
                dialog.removeFrom(document.body);
            });
            dialog.setOnSubmitListener(() => {
                const item = makeItem(dialogInput);
                this.mainContainer.addChild(item);
                dialog.removeFrom(document.body);
            });
            dialog.attachTo(document.body);
        });
    }
}
new App(document.querySelector('.main'));
