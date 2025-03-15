/**
* NavigationBar.js
*
* @author Edwin Cotto <edtowers1037@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-February-03 initial version
*/

import { addClasses, addEvent, appendChildren, detachChildren, createElementContainer, createHeadingText, createImgButton, createSVGButton } from "../../../helpers/basicElements.js";
import { routes } from "../../../helpers/router.js";

export class NavigationBar {
    constructor(parentProps) {
        this.parentProps = parentProps;
        this.view = addClasses(createElementContainer(), 'navigationBar_view');
        this.setView();
    }
    setView() {
        appendChildren(this.view, [
            addEvent(addClasses(createSVGButton('frontend/assets/icons/Home.svg'), 'navigationBar_homeIcon'), () => { this.parentProps.setNavState(routes.HOME_VIEW) }),
            addClasses(createHeadingText('Home'), 'navigationBar_homeText'),
            // addEvent(addClasses(createSVGButton('frontend/assets/icons/WebPage.svg'),'navigationBar_webPageIcon'), () => { this.parentProps.setNavState(routes.BUDGET_VIEW) }),
            // addClasses(createHeadingText('Budget Page'), 'navigationBar_brandText'),
            addEvent(addClasses(createSVGButton('frontend/assets/icons/WebPage.svg'), 'navigationBar_polyPageIcon'), () => { this.parentProps.setNavState(routes.POLY_VIEW) }),
            addClasses(createHeadingText('Poly Roster Page'), 'navigationBar_polyText'),
        ]);
    }
}
