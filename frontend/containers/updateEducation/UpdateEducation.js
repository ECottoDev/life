/**
* UpdateEducation.js
*
* @author Edwin Cotto <edtowers1037@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-February-04 initial version
*/

import { addClasses, addEvent, appendChildren, createButton, createCheckbox, createHeadingText, createInputBar, createPillBox } from "../../../helpers/basicElements.js";
import { Checkbox } from "../../components/checkbox/Checkbox.js";
import { getEducationData, updateEducationData } from "../../databaseCallers/resumeDataCalls.js";

export class UpdateEducation {
    /**
     * 
     * @param {*} parentProps 
     * @param {*} educationEntry 
     * @param {*} cancel 
     */
    constructor(parentProps, educationEntry, cancel = () => { }, refresh = () => { }) {
        this.parentProps = parentProps;
        this.educationEntry = educationEntry;
        this.cancel = cancel;
        this.refresh = refresh;
        this.view = addClasses(createPillBox(), 'addEducation_view');
        this.graduatedInput = new Checkbox('Graduated', { checked: this.educationEntry.graduated });

        this.setView();
    }
    async setView() {
        appendChildren(this.view, [
            createHeadingText('Update Education Form', { bold: true, size: 'large' }),
            this.schoolNameInput = addClasses(createInputBar({ type: 'text', placeholder: 'School Name', value: this.educationEntry.schoolName }), 'addEducation_schoolNameInput'),
            this.schoolYearInput = addClasses(createInputBar({ type: 'text', placeholder: 'School Year (from - to)', value: this.educationEntry.schoolYear }), 'addEducation_schoolYearInput'),
            this.concentrationInput = addClasses(createInputBar({ type: 'text', placeholder: 'Concentration (Music Major)', value: this.educationEntry.concentration }), 'addEducation_concentrationInput'),
            addClasses(this.graduatedInput.view, 'addEducation_graduatedInput'),
            addEvent(createButton('Submit'), () => { this.update(); this.cancel() }),
            addEvent(createButton('Cancel'), () => { this.cancel() })
        ])
    }
    async update() {
        updateEducationData(this.educationEntry.id, this.schoolNameInput.value, this.schoolYearInput.value, this.concentrationInput.value, this.graduatedInput.isChecked());
        this.refresh();
    }
}