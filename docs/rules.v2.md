# SCTree v2 Specification

## Identity

System name: Software Construction Tree

System short name: SCT

Language name: SCTree

CLI command: `sctree`

File extension: `.sctree`

Default output directory: `.out`

## Purpose

An SCTree document describes the intended folder and file structure of a software
project inside the Software Construction Tree design system. The document is both
a source artifact and a renderable preview target.

The source file should remain plain, deterministic, and easy to edit by hand.

## Reserved Keywords

The following words are reserved and cannot be used as file or folder
identifiers:

1. `name`
2. `type`
3. `language`
4. `framework`
5. `version`
6. `author`
7. `description`
8. `root`
9. `file`
10. `folder`

## Metadata

Metadata appears at the top of the document before the tree body.

Supported metadata keys:

1. `name`
2. `type`
3. `language`
4. `framework`
5. `version`
6. `author`
7. `description`

Metadata values are quoted strings.

The equals sign should be aligned using the formatter.

```sctree
name                    = "Project"
type                    = "none"
language                = "typescript"
framework               = "none"
version                 = "0.1.0"
author                  = "Daniel"
description             = "A planned project structure."
```

### Default Metadata

When `sctree init -y` is used, missing metadata uses these defaults:

```sctree
name                    = "Project"
type                    = "none"
language                = "typescript"
framework               = "none"
version                 = "0.1.0"
```

`author` and `description` are omitted unless provided.

## Structure Keywords

SCTree v2 has three structure keywords:

1. `root`
2. `folder`
3. `file`

`root` declares the single top-level project folder.

`folder` declares a folder node.

`file` declares a file node.

## Tree Syntax

Every SCTree document must contain exactly one root declaration.

```sctree
root Project {
  file .gitignore
  folder src {
    file index.ts
  }
}
```

Folders use braces to contain children.

Files cannot contain children.

## Complete Example

```sctree
name                    = "BlogApi"
type                    = "service"
language                = "typescript"
framework               = "express"
version                 = "0.1.0"
description             = "A simple blog API project structure."

root BlogApi {
  file .env
  file .env.example
  file .gitignore
  file package.json
  file pnpm-lock.yaml
  file tsconfig.json

  folder src {
    file app.ts
    file server.ts
    folder modules {
      folder posts {
        file posts.controller.ts
        file posts.router.ts
        file posts.service.ts
      }
      folder users {
        file users.controller.ts
        file users.router.ts
        file users.service.ts
      }
    }
  }

  folder test {
    file app.spec.ts
  }
}
```

## Ordering Rules

The formatter controls output order.

Within every folder:

1. Files come first.
2. Files are sorted alphabetically.
3. Folders come after files.
4. Folders are sorted alphabetically.
5. Nested folders follow the same rules recursively.

Example:

```sctree
root Project {
  file .gitignore
  file package.json
  folder src {
    file app.ts
    folder modules {
    }
  }
}
```

## Identifiers

Folder names may contain:

- letters
- numbers
- underscores
- hyphens
- periods

File names may contain any valid filesystem filename.

Reserved keywords cannot be used as file or folder identifiers.

## Comments

Lines beginning with `#` are comments.

Comments are ignored by the parser.

```sctree
# This is ignored.
root Project {
  file package.json
}
```

## Parser Guarantees

The parser guarantees:

1. A document must contain exactly one root declaration.
2. Root declarations cannot be nested.
3. Top-level folders must use `root`.
4. Files cannot contain child nodes.
5. Folders may contain files and folders.
6. Unknown keywords produce parser errors.
7. Documents are parsed from top to bottom.
8. Comments and empty lines are ignored.

## Renderer Behavior

SCTree documents may be rendered in multiple presentation formats.

Terminal render:

```bash
sctree render
```

Example output:

```text
Project
├─ .gitignore
└─ src
   └─ index.ts
```

HTML render:

```bash
sctree render --html
```

The HTML preview shows:

1. Project title
2. Project description, if provided
3. Metadata table
4. Rendered project tree

The description is displayed under the title and is not repeated in the metadata
table.

## CLI Rules

### Init

`sctree init` starts the interactive project setup.

```bash
sctree init
```

`init` creates:

1. a `.sctree` document in `.out/`
2. a `.sctreeignore` file in the project root
3. a `sctree.config.json` file in the project root

`sctree init -y` skips prompts and uses defaults for missing options.

```bash
sctree init -y
sctree init --yes
sctree init --y
```

Options may override defaults:

```bash
sctree init -y --name ApiProject --language csharp --framework aspnet-core
```

### Add

Files may be added explicitly:

```bash
sctree add file users.controller.ts src/modules/users
```

Folders may be added explicitly:

```bash
sctree add folder users src/modules
```

The shorthand add form assumes `file`:

```bash
sctree add users.controller.ts src/modules/users
```

Multiple entries may be added with `--content` and `--destination`.

```bash
sctree add file -c users.controller.ts users.service.ts -d src/modules/users
sctree add folder -c users posts comments -d src/modules
```

By default, `add` only updates the `.sctree` document. It creates real files or
folders only when `filesystem.applyOnAdd` is enabled in `sctree.config.json`.

### Remove

Remove all matching entries by name:

```bash
sctree rm users.controller.ts
```

Remove a matching entry under a specific folder:

```bash
sctree rm users.controller.ts src/modules/users
```

If the target is a folder, the folder and its contents are removed from the
SCTree document tree.

By default, `rm` only updates the `.sctree` document. It removes real files or
folders only when `filesystem.applyOnRemove` is enabled in `sctree.config.json`.

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

`scan` reads the current working directory and writes a new `.sctree` file to
`.out/`.

### Update

Add missing filesystem entries to the active `.sctree` document:

```bash
sctree update
```

`update` scans the current working directory, compares it with the active `.sctree`
document, and adds entries that exist on disk but are missing from the document.
It does not remove extra entries from the `.sctree` document.

## Ignore Rules

`.sctreeignore` controls paths ignored by `scan` and `update`.

```text
node_modules
dist
build
coverage
.out
```

Lines beginning with `#` are comments.

SCT also ignores common generated paths by default:

- `.git`
- `.DS_Store`
- `.out`
- `node_modules`
- `dist`
- `build`
- `coverage`

## Config Rules

`sctree.config.json` controls project-level SCT behavior.

Default config:

```json
{
  "filesystem": {
    "applyOnAdd": false,
    "applyOnRemove": false
  }
}
```

When `applyOnAdd` is `true`, `sctree add` also creates the requested files or
folders on disk.

When `applyOnRemove` is `true`, `sctree rm` also removes matching files or folders
from disk.

Both options default to `false`.

## Template Rules

Templates are selected by language and framework.

Template folders should follow this structure:

```text
src/templates/<language>/<framework>/index.ts
```

Examples:

```text
src/templates/typescript/react/index.ts
src/templates/typescript/node/index.ts
src/templates/csharp/aspnet-core/index.ts
```

If no matching template exists, the basic template is used.

## Current Language Options

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

## Compatibility Notes

SCT v2 keeps the core v1 syntax small:

- metadata at the top
- one root
- files
- folders
- comments
- deterministic formatting

Future features should not make simple project trees harder to read.
