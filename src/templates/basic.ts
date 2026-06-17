import type { TreeNode } from "@/libs/sct";
import { file, folder } from "./utils";

export function basicTemplate(projectName: string): TreeNode {
	return folder(projectName, [file(".gitignore"), folder("src")]);
}
