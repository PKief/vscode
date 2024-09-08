# Configuration Editing Extension

This extension provides capabilities (advanced IntelliSense, auto-fixing) in configuration files like settings, launch, and extension recommendation files.

## New `l10n` Property in `package.json`

The `package.json` file now includes a `l10n` property to specify the subdirectory for `package.l10n.json` and `package.l10n.*.json` files. This allows you to organize your localization files in a subdirectory instead of placing them in the root directory.

### Example

Here is an example of how to use the `l10n` property in your `package.json` file:

```json
{
  "name": "my-extension",
  "displayName": "My Extension",
  "description": "An example extension",
  "version": "1.0.0",
  "publisher": "my-publisher",
  "engines": {
    "vscode": "^1.60.0"
  },
  "l10n": "l10n",
  "contributes": {
    "configuration": {
      "type": "object",
      "title": "My Extension Configuration",
      "properties": {
        "myExtension.someSetting": {
          "type": "string",
          "default": "default value",
          "description": "A setting for my extension"
        }
      }
    }
  }
}
```

In this example, the `l10n` property specifies that the localization files are located in the `l10n` subdirectory. You can place your `package.l10n.json` and `package.l10n.*.json` files in this subdirectory.

### Backwards Compatibility

The extension maintains backwards compatibility for `package.nls.*.json` files in the root directory. If you do not specify the `l10n` property in your `package.json` file, the extension will continue to look for `package.nls.*.json` files in the root directory.

### Benefits

- Organize your localization files in a subdirectory for better project structure.
- Maintain backwards compatibility with existing `package.nls.*.json` files.
