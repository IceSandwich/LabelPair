interface KWToLength {
    key: string;
    counts: number;
}
function getTriggerWords() {
    const promptCounts: Array<KWToLength> = Array.from(promptLists, function ([key, value]) {
        return {
            key: key,
            counts: value.length
        }
    });
    return promptCounts.filter((item) => item.counts == storage.length).map((item) => item.key)
}
function contains<T>(big: Array<T>, small: Array<T>) {
    return small.every(item => big.includes(item));
}
function UpdateTriggerWords() { // keep order
    var newTriggerWords = Array.from(promptLists.entries()).filter(item => item[1].length == storage.length).map(item => item[0]);
    triggerWord = triggerWord.filter(item => newTriggerWords.includes(item));
    var needAppended = newTriggerWords.filter(item => !triggerWord.includes(item));
    triggerWord.push(...needAppended);
}
function prepareAnalysisTriggerWordsButtons() {
    UpdateTriggerWords();
    Array.from(triggerWordContainer.children).forEach(item => triggerWordContainer.removeChild(item));
    for (var i = 0; i < triggerWord.length; i++) {
        var node = NewTemplate(TemplateType.TriggerWord);
        node.children[1].textContent = triggerWord[i];
        node.setAttribute("data-id", String(i));
        triggerWordContainer.append(node);
    }
}
function onTriggerWordsButtonClick(event: HTMLEvent, isLeft: boolean) {
    var operationButton = event.target;
    if (operationButton.nodeName == "I") { // click on icon instead the lable of button
        operationButton = operationButton.parentNode! as HTMLElement; // now node point to the button
    }
    const KeyIdAttribute = "data-id";
    const IndexOfWord = 1;

    var wordSpan = operationButton.parentNode! as HTMLElement;
    var currentId = parseInt(wordSpan.getAttribute(KeyIdAttribute)!);
    if (isLeft && wordSpan.previousElementSibling != null) {
        var previousId = parseInt(wordSpan.previousElementSibling.getAttribute(KeyIdAttribute)!);
        // UI
        wordSpan.previousElementSibling.children[IndexOfWord].textContent = triggerWord[currentId];
        wordSpan.children[IndexOfWord].textContent = triggerWord[previousId];
        // Logic
        [triggerWord[previousId], triggerWord[currentId]] = [triggerWord[currentId], triggerWord[previousId]];
    }
    if (!isLeft && wordSpan.nextElementSibling != null) {
        var nextId = parseInt(wordSpan.nextElementSibling.getAttribute(KeyIdAttribute)!);
        // UI
        wordSpan.nextElementSibling.children[IndexOfWord].textContent = triggerWord[currentId];
        wordSpan.children[IndexOfWord].textContent = triggerWord[nextId];
        // Logic
        [triggerWord[currentId], triggerWord[nextId]] = [triggerWord[nextId], triggerWord[currentId]];
    }
}
function onNavbarAnalysisClick() {
    if (storage.length == 0) {
        alert("No images loaded!");
        return;
    }

    const promptCounts: Array<KWToLength> = Array.from(promptLists, function ([key, value]) {
        return {
            key: key,
            counts: value.length
        }
    });
    const sortedPromptCounts = promptCounts.sort(function (a, b) {
        return a.counts - b.counts;
    });

    // sortedPromptCounts is from small to large, transform it to middle large and small at two sides
    var removeLargest = sortedPromptCounts.slice(0, sortedPromptCounts.length - 1);
    var oddPositionNumbers = removeLargest.filter((item, index) => index % 2 == 1);
    var evenPositionNumbers = removeLargest.filter((item, index) => index % 2 == 0);
    var histogramData = [...evenPositionNumbers, sortedPromptCounts[sortedPromptCounts.length - 1], ...oddPositionNumbers.reverse()];
    var meanAxis = removeLargest.slice(1).reduce((accumulator: number, value: KWToLength) => accumulator + value.counts, 0) / (removeLargest.length - 1);

    var option = {
        // title: {
        //     text: "Tag Contribution",
        //     left: "center",
        //     bottom: "bottom"
        // },
        tooltip: {},
        // legend: {
        //     // data:['销量']
        // },
        itemStyle: {
            color: "#7C93C3"
        },
        xAxis: {
            data: Array.from(histogramData, (item) => item.key)
        },
        yAxis: {},
        series: [{
            // name: '销量',
            type: 'bar',
            // data: [5, 20, 36, 10, 10, 20]
            data: Array.from(histogramData, (item) => item.counts),
            markLine: {
                symbol: ['none', 'none'],
                // label: {
                //     show: true,
                //     // formatter: `mean`
                // },
                lineStyle: {
                    type: 'dash',
                    color: '#821131',
                    width: 5
                },
                data: [{
                    yAxis: meanAxis,
                    label: {
                        show: true,
                        formatter: `average`
                    }
                }, {
                    yAxis: storage.length,
                    label: {
                        show: true,
                        formatter: `total images`
                    }
                }]
            }
        }]
    };
    analysisChart.setOption(option);

    UpdateTriggerWords();
    // document.getElementById("Analysis-TriggerWords")!.textContent = triggerWord.join(", ");
    prepareAnalysisTriggerWordsButtons();
    document.getElementById("Analysis-TotalImages")!.textContent = `${String(storage.length)} / ${Array.from(promptLists.keys()).length}`;

    let wordsWOTriggers = storage.filter((item) => (item.PromptLists.filter(val => !triggerWord.includes(val))).length == 0);
    document.getElementById("Analysis-ImagesOnlyTriggerWords")!.textContent = wordsWOTriggers.map(item => item.ImgFilename).join(", ");

    let sameWordsMap: Map<string, ImageInstance[]> = new Map();
    for (var i = 0; i < storage.length; i++) {
        var key = [...new Set(storage[i].PromptLists)].sort().join(", ");
        if (sameWordsMap.has(key)) {
            sameWordsMap.get(key)?.push(storage[i]);
        } else {
            sameWordsMap.set(key, [storage[i]]);
        }
    }
    let sameWords: string[] = [];
    for (const [key, value] of sameWordsMap) {
        if (value.length == 1) break;
        sameWords.push(value.map(item => item.ImgFilename).join(", "));
    }
    document.getElementById("Analysis-ImagesHasSameTags")!.textContent = sameWords.join("; ");

    $("#AnalysisModal").modal('show');
}
$("#AnalysisModal").on('shown.bs.modal', function () {
    analysisChart.resize();
    setTimeout(function () {
        let container = document.getElementById("Analysis-Histogram")!;
        console.log(`width: ${container.offsetWidth}, height: ${container.offsetHeight}`);
        analysisChart.resize({
            width: container.offsetWidth,
            height: container.offsetHeight,
        });
    }, 500);
});

function onNavbarExportClick() {
    if (storage.length == 0) {
        alert("No images loaded!");
        return;
    }

    const zip = new JSZip();
    UpdateTriggerWords();
    let triggerPrefix = triggerWord.join(", ");
    if (triggerPrefix != "") {
        triggerPrefix = triggerPrefix + ", ";
    }
    storage.forEach((item) => {
        const prompt = triggerPrefix + item.PromptLists.filter(val => !triggerPrefix.includes(val)).join(", ");
        // const prompt = item.PromptLists.join(", ");
        const textContent = new TextEncoder().encode(prompt);
        const blob = new Blob([textContent], { type: "text/plain" });
        zip.file(item.PromptFilename, blob, { binary: true });
    });

    zip.generateAsync({ type: "blob" }).then(content => {
        saveAs(content, "export.zip");
    });
}
