# SCT

SCT, short for Software Construction Tree, is a CLI for creating and maintaining
`.sct` documents. An SCT document describes the planned folder and file structure
of a software project in a small, readable syntax that can be rendered as a
terminal tree, HTML preview, or text file.

It is meant to sit between project planning and implementation: a lightweight
artifact that communicates how a project should be shaped before every file has
to exist on disk.

## Installation

```bash
npm install -g sct
```

After installation, the CLI is available as:

```bash
sct
```

## Quick Start

Create a new SCT document interactively:

```bash
sct init
```

Create one immediately with defaults:

```bash
sct init -y
```

Create one with specific metadata:

```bash
sct init -y --name ApiProject --language csharp --framework aspnet-core
```

SCT files are written to `.out/` by default.

## Example `.sct` File

```sct
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
sct init
sct init -y
sct init --yes
sct init --y
```

`init` creates a new `.sct` document. The `-y` and `--yes` flags skip prompts and
use defaults for missing values.

### Add

Add a file:

```bash
sct add file users.controller.ts src/modules/users
```

Add a folder:

```bash
sct add folder users src/modules
```

Use the shorthand file form:

```bash
sct add users.controller.ts src/modules/users
```

Add multiple files or folders at once:

```bash
sct add file -c users.controller.ts users.service.ts -d src/modules/users
sct add folder -c users posts comments -d src/modules
```

### Remove

Remove every matching file or folder name:

```bash
sct rm users.controller.ts
```

Remove a matching entry under a specific folder:

```bash
sct rm users.controller.ts src/modules/users
```

If the target is a folder, the folder and its children are removed from the SCT
tree.

### Render

Render the tree in the terminal:

```bash
sct render
```

Render an HTML preview:

```bash
sct render --html
```

Render a text preview file:

```bash
sct render --txt
```

Preview files are written to `.out/` beside the `.sct` file.

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

- [SCT intro](docs/intro.v2.md)
- [SCT v2 specification](docs/rules.v2.md)

## Status

SCT is early and evolving. The current release focuses on project metadata,
files, folders, templates, add/remove commands, and preview rendering.
