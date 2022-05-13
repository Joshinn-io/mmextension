import { SkillAttribute } from "./SkillAttribute";

export interface Condition {
    condition: string,
    type: string,
    description: string,
    attributes: SkillAttribute[],
}