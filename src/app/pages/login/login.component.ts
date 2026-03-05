import { Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
    isLogin = true;
    form!: FormGroup;

    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
        // if (this.auth.isLoggedIn()) {
        //     this.router.navigate(['/dashboard']);
        // }

        this.createForm();
    }

    ngOnInit(): void {
        if (this.auth.isLoggedIn()) {
            this.router.navigate(['/dashboard']);
        }
    }

    createForm() {
        this.form = this.fb.group({
            username: ['', [
                Validators.required,
                Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
            ]],
            password: ['', this.isLogin ? [Validators.required] : [
                Validators.required,
                // Validators.minLength(6),
                // Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*]).*$/),
            ]],
        });
    }

    toggle() {
        this.isLogin = !this.isLogin;
        this.createForm();
    }

    submit() {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }
        const { username, password } = this.form.value;
        if (this.isLogin) {
            this.auth.login(username, password);
            return;
        }

        this.auth.signup(username, password);
    }
}