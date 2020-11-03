import admin from '@/middleware/admin'

export default [{
    path: '/',
    name: "Layout",
    component: () =>
        import ('@/views/layouts/MainLayout'),
    redirect: '/home',
    meta: {
        middleware: admin
    },
    children: [{
            path: '/home',
            name: 'HomeLayout',
            component: () =>
                import ('@/views/pages/Home'),
            meta: {
                middleware: admin
            }
        },
        {
            path: '/story/:story_url/:storyId',
            name: 'StoryLayout',
            component: () =>
                import ('@/views/pages/Story'),
            meta: {
                middleware: admin
            }
        },
        {
            path: '/read/story/:story_url/:chapter_url/:chapter_id',
            name: 'ChapterLayout',
            component: () =>
                import ('@/views/pages/ContentChapterRsV'),
                // import ('@/views/pages/ContentChapterRsVAudio2'),
            //import ('@/views/pages/ContentChapter'),
            meta: {
                middleware: admin
            }
        }
    ],

}, {
    path: '/404',
    name: "404",
    component: () =>
        import ('@/views/pages/404'),
}]