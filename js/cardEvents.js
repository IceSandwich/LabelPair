"use strict";
function onCardEnterLeave(event, isEnter) {
    if (isMultiSelectMode == true)
        return; // ignore when in multi-select mode
    let header = event.target.children[0];
    for (var i = 1; i < header.children.length; i++) {
        if (isEnter) {
            header.children[i].classList.remove("hidden");
        }
        else {
            header.children[i].classList.add("hidden");
        }
    }
    if (isEnter) {
        var tagName = GetCardName(event.target);
        var but = GetOperatorButton(event.target, OperatorButton.Retrieve).children[0];
        but.children[but.children.length - 1].textContent = String(storage.length - promptLists.get(tagName).length);
    }
}
function SelectImage(event, forceMultiSelect) {
    var imageCard = event.target;
    if (imageCard.nodeName == "IMG") {
        imageCard = imageCard.parentNode;
    }
    if (forceMultiSelect || imageCard.parentNode.parentNode.parentNode.parentNode.classList.contains("on-multiselect")) {
        imageCard.classList.toggle("on-select");
    }
}
function onMultiSelectClick(event) {
    var toggleButton = event.target;
    toggleButton.classList.toggle("active");
    let operatorBox = toggleButton.parentNode.parentNode;
    var card = operatorBox.parentNode;
    card.classList.toggle("on-multiselect");
    currentCard = toggleButton.classList.contains("active") ? card : null;
    let multiSelectTools = toggleButton.parentNode;
    for (var i = 1; i < multiSelectTools.children.length; i++) {
        multiSelectTools.children[i].classList.toggle("hidden");
    }
    isMultiSelectMode = toggleButton.classList.contains("active");
    if (isMultiSelectMode == false) {
        // TODO: delete on-select class in list
    }
}
function onMultiSelectOperatorButtonClick(event, tagNameNodeId, countNodeId, modalNodeId) {
    event.preventDefault();
    event.stopPropagation();
    var card = GetCardFromOperatorButton(event.target);
    var counter = GetSelectedImages(GetCardContainer(card), true).length;
    document.getElementById(tagNameNodeId).textContent = GetCardName(card);
    document.getElementById(countNodeId).textContent = String(counter);
    $(`#${modalNodeId}`).modal('show');
}
/** =======================  Retrieve ==========================  */
function AppendImageToRetrieveContainer(indexOfStorage) {
    const imageInstance = storage[indexOfStorage];
    var card = NewTemplate(TemplateType.RetrieveImg);
    card.setAttribute("data-id", String(indexOfStorage));
    var imgNode = card.children[0];
    imgNode.src = imageInstance.ImgDataURL;
    imgNode.setAttribute("title", imageInstance.ImgFilename);
    var lastRow = (retrieveContainer.children.length == 0 ? null : retrieveContainer.children[retrieveContainer.children.length - 1]);
    if (lastRow == null || lastRow.children.length == 3) { // new row
        lastRow = NewTemplate(TemplateType.RetrieveRow);
        Array.from(lastRow.children).forEach((item) => {
            lastRow.removeChild(item);
        });
        retrieveContainer.appendChild(lastRow);
    }
    lastRow.appendChild(card);
    return card;
}
function UpdateRetrieve() {
    var nodes = GetSelectedImages(retrieveContainer, true);
    document.getElementById("Retrieve-Num").textContent = String(nodes.length);
}
function onRetrieveButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();
    var target = event.target;
    if (target.nodeName == "SPAN") {
        target = event.target.parentNode;
    }
    var card = GetCardFromOperatorButton(target);
    var cardName = GetCardName(card);
    Array.from(retrieveContainer.children).forEach((rowItem) => {
        retrieveContainer.removeChild(rowItem);
    });
    var tagList = promptLists.get(cardName);
    for (var i = 0; i < storage.length; i++) {
        if (tagList.indexOf(i) != -1)
            continue;
        AppendImageToRetrieveContainer(i);
    }
    retrieveContainer.scrollTop = 0;
    document.getElementById("Retrieve-Count").textContent = String(storage.length - tagList.length);
    document.getElementById("Retrieve-Tag").textContent = cardName;
    UpdateRetrieve();
    $("#RetrieveModal").modal('show');
}
/** ================= Modal ==========================  */
function ApplyRenameKeyword(event) {
    event.preventDefault();
    event.stopPropagation();
    var srcTag = document.getElementById("Rename-SrcTag").textContent;
    var dstTag = document.getElementById("Rename-DstTag").value.trim();
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
    // TODO: check duplicated tag and alert user that would merge tags. here we assume merge duplicate tags
    var srcCard = currentCard;
    var dstCard = FindCard(dstTag);
    if (!dstCard) {
        dstCard = NewTemplate(TemplateType.CardBox);
        SetCardName(dstCard, dstTag);
        InsertCardAfter(srcCard, dstCard);
    }
    var srcTagLists = promptLists.get(srcTag);
    var dstTagLists = promptLists.has(dstTag) ? promptLists.get(dstTag) : promptLists.set(dstTag, []).get(dstTag);
    var selectedImages = GetSelectedImages(GetCardContainer(srcCard), true);
    selectedImages.forEach(selectedImageNode => {
        var id = parseInt(selectedImageNode.getAttribute("data-id"));
        var alreadyHaveInDst = (dstTagLists.indexOf(id) != -1);
        // Ui
        RemoveImageFromCard(srcCard, selectedImageNode);
        if (!alreadyHaveInDst) {
            AppendExistedImageToCard(dstCard, selectedImageNode);
        }
        // Logic
        srcTagLists.splice(srcTagLists.indexOf(id), 1);
        if (srcTagLists.length == 0) {
            promptLists.delete(srcTag);
        }
        if (!alreadyHaveInDst) {
            dstTagLists.push(id);
        }
        var tagIndex = storage[id].PromptLists.indexOf(srcTag);
        if (!alreadyHaveInDst) {
            storage[id].PromptLists[tagIndex] = dstTag;
        }
        else {
            storage[id].PromptLists.splice(tagIndex, 1);
        }
    });
    if (currentCard != null) {
        let but = GetOperatorButton(currentCard, OperatorButton.MultiSelectTools).children[0];
        but.click(); // exit multiselect mode
    }
    $("#RenameModal").modal('hide');
}
function ApplyDeleteKeyword(event) {
    event.preventDefault();
    event.stopPropagation();
    var tagName = document.getElementById("Delete-Tag").textContent;
    var tagLists = promptLists.get(tagName);
    var selectedImages = GetSelectedImages(GetCardContainer(currentCard), true);
    selectedImages.forEach(selectedImageNode => {
        // UI
        RemoveImageFromCard(currentCard, selectedImageNode);
        // Logic
        var id = parseInt(selectedImageNode.getAttribute("data-id"));
        tagLists.splice(tagLists.indexOf(id), 1);
        if (tagLists.length == 0) {
            promptLists.delete(tagName);
        }
        var tagIndex = storage[id].PromptLists.indexOf(tagName);
        storage[id].PromptLists.splice(tagIndex, 1);
    });
    if (currentCard != null) {
        let but = GetOperatorButton(currentCard, OperatorButton.MultiSelectTools).children[0];
        but.click(); // exit multiselect mode
    }
    $("#DeleteModal").modal('hide');
}
function ApplyAddKeyword(event) {
    // TODO: may have bug, will add duplicate tag to an image
    event.preventDefault();
    event.stopPropagation();
    var tagName = document.getElementById("Add-Tag").value.trim();
    if (tagName == "") {
        alert("New tag name is empty!");
        $("#AddModal").modal('hide');
        return;
    }
    if (tagName == GetCardName(currentCard)) {
        alert("Useless to add the same tag!");
        $("#AddModal").modal('hide');
        return;
    }
    var card = FindCard(tagName);
    if (!card) {
        card = NewTemplate(TemplateType.CardBox);
        SetCardName(card, tagName);
        InsertCardAfter(currentCard, card);
        // document.getElementById("PromptBoxes").appendChild(card);
    }
    var tagLists = promptLists.has(tagName) ? promptLists.get(tagName) : promptLists.set(tagName, []).get(tagName);
    var selectedImages = GetSelectedImages(GetCardContainer(currentCard), true);
    selectedImages.forEach(selectedImageNode => {
        var id = parseInt(selectedImageNode.getAttribute("data-id"));
        if (tagLists.indexOf(id) != -1)
            return; // skip already have
        // UI
        AppendImageToCard(card, id);
        // Logic
        tagLists.push(id);
        storage[id].PromptLists.push(tagName);
    });
    if (currentCard != null) {
        let but = GetOperatorButton(currentCard, OperatorButton.MultiSelectTools).children[0];
        but.click(); // exit multiselect mode
    }
    $("#AddModal").modal('hide');
}
function ApplyRetrieveImages(evnet) {
    var keyword = document.getElementById("Retrieve-Tag").textContent;
    var card = FindCard(keyword);
    if (!card) {
        throw Error(`retrieve cannot find a card with ketword ${keyword}`);
    }
    var selectedImages = GetSelectedImages(retrieveContainer, true);
    selectedImages.forEach(selectedImageNode => {
        var id = parseInt(selectedImageNode.getAttribute("data-id"));
        // UI
        AppendImageToCard(card, id);
        // Logic
        promptLists.get(keyword).push(id);
        storage[id].PromptLists.push(keyword);
    });
    $("#RetrieveModal").modal('hide');
}
//# sourceMappingURL=cardEvents.js.map