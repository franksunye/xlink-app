# App Dependency Inventory

This repository is an app-only Git import from the original SVN `code/app` tree.
Several app projects use uni-app / HBuilderX conventions where third-party
plugins are stored inside the project tree. Not every third-party-looking
directory is disposable build output.

## Keep In Git

### App Source

Top-level app folders such as `business/`, `business_jishi/`, `consumer/`,
`consumer_jishi/`, `smartTraining/`, `supplier/`, `tools-survey/`, `uni-admin/`,
`uniCloud/`, and `T/` are treated as source roots unless proven otherwise.

### `uni_modules/`

`uni_modules/` directories are DCloud / uni-app plugin directories. They often
contain plugin source, native UTS code, Android/iOS plugin configuration, and
runtime assets required by HBuilderX builds.

Examples currently referenced by app source include:

- `business/uni_modules/bw-calendar-event`
- `business/uni_modules/android-keeplive`
- `business/uni_modules/uni-registerRequestPermissionTips`
- `business/uni_modules/lime-painter`
- `business/uni_modules/lime-shared`

Do not delete or globally ignore `uni_modules/` without first proving each
plugin can be restored from a package manager or plugin registry with the exact
same version and local modifications.

### `wxcomponents/`

`wxcomponents/` directories contain WeChat mini-program custom components and
vendored component source. They are referenced directly by app code and
configuration.

Examples currently referenced by `business/` include:

- `business/wxcomponents/vant`
- `business/wxcomponents/tki-qrcode`
- `business/wxcomponents/l-echart`
- `business/wxcomponents/miniprogram_dist`

`miniprogram_dist` looks like generated output, but current business code imports
from it directly, so it must remain tracked until that dependency is replaced.

## Keep Out Of Git

These directories are local caches or generated output and should remain ignored:

- `node_modules/`
- `unpackage/`
- `dist/`
- `.env`, `.env.*` except `.env.example`
- local IDE/tooling files such as `.DS_Store`, `.idea/`, `.vscode/`

The repository has already been cleaned so these directories should not be
present after a fresh checkout, except when generated locally by HBuilderX or
package tooling.

## Local Secrets

Runtime credentials must not be committed. Use per-app `.env.local` files for
local development and keep committed `.env.example` files as templates.

For Alibaba Cloud NLS credentials, the current local variable names are:

- `VUE_APP_ALIBABA_CLOUD_ACCESS_KEY_ID`
- `VUE_APP_ALIBABA_CLOUD_ACCESS_KEY_SECRET`
- `VUE_APP_ALIBABA_CLOUD_APP_KEY`

Long term, these credentials should move behind a backend token service instead
of being bundled into front-end app code.

## Maintenance Rules

1. Before deleting a third-party-looking directory, search for direct imports,
   `pages.json` component mappings, native plugin references, and HBuilderX
   manifest references.
2. Treat `uni_modules/` and `wxcomponents/` as source dependencies until an exact
   replacement path is documented and verified.
3. Prefer small, explicit dependency migrations over broad cleanup commits.
4. Keep generated output and package caches out of Git.
5. When adding or updating a plugin, record its source, version, and any local
   modifications in this file or a follow-up dependency inventory document.
