/**
* AddEducation.js
*
* @author Edwin Cotto <edtowers1037@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-February-04 initial version
*/

import { addClasses, addEvent, appendChildren, createButton, createCheckbox, createHeadingText, createInputBar, createPillBox } from "../../../helpers/basicElements.js";
import { Checkbox } from "../../components/checkbox/Checkbox.js";
import { addEducationData, getEducationData } from "../../databaseCallers/resumeDataCalls.js";

export class AddEducation {
    /**
     * 
     * @param {*} parentProps 
     * @param {*} cancel 
     * @param {*} submit 
     */
    constructor(parentProps, cancel = () => { }, refresh = () => { }) {
        this.parentProps = parentProps;
        this.cancel = cancel;
        this.refresh = refresh;
        this.view = addClasses(createPillBox(), 'addEducation_view');
        this.setView();
    }
    setView() {
        appendChildren(this.view, [
            createHeadingText('Add Education Form', { bold: true, size: 'large' }),
            this.schoolNameInput = addClasses(createInputBar({ type: 'text', placeholder: 'School Name' }), 'addEducation_schoolNameInput'),
            this.schoolYearInput = addClasses(createInputBar({ type: 'text', placeholder: 'School Year (from - to)' }), 'addEducation_schoolYearInput'),
            this.concentrationInput = addClasses(createInputBar({ type: 'text', placeholder: 'Concentration (Music Major)' }), 'addEducation_concentrationInput'),
            this.graduatedInput = addClasses(new Checkbox('Graduated?', { callback: (value) => { this.value = value } }).view, 'addEducation_graduatedCheckbox'),
            addEvent(createButton('Submit'), () => { this.submit(); this.cancel() }),
            addEvent(createButton('Cancel'), () => { this.cancel() })
        ])

    }
    async submit() {
        await addEducationData(this.schoolNameInput.value, this.schoolYearInput.value, this.concentrationInput.value, this.value);
        delayExecution(() => { this.refresh() }, 500);
    }
}
