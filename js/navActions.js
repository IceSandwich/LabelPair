"use strict";
function getTriggerWords() {
    const promptCounts = Array.from(promptLists, function ([key, value]) {
        return {
            key: key,
            counts: value.length
        };
    });
    return promptCounts.filter((item) => item.counts == storage.length).map((item) => item.key);
}
function contains(big, small) {
    return small.every(item => big.includes(item));
}
function onNavbarAnalysisClick() {
    var _a;
    if (storage.length == 0) {
        alert("No images loaded!");
        return;
    }
    const promptCounts = Array.from(promptLists, function ([key, value]) {
        return {
            key: key,
            counts: value.length
        };
    });
    const sortedPromptCounts = promptCounts.sort(function (a, b) {
        return a.counts - b.counts;
    });
    // sortedPromptCounts is from small to large, transform it to middle large and small at two sides
    var removeLargest = sortedPromptCounts.slice(0, sortedPromptCounts.length - 1);
    var oddPositionNumbers = removeLargest.filter((item, index) => index % 2 == 1);
    var evenPositionNumbers = removeLargest.filter((item, index) => index % 2 == 0);
    var histogramData = [...evenPositionNumbers, sortedPromptCounts[sortedPromptCounts.length - 1], ...oddPositionNumbers.reverse()];
    var meanAxis = removeLargest.slice(1).reduce((accumulator, value) => accumulator + value.counts, 0) / (removeLargest.length - 1);
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
    var triggerWords = promptCounts.filter((item) => item.counts == storage.length).map((item) => item.key);
    document.getElementById("Analysis-TriggerWords").textContent = triggerWords.join(", ");
    document.getElementById("Analysis-TotalImages").textContent = `${String(storage.length)} / ${Array.from(promptLists.keys()).length}`;
    let wordsWOTriggers = storage.filter((item) => (item.PromptLists.filter(val => !triggerWords.includes(val))).length == 0);
    document.getElementById("Analysis-ImagesOnlyTriggerWords").textContent = wordsWOTriggers.map(item => item.ImgFilename).join(", ");
    let sameWordsMap = new Map();
    for (var i = 0; i < storage.length; i++) {
        var key = [...new Set(storage[i].PromptLists)].sort().join(", ");
        if (sameWordsMap.has(key)) {
            (_a = sameWordsMap.get(key)) === null || _a === void 0 ? void 0 : _a.push(storage[i]);
        }
        else {
            sameWordsMap.set(key, [storage[i]]);
        }
    }
    let sameWords = [];
    for (const [key, value] of sameWordsMap) {
        if (value.length == 1)
            break;
        sameWords.push(value.map(item => item.ImgFilename).join(", "));
    }
    document.getElementById("Analysis-ImagesHasSameTags").textContent = sameWords.join("; ");
    $("#AnalysisModal").modal('show');
}
$("#AnalysisModal").on('shown.bs.modal', function () {
    analysisChart.resize();
    setTimeout(function () {
        let container = document.getElementById("Analysis-Histogram");
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
    let triggerWords = getTriggerWords().join(", ");
    if (triggerWords != "") {
        triggerWords = triggerWords + ", ";
    }
    storage.forEach((item) => {
        const prompt = triggerWords + item.PromptLists.filter(val => !triggerWords.includes(val)).join(", ");
        // const prompt = item.PromptLists.join(", ");
        const textContent = new TextEncoder().encode(prompt);
        const blob = new Blob([textContent], { type: "text/plain" });
        zip.file(item.PromptFilename, blob, { binary: true });
    });
    zip.generateAsync({ type: "blob" }).then(content => {
        saveAs(content, "export.zip");
    });
}
//# sourceMappingURL=navActions.js.map