import type { ChangelogTree } from "./global";

export const changelogTreeDemo: ChangelogTree = {
  nodes: [
    {
      releaseAnnouncementPost:
        "https://blog.badawy.dev/CodeColab/release/0.0.1-beta",
      releaseUrl: "https://github.com/kashik0i/CodeColab?release=0.0.1-beta",
      version: "0.0.1 beta",
      date: "2018-01-01",
      releaseHighlights: [
        {
          id: "1",
          text: "basic functionality added",
          children: [
            {
              id: "1.1",
              text: "execute code on server",
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
              url: "https://github.com/kashik0i/CodeColab/issues?#1",
            },
          ],
        },
      ],
    },
  ],
};
