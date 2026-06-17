import type { TreeNode } from "@/libs/sct";

export function renderTree(root: TreeNode) {
	return [root.name, ...renderChildren(root.children, "")].join("\n");
}

function renderChildren(children: TreeNode[], prefix: string): string[] {
	return children.flatMap((child, index) => {
		const isLast = index === children.length - 1;
		const connector = isLast ? "└─ " : "├─ ";
		const nextPrefix = `${prefix}${isLast ? "   " : "│  "}`;
		const line = `${prefix}${connector}${child.name}`;

		if (child.type === "file") {
			return [line];
		}

		return [line, ...renderChildren(child.children, nextPrefix)];
	});
}
