/**
* CardTile.js
*
* @author Edwin Cotto <cottosoftwaredevelopment@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-May-15 initial version
*/

import { addClasses, addEvent, appendChildren, createButton, createElementContainer, createHeadingText, createInputBar, getDateObj, toCurrencyFormat, toTitleCase } from "../../../../helpers/basicElements.js";
import { updateCard } from "../../../databaseCallers/budgetDataCalls.js";

export class CardTile {
    constructor(parentProps, cardEntry, refresh = () => { }) {
        this.refresh = refresh;
        this.parentProps = parentProps;
        this.cardEntry = cardEntry;
        this.billingDate = getDateObj(new Date());
        this.view = addClasses(createElementContainer(), 'cardTile_view');
        this.setView();
    }
    setView() {
        appendChildren(this.view, [
            addClasses(createHeadingText(toTitleCase(this.cardEntry.cardName)), 'cardTile_cardName'),
            addClasses(createHeadingText(`Billing: ${this.billingDate.shortMonth} ${this.cardEntry.billing}`), ''),
            appendChildren(addClasses(createElementContainer(), 'cardTile_inputBars'), [
                this.amountButton = addEvent(addClasses(createInputBar({ placeholder: toCurrencyFormat(this.cardEntry.amountDue) }), 'cardTile_amountDue'), async () => { if (event.key === 'Enter') { await updateCard(this.cardEntry.cardID, this.amountButton.value); this.refresh() } }, 'keydown'),
                addClasses(createInputBar({ placeholder: toCurrencyFormat(this.cardEntry.amountMinDue), disabled: true }), 'cardTile_amountMinDue'),
            ]),
            addEvent(addClasses(createButton('Update Card'), 'cardTile_updateButton'), async () => { await updateCard(this.cardEntry.cardID, this.amountButton.value); this.refresh() }, 'click')
        ])
    }
}

