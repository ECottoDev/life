/**
* UpdateSkills.js
*
* @author Edwin Cotto <edtowers1037@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-February-11 initial version
*/

import { addClasses, addEvent, appendChildren, createButton, createElementContainer, createHeadingText, createInputBar, createPillBox } from "../../../helpers/basicElements.js";
import { addSkillsData, updateSkillsData } from "../../databaseCallers/resumeDataCalls.js";

export class UpdateSkills {
    constructor(parentProps, skill, cancel = () => { }, refresh = () => { }) {
        this.parentProps = parentProps;
        this.skill = skill;
        this.cancel = cancel;
        this.refresh = refresh;
        this.view = addClasses(createPillBox(), 'addSkills_view');
        this.setView();
    }
    setView() {
        appendChildren(this.view, [
            addClasses(createHeadingText('Update Skills Form', { bold: true, size: 'large' }), 'addSkills_heading'),
            this.skillNameInput = addClasses(createInputBar({ type: 'text', placeholder: 'Skill Name', value: this.skill.name }), 'addSkills_skillNameInput'),
            this.skillLevelInput = addClasses(createInputBar({ type: 'text', placeholder: 'Skill Level', value: this.skill.skillLevel }), 'addSkills_skillLevelInput'),
            appendChildren(addClasses(createElementContainer(), 'addSkills_buttonContainer'), [
                addEvent(createButton('Submit'), () => { this.update(); this.cancel() }),
                addEvent(createButton('Cancel'), () => { this.cancel() })
            ])
        ])
    }
    async update() {
        await updateSkillsData(this.skill.id, this.skillNameInput.value, this.skillLevelInput.value);
        delayExecution(() => { this.refresh() }, 500);
    }
}