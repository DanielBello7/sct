# SCT v2 Specification

## Identity

Language name: Software Construction Tree

Short name: SCT

File extension: `.sct`

Default output directory: `.out`

## Purpose

An SCT document describes the intended folder and file structure of a software
project. The document is both a source artifact and a renderable preview target.

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

```sct
name                    = "Project"
type                    = "none"
language                = "typescript"
framework               = "none"
version                 = "0.1.0"
author                  = "Daniel"
description             = "A planned project structure."
```

### Default Metadata

When `sct init -y` is used, missing metadata uses these defaults:

```sct
name                    = "Project"
type                    = "none"
language                = "typescript"
framework               = "none"
version                 = "0.1.0"
```

`author` and `description` are omitted unless provided.

## Structure Keywords

SCT v2 has three structure keywords:

1. `root`
2. `folder`
3. `file`

`root` declares the single top-level project folder.

`folder` declares a folder node.

`file` declares a file node.

## Tree Syntax

Every SCT document must contain exactly one root declaration.

```sct
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

```sct
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

```sct
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

```sct
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

SCT documents may be rendered in multiple presentation formats.

Terminal render:

```bash
sct render
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
sct render --html
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

`sct init` starts the interactive project setup.

```bash
sct init
```

`sct init -y` skips prompts and uses defaults for missing options.

```bash
sct init -y
sct init --yes
sct init --y
```

Options may override defaults:

```bash
sct init -y --name ApiProject --language csharp --framework aspnet-core
```

### Add

Files may be added explicitly:

```bash
sct add file users.controller.ts src/modules/users
```

Folders may be added explicitly:

```bash
sct add folder users src/modules
```

The shorthand add form assumes `file`:

```bash
sct add users.controller.ts src/modules/users
```

Multiple entries may be added with `--content` and `--destination`.

```bash
sct add file -c users.controller.ts users.service.ts -d src/modules/users
sct add folder -c users posts comments -d src/modules
```

### Remove

Remove all matching entries by name:

```bash
sct rm users.controller.ts
```

Remove a matching entry under a specific folder:

```bash
sct rm users.controller.ts src/modules/users
```

If the target is a folder, the folder and its contents are removed from the SCT
tree.

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
