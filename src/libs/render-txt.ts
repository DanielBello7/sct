import { renderTree } from "@/libs/render-tree";
import type { SctreeAst } from "@/libs/sctree";

function renderTxt(ast: SctreeAst) {
	return `${renderTree(ast.root)}\n`;
}

export { renderTxt };
