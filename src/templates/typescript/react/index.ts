import { file, folder, type TreeNode } from "@/templates/utils";

export function typescriptReactTemplate(projectName: string): TreeNode {
	return folder(projectName, [
		file("pnpm-lock.yaml"),
		file("package.json"),
		file(".gitignore"),
		folder("src", [file("index.d.ts"), file("App.ts")]),
	]);
}
