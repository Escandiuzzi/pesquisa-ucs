import { db } from "../db";
import { areas } from "../db/schema";

export async function getAreasTree() {
  const areas = await db.query.areas.findMany();
  // Some areas have a parentId, which means they are subareas.
  // Let's build it into a tree structure.
  function createArea(
    area: (typeof areas)[0]
  ): (typeof areas)[0] & { children: ReturnType<typeof createArea>[] } {
    return {
      ...area,
      children: areas.filter((a) => a.parentId === area.id).map(createArea),
    };
  }

  return areas.filter((a) => !a.parentId).map(createArea);
}

// Gets the tree of areas and flattens them. E.g:
// [
//   { id: 1, name: "Math", parentId: null },
//   { id: 2, name: "Math > Algebra", parentId: 1 },
//   { id: 3, name: "Math > Algebra > Linear Algebra", parentId: 2 },
// ]
export async function getAreasFlat() {
  const tree = await getAreasTree();

  return tree.map((node) => printPaths(node)).flat();
}

function printPaths(
  node: Awaited<ReturnType<typeof getAreasTree>>[0],
  path?: string
): typeof areas.$inferSelect | (typeof areas.$inferSelect)[] {
  const nodeName = node.name ? (path ? " > " : "") + node.name : "";
  const nodePath = (path ? path : "") + nodeName;
  const nodeChildren = Object.values(node).filter(Array.isArray).flat();

  return nodeChildren.length > 0
    ? nodeChildren.map((nodeChild) => printPaths(nodeChild, nodePath)).flat()
    : {
        id: node.id,
        name: nodePath,
        parentId: node.parentId,
      };
}
