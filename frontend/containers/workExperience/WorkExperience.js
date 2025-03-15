/**
* WorkExperience.js
*
* @author Edwin Cotto <edtowers1037@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-February-10 initial version
*/

import { addClasses, addEvent, appendChildren, createElementContainer, createHeadingText, createSVGButton, createScrollArea, detachChildren, sortArrayOfObj } from "../../../helpers/basicElements.js";
import { ExperienceTiles } from "../../components/tiles/experienceTiles/ExperienceTiles.js";
import { AddExperience } from "../../containers/addExperience/AddExperience.js";
import { getExperienceData } from "../../databaseCallers/resumeDataCalls.js";

export class WorkExperience {
    constructor(parentProps) {
        this.parentProps = parentProps;
        this.view = addClasses(createElementContainer('all'), 'workExperience_view');
        this.fetch();
    }
    async fetch() {
        this.experienceData = await getExperienceData();
        this.experienceData.sort(sortArrayOfObj('-id'));
        this.setView();
    }
    setView() {
        appendChildren(this.view, [
            createHeadingText('Experience', { bold: true, size: 'large' }),
            appendChildren(addClasses(createScrollArea(), 'resumeView_scrollArea'), [
                this.experienceData.map((entry) => {
                    return addClasses(new ExperienceTiles(this.parentProps, entry, () => {
                        detachChildren(this.view);
                        this.fetch();
                    }).view, 'resumeView_educationTile');
                })]
            ),
            addEvent(addClasses(createSVGButton('frontend/assets/icons/Plus.svg'), 'resumeView_addButton'), () => { const close = this.parentProps.displayBox(new AddExperience(this.parentProps, () => { close() }, () => { detachChildren(this.view); this.fetch(); }).view) })
        ])
    }
}