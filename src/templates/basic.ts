import type { TreeNode } from "@/libs/sctree.ts";
import { file, folder } from "./utils.ts";

export function basicTemplate(projectName: string): TreeNode {
	return folder(projectName, [file(".gitignore"), folder("src")]);
}
