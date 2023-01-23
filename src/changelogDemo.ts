import type {ChangelogTree} from "./global";

const CODE_COLAB_FRONTEND_GITHUB_URL = 'https://github.com/kashik0i/codecolab-frontend',
    CODE_COLAB_BACKEND_GITHUB_URL = 'https://github.com/kashik0i/codecolab-backend',
    CODE_COLAB_FRONTEND_BLOG_URL = 'https://blog.badawy.dev/codecolab-frontend',
    CODE_COLAB_BACKEND_BLOG_URL = 'https://blog.badawy.dev/CodeColab-backend';
export const changelogTreeDemo: ChangelogTree = {
    nodes: [
        {
            releaseAnnouncementPost:
                `${CODE_COLAB_FRONTEND_BLOG_URL}/release/0.0.1-alpha`,
            releaseUrl: `${CODE_COLAB_FRONTEND_BLOG_URL}?release=0.0.1-alpha`,
            version: "0.0.1 alpha",
            date: "2022-08-14",
            releaseHighlights: [
                {
                    id: "1",
                    text: "basic functionality added",
                    children: [
                        {
                            id: "1.1",
                            text: "execute code on client (WIP)",
                        },
                        {
                            id: "1.2",
                            text: "delete, copy, move up/down and import/export blocks",
                        },
                    ],
                },
                {
                    id: "1",
                    text: "basic account functionality",
                },
            ],
            features: [
                {
                    title: "init",
                    description: "initialize the CodeColab project",
                    githubIssue: [
                        {
                            id: "#1",
                            url: `${CODE_COLAB_FRONTEND_GITHUB_URL}/issues?#1`,
                        },
                    ],
                },
            ],
        },
        {
            releaseAnnouncementPost:
                `${CODE_COLAB_FRONTEND_BLOG_URL}/release/0.0.1-beta`,
            releaseUrl: `${CODE_COLAB_FRONTEND_BLOG_URL}?release=0.0.1-beta`,
            version: "0.0.1 beta",
            date: "2023-01-01",
            releaseHighlights: [
                {
                    id: "1",
                    text: "happy new year mode 🎉",
                },
            ],
            features: [
                {
                    title: "init",
                    description: "working on compiler stuff",
                    githubIssue: [
                        {
                            id: "#2",
                            url: `${CODE_COLAB_FRONTEND_GITHUB_URL}/issues?#2`,
                        },
                    ],
                },
            ],
        },
    ],
};
