import { renderTree } from "@/libs/render-tree";
import type { SctAst } from "@/libs/sct";

function renderTxt(ast: SctAst) {
	return `${renderTree(ast.root)}\n`;
}

export { renderTxt };
