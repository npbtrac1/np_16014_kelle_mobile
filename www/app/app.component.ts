import { Component }       from '@angular/core';

import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
@Component({
    selector: 'my-app',
    templateUrl:'app/views/login.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ROUTER_PROVIDERS,
    ],

})

export class AppComponent {
    title = 'Login - Kelle';
    showForm = 0;
    showFormAction: any;
    constructor() {
        this.showFormAction = function(){
            this.showForm = 1;
            return false;
        }
    }
}