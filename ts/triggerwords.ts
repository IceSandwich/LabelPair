/** Ordered trigger words */
class TriggerWords {
    words: string[] = [];

    private static singleton: TriggerWords;

    static GetInstance() {
        if (!TriggerWords.singleton) {
            TriggerWords.singleton = new TriggerWords();
        }
        return TriggerWords.singleton;
    }

    private static newTriggerwordBox() {
        const templateTriggerWord = document.getElementById("Template-TriggerWord")!;
        let ret = templateTriggerWord.cloneNode(true) as HTMLElement;

        ret.classList.remove("template");
        ret.removeAttribute("id");
        return ret;
    }
    private static getContainer() {
        return document.getElementById("Template-TriggerWordContainer")!;
    }

    private updateWords() {
        // keep order assign new trigger words array
        var newTriggerWords = Array.from(GlobalCards.entries()).filter(item => item[1].GetSize() == GlobalImageStorage.length).map(item => item[0]);
        this.words = this.words.filter(item => newTriggerWords.includes(item));
        var needAppended = newTriggerWords.filter(item => !this.words.includes(item));
        this.words.push(...needAppended);
    }
    private updateUI() {
        const triggerWordContainer = TriggerWords.getContainer();
        Array.from(triggerWordContainer.children).forEach(item => triggerWordContainer.removeChild(item));
        for (var i = 0; i < this.words.length; i++) {
            var node = TriggerWords.newTriggerwordBox();
            node.children[1].textContent = this.words[i];
            node.setAttribute("data-id", String(i));
            triggerWordContainer.append(node);
        }
    }

    Update() {
        this.updateWords();
        this.updateUI();
    }

    MoveLeft(index: number) {
        if (index == 0) {
            return;
        }

        [this.words[index-1], this.words[index]] = [this.words[index], this.words[index-1]];
        this.updateUI();
    }

    MoveRight(index: number) {
        if (index >= this.words.length - 1) {
            return;
        }

        [this.words[index], this.words[index+1]] = [this.words[index+1], this.words[index]];
        this.updateUI();
    }

    
    GetWords() {
        return this.words;
    }
}

function onTriggerWordsButtonClick(event: HTMLEvent, isLeft: boolean) {
    var operationButton = event.target;
    if (operationButton.nodeName == "I") { // click on icon instead the lable of button
        operationButton = operationButton.parentNode! as HTMLElement; // now node point to the button
    }
    const KeyIdAttribute = "data-id";

    var wordSpan = operationButton.parentNode! as HTMLElement;
    var currentId = parseInt(wordSpan.getAttribute(KeyIdAttribute)!);
    if (isLeft) {
        TriggerWords.GetInstance().MoveLeft(currentId);
    } else {
        TriggerWords.GetInstance().MoveRight(currentId);
    }
}