class ImageStorage {
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
let GlobalImageStorage: ImageStorage[] = [];

/** Key: Tag name, Value: the indices of storage */
let GlobalCards: Map<string, CardInstance> = new Map();

/** Current focused card when in multi-select mode */
let GlobalCurrentCard: CardInstance | null = null;