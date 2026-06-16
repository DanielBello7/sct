import { Command } from "commander";
import { add } from "@/features/add.ts";
import { init, type InitOptions } from "@/features/init.ts";
import { render } from "@/features/render.ts";
import { rm } from "@/features/rm.ts";

const program = new Command();

program
	.name("sctree")
	.description("Create and maintain Software Construction Tree files.")
	.version("0.1.0", "-V, --cli-version", "Output the sctree CLI version.");

program
	.command("init")
	.description("Start a new .sctree project definition.")
	.option("--name <name>", "Project/root folder name")
	.option("--type <type>", "Project type")
	.option("--language <language>", "Project language")
	.option("--framework <framework>", "Project framework")
	.option("--version <version>", "Project version")
	.action(async (options: InitOptions) => {
		console.log("hi init", options);
		// await init(options);
	});

program
	.command("add")
	.description("Add a file entry to the .sctree document tree.")
	.argument("<filename>", "File name to add")
	.argument("<location>", "Folder path where the file belongs")
	.action(async (filename: string, location: string) => {
		console.log("hi add", filename, location);
		// await add(filename, location);
	});

program
	.command("rm")
	.description("Remove file or folder entries from the .sctree document tree.")
	.argument("<name>", "File or folder name to remove")
	.argument("[location]", "Optional folder path to remove from")
	.action(async (name: string, location?: string) => {
		console.log("hi rm", name, location);
		// await rm(name, location);
	});

program
	.command("render")
	.description("Render the .sctree document tree.")
	.action(async () => {
		console.log("hi render");
		// await render();
	});

program.parseAsync();
