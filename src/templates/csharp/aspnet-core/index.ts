import { file, folder, type TreeNode } from "@/templates/utils";

export function csharpAspnetCoreTemplate(projectName: string): TreeNode {
	return folder(projectName, [
		file(`${projectName}.sln`),
		file(".gitignore"),
		folder("src", [
			folder(projectName, [
				file(`${projectName}.csproj`),
				file("Program.cs"),
				file("appsettings.json"),
				folder("Controllers"),
				folder("Properties", [file("launchSettings.json")]),
			]),
		]),
	]);
}
