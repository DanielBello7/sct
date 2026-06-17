# SCTree

SCTree is the language and CLI for Software Construction Tree documents.

Software Construction Tree, or SCT, is the design system. SCTree is the notation
used to describe a project structure in `.sctree` files. An SCTree document
describes the planned folder and file structure of a software project in a small,
readable syntax that can be rendered as a terminal tree, HTML preview, or text
file.

It is meant to sit between project planning and implementation: a lightweight
artifact that communicates how a project should be shaped before every file has
to exist on disk.

## Installation

Install globally:

```bash
npm install -g sctree-cli
```

When npm's global binary directory is on your `PATH`, the command is available
as:

```bash
sctree
```

If your shell cannot find `sctree`, check npm's global install prefix:

```bash
npm prefix -g
```

On macOS/Linux, global binaries are usually inside the `bin` folder under that
prefix. Make sure that folder is included in your `PATH`.

You can also run the `sctree` binary without a global install:

```bash
npx sctree-cli --help
npx sctree-cli init
```

## Quick Start

Create a new SCTree document interactively:

```bash
sctree init
```

Create one immediately with defaults:

```bash
sctree init -y
```

Create one with specific metadata:

```bash
sctree init -y --name ApiProject --language csharp --framework aspnet-core
```

Scan an existing project into an SCTree document:

```bash
sctree scan --name ExistingProject
```

SCTree files are written to `.out/` by default.

## Example `.sctree` File

```sctree
name                    = "Project"
type                    = "none"
language                = "typescript"
framework               = "none"
version                 = "0.1.0"
description             = "A planned project structure."

root Project {
  file .gitignore
  folder src {
    file index.ts
  }
}
```

## Commands

### Init

```bash
sctree init
sctree init -y
sctree init --yes
sctree init --y
```

`init` creates a new `.sctree` document, plus `.sctreeignore` and `sctree.config.json` in
the project root. The `-y` and `--yes` flags skip prompts and use defaults for
missing values.

### Add

Add a file:

```bash
sctree add file users.controller.ts src/modules/users
```

Add a folder:

```bash
sctree add folder users src/modules
```

Use the shorthand file form:

```bash
sctree add users.controller.ts src/modules/users
```

Add multiple files or folders at once:

```bash
sctree add file -c users.controller.ts users.service.ts -d src/modules/users
sctree add folder -c users posts comments -d src/modules
```

### Remove

Remove every matching file or folder name:

```bash
sctree rm users.controller.ts
```

Remove a matching entry under a specific folder:

```bash
sctree rm users.controller.ts src/modules/users
```

If the target is a folder, the folder and its children are removed from the SCTree
tree.

### Scan

Generate a `.sctree` document from the current project structure:

```bash
sctree scan
```

Set metadata while scanning:

```bash
sctree scan --name ApiProject --language csharp --framework aspnet-core
```

Overwrite an existing generated file:

```bash
sctree scan --force
```

### Update

Scan the current project and add missing filesystem entries to the active `.sctree`
document:

```bash
sctree update
```

### Render

Render the tree in the terminal:

```bash
sctree render
```

Render an HTML preview:

```bash
sctree render --html
```

Render a text preview file:

```bash
sctree render --txt
```

Preview files are written to `.out/` beside the `.sctree` file.

## Ignore And Config Files

Use `.sctreeignore` to exclude paths from `sctree scan` and `sctree update`.

```text
node_modules
dist
.out
coverage
```

Use `sctree.config.json` to opt into filesystem changes when `sctree add` or `sctree rm`
is called.

```json
{
	"filesystem": {
		"applyOnAdd": false,
		"applyOnRemove": false
	}
}
```

Both settings default to `false`, so add/remove only update the `.sctree` document
unless you explicitly enable filesystem changes.

## Supported Options

Current language options:

- `typescript`
- `javascript`
- `csharp`

Current framework options are language-dependent.

TypeScript:

- `none`
- `node`
- `express`
- `nestjs`
- `react`

JavaScript:

- `none`
- `node`
- `express`
- `react`

C#:

- `none`
- `aspnet-core`

## Documentation

For more details about the language, syntax, parser rules, templates, and design
direction, see:

- [SCTree intro](docs/intro.v2.md)
- [SCTree v2 specification](docs/rules.v2.md)
