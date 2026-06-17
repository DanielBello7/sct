### SOFTWARE CONSTRUCTION TREE

Software like everything else requires a rigorus design process before any
actual code is written down, but due to the low or non-immediate consequence of
rushing into writing code before proper designing developers skip a large chunk
of the designing process if not the whole thing and just go with the flow
or best case - design as they write the code.

The software construction tree is a design document aimed at improving the
understanding of a piece of software by providing a visual representation of the
project document tree. Every piece of software during development is just a series of
files or documents nested at different levels of folders, but with each file holding
a section of the software code and each folder holding a grouped section of files,
usually by a certain pattern.

Usually during the design process you have multiple stages before coding actually starts,
idea, documentation of the idea, extraction of key goals and functions of the software from the idea,
breakdown of the idea into distinct key features, tooling decisions, role assignments, process
setups and then the writing of the actual code. I believe one part of this that is actually missing is the
construction tree.

Just like an architect/building engineer lists out the bill of materials before the construction
of a building i believe softwares are supposed to have a tree describing all the required files
and folders for this project before the development of the project can begin. This
can and should be placed after the toolings have been decided and just before roles are assigned
to team members on a particular project.

This part of the design process can aid engineers by;

- Providing a complete visualization of the project before a single line of code is written.
- Providing team members with a quick and recognizable design pattern that is to be used for the project, reducing amiguity during developmemt.
- Providing an accountability table that helps keep engineers/team-members upto date with what has been done.
- Providing a simple and understandable document for non-engineers to use when trying to follow the development process.
- Providing new engineers joining a team a quick understanding and scale through of the whole project even before seeing the whole project.
- Providing a context document for Ai agents, it would immediately convey the intention and idea of the project, letting the Ai know what should be where and what should exist.

This project aims at creating a tool that can help engineers during the
software construction tree design process by providing tools that create and maintain an
artifact document known as the software construction tree document which would contain
the tree information,

The software construction tree document `(.sct)` is a document that contains all the information about the project structure
would have a presentaion mode which would look very similar to the usual
tree design but also have a markdown mode which would contain the actual implementation for the presentation.

The tool would be able to;

- Create a `.sct` document for a new project with no folders or documents.
- Create a `.sct` document for a project already existing without one.
- Update the existing `.sct` document.
- Modify segments of an existing `.sct` document.
- Create `.sct` documents using templates.
- Create a presentation document for the `.sct` document.
- Aid in syntax highlighting for the `.sct` document.
- Create actual files or just stick to modifying and manipulating the `.sct` document.
- Aid to format `.sct` documents.
  etc

The templates help in generating initial files or just generating initial
scafolding in the document based on a design pattern.

## Core Features

folder
file
metadata

## Future Features

module
import
template
dependency
owner
tag
description

## Language Goals

1.  Human Readable
2.  AI Readable
3.  Easily Parsed
4.  Easily Generated
5.  Framework Agnostic
6.  Language Agnostic
7.  Git Friendly
8.  Deterministic
9.  Scalable to Large Projects
10. Presentation Friendly

## Presentation Mode

Every SCT document has two representations:

1. Source Representation (Editable SCT syntax).
2. Presentation Representation (Rendered filesystem tree).

<!-- prettier-ignore-start -->

Example;

folder src {
  file app.ts
}

renders as;
src
└─ app.ts

<!-- prettier-ignore-end -->
