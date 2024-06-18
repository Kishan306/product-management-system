import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  http: any;
  user$: any;

  constructor(
    private fireauth: AngularFireAuth, 
    private router: Router,
    private firestore: AngularFirestore,
    private message: NzMessageService
  ) { }

  //login
  login(email: string, password: string){
    this.fireauth.signInWithEmailAndPassword(email, password).then((res)=>{
      localStorage.clear();
      localStorage.setItem('token', email);
      localStorage.setItem('userid', res.user!.uid);
      this.getUserByEmail(email);
      this.message.success(`Welcome, ${email}!!`)
      
      if(res.user?.emailVerified == false ){
        this.router.navigate(['verify-email']);
      }
    }, err => {
      alert(err.message);
      this.router.navigate(['login']);
    })
  }

  getUserByEmail(email: string){
    return this.firestore.collection('users', ref => ref.where('email', '==', email)).snapshotChanges()
    .subscribe( (res: any)=>{
      const users = res.map((e: any)=>{
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      })
      if(users.length>0){
        const user = users[0];
        if(user.isSuperAdmin == true){
          localStorage.setItem('isAdmin', 'true')
          this.router.navigate(['adminproductslist']);
        } else {
          localStorage.setItem('isAdmin', 'false')
          this.router.navigate(['products']);
        }
      } else {
        localStorage.removeItem('isAdmin')
      }
    })
  }

  isLoggedInVar = false;
  userMail!: string;
  isLoggedIn(){
    if(localStorage.getItem('token')){
      this.isLoggedInVar = true;
      this.userMail = localStorage.getItem('token')!;
    }
  }

  isAdminVar = false;
  isAdmin(){
    if(localStorage.getItem('isAdmin') == 'true'){
      this.isAdminVar = true;
    } else {
      this.isAdminVar = false
    }
  }


  avatar!: string;
  fetchAvatar(){
    if(localStorage.getItem('token')){
      this.avatar = localStorage.getItem('token')!.slice(0, 1).toUpperCase();
    }
  }

  getUserEmail(){
    const email = localStorage.getItem('token');
    return email;
  }

  signup(user: User){
    return this.fireauth.createUserWithEmailAndPassword(user.email, user.password).then((res)=>{
      if(res.user){
        this.firestore.collection('users').doc(res.user.uid).set({
          email: user.email,
          uid: res.user!.uid,
          isSuperAdmin: user.isSuperAdmin
        }).then(()=>{
          this.sendEmailForVerification(res.user);
          alert("Signed Up Successfully!!");
          this.router.navigate(['verify-email']);
        })
      }
    }, err=>{
      alert(err.message);
      this.router.navigate(['signup'])
    })
  }



  sendEmailForVerification(user: any){
    user.sendEmailVerification().then((res:any)=>{
      this.router.navigate(['/verify-email']);
    }, (err: any)=>{
      alert('Something went wrong, not ablt to sent mail to registered email');
    })
  }

  logout(){
    this.fireauth.signOut().then(()=>{
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('userid')
      this.isLoggedInSubject.next(false);
      this.router.navigate(['login']);
    }, err=>{
      alert(err.message);
    })
  }

  forgotPassword(email: string){
    this.fireauth.sendPasswordResetEmail(email).then(()=>{
      this.router.navigate(['/verify-email']);
    }, err=>{
      alert('Something went wrong');
    })
  }

  googleSignIn(){
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then((res)=>{
      this.router.navigate(['products']);
      localStorage.setItem('token', JSON.stringify(res.user?.email))
    }, err=>{
      alert(err.message);
    })
  }

}
