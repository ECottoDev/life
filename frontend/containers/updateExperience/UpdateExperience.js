/**
* UpdateExperience.js
*
* @author Edwin Cotto <edtowers1037@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-February-07 initial version
*/

import { addClasses, addEvent, appendChildren, createButton, createHeadingText, createInputBar, createPillBox, delayExecution } from "../../../helpers/basicElements.js";
import { updateExperienceData } from "../../databaseCallers/resumeDataCalls.js";


export class UpdateExperience {
    /**
     * 
     * @param {*} parentProps 
     * @param {*} experienceEntry 
     * @param {*} cancel 
     */
    constructor(parentProps, experienceEntry, cancel = () => { }, refresh = () => { }) {
        this.parentProps = parentProps;
        this.experienceEntry = experienceEntry;
        this.cancel = cancel;
        this.refresh = refresh;
        this.view = addClasses(createPillBox(), 'addExperience_view');
        this.setView();
    }
    async setView() {
        appendChildren(this.view, [
            createHeadingText('Update Experience Form', { bold: true, size: 'large' }),
            this.companyInput = createInputBar({ type: 'text', placeholder: 'Company', value: this.experienceEntry.Company }),
            this.positionInput = createInputBar({ type: 'text', placeholder: 'Position', value: this.experienceEntry.Position }),
            this.dutiesInput = createInputBar({ type: 'text', placeholder: 'Duties', value: this.experienceEntry.Duties }),
            this.timeWorkedInput = createInputBar({ type: 'text', placeholder: 'Time Worked', value: this.experienceEntry.TimeWorked }),
            addEvent(createButton('Submit'), () => { this.update(); this.cancel() }),
            addEvent(createButton('Cancel'), () => { this.cancel() })

        ])

    }
    async update() {
        await updateExperienceData(this.experienceEntry.id, this.companyInput.value, this.positionInput.value, this.dutiesInput.value, this.timeWorkedInput.value);
        delayExecution(() => { this.refresh() }, 500);
    }
}
