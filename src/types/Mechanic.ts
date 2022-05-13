import { SkillAttribute } from "./SkillAttribute";

export interface Mechanic {
    mechanic: string,
    attributes: SkillAttribute[],
    description: string,
    default: any
}