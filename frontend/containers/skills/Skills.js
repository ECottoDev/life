/**
* Skills.js
*
* @author Edwin Cotto <edtowers1037@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-February-11 initial version
*/

import { addClasses, addEvent, appendChildren, createElementContainer, createHeadingText, createSVGButton, createScrollArea, detachChildren, searchArray, sortArrayOfObj } from "../../../helpers/basicElements.js";
import { SkillsTiles } from "../../components/tiles/skillsTiles/SkillsTiles.js";
import { getSkillsData } from "../../databaseCallers/resumeDataCalls.js";
import { AddSkills } from "../addSkill/AddSkills.js";

export class Skills {
    constructor(parentProps) {
        this.parentProps = parentProps;
        this.view = addClasses(createElementContainer('all'), 'skills_view');
        this.fetch();
    }
    async fetch() {
        this.skills = await getSkillsData();
        this.skillsData = [];
        searchArray(this.skills, 'Advanced', 'skillLevel').map((entry) => { this.skillsData.push(entry) });
        searchArray(this.skills, 'Intermediate', 'skillLevel').map((entry) => { this.skillsData.push(entry) });
        searchArray(this.skills, 'Beginner', 'skillLevel').map((entry) => { this.skillsData.push(entry) });
        this.setView();
    }
    setView() {
        appendChildren(this.view, [
            addClasses(createHeadingText('Skills', { bold: true }), 'skills_heading'),
            appendChildren(addClasses(createScrollArea(), 'skills_scrollArea'), [
                this.skillsData.map((entry) => {
                    return addClasses(new SkillsTiles(this.parentProps, entry, () => { detachChildren(this.view); this.fetch(); }).view, 'skills_tile');
                })
            ]),
            addEvent(addClasses(createSVGButton('frontend/assets/icons/Plus.svg'), 'skills_addButton'), () => { const close = this.parentProps.displayBox(new AddSkills(this.parentProps, () => { close() }, () => { detachChildren(this.view); this.fetch(); }).view) })
        ]);
    }
}