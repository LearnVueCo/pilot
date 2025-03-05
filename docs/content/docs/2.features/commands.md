---
title: Commands (Slash Menu)
subheading: Create a Notion-like slash menu
---

Pilot provides a `Commands` component and `CommandExtension` that allows you to create a Notion-like slash menu.

::info
The `CommandExtension` will automatically be registered when using the `Commands` component in your app.
::

## Usage

The `Commands` component accepts a `commands` prop, which is an array of commands. And exposes a default slot that exposes the following properties:

- `editor`: The editor instance.
- `commands`: The commands array.
- `selectedIndex`: The index of the selected command.
- `selectItem`: The function to select an item by index.

Using these, you can create your custom UI for displaying your commands, selecting them, and changing the UI for the selected command.

## Commands Array

The `Commands` component accepts a `commands` prop, which is an array of commands.

Each command is an object that contains the following properties:

- `name`: The name of the command.
- `label`: The label of the command.
- `icon`: The icon of the command.
- `command`: The command to execute.
