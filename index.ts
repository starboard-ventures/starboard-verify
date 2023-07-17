import { extendConfig } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";

import "./src/tasks/starboard-verify";
import "./src/type-extensions";

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    config.starboardConfig = userConfig.starboardConfig!;
  }
);

export * from "./src/types";
