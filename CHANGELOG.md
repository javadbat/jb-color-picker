# Changelog


## [1.0.0] - 2026-09-03

### Changed

- Standardized private DOM event handlers on the `#on<Target><Event>()` naming convention.
- Breaking: renamed the picker root part from `wrapper` to `root`.
## [0.2.0] 2026-08-31

### Changed

- Made custom-element module evaluation SSR-safe by extending `JBBaseComponent` where needed and registering elements through the shared `defineWebComponent()` helper; raised the minimum `jb-core` version to `0.35.0`.
