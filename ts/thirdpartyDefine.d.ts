/** JQuery */
declare function $(str: string): any;

/** JSZip */
declare class JSZip {
    file(filename: string, blob: Blob, options: any): void;
    generateAsync(options: any): Promise<Blob>;
}

/** FileSaver */
declare function saveAs(blob: Blob, filename: string): void;

/** EChats */
interface ECharts extends HTMLElement {
    setOption(data: any): void;
    init(elem: HTMLElement): ECharts;
    resize(): void;
}
declare let echarts: ECharts;