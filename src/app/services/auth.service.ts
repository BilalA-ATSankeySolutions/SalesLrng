import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './common.service';

export interface User {
    username: string;
    password: string;
}

const SESSION_DURATION = 30 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private router: Router, private common: CommonService) {
        this.checkSessionOnStartup();
    }

    private _isLoggedIn = signal<boolean>(
        localStorage.getItem('isLoggedIn') === 'true'
    );

    private logoutTimer: any;

    isLoggedIn = computed(() => this._isLoggedIn());

    signup(username: string, password: string) {
        const newUser: User = { username, password };

        const saved = localStorage.getItem('user');
        let users: User[] = saved ? JSON.parse(saved) : [];

        const exists = users.find(u => u.username === username);

        if (exists) {
            this.common.error('User already exists.');
            return;
        }

        users.push(newUser);
        localStorage.setItem('user', JSON.stringify(users));

        this.setLoginState(true);
        this.startSession();
        this.common.success('Account created successfully!');
        this.router.navigate(['/dashboard']);
    }

    login(username: string, password: string) {
        const savedUser = localStorage.getItem('user');

        if (!savedUser) {
            this.common.error('No user found. Please sign up first.');
            return;
        }

        const users: User[] = JSON.parse(savedUser);

        const isFound = users.find(
            u => u.username === username && u.password === password
        );

        if (!isFound) {
            this.common.error('Invalid credentials.');
            return;
        }

        this.setLoginState(true);
        this.startSession();
        this.common.success('Login successful!');
        this.router.navigate(['/dashboard']);
    }

    logout(isSessionExpired = false) {
        this._isLoggedIn.set(false);

        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('sessionExpiry');

        if (this.logoutTimer) {
            clearTimeout(this.logoutTimer);
        }


        if (isSessionExpired) {
            this.common.error('Session Expired', 'You have been logged out after 30 minutes.');
        } else {
            this.common.info('Logged Out', 'You have successfully logged out.');
        }

        this.router.navigate(['/login']);
    }


    private startSession() {
        const expiry = Date.now() + SESSION_DURATION;

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('sessionExpiry', expiry.toString());

        this._isLoggedIn.set(true);
        this.autoLogout(expiry);
    }

    private checkSessionOnStartup() {
        const expiry = localStorage.getItem('sessionExpiry');

        if (!expiry) {
            localStorage.removeItem('isLoggedIn');
            this._isLoggedIn.set(false);
            return;
        }

        const expiryTime = +expiry;

        if (Date.now() > expiryTime) {
            this.logout();
        } else {
            this._isLoggedIn.set(true);
            this.autoLogout(expiryTime);
        }
    }

    private autoLogout(expiryTime: number) {
        const timeLeft = expiryTime - Date.now();

        if (timeLeft <= 0) {
            this.logout(true);
            return;
        }

        this.logoutTimer = setTimeout(() => {
            this.logout(true);
        }, timeLeft);
    }

    private setLoginState(state: boolean) {
        this._isLoggedIn.set(state);
        localStorage.setItem('isLoggedIn', String(state));
    }
}