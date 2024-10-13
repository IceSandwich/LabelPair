interface HTMLEvent extends Event {
    target: HTMLElement;
}

function onCardEnterLeave(event: HTMLEvent, isEnter: boolean) {
    if (GlobalCurrentCard?.IsOnMultiSelect()) return;// ignore when in multi-select mode

    let header = event.target.children[0];
    for (var i = 1; i < header.children.length; i++) {
        if (isEnter) {
            header.children[i].classList.remove("hidden");
        } else {
            header.children[i].classList.add("hidden");
        }
    }

    if (isEnter) {
        let card = GlobalCards.get(CardInstance.GetCardName(event.target))!;
        var but = card.GetOperatorButton(OperatorButton.Retrieve).children[0];
        but.children[but.children.length - 1].textContent = String(GlobalImageStorage.length - card.GetSize());
    }
}

/** =======================  Retrieve ==========================  */

let GlobalRetrieveCardBox = CardInstance.InitFromExistedCard(document.getElementById("Retrieve-CardBox")!)

function UpdateRetrieve() {
    document.getElementById("Retrieve-Num")!.textContent = String(GlobalRetrieveCardBox.GetSelectedImages(true).length);
}

/** =======================  Image ==========================  */

function SelectImage(event: HTMLEvent) {
    var imageNode = event.target;
    if (imageNode.nodeName == "IMG") {
        imageNode = imageNode.parentNode as HTMLElement;
    }

    let image = ImageInstance.InitFromExistedImageNode(imageNode);
    let card = CardInstance.InitFromExistedCard(image.GetCardNode());

    let isInRetrievePanel = card.GetCardName() == "Retrieve";
    
    if (isInRetrievePanel || card.IsOnMultiSelect()) {
        image.ToggleOnSelect();
    }

    if (isInRetrievePanel) {
        UpdateRetrieve();
    }
}

/** =======================  Tool click events ==========================  */

// hide or show tools
function onMultiSelectClick(event: HTMLEvent) {
    var toggleButton = event.target;
    toggleButton.classList.toggle("active");

    let operatorBox = toggleButton.parentNode!.parentNode!;
    let card = CardInstance.InitFromExistedCard(operatorBox.parentNode! as HTMLElement, true);
    card.ToggleOnMultiSelect();

    GlobalCurrentCard = card.IsOnMultiSelect() ? card : null;
    let multiSelectTools = toggleButton.parentNode!;
    for (var i = 1; i < multiSelectTools.children.length; i++) {
        multiSelectTools.children[i].classList.toggle("hidden");
    }
}

// show modal dialog
function onMultiSelectOperatorButtonClick(event: HTMLEvent, tagNameNodeId: string, countNodeId: string, modalNodeId: string) {
    event.preventDefault();
    event.stopPropagation();

    let card = GlobalCards.get(CardInstance.GetCardNameFromOperatorButton(event.target))!;
    let counter = card.GetSelectedImages(true).length;

    document.getElementById(tagNameNodeId)!.textContent = card.GetCardName();
    document.getElementById(countNodeId)!.textContent = String(counter);
    $(`#${modalNodeId}`).modal('show');
}

// show modal dialog only for retrieve
function onRetrieveButtonClick(event: HTMLEvent) {
    event.preventDefault();
    event.stopPropagation();

    var target = event.target;
    if (target.nodeName == "SPAN") {
        target = event.target.parentNode as HTMLElement;
    }
    let card = GlobalCards.get(CardInstance.GetCardNameFromOperatorButton(target))!;

    let retrieveImages = Array.from({length: GlobalImageStorage.length}, (_, i) => i).filter(id => !card.GetImages().includes(id));
    GlobalRetrieveCardBox.Clear();
    retrieveImages.forEach(id => GlobalRetrieveCardBox.AppendImage(id));
    GlobalRetrieveCardBox.GetCardContainer().scrollTop = 0;

    document.getElementById("Retrieve-Count")!.textContent = String(GlobalImageStorage.length - card.GetSize());
    document.getElementById("Retrieve-Tag")!.textContent = card.GetCardName();

    UpdateRetrieve();
    $("#RetrieveModal").modal('show');
}

/** ================= Modal ==========================  */

function ApplyRenameKeyword(event: HTMLEvent) {
    event.preventDefault();
    event.stopPropagation();

    var srcTag = document.getElementById("Rename-SrcTag")!.textContent!;
    var dstTag = (document.getElementById("Rename-DstTag")! as HTMLInputElement).value.trim();

    if (srcTag == dstTag) {
        alert("New tag name is same as the old tag name!");
        $("#RenameModal").modal('hide');
        return;
    }

    if (dstTag == "") {
        alert("New tag name is empty! If you want to delete this tag, hit `Remove` next to the `Rename` button.");
        $("#RenameModal").modal('hide');
        return;
    }

    if (GlobalCurrentCard != null) {
        let but = GlobalCurrentCard.GetOperatorButton(OperatorButton.MultiSelectTools).children[0] as HTMLElement;
        but.click(); // exit multiselect mode
    }

    // TODO: check duplicated tag and alert user that would merge tags. here we assume merge duplicate tags

    let srcCard = GlobalCards.get(srcTag)!;
    let dstCard = GlobalCards.get(dstTag);
    if (!dstCard) {
        dstCard = new CardInstance();
        dstCard.CreateCard(dstTag, srcCard);
        GlobalCards.set(dstTag, dstCard);
    }

    let selectedImages = srcCard.GetSelectedImages(true).map(ii => ii.GetIndexOfStorage());
    let appendImages = selectedImages.filter(id => {
        return !dstCard.GetImages().includes(id);
    });

    // Ui
    appendImages.forEach(id => dstCard.AppendImage(id));
    srcCard.RemoveImages(selectedImages);
    if (srcCard.IsEmpty()) {
        srcCard.DestroyCard();
        GlobalCards.delete(srcCard.GetCardName());
    }

    // Logic
    selectedImages.forEach(id => {
        var imageInstance = GlobalImageStorage[id];
        var tagIndex = imageInstance.PromptLists.indexOf(srcTag);
        if (appendImages.includes(id)) {
            imageInstance.PromptLists[tagIndex] = dstTag;
        } else {
            imageInstance.PromptLists.splice(tagIndex, 1);
        }
    })

    $("#RenameModal").modal('hide');
}

function ApplyDeleteKeyword(event: HTMLEvent) {
    event.preventDefault();
    event.stopPropagation();

    var srcTag = document.getElementById("Delete-Tag")!.textContent!;
    var srcCard = GlobalCards.get(srcTag)!;

    if (GlobalCurrentCard != null) {
        let but = GlobalCurrentCard.GetOperatorButton(OperatorButton.MultiSelectTools).children[0] as HTMLElement;
        but.click(); // exit multiselect mode
    }

    let selectedImages = srcCard.GetSelectedImages(true).map(ii => ii.GetIndexOfStorage());

    // UI
    srcCard.RemoveImages(selectedImages);
    if (srcCard.IsEmpty()) {
        srcCard.DestroyCard();
        GlobalCards.delete(srcCard.GetCardName());
    }

    // Logic
    selectedImages.forEach(id => {
        var imageInstance = GlobalImageStorage[id];
        imageInstance.PromptLists.splice(imageInstance.PromptLists.indexOf(srcTag), 1);
    })

    $("#DeleteModal").modal('hide');
}
function ApplyAddKeyword(event: HTMLEvent) {
    event.preventDefault();
    event.stopPropagation();

    let srcTag = document.getElementById("Add-HiddenSrcTag")?.textContent!;
    let srcCard = GlobalCards.get(srcTag)!;
    let dstTag = (document.getElementById("Add-Tag") as HTMLInputElement).value.trim();
    let dstCard = GlobalCards.get(dstTag);

    if (dstTag == "") {
        alert("New tag name is empty!");
        $("#AddModal").modal('hide');
        return;
    }

    if (dstTag == srcCard.GetCardName()) {
        alert("Useless to add the same tag!");
        $("#AddModal").modal('hide');
        return;
    }

    if (!dstCard) {
        dstCard = new CardInstance();
        dstCard.CreateCard(dstTag, srcCard);
        GlobalCards.set(dstTag, dstCard);
    }

    let selectedImages = srcCard.GetSelectedImages(true).map(ii => ii.GetIndexOfStorage());
    let appendImages = selectedImages.filter(id => {
        return !dstCard.GetImages().includes(id);
    });

    // Ui
    appendImages.forEach(id => dstCard.AppendImage(id));

    // Logic
    appendImages.forEach(id => {
        GlobalImageStorage[id].PromptLists.push(dstTag);
    })

    if (GlobalCurrentCard != null) {
        let but = GlobalCurrentCard.GetOperatorButton(OperatorButton.MultiSelectTools).children[0] as HTMLElement;
        but.click(); // exit multiselect mode
    }
    $("#AddModal").modal('hide');
}
function ApplyRetrieveImages(evnet: HTMLEvent) {
    var tagName = document.getElementById("Retrieve-Tag")!.textContent!;
    var tagCard = GlobalCards.get(tagName)!;

    let selectedImages = GlobalRetrieveCardBox.GetSelectedImages(true).map(ii => ii.GetIndexOfStorage());
    let appendImages = selectedImages.filter(id => {
        return !tagCard.GetImages().includes(id);
    });

    // Ui
    appendImages.forEach(id => tagCard.AppendImage(id));

    // Logic
    appendImages.forEach(id => {
        GlobalImageStorage[id].PromptLists.push(tagName);
    });
    
    $("#RetrieveModal").modal('hide');
}

