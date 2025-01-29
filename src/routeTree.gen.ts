/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PostsImport } from './routes/posts'
import { Route as AboutImport } from './routes/about'
import { Route as LayoutImport } from './routes/_layout'
import { Route as IndexImport } from './routes/index'
import { Route as PostsIndexImport } from './routes/posts.index'
import { Route as PostsPostIdImport } from './routes/posts.$postId'
import { Route as LayoutLayout2Import } from './routes/_layout/_layout-2'
import { Route as LayoutLayout2LayoutBImport } from './routes/_layout/_layout-2/layout-b'
import { Route as LayoutLayout2LayoutAImport } from './routes/_layout/_layout-2/layout-a'

// Create/Update Routes

const PostsRoute = PostsImport.update({
  id: '/posts',
  path: '/posts',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const PostsIndexRoute = PostsIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => PostsRoute,
} as any)

const PostsPostIdRoute = PostsPostIdImport.update({
  id: '/$postId',
  path: '/$postId',
  getParentRoute: () => PostsRoute,
} as any)

const LayoutLayout2Route = LayoutLayout2Import.update({
  id: '/_layout-2',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutLayout2LayoutBRoute = LayoutLayout2LayoutBImport.update({
  id: '/layout-b',
  path: '/layout-b',
  getParentRoute: () => LayoutLayout2Route,
} as any)

const LayoutLayout2LayoutARoute = LayoutLayout2LayoutAImport.update({
  id: '/layout-a',
  path: '/layout-a',
  getParentRoute: () => LayoutLayout2Route,
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
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/posts': {
      id: '/posts'
      path: '/posts'
      fullPath: '/posts'
      preLoaderRoute: typeof PostsImport
      parentRoute: typeof rootRoute
    }
    '/_layout/_layout-2': {
      id: '/_layout/_layout-2'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutLayout2Import
      parentRoute: typeof LayoutImport
    }
    '/posts/$postId': {
      id: '/posts/$postId'
      path: '/$postId'
      fullPath: '/posts/$postId'
      preLoaderRoute: typeof PostsPostIdImport
      parentRoute: typeof PostsImport
    }
    '/posts/': {
      id: '/posts/'
      path: '/'
      fullPath: '/posts/'
      preLoaderRoute: typeof PostsIndexImport
      parentRoute: typeof PostsImport
    }
    '/_layout/_layout-2/layout-a': {
      id: '/_layout/_layout-2/layout-a'
      path: '/layout-a'
      fullPath: '/layout-a'
      preLoaderRoute: typeof LayoutLayout2LayoutAImport
      parentRoute: typeof LayoutLayout2Import
    }
    '/_layout/_layout-2/layout-b': {
      id: '/_layout/_layout-2/layout-b'
      path: '/layout-b'
      fullPath: '/layout-b'
      preLoaderRoute: typeof LayoutLayout2LayoutBImport
      parentRoute: typeof LayoutLayout2Import
    }
  }
}

// Create and export the route tree

interface LayoutLayout2RouteChildren {
  LayoutLayout2LayoutARoute: typeof LayoutLayout2LayoutARoute
  LayoutLayout2LayoutBRoute: typeof LayoutLayout2LayoutBRoute
}

const LayoutLayout2RouteChildren: LayoutLayout2RouteChildren = {
  LayoutLayout2LayoutARoute: LayoutLayout2LayoutARoute,
  LayoutLayout2LayoutBRoute: LayoutLayout2LayoutBRoute,
}

const LayoutLayout2RouteWithChildren = LayoutLayout2Route._addFileChildren(
  LayoutLayout2RouteChildren,
)

interface LayoutRouteChildren {
  LayoutLayout2Route: typeof LayoutLayout2RouteWithChildren
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutLayout2Route: LayoutLayout2RouteWithChildren,
}

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren)

interface PostsRouteChildren {
  PostsPostIdRoute: typeof PostsPostIdRoute
  PostsIndexRoute: typeof PostsIndexRoute
}

const PostsRouteChildren: PostsRouteChildren = {
  PostsPostIdRoute: PostsPostIdRoute,
  PostsIndexRoute: PostsIndexRoute,
}

const PostsRouteWithChildren = PostsRoute._addFileChildren(PostsRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof LayoutLayout2RouteWithChildren
  '/about': typeof AboutRoute
  '/posts': typeof PostsRouteWithChildren
  '/posts/$postId': typeof PostsPostIdRoute
  '/posts/': typeof PostsIndexRoute
  '/layout-a': typeof LayoutLayout2LayoutARoute
  '/layout-b': typeof LayoutLayout2LayoutBRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof LayoutLayout2RouteWithChildren
  '/about': typeof AboutRoute
  '/posts/$postId': typeof PostsPostIdRoute
  '/posts': typeof PostsIndexRoute
  '/layout-a': typeof LayoutLayout2LayoutARoute
  '/layout-b': typeof LayoutLayout2LayoutBRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_layout': typeof LayoutRouteWithChildren
  '/about': typeof AboutRoute
  '/posts': typeof PostsRouteWithChildren
  '/_layout/_layout-2': typeof LayoutLayout2RouteWithChildren
  '/posts/$postId': typeof PostsPostIdRoute
  '/posts/': typeof PostsIndexRoute
  '/_layout/_layout-2/layout-a': typeof LayoutLayout2LayoutARoute
  '/_layout/_layout-2/layout-b': typeof LayoutLayout2LayoutBRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | ''
    | '/about'
    | '/posts'
    | '/posts/$postId'
    | '/posts/'
    | '/layout-a'
    | '/layout-b'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | ''
    | '/about'
    | '/posts/$postId'
    | '/posts'
    | '/layout-a'
    | '/layout-b'
  id:
    | '__root__'
    | '/'
    | '/_layout'
    | '/about'
    | '/posts'
    | '/_layout/_layout-2'
    | '/posts/$postId'
    | '/posts/'
    | '/_layout/_layout-2/layout-a'
    | '/_layout/_layout-2/layout-b'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  LayoutRoute: typeof LayoutRouteWithChildren
  AboutRoute: typeof AboutRoute
  PostsRoute: typeof PostsRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  LayoutRoute: LayoutRouteWithChildren,
  AboutRoute: AboutRoute,
  PostsRoute: PostsRouteWithChildren,
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
        "/_layout",
        "/about",
        "/posts"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_layout": {
      "filePath": "_layout.tsx",
      "children": [
        "/_layout/_layout-2"
      ]
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/posts": {
      "filePath": "posts.tsx",
      "children": [
        "/posts/$postId",
        "/posts/"
      ]
    },
    "/_layout/_layout-2": {
      "filePath": "_layout/_layout-2.tsx",
      "parent": "/_layout",
      "children": [
        "/_layout/_layout-2/layout-a",
        "/_layout/_layout-2/layout-b"
      ]
    },
    "/posts/$postId": {
      "filePath": "posts.$postId.tsx",
      "parent": "/posts"
    },
    "/posts/": {
      "filePath": "posts.index.tsx",
      "parent": "/posts"
    },
    "/_layout/_layout-2/layout-a": {
      "filePath": "_layout/_layout-2/layout-a.tsx",
      "parent": "/_layout/_layout-2"
    },
    "/_layout/_layout-2/layout-b": {
      "filePath": "_layout/_layout-2/layout-b.tsx",
      "parent": "/_layout/_layout-2"
    }
  }
}
ROUTE_MANIFEST_END */
