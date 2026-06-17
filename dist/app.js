import { Command } from "commander";
import { addMany } from "./features/add.js";
import { init } from "./features/init.js";
import { render } from "./features/render.js";
import { rm } from "./features/rm.js";
import { scan } from "./features/scan.js";
import { update } from "./features/update.js";
const program = new Command();
function resolveAddInput(kindOrName, nameOrLocation, locationArg, options) {
    const hasKind = kindOrName === "file" || kindOrName === "folder";
    const kind = hasKind ? kindOrName : "file";
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
async function addFromInput(kindOrName, nameOrLocation, location, options) {
    const input = resolveAddInput(kindOrName, nameOrLocation, location, options);
    await addMany(input.names, input.location, input.kind);
}
program
    .name("sctree")
    .description("Create and maintain Software Construction Tree files.")
    .version("0.2.0", "-V, --cli-version", "Output the sctree CLI version.");
/**
 * the options just collect the required information from the cli
 * if they aren't there it won't find anything and won't print anything
 */
program
    .command("init")
    .description("Start a new .sctree project definition.")
    .option("--name <name>", "Project/root folder name")
    .option("--type <type>", "Project type")
    .option("--language <language>", "Project language")
    .option("--framework <framework>", "Project framework")
    .option("--version <version>", "Project version")
    .option("--author <author>", "Project author")
    .option("--description <description>", "Project description")
    .option("-y, --yes", "Skip prompts and use defaults for missing options")
    .option("--y", "Alias for --yes")
    .action(async (options) => {
    await init({ ...options, yes: Boolean(options.yes || options.y) });
});
const addCommand = program
    .command("add")
    .description("Add file or folder entries to the .sctree document tree.")
    .argument("[name]", "File name to add")
    .argument("[target]", "Folder path, or name when using file/folder kind")
    .argument("[location]", "Folder path when using file/folder kind")
    .option("-c, --content <names...>", "Names to add")
    .option("-d, --destination <location>", "Folder path where entries belong")
    .action(async (name, target, location, options) => {
    try {
        await addFromInput(name, target, location, options);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Invalid add command.";
        addCommand.error(message);
    }
});
program
    .command("rm")
    .description("Remove file or folder entries from the .sctree document tree.")
    .argument("<name>", "File or folder name to remove")
    .argument("[location]", "Optional folder path to remove from")
    .action(async (name, location) => {
    await rm(name, location);
});
program
    .command("scan")
    .description("Scan the current project and generate a .sctree document.")
    .option("--name <name>", "Project/root folder name")
    .option("--type <type>", "Project type")
    .option("--language <language>", "Project language")
    .option("--framework <framework>", "Project framework")
    .option("--version <version>", "Project version")
    .option("--author <author>", "Project author")
    .option("--description <description>", "Project description")
    .option("--force", "Overwrite an existing generated .sctree file")
    .action(async (options) => {
    await scan(options);
});
program
    .command("update")
    .description("Scan the project and add missing entries to the active .sctree document.")
    .action(async () => {
    await update();
});
program
    .command("render")
    .description("Render the .sctree document tree.")
    .option("--html", "Render an HTML preview file")
    .option("--txt", "Render a text preview file")
    .action(async (options) => {
    await render(options);
});
program.parseAsync();
//# sourceMappingURL=app.js.map