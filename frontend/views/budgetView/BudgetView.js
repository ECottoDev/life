/**
* BudgetView.js
*
* @author Edwin Cotto <cottosoftwaredevelopment@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-May-14 initial version
*/

import { addClasses, addEvent, appendChildren, createButton, createElementContainer, createHeadingText, createPillBox, detachChildren, getDateObj, toTitleCase } from "../../../helpers/basicElements.js";
import { CardTile } from "../../components/tiles/cardTile/CardTile.js";
import { AddCard } from "../../containers/addCard/AddCard.js";
import { getBudgetData } from "../../databaseCallers/budgetDataCalls.js";

export class BudgetView {
    constructor(parentProps) {
        this.parentProps = parentProps;
        this.date = getDateObj();
        this.totalBudget = 15200;
        this.view = addClasses(createPillBox(), 'budgetView_view');
        this.fetch();
    }
    async fetch() {
        this.budgetList = await getBudgetData();
        this.setView();
    }
    setView() {
        appendChildren(this.view, [
            addClasses(createHeadingText(`Available budget in ${this.date.month} ${this.date.day} ${this.date.year}`), 'budgetView_heading'),
            appendChildren(addClasses(createElementContainer(), 'budgetView_bottomContainer'), [
                addClasses(createHeadingText('Budget Cards'), 'budgetView_heading'),
                appendChildren(addClasses(createElementContainer(), 'budgetView_cardContainer'), [
                    ...this.budgetList.map((card) => {
                        return new CardTile(this.parentProps, card, () => { detachChildren(this.view); this.fetch(); }).view;
                    })
                ]),
                appendChildren(addClasses(createElementContainer(), 'budgetView_budgetInfo'), [
                    addClasses(createHeadingText(toTitleCase(`total budget: ${this.totalBudget}`), 'budgetView_total')),
                    addClasses(createHeadingText(toTitleCase(`total due: ${this.totalDue()}`)), 'budgetView_noLoan'),
                    //addClasses(createHeadingText(toTitleCase(`total due with loan: ${this.totalDue()}`)), 'budgetView_loan'),
                    addClasses(createHeadingText(toTitleCase(`total Budget Available: ${this.totalBudget - this.totalDue()}`)), 'budgetView_available'),
                ]),

                addEvent(addClasses(createButton('Add Card'), 'budgetView_button'), () => {
                    const close = this.parentProps.displayBox(new AddCard(this.parentProps, () => close(), () => { detachChildren(this.view); this.fetch() }).view)
                })
            ]),
        ]);
    }
    totalDue() {
        this.result = 0;
        this.budgetList.map((card) => {
            this.result += card.amountDue;
        })
        return (this.result);
    }
}
