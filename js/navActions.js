"use strict";
function onNavbarAnalysisClick() {
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
    var option = {
        title: {
            text: "Tag Contribution",
            left: "center",
            bottom: "bottom"
        },
        tooltip: {},
        legend: {
        // data:['销量']
        },
        xAxis: {
            data: Array.from(histogramData, (item) => item.key)
        },
        yAxis: {},
        series: [{
                // name: '销量',
                type: 'bar',
                // data: [5, 20, 36, 10, 10, 20]
                data: Array.from(histogramData, (item) => item.counts)
            }]
    };
    analysisChart.setOption(option);
    var triggerWords = promptCounts.filter((item) => item.counts == storage.length).map((item) => item.key);
    document.getElementById("Analysis-TriggerWords").textContent = triggerWords.join(", ");
    document.getElementById("Analysis-TotalImages").textContent = String(storage.length);
    $("#AnalysisModal").modal('show');
}
$("#AnalysisModal").on('shown.bs.modal', function () {
    analysisChart.resize();
});
function onNavbarExportClick() {
    if (storage.length == 0) {
        alert("No images loaded!");
        return;
    }
    const zip = new JSZip();
    storage.forEach((item) => {
        const prompt = item.PromptLists.join(", ");
        const textContent = new TextEncoder().encode(prompt);
        const blob = new Blob([textContent], { type: "text/plain" });
        zip.file(item.PromptFilename, blob, { binary: true });
    });
    zip.generateAsync({ type: "blob" }).then(content => {
        saveAs(content, "export.zip");
    });
}
//# sourceMappingURL=navActions.js.map