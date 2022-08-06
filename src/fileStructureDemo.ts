import type { TreeNode } from "carbon-components-svelte/types/TreeView/TreeView.svelte";
import { Folder, DocumentBlank, Document } from "carbon-icons-svelte";
type IFileStructure = TreeNode[] & {
  children?: TreeNode[];
};
export const fileStructureDemo: IFileStructure = [
  { id: 0, text: "AI / Machine learning", icon: Folder },
  {
    id: 1,
    text: "Analytics",
    icon: Folder,
    children: [
      {
        id: 2,
        text: "IBM Analytics Engine",
        icon: Folder,
        children: [
          { id: 3, text: "Apache Spark", icon: DocumentBlank },
          { id: 4, text: "Hadoop", icon: DocumentBlank },
        ],
      },
      { id: 5, text: "IBM Cloud SQL Query", icon: DocumentBlank },
      { id: 6, text: "IBM Db2 Warehouse on Cloud", icon: DocumentBlank },
    ],
  },
  {
    id: 7,
    text: "Blockchain",
    icon: Folder,
    children: [{ id: 8, text: "IBM Blockchain Platform", icon: DocumentBlank }],
  },
  {
    id: 9,
    text: "Databases",
    icon: Folder,
    children: [
      {
        id: 10,
        text: "IBM Cloud Databases for Elasticsearch",
        icon: DocumentBlank,
      },
      {
        id: 11,
        text: "IBM Cloud Databases for Enterprise DB",
        icon: DocumentBlank,
      },
      { id: 12, text: "IBM Cloud Databases for MongoDB", icon: DocumentBlank },
      {
        id: 13,
        text: "IBM Cloud Databases for PostgreSQL",
        icon: DocumentBlank,
      },
    ],
  },
  {
    id: 14,
    text: "Integration",
    icon: Folder,
    disabled: true,
    children: [
      { id: 15, text: "IBM API Connect", disabled: true, icon: DocumentBlank },
    ],
  },
];
