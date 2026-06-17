import { file, folder, type TreeNode } from "@/templates/utils";

export function typescriptNodeTemplate(projectName: string): TreeNode {
	return folder(projectName, [
		file("package.json"),
		file(".gitignore"),
		folder("src", [file("index.ts")]),
	]);
}
