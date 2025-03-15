
import { addClasses, addEvent, appendChildren, createButton, createElementContainer, createHeadingText, createImg, createSVG, createSVGButton, createScrollArea, detachChildren, getURLParam, getUsernameCookie, navigate, parseRequestURL, setUsernameCookie, toPhoneFormat } from "../helpers/basicElements.js";
import { routes } from "../helpers/router.js";
import { DisplayBox } from "./components/displayBox/DisplayBox.js";
import { NavigationBar } from "./containers/navigationBar/NavigationBar.js";
import { verifySession } from "./databaseCallers/loginDataCalls.js";
import { LoginView } from "./views/loginView/LoginView.js";
import { RegisterView } from "./views/registerView/RegisterView.js";
import { ResumeView } from "./views/resumeView/ResumeView.js";


window.onload = async () => { appendChildren(document.getElementById('root'), [new Index().view]); }

export class Index {
    constructor() {
        window.onhashchange = () => { this.setNavState() };
        const root = document.getElementById('root');
        this.displayBox = new DisplayBox(root);
        this.setNavObj();
        this.setAppProps();
        this.container = addClasses(createScrollArea(), 'index_container');
        this.view = addClasses(createElementContainer(), 'index_view');
        this.setView();
    }
    setAppProps() {
        const root = document.getElementById('root');
        //if any problems arise with the appProps, add {}, before the swirly brackets
        this.appProps = Object.assign({
            setUser: setUsernameCookie.bind(this),
            username: () => getUsernameCookie(),
            displayBox: this.displayBox.display,
            setNavState: this.setNavState.bind(this),
            showMsg: () => { console.log('display showMessage'); }
        });
    }
    async setView() {
        appendChildren(detachChildren(this.view), [
            appendChildren(addClasses(createElementContainer(), 'index_navBarContainer'), [
                addEvent(addClasses(createSVGButton('frontend/assets/icons/lucifer.svg'), 'index_lucifer'), () => { this.setNavState(routes.HOME_VIEW); }),
                this.navBar = addClasses(new NavigationBar(this.appProps).view, 'index_navBar'),
            ]),
            this.container,
        ]);
        this.setNavState(this.navState, this.setParams());
    }
    /**
     * helps to set the navigation object and move from pages
     */
    setNavObj() {
        this.navigation = {
            [routes.HOME_VIEW]: () => new LoginView(this.appProps).view,
            [routes.RESUME_VIEW]: () => new ResumeView(this.appProps).view,
            [routes.REGISTER_VIEW]: () => new RegisterView(this.appProps).view,
        }
    }
    /**
     * helps to direct the user to another page
     * @param {*} hash 
     * @param {*} params (default = false) 
     */
    async setNavState(hash = '', params = false) {
        hash && navigate(hash, params);
        this.navState = parseRequestURL().split('?')[0];

        const verify = await verifySession(this.appProps.username());
        if (!verify.success) {
            // Check if REGISTER_V'IEW is defined and navigate there
            if (this.navState === '#/register') {
                navigate(this.navState);
            } else {
                // Otherwise, navigate to HOME_VIEW
                this.navState = routes.HOME_VIEW;
            }
        } else if (this.navState === routes.HOME_VIEW || this.navState === '' || this.navState === '#/' || this.navState === '/') {
            // If on HOME_VIEW or an empty/invalid route, navigate to RESUME_VIEW
            this.navState = routes.RESUME_VIEW;
            navigate(this.navState);
        } else if (this.navState === routes.RESUME_VIEW || this.navigation[this.navState]) {
            // If on RESUME_VIEW or a valid route, continue navigation
            navigate(this.navState);
        }
        const navView = this.navigation[this.navState] ? this.navigation[this.navState]() : false;
        (navView && this.navigation[this.navState]) && appendChildren(detachChildren(this.container), navView);
    }
    /**
     * helps to get the params to the url
     */
    setParams() {
        const URLParams = getURLParam();
        return URLParams.success ? URLParams.urlParam : false;
    }
}

