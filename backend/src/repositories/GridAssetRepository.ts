import { seed } from "../seed";
import type { GridAsset } from "../models/GridAsset";

const rows: GridAsset[] = seed.gridAsset.map((row) => ({ ...row }));

export const gridAssetRepository = {
  findAll: (): GridAsset[] => rows,
  findById: (id: number): GridAsset | undefined => rows.find((row) => row.id === id),
  save: (row: GridAsset): GridAsset => row
};
