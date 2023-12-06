import { BaseComponent } from '../../Component/component.js';
export class VideoComponent extends BaseComponent<HTMLElement> {
  constructor(title: string, url: string) {
    super(`<section class="item-video">
          <h3 class="video__title"></h3>
          <iframe
            class="video__player"
            width="683"
            height="384"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </section>
        `);

    const titleElement = this.element.querySelector(
      '.video__title'
    )! as HTMLHeadingElement;
    titleElement.textContent = title;

    const videoPlayerElement = this.element.querySelector(
      '.video__player'
    )! as HTMLIFrameElement;
    videoPlayerElement.src = this.convertToEmbededURL(url);
    videoPlayerElement.title = title;
  }

  private convertToEmbededURL(url: string): string {
    const regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:(?:youtube.com\/(?:(?:watch\?v=)|(?:embed\/))([a-zA-Z0-9-]{11}))|(?:youtu.be\/([a-zA-Z0-9-]{11})))/;
    const match = url.match(regExp);
    const videoId = match ? match[1] || match[2] : undefined;
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  }
}
