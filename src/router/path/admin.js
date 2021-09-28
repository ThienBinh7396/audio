import admin from "@/middleware/admin";

export default [
  {
    path: "/api/document",
    name: "APIDocument",
    component: () => import("@/views/pages/api/ListAPI"),
    meta: {
      middleware: admin,
    },
  },
  {
    path: "/",
    name: "Layout",
    component: () => import("@/views/layouts/MainLayout"),
    redirect: "/home",
    meta: {
      middleware: admin,
    },
    children: [
      {
        path: "/home",
        name: "HomePage",
        component: () => import("@/views/pages/home/Home"),
        meta: {
          middleware: admin,
        },
      },
      {
        path: "/story/:story_url/:storyId",
        name: "StoryPage",
        component: () => import("@/views/pages/story/Story"),
        meta: {
          middleware: admin,
        },
      },
      {
        path: "/read/story/:story_url/:chapter_url/:chapter_id",
        name: "ChapterPage",
        component: () => import("@/views/pages/story/ContentChapterRsVAudio"),
        meta: {
          middleware: admin,
        },
      },
      {
        path: "/read/chapters",
        name: "ChapterFromMultipleWeb",
        component: () => import("@/views/pages/story/ChapterFromMultipleWeb"),
      },
    ],
  },
  {
    path: "/*",
    name: "404",
    component: () => import("@/views/pages/error/404"),
  },
];
