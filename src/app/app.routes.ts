import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { authGuard } from './guards/auth.guard';
import { ProductsComponent } from './components/main/products/products.component';
import { VerifyEmailComponent } from './components/auth/verify-email/verify-email.component';
import { CartComponent } from './components/main/cart/cart.component';
import { ProductformComponent } from './components/admin/productform/productform.component';
import { NotfoundComponent } from './components/main/notfound/notfound.component';
import { WishlistComponent } from './components/main/wishlist/wishlist.component';
import { AdminproductlistComponent } from './components/admin/adminproductlist/adminproductlist.component';
import { UpdateformComponent } from './components/admin/updateform/updateform.component';
import { CheckoutComponent } from './components/main/checkout/checkout.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'verify-email',
        component: VerifyEmailComponent
    },
    {
        path: 'products',
        component: ProductsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'cart',
        component: CartComponent,
        canActivate: [authGuard]
    },
    {
        path: 'wishlist',
        component: WishlistComponent,
        canActivate: [authGuard]
    },
    {
        path: 'add-product',
        component: ProductformComponent,
        canActivate: [authGuard, adminGuard]
    },
    {
        path: 'adminproductslist',
        component: AdminproductlistComponent,
        canActivate: [authGuard]
    },
    {
        path: 'updateproduct/:id',
        component: UpdateformComponent,
        canActivate: [authGuard, adminGuard]
    },
    {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [authGuard]
    },
    {
        path: '**',
        component: NotfoundComponent
    }
];
