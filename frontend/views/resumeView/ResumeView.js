/**
* ResumeView.js
*
* @author Edwin Cotto <edtowers1037@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-February-03 initial version
*/

import { addClasses, addEvent, appendChildren, createButton, createElementContainer, createHeadingText, createPillBox, delayedListener, delayExecution, deleteUsernameCookie, sortArrayOfObj } from "../../../helpers/basicElements.js";
import { routes } from "../../../helpers/router.js";
import { EducationHistory } from "../../containers/educationHistory/EducationHistory.js";
import { systemLogout, verifySession } from "../../databaseCallers/loginDataCalls.js";
import { getEducationData} from "../../databaseCallers/resumeDataCalls.js";

export class ResumeView {
    constructor(parentProps) {
        this.parentProps = parentProps;
        this.view = addClasses(createElementContainer(), 'resumeView_view');
        this.fetch();
    }
    async fetch() {
        // this.educationData =  await getEducationData();
        // this.educationData.sort(sortArrayOfObj('-schoolYear'));
        // this.experienceData = await getExperienceData();
        // this.experienceData.sort(sortArrayOfObj('-id'));
        this.setView();
    }
    setView() {
        appendChildren(this.view, [
            appendChildren(addClasses(createElementContainer(), 'resumeView_educationHistory'), [
		    createHeadingText(`current user is ${this.parentProps.username()}`),
            addEvent(addClasses(createButton('logout'), 'resumeView_addButton', 'resumeView_button'), async () => { await systemLogout(this.parentProps.username(),
                ()=>{const close = this.parentProps.displayBox(appendChildren(createPillBox(), [
                        createHeadingText('Logout Successfull'), 
                        createButton('close'), 
                        delayExecution(()=>{
                            deleteUsernameCookie();
                            close(); 
                            delayedListener(this.parentProps.setNavState(routes.HOME_VIEW)) 
                        },1000)])
                    )},
                () => { const close = this.parentProps.displayBox(appendChildren(createPillBox(), [
                    createHeadingText('Logout failed. Please check user and password and try again.'), 
                    addEvent(createButton('close'), () => close())
                ]))})}),
		    //new EducationHistory(this.parentProps).view
            ]),
            appendChildren(addClasses(createElementContainer(), 'resumeView_workHistory'), [
                // new WorkExperience(this.parentProps).view
                addEvent(addClasses(createButton('verification'), 'resumeView_addButton', 'resumeView_button'), async()=>{
                    await verifySession(this.parentProps.username());
                    console.log('session verified');
                })

            ]),
            appendChildren(addClasses(createElementContainer(), 'resumeView_skills'), [
                // new Skills(this.parentProps).view
            ]),

        ]);
    }
}
