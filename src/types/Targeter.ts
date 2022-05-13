import { SkillAttribute } from "./SkillAttribute";

export interface Targeter {
    targeter: string,
    shorthand: string[],
    description: string,
    attributes: SkillAttribute[],
}