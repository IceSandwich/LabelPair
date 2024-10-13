class ImageInstance {
    imageNode: HTMLElement | null = null;

    private static newCardImage() {
        const templateCardImg = document.getElementById("Template-CardImage")!;
        let ret = templateCardImg.cloneNode(true) as HTMLElement;

        ret.classList.remove("template");
        ret.removeAttribute("id");
        return ret;
    }

    CreateImageNode(indexOfStorage: number) {
        this.imageNode = ImageInstance.newCardImage();
        this.imageNode.setAttribute("data-id", String(indexOfStorage))

        let imageInstance = GlobalImageStorage[indexOfStorage];
        let imgNode = this.imageNode.children[0] as HTMLImageElement;
        imgNode.src = imageInstance.ImgDataURL;
        imgNode.setAttribute("title", imageInstance.ImgFilename);
    }

    static InitFromExistedImageNode(existed: HTMLElement) {
        let ret = new ImageInstance;
        ret.imageNode = existed;
        return ret;
    }

    GetIndexOfStorage() {
        return parseInt(this.imageNode!.getAttribute("data-id")!);
    }

    GetCardNode() {
        return this.imageNode!.parentNode!.parentNode!.parentNode!.parentNode! as HTMLElement;
    }

    GetImageHTMLNode() {
        return this.imageNode!;
    }

    IsOnSelect() {
        return this.imageNode!.classList.contains("on-select");
    }

    ToggleOnSelect() {
        this.imageNode!.classList.toggle("on-select");
    }
}