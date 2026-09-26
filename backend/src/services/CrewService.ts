import { crewRepository } from "../repositories/CrewRepository";
import type { Crew } from "../models/Crew";
export const crewService = { list: () => crewRepository.findAll(), create: (row: Crew) => crewRepository.save(row) };
