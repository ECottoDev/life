/**
* ExperienceTiles.js
*
* @author Edwin Cotto <edtowers1037@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-February-06 initial version
*/

import { addClasses, addEvent, appendChildren, createButton, createHeadingText, createParagraph, createSVGButton, createTileContainer } from "../../../../helpers/basicElements.js";
import { UpdateExperience } from "../../../containers/updateExperience/UpdateExperience.js";
import { deleteExperienceData } from "../../../databaseCallers/resumeDataCalls.js";

export class ExperienceTiles {
    constructor(parentProps, experienceEntry, refresh = () => { }) {
        this.parentProps = parentProps;
        this.experienceEntry = experienceEntry;
        this.refresh = refresh;
        this.view = addClasses(createTileContainer(), 'experienceTiles_view');
        this.setView()

    }
    setView() {
        appendChildren(this.view, [
            addClasses(createHeadingText(this.experienceEntry.Company, { bold: true }), 'experienceTiles_companyName'),
            addClasses(createParagraph(this.experienceEntry.TimeWorked, { bold: true }), 'experienceTiles_timeWorked'),
            addClasses(createParagraph(this.experienceEntry.Position), 'experienceTiles_position'),
            addClasses(createParagraph(this.experienceEntry.Duties), 'experienceTiles_duties'),
            addEvent(addClasses(createSVGButton('frontend/assets/icons/Edit.svg'), 'experienceTiles_updateButton'), () => { const close = this.parentProps.displayBox(new UpdateExperience(this.parentProps, this.experienceEntry, () => { close() }, () => { this.refresh() }).view) }),
            addEvent(addClasses(createSVGButton('frontend/assets/icons/Delete.svg'), 'experienceTiles_deleteButton'), async () => {
                await deleteExperienceData(this.experienceEntry.id);
                this.refresh();
            })])
    }
}