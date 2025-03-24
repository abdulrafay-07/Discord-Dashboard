import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { getRouterManifest } from "@tanstack/react-start/router-manifest";

import { createRouter } from "./router";
import { createClerkHandler } from "@clerk/tanstack-start/server";

const handler = createStartHandler({
  createRouter,
  getRouterManifest,
});

const clerkHandler = createClerkHandler(handler);

export default clerkHandler(defaultStreamHandler);
