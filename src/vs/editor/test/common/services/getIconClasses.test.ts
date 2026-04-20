/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { mock } from '../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { getIconClasses, getIconClassesForLanguageId } from '../../../common/services/getIconClasses.js';
import { FileKind } from '../../../../platform/files/common/files.js';
import { ILanguageService } from '../../../common/languages/language.js';
import { IModelService } from '../../../common/services/model.js';

suite('getIconClasses', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const modelService = new class extends mock<IModelService>() {
		override getModel() { return null; }
	};
	const languageService = new class extends mock<ILanguageService>() {
		override getLanguageIdByMimeType(): null { return null; }
		override guessLanguageIdByFilepathOrFirstLine(): null { return null; }
	};

	suite('FileIconInfo shape', () => {

		test('returns classes and attributes for a file resource', () => {
			const result = getIconClasses(modelService, languageService, URI.file('/project/src/app.test.ts'), FileKind.FILE);
			assert.ok(Array.isArray(result.classes));
			assert.ok(result.classes.includes('file-icon'));
			assert.ok(result.attributes);
		});

		test('returns no attributes when resource is undefined', () => {
			const result = getIconClasses(modelService, languageService, undefined, FileKind.FILE);
			assert.ok(result.classes.includes('file-icon'));
			assert.strictEqual(result.attributes, undefined);
		});
	});

	suite('data-file-name attribute', () => {

		test('sets data-file-name for regular files', () => {
			const result = getIconClasses(modelService, languageService, URI.file('/project/app.ts'), FileKind.FILE);
			assert.strictEqual(result.attributes?.['data-file-name'], 'app.ts');
		});

		test('lowercases data-file-name', () => {
			const result = getIconClasses(modelService, languageService, URI.file('/project/MyComponent.TSX'), FileKind.FILE);
			assert.strictEqual(result.attributes?.['data-file-name'], 'mycomponent.tsx');
		});

		test('sets data-file-name for dotfiles', () => {
			const result = getIconClasses(modelService, languageService, URI.file('/project/.env.development'), FileKind.FILE);
			assert.strictEqual(result.attributes?.['data-file-name'], '.env.development');
		});

		test('sets data-file-name for files without extension', () => {
			const result = getIconClasses(modelService, languageService, URI.file('/project/Makefile'), FileKind.FILE);
			assert.strictEqual(result.attributes?.['data-file-name'], 'makefile');
		});
	});

	suite('data-file-ext attribute', () => {

		test('sets data-file-ext to last extension segment', () => {
			const result = getIconClasses(modelService, languageService, URI.file('/project/app.test.ts'), FileKind.FILE);
			assert.strictEqual(result.attributes?.['data-file-ext'], 'ts');
		});

		test('omits data-file-ext for files without extension', () => {
			const result = getIconClasses(modelService, languageService, URI.file('/project/Makefile'), FileKind.FILE);
			assert.strictEqual(result.attributes?.['data-file-ext'], undefined);
		});

		test('omits data-file-ext for bare dotfiles', () => {
			const result = getIconClasses(modelService, languageService, URI.file('/project/.env'), FileKind.FILE);
			assert.strictEqual(result.attributes?.['data-file-ext'], undefined);
		});

		test('sets data-file-ext for dotfiles with extension', () => {
			const result = getIconClasses(modelService, languageService, URI.file('/project/.env.local'), FileKind.FILE);
			assert.strictEqual(result.attributes?.['data-file-ext'], 'local');
		});
	});

	suite('data-folder-name attribute', () => {

		test('sets data-folder-name for folders', () => {
			const result = getIconClasses(modelService, languageService, URI.file('/project/src'), FileKind.FOLDER);
			assert.ok(result.classes.includes('folder-icon'));
			assert.strictEqual(result.attributes?.['data-folder-name'], 'src');
		});

		test('sets data-folder-name for root folders', () => {
			const result = getIconClasses(modelService, languageService, URI.file('/project'), FileKind.ROOT_FOLDER);
			assert.ok(result.classes.includes('rootfolder-icon'));
			assert.strictEqual(result.attributes?.['data-folder-name'], 'project');
		});

		test('omits data-file-name for folders', () => {
			const result = getIconClasses(modelService, languageService, URI.file('/project/src'), FileKind.FOLDER);
			assert.strictEqual(result.attributes?.['data-file-name'], undefined);
		});

		test('omits data-folder-name for files', () => {
			const result = getIconClasses(modelService, languageService, URI.file('/project/app.ts'), FileKind.FILE);
			assert.strictEqual(result.attributes?.['data-folder-name'], undefined);
		});
	});

	suite('getIconClassesForLanguageId', () => {

		test('returns FileIconInfo with classes', () => {
			const result = getIconClassesForLanguageId('typescript');
			assert.ok(result.classes.includes('file-icon'));
			assert.ok(result.classes.includes('typescript-lang-file-icon'));
		});

		test('returns no attributes', () => {
			const result = getIconClassesForLanguageId('typescript');
			assert.strictEqual(result.attributes, undefined);
		});
	});
});
