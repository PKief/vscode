/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MainContext, MainThreadLocalizationShape } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IFileService } from '../../../platform/files/common/files.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { ILanguagePackService } from '../../../platform/languagePacks/common/languagePacks.js';
import { IExtensionService } from '../../../platform/extensions/common/extensions.js';
import { ILogService } from '../../../platform/log/common/log.js';

@extHostNamedCustomer(MainContext.MainThreadLocalization)
export class MainThreadLocalization extends Disposable implements MainThreadLocalizationShape {

	constructor(
		extHostContext: IExtHostContext,
		@IFileService private readonly fileService: IFileService,
		@ILanguagePackService private readonly languagePackService: ILanguagePackService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@ILogService private readonly logService: ILogService
	) {
		super();
	}

	async $fetchBuiltInBundleUri(id: string, language: string): Promise<URI | undefined> {
		try {
			const uri = await this.languagePackService.getBuiltInExtensionTranslationsUri(id, language);
			return uri;
		} catch (e) {
			return undefined;
		}
	}

	async $fetchBundleContents(uriComponents: UriComponents): Promise<string> {
		const contents = await this.fileService.readFile(URI.revive(uriComponents));
		return contents.value.toString();
	}

	async $fetchLocalizationBundleUri(id: string, language: string): Promise<URI | undefined> {
		try {
			const extension = await this.extensionService.getExtension(id);
			if (!extension) {
				this.logService.warn(`Extension ${id} not found`);
				return undefined;
			}

			const l10nPath = extension.packageJSON.l10n;
			if (l10nPath) {
				const l10nUri = URI.joinPath(extension.extensionLocation, l10nPath, `package.l10n.${language}.json`);
				if (await this.fileService.exists(l10nUri)) {
					return l10nUri;
				}
			}

			const nlsUri = URI.joinPath(extension.extensionLocation, `package.nls.${language}.json`);
			if (await this.fileService.exists(nlsUri)) {
				return nlsUri;
			}

			return undefined;
		} catch (e) {
			this.logService.error(e);
			return undefined;
		}
	}
}
