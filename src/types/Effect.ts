import { SkillAttribute } from "./SkillAttribute";

export interface Effect {
    effect: string,
    attributes: SkillAttribute[],
    description: string,
    default: any
}