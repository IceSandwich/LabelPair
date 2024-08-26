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
interface EChartsResizeOptions {
    width: number;
    height: number;
}
interface ECharts extends HTMLElement {
    setOption(data: any): void;
    init(elem: HTMLElement): ECharts;
    resize(options?: EChartsResizeOptions): void;
}
declare let echarts: ECharts;