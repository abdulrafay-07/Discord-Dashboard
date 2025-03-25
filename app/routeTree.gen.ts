/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as ServersServerIdIndexImport } from './routes/servers/$serverId/index'
import { Route as ServersServerIdMembersImport } from './routes/servers/$serverId/members'
import { Route as AuthSignUpSplatImport } from './routes/_auth/sign-up/$'
import { Route as AuthSignInSplatImport } from './routes/_auth/sign-in/$'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const ServersServerIdIndexRoute = ServersServerIdIndexImport.update({
  id: '/servers/$serverId/',
  path: '/servers/$serverId/',
  getParentRoute: () => rootRoute,
} as any)

const ServersServerIdMembersRoute = ServersServerIdMembersImport.update({
  id: '/servers/$serverId/members',
  path: '/servers/$serverId/members',
  getParentRoute: () => rootRoute,
} as any)

const AuthSignUpSplatRoute = AuthSignUpSplatImport.update({
  id: '/_auth/sign-up/$',
  path: '/sign-up/$',
  getParentRoute: () => rootRoute,
} as any)

const AuthSignInSplatRoute = AuthSignInSplatImport.update({
  id: '/_auth/sign-in/$',
  path: '/sign-in/$',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_auth/sign-in/$': {
      id: '/_auth/sign-in/$'
      path: '/sign-in/$'
      fullPath: '/sign-in/$'
      preLoaderRoute: typeof AuthSignInSplatImport
      parentRoute: typeof rootRoute
    }
    '/_auth/sign-up/$': {
      id: '/_auth/sign-up/$'
      path: '/sign-up/$'
      fullPath: '/sign-up/$'
      preLoaderRoute: typeof AuthSignUpSplatImport
      parentRoute: typeof rootRoute
    }
    '/servers/$serverId/members': {
      id: '/servers/$serverId/members'
      path: '/servers/$serverId/members'
      fullPath: '/servers/$serverId/members'
      preLoaderRoute: typeof ServersServerIdMembersImport
      parentRoute: typeof rootRoute
    }
    '/servers/$serverId/': {
      id: '/servers/$serverId/'
      path: '/servers/$serverId'
      fullPath: '/servers/$serverId'
      preLoaderRoute: typeof ServersServerIdIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/sign-in/$': typeof AuthSignInSplatRoute
  '/sign-up/$': typeof AuthSignUpSplatRoute
  '/servers/$serverId/members': typeof ServersServerIdMembersRoute
  '/servers/$serverId': typeof ServersServerIdIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/sign-in/$': typeof AuthSignInSplatRoute
  '/sign-up/$': typeof AuthSignUpSplatRoute
  '/servers/$serverId/members': typeof ServersServerIdMembersRoute
  '/servers/$serverId': typeof ServersServerIdIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_auth/sign-in/$': typeof AuthSignInSplatRoute
  '/_auth/sign-up/$': typeof AuthSignUpSplatRoute
  '/servers/$serverId/members': typeof ServersServerIdMembersRoute
  '/servers/$serverId/': typeof ServersServerIdIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/sign-in/$'
    | '/sign-up/$'
    | '/servers/$serverId/members'
    | '/servers/$serverId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/sign-in/$'
    | '/sign-up/$'
    | '/servers/$serverId/members'
    | '/servers/$serverId'
  id:
    | '__root__'
    | '/'
    | '/_auth/sign-in/$'
    | '/_auth/sign-up/$'
    | '/servers/$serverId/members'
    | '/servers/$serverId/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AuthSignInSplatRoute: typeof AuthSignInSplatRoute
  AuthSignUpSplatRoute: typeof AuthSignUpSplatRoute
  ServersServerIdMembersRoute: typeof ServersServerIdMembersRoute
  ServersServerIdIndexRoute: typeof ServersServerIdIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthSignInSplatRoute: AuthSignInSplatRoute,
  AuthSignUpSplatRoute: AuthSignUpSplatRoute,
  ServersServerIdMembersRoute: ServersServerIdMembersRoute,
  ServersServerIdIndexRoute: ServersServerIdIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_auth/sign-in/$",
        "/_auth/sign-up/$",
        "/servers/$serverId/members",
        "/servers/$serverId/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_auth/sign-in/$": {
      "filePath": "_auth/sign-in/$.tsx"
    },
    "/_auth/sign-up/$": {
      "filePath": "_auth/sign-up/$.tsx"
    },
    "/servers/$serverId/members": {
      "filePath": "servers/$serverId/members.tsx"
    },
    "/servers/$serverId/": {
      "filePath": "servers/$serverId/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
