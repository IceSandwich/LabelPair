"use strict";
class ImageStorage {
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
let GlobalImageStorage = [];
/** Key: Tag name, Value: the indices of storage */
let GlobalCards = new Map();
/** Current focused card when in multi-select mode */
let GlobalCurrentCard = null;
//# sourceMappingURL=index.js.map