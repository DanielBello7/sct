import { file, folder, type TreeNode } from "@/templates/utils.ts";

export function javascriptReactTemplate(projectName: string): TreeNode {
	return folder(projectName, [
		file("pnpm-lock.yaml"),
		file("package.json"),
		file(".gitignore"),
		folder("src", [file("App.js")]),
	]);
}
