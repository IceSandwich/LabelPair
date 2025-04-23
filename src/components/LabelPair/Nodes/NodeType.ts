import { PZNodeDataBase } from "@/components/Panzoom/Type";

export class TagNodeData extends PZNodeDataBase{
	public label: string;
	constructor() {
		super();
		this.nodeType = 'TagNode';
		this.label = "";
	}
}