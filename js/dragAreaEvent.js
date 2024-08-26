"use strict";
let dropArea = document.getElementById("DropArea");
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, function (e) {
        e.preventDefault();
        e.stopPropagation();
    }, false);
});
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, function (e) {
        dropArea.classList.add("drop-area-highlight");
    }, false);
});
['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, function (e) {
        dropArea.classList.remove("drop-area-highlight");
    }, false);
});
dropArea.addEventListener('drop', function (e) {
    var dt = e.dataTransfer;
    if (!dt) {
        throw Error(`dataTransfer is null`);
    }
    if (!e.target) {
    }
    var readTasksSyncPromises = [];
    var pair = new Map(); // filename to ImageInstance
    [...dt.files].forEach(f => {
        var filenameWithoutExtension = f.name.replace(/\.[^/.]+$/, "");
        var imageInstance = null;
        if (pair.has(filenameWithoutExtension)) {
            imageInstance = pair.get(filenameWithoutExtension);
        }
        else {
            imageInstance = new ImageInstance();
            pair.set(filenameWithoutExtension, imageInstance);
        }
        if (f.type.startsWith("image/")) {
            if (imageInstance.ImgFilename != "") {
                alert("Found duplicated image, use the old one: \n\tBefore: " + imageInstance.ImgFilename + "\t\tNew: " + f.name);
            }
            else {
                imageInstance.ImgFilename = f.name;
                readTasksSyncPromises.push(new Promise((resolve, reject) => {
                    var imageInstance = pair.get(filenameWithoutExtension);
                    var imageType = f.type;
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        if (!e.target || !e.target.result) {
                            reject(`reading files from disk, but target or result is null.`);
                            return;
                        }
                        var data = e.target.result;
                        const blob = new Blob([new Uint8Array(data)], { type: imageType });
                        imageInstance.ImgDataURL = URL.createObjectURL(blob);
                        resolve(true);
                    };
                    reader.onerror = function (e) {
                        reject(e);
                    };
                    reader.readAsArrayBuffer(f);
                }));
            }
        }
        else if (f.type.startsWith("text")) {
            if (imageInstance.PromptFilename != "") {
                alert("Found duplicated text, use the old one: \n\tBefore: " + imageInstance.PromptFilename + "\t\tNew: " + f.name);
            }
            else {
                imageInstance.PromptFilename = f.name;
                readTasksSyncPromises.push(new Promise((resolve, reject) => {
                    var imageInstance = pair.get(filenameWithoutExtension);
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        if (!e.target || !e.target.result) {
                            reject(`reading files from disk, but target or result is null.`);
                            return;
                        }
                        imageInstance.Prompts = e.target.result;
                        imageInstance.PromptLists = imageInstance.Prompts.split(",").map(item => item.trim()).filter(item => item != "");
                        resolve(true);
                    };
                    reader.onerror = function (e) {
                        reject(e);
                    };
                    reader.readAsText(f);
                }));
            }
        }
        else {
            alert("Unknow file type for this file, ignore: \n\tFile: " + f.name + "\n\tType: " + f.type);
        }
    }, false);
    Promise.all(readTasksSyncPromises).then(function () {
        var deletedDuplicatedTagCounter = 0;
        for (const [key, value] of pair.entries()) {
            if (value.ImgFilename == "" || value.PromptFilename == "") {
                alert("Cannot find a pair for an instance, skip: \n\tImage: " + value.ImgFilename + "\n\tTxt: " + value.PromptFilename);
            }
            else {
                const oldSize = value.PromptLists.length;
                value.PromptLists = Array.from(new Set(value.PromptLists));
                storage.push(value);
                deletedDuplicatedTagCounter += oldSize - value.PromptLists.length;
            }
        }
        if (deletedDuplicatedTagCounter > 0) {
            alert(`Deleted ${deletedDuplicatedTagCounter} duplicated tags!`);
        }
        var generateTreeNodesPromises = [];
        for (var i = 0; i < storage.length; i++) {
            storage[i].PromptLists.forEach(keyword => {
                if (promptLists.has(keyword)) {
                    promptLists.get(keyword).push(i);
                }
                else {
                    promptLists.set(keyword, [i]);
                }
            });
        }
        for (const [key, value] of promptLists.entries()) {
            let card = NewTemplate(TemplateType.CardBox);
            SetCardName(card, key);
            value.forEach(function (elem) {
                AppendImageToCard(card, elem);
            });
            cardBoxes.append(card);
        }
    });
}, false);
//# sourceMappingURL=dragAreaEvent.js.map