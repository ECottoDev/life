/**
* AddExperience.js
*
* @author Edwin Cotto <edtowers1037@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-February-06 initial version
*/

import { addClasses, addEvent, appendChildren, createButton, createElementContainer, createHeadingText, createInputBar, createPillBox } from "../../../helpers/basicElements.js";
import { addExperienceData } from "../../databaseCallers/resumeDataCalls.js";

export class AddExperience {
    constructor(parentProps, cancel = () => { }, refresh = () => { }) {
        this.parentProps = parentProps;
        this.cancel = cancel;
        this.refresh = refresh;
        this.view = addClasses(createPillBox(), 'addExperience_view');
        this.setView();
    }
    setView() {
        appendChildren(this.view, [
            createHeadingText('Add Experience'),
            this.companyInput = createInputBar({ type: 'text', placeholder: 'Company' }),
            this.positionInput = createInputBar({ type: 'text', placeholder: 'Position' }),
            this.dutiesInput = createInputBar({ type: 'text', placeholder: 'Duties' }),
            this.timeWorkedInput = createInputBar({ type: 'text', placeholder: 'Time Worked' }),
            addEvent(createButton('Submit'), () => { this.submit(); this.cancel(); }),
            addEvent(createButton('Cancel'), () => { this.cancel(); })
        ])
    }
    async submit() {
        await addExperienceData(this.companyInput.value, this.positionInput.value, this.dutiesInput.value, this.timeWorkedInput.value);
        delayExecution(() => { this.refresh() }, 500);

    }

}