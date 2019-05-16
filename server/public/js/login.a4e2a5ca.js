(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["login"],{a55b:function(e,a,t){"use strict";t.r(a);var r=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("v-container",{attrs:{fluid:"","fill-height":""}},[t("v-layout",{attrs:{"align-center":"","justify-center":""}},[t("v-flex",{attrs:{xs12:"",sm8:"",md5:""}},[t("v-card",[t("v-toolbar",{staticClass:"elevation-1 py-2",attrs:{dark:"",color:"primary"}},[t("v-toolbar-title",[e._v("Login Form")]),t("v-spacer")],1),t("v-form",{ref:"form"},[t("v-card-text",[t("v-text-field",{attrs:{"prepend-icon":"person",name:"email",label:"Email",type:"email",rules:e.emailRules,required:"","validate-on-blur":""},on:{keyup:function(a){return!a.type.indexOf("key")&&e._k(a.keyCode,"enter",13,a.key,"Enter")?null:e.submit(a)}},model:{value:e.email,callback:function(a){e.email=a},expression:"email"}}),t("v-text-field",{attrs:{"prepend-icon":"lock",name:"password",label:"Password",type:"password",rules:e.passwordRules,counter:64,required:"","validate-on-blur":""},on:{keyup:function(a){return!a.type.indexOf("key")&&e._k(a.keyCode,"enter",13,a.key,"Enter")?null:e.submit(a)}},model:{value:e.password,callback:function(a){e.password=a},expression:"password"}})],1),t("v-card-actions",{staticClass:"px-3"},[t("span",{staticClass:"accent--text"},[e._v("Not have an account yet?")]),t("router-link",{staticClass:"pl-2 white--text",attrs:{to:"/register"}},[e._v("Register")]),t("v-spacer"),t("v-btn",{attrs:{color:"primary"},on:{click:function(a){return a.preventDefault(),e.submit(a)}}},[e._v("Login")])],1)],1)],1)],1)],1)],1)},i=[],s=t("cebc"),n=t("1dce"),o=t("b5ae"),l=t("2f62"),u=t("de0e"),d={name:"login",mixins:[n["validationMixin"]],validations:{email:{required:o["required"],email:o["email"]},password:{required:o["required"],minLength:Object(o["minLength"])(8),maxLength:Object(o["maxLength"])(64)}},data:function(){var e=this;return{email:"",password:"",emailRules:[function(){var a="";return e.$v.email.required||(a+="E-mail is required. "),e.$v.email.email||(a+="Must be valid e-mail."),a||!0}],passwordRules:[function(){var a="";return e.$v.password.required||(a+="Password is required. "),e.$v.password.minLength&&e.$v.password.maxLength||(a+="Password must contain 8 to 64 characters."),a||!0}]}},computed:Object(s["a"])({},Object(l["b"])({user:"users/getUser"})),methods:{submit:function(){var e=this;if(this.$refs.form.validate(),!this.$v.$invalid)return this.$store.dispatch("users/login",{username:this.email,password:this.password}).then(function(){if(e.user){var a="owner"===e.user.role?"?own=true":"";e.$router.push("/restaurants".concat(a))}})}},created:function(){this.user&&Object(u["a"])("You are already logged in.","info")}},c=d,m=t("2877"),p=t("6544"),v=t.n(p),f=t("8336"),b=t("b0af"),w=t("99d9"),h=t("a523"),x=t("0e8f"),y=t("4bd4"),g=t("a722"),k=t("9910"),V=t("2677"),$=t("71d9"),q=t("2a7f"),C=Object(m["a"])(c,r,i,!1,null,null,null);a["default"]=C.exports;v()(C,{VBtn:f["a"],VCard:b["a"],VCardActions:w["a"],VCardText:w["b"],VContainer:h["a"],VFlex:x["a"],VForm:y["a"],VLayout:g["a"],VSpacer:k["a"],VTextField:V["a"],VToolbar:$["a"],VToolbarTitle:q["a"]})}}]);
//# sourceMappingURL=login.a4e2a5ca.js.map