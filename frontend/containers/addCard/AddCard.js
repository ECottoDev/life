/**
* AddCard.js
*
* @author Edwin Cotto <edtowers1037@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-February-04 initial version
*/

import { addClasses, addEvent, appendChildren, createButton, createCheckbox, createDropdown, createHeadingText, createInputBar, createPillBox, delayExecution, getDropdownText, getDropdownValue, getMonthsWithDays, searchArray } from "../../../helpers/basicElements.js";
import { Checkbox } from "../../components/checkbox/Checkbox.js";
import { addCardData } from "../../databaseCallers/budgetDataCalls.js";

export class AddCard {
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
        this.view = addClasses(createPillBox(), 'addCard_view');
        this.amountDue = 0;
        this.minPayment = 35;
        this.yearData = getMonthsWithDays();
        this.months = this.yearData.map((item, index) => {
            return {
                description: item.month,
                id: index + 1,
                disabled: false
            };
        });
        this.monthDropdown = createDropdown(this.months);
        this.setView();
    }
    handleDropdownChange(options) {
        return createDropdown(options);
    }
    setView() {
        appendChildren(this.view, [
            createHeadingText('Add Card Form', { bold: true, size: 'large' }),
            this.cardNameInput = addClasses(createInputBar({ type: 'text', placeholder: 'Card Name' }), 'addCard_schoolNameInput'),
            addEvent(this.monthDropdown, () => {
                this.daysDropdownOptions = Array.from({ length: searchArray(this.yearData, getDropdownText(this.monthDropdown), 'month')[0].days }, (v, i) => ({
                    description: i + 1,
                    id: i + 1,
                    disabled: false
                }));
                this.daysDropdown.replaceWith(this.daysDropdown = this.handleDropdownChange(this.daysDropdownOptions));
            }, 'change'),

            this.daysDropdown = createDropdown(Array.from({ length: searchArray(this.yearData, getDropdownText(this.monthDropdown), 'month')[0].days }, (v, i) => ({
                description: i + 1,
                id: i + 1,
                disabled: false
            }))),
            this.loanInput = addClasses(new Checkbox('Is this a Loan?', { callback: (value) => { this.loanValue = value } }).view, 'addEducation_graduatedCheckbox'),
            addEvent(createButton('Submit'), () => { this.submit(); this.cancel() }),
            addEvent(createButton('Cancel'), () => { this.cancel() })
        ])

    }
    async submit() {
        this.billingday = `${getDropdownText(this.monthDropdown)} / ${getDropdownValue(this.daysDropdown)} / 2025`;
        await addCardData(this.cardNameInput.value, this.billingday, this.amountDue, this.minPayment, this.loanValue);
        delayExecution(() => { this.refresh() }, 500);
    }
}
