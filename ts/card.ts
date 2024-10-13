enum OperatorButton {
    MultiSelectTools = 1,
    Retrieve = 2
}

/**
 * 
 * @param container 
 * @param autoAll if no images selected, use all images instead.
 * @returns 
 */
function GetSelectedImages(container: HTMLElement, autoAll: boolean) {

}

class CardInstance {
    cardNode: HTMLElement | null = null;
    instancePointers: number[] = [];
    private tagName: string = ""

    private static getCardNameHTMLElement(cardNode: HTMLElement) {
        return cardNode.children[0].children[0]! as HTMLElement;
    }
    private static getCardContainer(cardNode: HTMLElement) {
        return cardNode.children[1].children[0]! as HTMLElement;
    }
    private getCardNameHTMLElement() {
        return CardInstance.getCardNameHTMLElement(this.cardNode!);
    }
    GetCardContainer() {
        return CardInstance.getCardContainer(this.cardNode!);
    }
    static GetCardName(cardNode: HTMLElement) {
        return CardInstance.getCardNameHTMLElement(cardNode).textContent!;
    }
    static GetCardNameFromOperatorButton(operationButton: HTMLElement) {
        if (operationButton.nodeName == "I") { // click on icon instead the lable of button
            operationButton = operationButton.parentNode! as HTMLElement; // now node point to the button
        }
    
        let cardNode = operationButton.parentNode!.parentNode!.parentNode! as HTMLElement;
        return CardInstance.getCardNameHTMLElement(cardNode).textContent!;
    }
    private static getCardBoxes() {
        return document.getElementById("CardBoxes")!;
    }

    private static newCardBox() {
        const templateCardBox = document.getElementById("Template-CardBox")!;
        let ret = templateCardBox.cloneNode(true) as HTMLElement;

        // clear children
        let container = ret.children[1].children[0];
        Array.from(container.children).forEach((rowItem) => {
            container.removeChild(rowItem);
        });

        ret.classList.remove("template");
        ret.removeAttribute("id");
        return ret;
    }
    private static newCardRow() {
        const templateCardRow = document.getElementById("Template-CardRow")!;
        let ret = templateCardRow.cloneNode(true) as HTMLElement;

        // clear children
        Array.from(ret.children).forEach((item) => {
            ret!.removeChild(item);
        });

        ret.classList.remove("template");
        ret.removeAttribute("id");
        return ret;
    }

    CreateCard(tagName: string, insertAfter: CardInstance | null = null) {
        if (this.cardNode != null) {
            throw Error("CardContainer existed.")
        }

        this.cardNode = CardInstance.newCardBox();
        this.SetCardName(tagName);

        let cardBoxes = CardInstance.getCardBoxes();
        if (insertAfter == null || insertAfter.cardNode == null || cardBoxes.lastChild == insertAfter.cardNode) {
            cardBoxes.append(this.cardNode);
        } else {
            cardBoxes.insertBefore(this.cardNode, insertAfter.cardNode.nextSibling);
        }
    }
    static InitFromExistedCard(existed: HTMLElement, useGlobalInstance = false) {
        let ret = new CardInstance;
        ret.cardNode = existed;
        ret.tagName = ret.getCardNameHTMLElement().textContent!;
        if (useGlobalInstance) {
            return GlobalCards.get(ret.tagName)!;
        }

        Array.from(ret.GetCardContainer().children).forEach(row => {
            Array.from(row.children).forEach(item => {
                var ii = ImageInstance.InitFromExistedImageNode(item as HTMLElement);
                ret.instancePointers.push(ii.GetIndexOfStorage());
            })
        })
        return ret;
    }

    DestroyCard() {
        CardInstance.getCardBoxes().removeChild(this.cardNode!);
        this.cardNode = null;
        this.instancePointers = [];
    }

    RemoveImages(indicesOfStorage: number[]) {
        let newInstancePointers = this.instancePointers.filter((index) => {
            return !indicesOfStorage.includes(index);
        });

        let container = this.GetCardContainer();
        Array.from(container.children).forEach((item) => container.removeChild(item));
        this.instancePointers = [];
        newInstancePointers.forEach((item) => this.AppendImage(item));
    }

    Clear() {
        this.RemoveImages(this.instancePointers);
    }

    AppendImage(indexOfStorage: number) {
        let imageInstance = new ImageInstance();
        imageInstance.CreateImageNode(indexOfStorage);
        this.instancePointers.push(indexOfStorage);

        let container = this.GetCardContainer();
        let lastRow = (container.children.length == 0 ? null : container.children[container.children.length - 1]);
        if (lastRow == null || lastRow.children.length == 3) { // new row
            lastRow = CardInstance.newCardRow();
            container.appendChild(lastRow);
        }
    
        lastRow.appendChild(imageInstance.GetImageHTMLNode());
    }

    GetSelectedImages(autoAll: boolean) {
        let nodes: ImageInstance[] = []
        Array.prototype.forEach.call(this.GetCardContainer().children, (row) => {
            Array.prototype.forEach.call(row.children, (item) => {
                var ii = ImageInstance.InitFromExistedImageNode(item);
                if (ii.IsOnSelect()) {
                    nodes.push(ii);
                }
            });
        });
        if (autoAll && nodes.length == 0) {
            Array.prototype.forEach.call(this.GetCardContainer().children, (row) => {
                Array.prototype.forEach.call(row.children, (item) => {
                    nodes.push(ImageInstance.InitFromExistedImageNode(item));
                });
            });
        }
        return nodes;
    }

    GetOperatorButton(button: OperatorButton) {
        let operationsBox = this.cardNode!.children[0];
        return operationsBox.children[button] as HTMLElement;
    }

    SetCardName(value: string) {
        this.tagName = value;
        this.getCardNameHTMLElement().textContent = this.tagName;
    }

    GetCardName() {
        return this.tagName;
    }

    GetImages() {
        return this.instancePointers;
    }

    IsEmpty() {
        return this.instancePointers.length == 0;
    }

    GetSize() {
        return this.instancePointers.length;
    }

    IsOnMultiSelect() {
        return this.cardNode!.classList.contains("on-multiselect")
    }

    ToggleOnMultiSelect() {
        this.cardNode!.classList.toggle("on-multiselect");
    }
}