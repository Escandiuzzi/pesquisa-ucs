import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { areas } from "../db/schema";
import * as schema from "../db/schema";

// Gets the tree of areas and flattens them.
export async function getAreasFlat(db: BetterSQLite3Database<typeof schema>) {
  const areas = await db.query.areas.findMany({
    columns: {
      id: true,
      name: true,
    },
    with: {
      parent: {
        columns: {
          id: true,
          name: true,
        },
        with: {
          parent: {
            columns: {
              id: true,
              name: true,
            },
            with: {
              parent: true,
            },
          },
        },
      },
    },
  });

  const flattenedAreas: { id: number; name: string }[] = [];

  for (const area of areas) {
    let name = area.name;
    if (area.parent) {
      name = `${area.parent.name} > ${name}`;
      if (area.parent.parent) {
        name = `${area.parent.parent.name} > ${name}`;
        if (area.parent.parent.parent) {
          name = `${area.parent.parent.parent.name} > ${name}`;
        }
      }
    }

    flattenedAreas.push({ id: area.id, name });
  }

  return flattenedAreas;
}
