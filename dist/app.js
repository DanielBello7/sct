import { Command } from "commander";
import { add } from "./features/add.js";
import { init } from "./features/init.js";
import { render } from "./features/render.js";
import { rm } from "./features/rm.js";
const program = new Command();
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
    .action(async (options) => {
    await init(options);
});
program
    .command("add")
    .description("Add a file entry to the .sct document tree.")
    .argument("<filename>", "File name to add")
    .argument("<location>", "Folder path where the file belongs")
    .action(async (filename, location) => {
    await add(filename, location);
});
program
    .command("rm")
    .description("Remove file or folder entries from the .sct document tree.")
    .argument("<name>", "File or folder name to remove")
    .argument("[location]", "Optional folder path to remove from")
    .action(async (name, location) => {
    await rm(name, location);
});
program
    .command("render")
    .description("Render the .sct document tree.")
    .action(async () => {
    await render();
});
program.parseAsync();
//# sourceMappingURL=app.js.map