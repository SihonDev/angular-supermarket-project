import { Injectable, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    public constructor(private router: Router) {}

    public canActivate(): boolean {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        const userType = sessionStorage.getItem("userType");
        if(isLoggedIn == "true" && userType == "Admin") {
            return true;
        }

        this.router.navigateByUrl("/home");
        sessionStorage.clear()
        alert("Access Denied");
        return false;
    }

}
