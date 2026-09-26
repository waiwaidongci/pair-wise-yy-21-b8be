import { gridAssetRepository } from "../repositories/GridAssetRepository";
import type { GridAsset } from "../models/GridAsset";
export const gridAssetService = { list: () => gridAssetRepository.findAll(), create: (row: GridAsset) => gridAssetRepository.save(row) };
