"use strict";
var OperatorButton;
(function (OperatorButton) {
    OperatorButton[OperatorButton["MultiSelectTools"] = 1] = "MultiSelectTools";
    OperatorButton[OperatorButton["Retrieve"] = 2] = "Retrieve";
})(OperatorButton || (OperatorButton = {}));
/**
 *
 * @param container
 * @param autoAll if no images selected, use all images instead.
 * @returns
 */
function GetSelectedImages(container, autoAll) {
}
class CardInstance {
    constructor() {
        this.cardNode = null;
        this.instancePointers = [];
        this.tagName = "";
    }
    static getCardNameHTMLElement(cardNode) {
        return cardNode.children[0].children[0];
    }
    static getCardContainer(cardNode) {
        return cardNode.children[1].children[0];
    }
    getCardNameHTMLElement() {
        return CardInstance.getCardNameHTMLElement(this.cardNode);
    }
    GetCardContainer() {
        return CardInstance.getCardContainer(this.cardNode);
    }
    static GetCardName(cardNode) {
        return CardInstance.getCardNameHTMLElement(cardNode).textContent;
    }
    static GetCardNameFromOperatorButton(operationButton) {
        if (operationButton.nodeName == "I") { // click on icon instead the lable of button
            operationButton = operationButton.parentNode; // now node point to the button
        }
        let cardNode = operationButton.parentNode.parentNode.parentNode;
        return CardInstance.getCardNameHTMLElement(cardNode).textContent;
    }
    static getCardBoxes() {
        return document.getElementById("CardBoxes");
    }
    static newCardBox() {
        const templateCardBox = document.getElementById("Template-CardBox");
        let ret = templateCardBox.cloneNode(true);
        // clear children
        let container = ret.children[1].children[0];
        Array.from(container.children).forEach((rowItem) => {
            container.removeChild(rowItem);
        });
        ret.classList.remove("template");
        ret.removeAttribute("id");
        return ret;
    }
    static newCardRow() {
        const templateCardRow = document.getElementById("Template-CardRow");
        let ret = templateCardRow.cloneNode(true);
        // clear children
        Array.from(ret.children).forEach((item) => {
            ret.removeChild(item);
        });
        ret.classList.remove("template");
        ret.removeAttribute("id");
        return ret;
    }
    CreateCard(tagName, insertAfter = null) {
        if (this.cardNode != null) {
            throw Error("CardContainer existed.");
        }
        this.cardNode = CardInstance.newCardBox();
        this.SetCardName(tagName);
        let cardBoxes = CardInstance.getCardBoxes();
        if (insertAfter == null || insertAfter.cardNode == null || cardBoxes.lastChild == insertAfter.cardNode) {
            cardBoxes.append(this.cardNode);
        }
        else {
            cardBoxes.insertBefore(this.cardNode, insertAfter.cardNode.nextSibling);
        }
    }
    static InitFromExistedCard(existed, useGlobalInstance = false) {
        let ret = new CardInstance;
        ret.cardNode = existed;
        ret.tagName = ret.getCardNameHTMLElement().textContent;
        if (useGlobalInstance) {
            return GlobalCards.get(ret.tagName);
        }
        Array.from(ret.GetCardContainer().children).forEach(row => {
            Array.from(row.children).forEach(item => {
                var ii = ImageInstance.InitFromExistedImageNode(item);
                ret.instancePointers.push(ii.GetIndexOfStorage());
            });
        });
        return ret;
    }
    DestroyCard() {
        CardInstance.getCardBoxes().removeChild(this.cardNode);
        this.cardNode = null;
        this.instancePointers = [];
    }
    RemoveImages(indicesOfStorage) {
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
    AppendImage(indexOfStorage) {
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
    GetSelectedImages(autoAll) {
        let nodes = [];
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
    GetOperatorButton(button) {
        let operationsBox = this.cardNode.children[0];
        return operationsBox.children[button];
    }
    SetCardName(value) {
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
        return this.cardNode.classList.contains("on-multiselect");
    }
    ToggleOnMultiSelect() {
        this.cardNode.classList.toggle("on-multiselect");
    }
}
//# sourceMappingURL=card.js.map