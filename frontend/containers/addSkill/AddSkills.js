/**
* AddSkills.js
*
* @author Edwin Cotto <edtowers1037@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-February-11 initial version
*/

import { addClasses, addEvent, appendChildren, createButton, createElementContainer, createHeadingText, createInputBar, createPillBox } from "../../../helpers/basicElements.js";
import { addSkillsData } from "../../databaseCallers/resumeDataCalls.js";

export class AddSkills {
    constructor(parentProps, cancel = () => { }, refresh = () => { }) {
        this.parentProps = parentProps;
        this.cancel = cancel;
        this.refresh = refresh;
        this.view = addClasses(createPillBox(), 'addSkills_view');
        this.setView();

    }
    setView() {
        appendChildren(this.view, [
            addClasses(createHeadingText('Add Skills'), 'addSkills_heading'),
            this.nameInput = addClasses(createInputBar({ type: 'text', placeholder: 'Skill' }), 'addSkills_nameInput'),
            this.levelInput = addClasses(createInputBar({ type: 'text', placeholder: 'Skill Level' }), 'addSkills_levelInput'),
            appendChildren(addClasses(createElementContainer(), 'addSkills_buttons'), [
                addEvent(addClasses(createButton('Submit'), 'addSkills_submitButton'), () => { this.submit(); this.cancel(); }),
                addEvent(addClasses(createButton('Cancel'), 'addSkills_cancelButton'), () => { this.cancel(); })
            ])
        ])
    }
    async submit() {
        await addSkillsData(this.nameInput.value, this.levelInput.value);
        delayExecution(() => { this.refresh() }, 500);
    }
}