import type { InitOptions } from "@/types";
import { Command } from "commander";
import { addMany, type AddKind } from "@/features/add";
import { init } from "@/features/init";
import { render, type RenderOptions } from "@/features/render";
import { rm } from "@/features/rm";

const program = new Command();

type AddOptions = {
	content?: string[];
	destination?: string;
};

function resolveAddInput(
	kindOrName: string | undefined,
	nameOrLocation: string | undefined,
	locationArg: string | undefined,
	options: AddOptions,
) {
	const hasKind = kindOrName === "file" || kindOrName === "folder";
	const kind: AddKind = hasKind ? kindOrName : "file";
	const name = hasKind ? nameOrLocation : kindOrName;
	const location = hasKind ? locationArg : nameOrLocation;
	const usesBatch = Boolean(options.content || options.destination);

	if (usesBatch) {
		if (!options.content?.length || !options.destination) {
			throw new Error("Use both --content and --destination for batch add.");
		}

		return {
			kind,
			names: options.content,
			location: options.destination,
		};
	}

	if (!name || !location) {
		throw new Error("Provide <name> <location> or use --content with --destination.");
	}

	return {
		kind,
		names: [name],
		location,
	};
}

async function addFromInput(
	kindOrName: string | undefined,
	nameOrLocation: string | undefined,
	location: string | undefined,
	options: AddOptions,
) {
	const input = resolveAddInput(kindOrName, nameOrLocation, location, options);
	await addMany(input.names, input.location, input.kind);
}

program
	.name("sct")
	.description("Create and maintain Software Construction Tree files.")
	.version("0.1.0", "-V, --cli-version", "Output the sct CLI version.");

/**
 * the options just collect the required information from the cli
 * if they aren't there it won't find anything and won't print anything
 */
program
	.command("init")
	.description("Start a new .sct project definition.")
	.option("--name <name>", "Project/root folder name")
	.option("--type <type>", "Project type")
	.option("--language <language>", "Project language")
	.option("--framework <framework>", "Project framework")
	.option("--version <version>", "Project version")
	.option("--author <author>", "Project author")
	.option("--description <description>", "Project description")
	.option("-y, --yes", "Skip prompts and use defaults for missing options")
	.option("--y", "Alias for --yes")
	.action(async (options: InitOptions) => {
		await init({ ...options, yes: Boolean(options.yes || options.y) });
	});

const addCommand = program
	.command("add")
	.description("Add file or folder entries to the .sct document tree.")
	.argument("[name]", "File name to add")
	.argument("[target]", "Folder path, or name when using file/folder kind")
	.argument("[location]", "Folder path when using file/folder kind")
	.option("-c, --content <names...>", "Names to add")
	.option("-d, --destination <location>", "Folder path where entries belong")
	.action(async (
		name: string | undefined,
		target: string | undefined,
		location: string | undefined,
		options: AddOptions,
	) => {
		try {
			await addFromInput(name, target, location, options);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Invalid add command.";
			addCommand.error(message);
		}
	});

program
	.command("rm")
	.description("Remove file or folder entries from the .sct document tree.")
	.argument("<name>", "File or folder name to remove")
	.argument("[location]", "Optional folder path to remove from")
	.action(async (name: string, location?: string) => {
		await rm(name, location);
	});

program
	.command("render")
	.description("Render the .sct document tree.")
	.option("--html", "Render an HTML preview file")
	.option("--txt", "Render a text preview file")
	.action(async (options: RenderOptions) => {
		await render(options);
	});

program.parseAsync();
