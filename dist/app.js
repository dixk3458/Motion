import { ImageComponent } from './components/page/item/image.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';
import { VideoComponent } from './components/page/item/video.js';
import { PageCompoent, PageItemComponent, } from './components/page/page.js';
class App {
    constructor(appRoot) {
        this.page = new PageCompoent(PageItemComponent);
        this.page.attachTo(appRoot);
        const image = new ImageComponent('imageComponent', 'https://images.unsplash.com/photo-1700335739138-150bf313be41?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8');
        const note = new NoteComponent('Note Title', 'Note Body');
        const todo = new TodoComponent('Todo Title', '할것들');
        const video = new VideoComponent('에스파', 'https://www.youtube.com/embed/D8VEhcPeSlc');
        this.page.addChild(image);
        this.page.addChild(note);
        this.page.addChild(video);
        this.page.addChild(todo);
    }
}
new App(document.querySelector('.document'));
