export enum PZPanMouseButton {
	Left = 0,
}

export class PanzoomConfig {
	public button = PZPanMouseButton.Left;
}

export interface PZNodeDataType {
	nodeType: string;
	panX: number;
	panY: number;
	panScale: number;
}

// must expose in node component
export interface PZNodeType {
	GetData(): PZNodeDataType;
	GetHTMLElem(): HTMLElement;

	OnMouseDown(e: PointerEvent);
	OnMouseMove(e: PointerEvent);
	OnMouseUp(e: PointerEvent);

	SetPanScale(value: number);
}

export class PZNodeDataBase implements PZNodeDataType {
	public nodeType: string;
	public panX: number;
	public panY: number;
	public panScale: number;

	constructor() {
		this.nodeType = '';
		this.panX = 0;
		this.panY = 0;
		this.panScale = 1;
	}
}