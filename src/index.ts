import {
  Client,
  Module,
  Args_tryResolveUri,
  Args_getFile,
  UriResolver_MaybeUriOrManifest,
  Bytes,
  manifest,
} from "./wrap";

import { PluginFactory } from "@polywrap/core-js";
import { OcrId, decodeOcrIdFromContenthash } from "@nerfzael/ocr-core";

export type Address = string;

export interface Addresses {
  [network: string]: Address;
}

export interface OcrEnsContenthashResolverPluginConfig {
}

export class OcrEnsContenthashResolverPlugin extends Module<OcrEnsContenthashResolverPluginConfig> {
  constructor(config?: OcrEnsContenthashResolverPluginConfig) {
    super(config ?? {});
  }

  async tryResolveUri(
    args: Args_tryResolveUri,
    client: Client
  ): Promise<UriResolver_MaybeUriOrManifest | null> {
    let ocrId: OcrId;

    if (args.authority === "ens-contenthash") {
      const result = decodeOcrIdFromContenthash(args.path);

      if (!result) {
        return this.notFound();
      }

      return {
        uri: `wrap://ocr/${result.protocolVersion}/${result.chainId}/${result.contractAddress}/${result.packageIndex}/${result.startBlock}/${result.endBlock}`,
      };
    } else {
      return this.notFound();
    }
  }

  async getFile(args: Args_getFile, _client: Client): Promise<Bytes | null> {
    return null;
  }

  private notFound(): UriResolver_MaybeUriOrManifest {
    return { uri: null, manifest: null };
  }
}

export const ocrEnsContenthashResolverPlugin: PluginFactory<OcrEnsContenthashResolverPluginConfig> = (
  config?: OcrEnsContenthashResolverPluginConfig
) => {
  return {
    factory: () => new OcrEnsContenthashResolverPlugin(config),
    manifest,
  };
};

export const plugin = ocrEnsContenthashResolverPlugin;
