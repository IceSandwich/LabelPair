class ImageInstance {
    /** Record where image and prompts come from */
    ImgFilename = "";
    PromptFilename = "";
    Prompts = "";

    /** Prompts to modify and output */
    PromptLists: string[] = [];

    /** Cached image blob url */
    ImgDataURL = "";
}

/** Store all images here that user uploads */
let storage: ImageInstance[] = [];

/** Key: Tag name, Value: the indices of storage */
let promptLists: Map<string, number[]> = new Map();

/** Is it in multi-select mode currently? */
let isMultiSelectMode: boolean = false;

/** Current focused card when in multi-select mode */
let currentCard: HTMLElement | null = null;

/** Ordered trigger word */
let triggerWord: string[] = [];

/* ============= Utils functions & variables used in other files =================== */
const templateCardBox = document.getElementById("Template-CardBox")!;
const templateCardImg = document.getElementById("Template-CardImage")!;
const templateCardRow = document.getElementById("Template-CardRow")!;
const templateTriggerWord = document.getElementById("Template-TriggerWord")!;
const cardBoxes = document.getElementById("CardBoxes")!;
const retrieveContainer = document.getElementById("RetrieveContainer")!;
const triggerWordContainer = document.getElementById("Template-TriggerWordContainer")!;
const templateRetrieveRow = document.getElementById("Template-RetrieveRow")!;
const templateRetrieveImg = document.getElementById("Template-RetrieveImg")!;
let analysisChart = echarts.init(document.getElementById("Analysis-Histogram")!);


function GetCardName(cardNode: HTMLElement) {
    let name = cardNode.children[0].children[0].textContent;
    if (!name) {
        throw Error(`CardName should not be null`);
    }
    return name;
}
function SetCardName(cardNode: HTMLElement, keyword: string) {
    cardNode.children[0].children[0].textContent = keyword;
}
function GetCardContainer(cardNode: HTMLElement) {
    return cardNode.children[1].children[0] as HTMLElement;
}

enum OperatorButton {
    MultiSelectTools = 1,
    Retrieve = 2
}
function GetOperatorButton(cardNode: HTMLElement, button: OperatorButton) {
    let operationsBox = cardNode.children[0];
    return operationsBox.children[button] as HTMLElement;
}
function GetCardFromOperatorButton(operationButton: HTMLElement) {
    if (operationButton.nodeName == "I") { // click on icon instead the lable of button
        operationButton = operationButton.parentNode! as HTMLElement; // now node point to the button
    }

    return operationButton.parentNode!.parentNode!.parentNode! as HTMLElement;
}

enum TemplateType {
    CardBox,
    CardImg,
    CardRow,
    RetrieveImg,
    RetrieveRow,
    TriggerWord,
}
function NewTemplate(type: TemplateType) {
    let ret: HTMLElement | null = null;
    switch (type) {
        case TemplateType.CardBox:
            ret = templateCardBox.cloneNode(true) as HTMLElement;

            // clear children
            let container = GetCardContainer(ret);
            Array.from(container.children).forEach((rowItem) => {
                container.removeChild(rowItem);
            });
            break;
        case TemplateType.CardImg:
            ret = templateCardImg.cloneNode(true) as HTMLElement;
            break;
        case TemplateType.CardRow:
            ret = templateCardRow.cloneNode(true) as HTMLElement;

            // clear children
            Array.from(ret.children).forEach((item) => {
                ret!.removeChild(item);
            });
            break;
        case TemplateType.RetrieveImg:
            ret = templateRetrieveImg.cloneNode(true) as HTMLElement;
            break;
        case TemplateType.RetrieveRow:
            ret = templateRetrieveRow.cloneNode(true) as HTMLElement;
            Array.from(ret.children).forEach((rowItem) => {
                ret!.removeChild(rowItem);
            });
            break;
        case TemplateType.TriggerWord:
            ret = templateTriggerWord.cloneNode(true) as HTMLElement;
            break;
    }
    if (!ret) {
        throw Error(`Unknow template type to clone: ${type}`);
    }
    ret.classList.remove("template");
    ret.removeAttribute("id");
    return ret;
}


function AppendExistedImageToCard(cardNode: HTMLElement, imgNode: HTMLElement) {
    let container = GetCardContainer(cardNode);
    let lastRow = (container.children.length == 0 ? null : container.children[container.children.length - 1]);
    if (lastRow == null || lastRow.children.length == 3) { // new row
        lastRow = NewTemplate(TemplateType.CardRow);
        container.appendChild(lastRow);
    }

    lastRow.appendChild(imgNode);
}
function AppendImageToCard(cardNode: HTMLElement, indexOfStorage: number) {
    const imageInstance = storage[indexOfStorage];
    let node = NewTemplate(TemplateType.CardImg);
    node.setAttribute("data-id", String(indexOfStorage))
    var imgNode = node.children[0] as HTMLImageElement;
    imgNode.src = imageInstance.ImgDataURL;
    imgNode.setAttribute("title", imageInstance.ImgFilename);

    AppendExistedImageToCard(cardNode, node);
    return node;
}
function RemoveImageFromCard(cardNode: HTMLElement, imgNode: HTMLElement) {
    var row = imgNode.parentNode as HTMLElement;
    row.removeChild(imgNode);
    if (row.children.length == 0) { // delete empty row
        (row.parentNode as HTMLElement).removeChild(row);
    }
    
    var container = GetCardContainer(cardNode);
    if (container.children.length == 0) {
        if (isMultiSelectMode) {
            // exit multi select mode before we delete the whole card, otherwise we cannot find the button to exit multiselect mode
            GetOperatorButton(cardNode, OperatorButton.MultiSelectTools).click();
        }
        (cardNode.parentNode as HTMLElement).removeChild(cardNode);
    }
}
function InsertCardAfter(cardPosition: HTMLElement, newCard: HTMLElement) {
    var parentElement = cardPosition.parentNode as HTMLElement;
    if (parentElement.lastChild == cardPosition) {
        parentElement.appendChild(newCard);
    } else {
        parentElement.insertBefore(newCard, cardPosition.nextSibling);
    }
}
function FindCard(keyword: string): HTMLElement | undefined {
    return Array.prototype.find.call(cardBoxes.children, (item) => GetCardName(item) == keyword);
}


/**
 * 
 * @param container 
 * @param autoAll if no images selected, use all images instead.
 * @returns 
 */
function GetSelectedImages(container: HTMLElement, autoAll: boolean) {
    let nodes: HTMLElement[] = [];
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

