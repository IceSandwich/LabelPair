"use strict";
class ImageInstance {
    constructor() {
        /** Record where image and prompts come from */
        this.ImgFilename = "";
        this.PromptFilename = "";
        this.Prompts = "";
        /** Prompts to modify and output */
        this.PromptLists = [];
        /** Cached image blob url */
        this.ImgDataURL = "";
    }
}
/** Store all images here that user uploads */
let storage = [];
/** Key: Tag name, Value: the indices of storage */
let promptLists = new Map();
/** Is it in multi-select mode currently? */
let isMultiSelectMode = false;
/** Current focused card when in multi-select mode */
let currentCard = null;
/** Ordered trigger word */
let triggerWord = [];
/* ============= Utils functions & variables used in other files =================== */
const templateCardBox = document.getElementById("Template-CardBox");
const templateCardImg = document.getElementById("Template-CardImage");
const templateCardRow = document.getElementById("Template-CardRow");
const templateTriggerWord = document.getElementById("Template-TriggerWord");
const cardBoxes = document.getElementById("CardBoxes");
const retrieveContainer = document.getElementById("RetrieveContainer");
const triggerWordContainer = document.getElementById("Template-TriggerWordContainer");
const templateRetrieveRow = document.getElementById("Template-RetrieveRow");
const templateRetrieveImg = document.getElementById("Template-RetrieveImg");
let analysisChart = echarts.init(document.getElementById("Analysis-Histogram"));
function GetCardName(cardNode) {
    let name = cardNode.children[0].children[0].textContent;
    if (!name) {
        throw Error(`CardName should not be null`);
    }
    return name;
}
function SetCardName(cardNode, keyword) {
    cardNode.children[0].children[0].textContent = keyword;
}
function GetCardContainer(cardNode) {
    return cardNode.children[1].children[0];
}
var OperatorButton;
(function (OperatorButton) {
    OperatorButton[OperatorButton["MultiSelectTools"] = 1] = "MultiSelectTools";
    OperatorButton[OperatorButton["Retrieve"] = 2] = "Retrieve";
})(OperatorButton || (OperatorButton = {}));
function GetOperatorButton(cardNode, button) {
    let operationsBox = cardNode.children[0];
    return operationsBox.children[button];
}
function GetCardFromOperatorButton(operationButton) {
    if (operationButton.nodeName == "I") { // click on icon instead the lable of button
        operationButton = operationButton.parentNode; // now node point to the button
    }
    return operationButton.parentNode.parentNode.parentNode;
}
var TemplateType;
(function (TemplateType) {
    TemplateType[TemplateType["CardBox"] = 0] = "CardBox";
    TemplateType[TemplateType["CardImg"] = 1] = "CardImg";
    TemplateType[TemplateType["CardRow"] = 2] = "CardRow";
    TemplateType[TemplateType["RetrieveImg"] = 3] = "RetrieveImg";
    TemplateType[TemplateType["RetrieveRow"] = 4] = "RetrieveRow";
    TemplateType[TemplateType["TriggerWord"] = 5] = "TriggerWord";
})(TemplateType || (TemplateType = {}));
function NewTemplate(type) {
    let ret = null;
    switch (type) {
        case TemplateType.CardBox:
            ret = templateCardBox.cloneNode(true);
            // clear children
            let container = GetCardContainer(ret);
            Array.from(container.children).forEach((rowItem) => {
                container.removeChild(rowItem);
            });
            break;
        case TemplateType.CardImg:
            ret = templateCardImg.cloneNode(true);
            break;
        case TemplateType.CardRow:
            ret = templateCardRow.cloneNode(true);
            // clear children
            Array.from(ret.children).forEach((item) => {
                ret.removeChild(item);
            });
            break;
        case TemplateType.RetrieveImg:
            ret = templateRetrieveImg.cloneNode(true);
            break;
        case TemplateType.RetrieveRow:
            ret = templateRetrieveRow.cloneNode(true);
            Array.from(ret.children).forEach((rowItem) => {
                ret.removeChild(rowItem);
            });
            break;
        case TemplateType.TriggerWord:
            ret = templateTriggerWord.cloneNode(true);
            break;
    }
    if (!ret) {
        throw Error(`Unknow template type to clone: ${type}`);
    }
    ret.classList.remove("template");
    ret.removeAttribute("id");
    return ret;
}
function AppendExistedImageToCard(cardNode, imgNode) {
    let container = GetCardContainer(cardNode);
    let lastRow = (container.children.length == 0 ? null : container.children[container.children.length - 1]);
    if (lastRow == null || lastRow.children.length == 3) { // new row
        lastRow = NewTemplate(TemplateType.CardRow);
        container.appendChild(lastRow);
    }
    lastRow.appendChild(imgNode);
}
function AppendImageToCard(cardNode, indexOfStorage) {
    const imageInstance = storage[indexOfStorage];
    let node = NewTemplate(TemplateType.CardImg);
    node.setAttribute("data-id", String(indexOfStorage));
    var imgNode = node.children[0];
    imgNode.src = imageInstance.ImgDataURL;
    imgNode.setAttribute("title", imageInstance.ImgFilename);
    AppendExistedImageToCard(cardNode, node);
    return node;
}
function RemoveImageFromCard(cardNode, imgNode) {
    var row = imgNode.parentNode;
    row.removeChild(imgNode);
    if (row.children.length == 0) { // delete empty row
        row.parentNode.removeChild(row);
    }
    var container = GetCardContainer(cardNode);
    if (container.children.length == 0) {
        if (isMultiSelectMode) {
            // exit multi select mode before we delete the whole card, otherwise we cannot find the button to exit multiselect mode
            GetOperatorButton(cardNode, OperatorButton.MultiSelectTools).click();
        }
        cardNode.parentNode.removeChild(cardNode);
    }
}
function InsertCardAfter(cardPosition, newCard) {
    var parentElement = cardPosition.parentNode;
    if (parentElement.lastChild == cardPosition) {
        parentElement.appendChild(newCard);
    }
    else {
        parentElement.insertBefore(newCard, cardPosition.nextSibling);
    }
}
function FindCard(keyword) {
    return Array.prototype.find.call(cardBoxes.children, (item) => GetCardName(item) == keyword);
}
/**
 *
 * @param container
 * @param autoAll if no images selected, use all images instead.
 * @returns
 */
function GetSelectedImages(container, autoAll) {
    let nodes = [];
    Array.prototype.forEach.call(container.children, (row) => {
        Array.prototype.forEach.call(row.children, (item) => {
            if (item.classList.contains("on-select")) {
                nodes.push(item);
            }
        });
    });
    if (autoAll && nodes.length == 0) {
        Array.prototype.forEach.call(container.children, (row) => {
            Array.prototype.forEach.call(row.children, (item) => {
                nodes.push(item);
            });
        });
    }
    return nodes;
}
//# sourceMappingURL=index.js.map