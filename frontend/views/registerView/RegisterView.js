/**
* RegisterView.js
*
* @author Edwin Cotto <edtowers1037@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-February-08 initial version
*/

import { addClasses, addEvent, appendChildren, createButton, createElementContainer, createHeadingText, createInputBar, createPillBox, delayedListener, delayExecution, deleteUsernameCookie, getUsernameCookie, setUsernameCookie } from "../../../helpers/basicElements.js";
import { routes } from "../../../helpers/router.js";
import { systemRegister } from "../../databaseCallers/loginDataCalls.js";


export class RegisterView {
    constructor(parentProps) {
        this.parentProps = parentProps;
        this.view = addClasses(createElementContainer(), 'RegisterView_view');
        this.fetch();
    }
    async fetch() {
        this.setView();
    }
    setView() {
        appendChildren(this.view, [
            addClasses(createHeadingText('Poly Register', { bold: true }), 'RegisterView_heading'),
            this.user = createInputBar({ placeholder: 'User' }),
            this.password = createInputBar({ type: 'password', placeholder: 'Password' }),
            this.confirmPassword = createInputBar({ type: 'password', placeholder: 'Confirm Password' }),
            //if passwords dont match, display error message
            addEvent(addClasses(createButton('Register'), 'RegisterView_addButton', 'RegisterView_button'), () => { this.testUsers() }),

        ])
    }
    async testUsers() {
        if (this.password.value !== this.confirmPassword.value) {
            const close = this.parentProps.displayBox(appendChildren(createPillBox(), [
                createHeadingText('Passwords do not match'),
                addEvent(createButton('close'), () => close())
            ]))
            return;
        }
        await systemRegister(this.user.value, this.password.value,
            () => {
                const close = this.parentProps.displayBox(appendChildren(createPillBox(), [
                    createHeadingText('Register Successfull'),
                    createButton('close'),
                    delayExecution(() => {
                        close();
                        delayedListener(this.parentProps.setNavState(routes.RESUME_VIEW))
                    }, 1000)])
                )
            },
            () => {
                const close = this.parentProps.displayBox(appendChildren(createPillBox(), [
                    createHeadingText('Register failed. Please check user and password and try again.'),
                    addEvent(createButton('close'), () => close())
                ]))
            })
    }
}
