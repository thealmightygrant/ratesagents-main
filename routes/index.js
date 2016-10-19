var express = require('express')
,   router  = express.Router();

router.get('/', function(req, res){
  res.render('main-sales',
             {
               navType: 'main-sales',
               navData: {
                 realtors: {
                   title: "Realtors",
                   linkData: [
                     {
                       href: "/realtors/login",
                       value: "Login"
                     },
                     {
                       href: "/realtors/faqs",
                       value: "FAQs"
                     },
                     {
                       href: "/realtors/register",
                       value: "Register"
                     }
                   ]
                 },
                 homeowners: {
                   title: "Homeowners",
                   linkData: [
                     {
                       href: "/homeowners/login",
                       value: "Login"
                     },
                     {
                       href: "/homeowners/faqs",
                       value: "FAQs"
                     },
                     {
                       href: "/homeowners/register",
                       value: "Register"
                     }
                   ]
                 },
                 company: {
                   title: "Company",
                   linkData: [
                     {
                       href: "/about",
                       value: "About Us"
                     },
                     {
                       href: "/license",
                       value: "License"
                     },
                   ]
                 }
               },
               socialData: {
                 page_name: ""
                 , description: "Get more options when selling your home. Choose a lower commission rate, more experience, or the best reviewed realtors. Sign up for free!"
                 //, image: "/images/bat-country.jpg"
                 , title: "Let Realtors fight to Represent Your Home."
               }
             });
});

module.exports = router;
