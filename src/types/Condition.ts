import { SkillAttribute } from "./SkillAttribute";

export interface Condition {
    condition: string,
    type: string,
    description: string,
    aliases: string[],
    attributes: SkillAttribute[],
}