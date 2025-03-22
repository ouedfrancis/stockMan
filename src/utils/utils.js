import DOMPurify from 'dompurify';

import draftToHtml from 'draftjs-to-html';

import { NotificationManager} from 'react-notifications';
import ModelesDataService from "../services/modeles.service";
import MessagesDataService from "../services/messagerie/messages.service";
import globalObject from '../global.js'
import { Font, StyleSheet  } from '@react-pdf/renderer';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";


pdfMake.vfs = pdfFonts.vfs;
Font.register({
      family: 'Open Sans',
      fonts: [
        { src: '/fonts/open-sans-regular.ttf' },
        { src: '/fonts/open-sans-600.ttf', fontWeight: 600 }
      ]
    })
Font.register({
      family: 'Poppins',
      fonts: [
       { src: 'fonts/open-sans-regular.ttf' },
        { src: '/fonts/open-sans-600.ttf', fontWeight: 600 }      ]
    })
const styles = StyleSheet.create({
    title: { fontFamily: 'Open Sans', fontSize: "14px", fontWeight: 600 }, // doesn't work without fontFamily
    bold: { fontFamily: 'Open Sans', fontSize: 9, fontWeight: 600  }, // doesn't work without fontFamily
    textAlign: { textAlign: 'center' },
    tableHeader:{fontFamily: 'Open Sans', fontWeight: 700,"border": "1px", "fontSize": "10px", backgroundColor:'#adb5bd'},
    tableColSpan:{fontFamily: 'Open Sans', fontWeight: 600,"fontSize": "9px",backgroundColor:'#ced4da' },
    table:{border: "1px", fontSize: "10px"},
    tableTr: {  fontSize: "9px" },
    fontSize: {  fontSize: "9px" },

})
 /* eslint-disable */
function validateMobileNumber(telNumber) {
    //var re = /^(\\+|0{0,2})[0-9]{2,3}[0-9]{9,10}$/;
    //var re=/^(\\+|0{0,2})[0-9]{2,3}[0-9]{9,10}$/
    var re=/^(\+|0{0,2})[0-9]{2,3}[0-9]{9,10}$/

        return re.test(telNumber);
    
  }




  //for resgister patient
function isValidPhoneNumber(phoneNumber) {
  // Expression régulière pour vérifier le format d'un numéro de téléphone
  const phoneRegex = /^\+?[0-9]{11,15}$/;

  return phoneRegex.test(phoneNumber);
}
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

 function validDate(testDate){
        /*/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/*/
    const date_regex =/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/ 
        if (date_regex.test(testDate)) {
           return true;
        }
        else{
          return false;
        }
}
function formatDate(date)
{
  if (date.length>=10)  
  {
     let jour=date.substring(8,10);
      let mois=date.substring(5,7);
      let annee=date.substring(0,4);
      let d= jour+"/"+mois+"/"+annee;
      return d;
    }
 else 
 return ""
}

/*
//compare 2 string of date isLater("2012-12-01", "2012-11-01") return true
function isLater(dateString1, dateString2) {
  return dateString1 > dateString2
}*/

//return -1 if date1 > date2
//return 1 if date1 < date2
//return 0 if date1 = date2
function dateCompare(date1, date2) {
  let jour1=date1.substring(8,10);
  let mois1=date1.substring(5,7);
  let annee1=date1.substring(0,4);

  let jour2=date2.substring(8,10);
  let mois2=date2.substring(5,7);
  let annee2=date2.substring(0,4);
  if(parseInt(annee1)>parseInt(annee2))
    return -1
  else
     if(parseInt(annee1)<parseInt(annee2))
        return 1
     else
     {
      if(parseInt(mois1)>parseInt(mois2))
        return -1
      else
         if(parseInt(mois1)<parseInt(mois2))
            return 1
         else
         {
             if(parseInt(jour1)>parseInt(jour2))
                return -1
              else
                 if(parseInt(jour1)<parseInt(jour2))
                    return 1
                 else
                    return 0
         }
     }

}
function calculateAge(dateNaissance) {

let anneeNais=parseInt(dateNaissance.substring(0,4));
let dateNow=getGMTDateTime();
//var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
 return dateNow.getFullYear()-anneeNais;
}

function nombreDeMois(date1, date2) {
    // Convertir les dates en objets Date si elles ne le sont pas déjà
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);

    // Calculer la différence en millisecondes entre les deux dates
    const timeDiff = d2.getTime() - d1.getTime();

    // Calculer le nombre de mois en utilisant le facteur de conversion (environ 30.44 jours par mois)
    const monthsDiff = Math.round(timeDiff / (30.44 * 24 * 60 * 60 * 1000));

    return monthsDiff;
}
/*function calculateAgeString(dateNaissance) {

let anneeNais=parseInt(dateNaissance.substring(0,4));
let moisNais=parseInt(dateNaissance.substring(5,7));
let jourNais=parseInt(dateNaissance.substring(8,10));
let dateNow=new Date();
//var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
let an= dateNow.getFullYear()-anneeNais
let mois=dateNow.getMonth()+1-moisNais
let jour=dateNow.getDate()-jourNais
let age=an+"ans";
if(mois>0)
    age=age+" "+mois+"mois"
else
    age=age+" 0"+"mois"

if(jour>0)
    age=age+" "+jour+"jours "


 return age;
}
*/ 

//const date1 = new Date(2020, 0, 1);  // 1er janvier 2020
//const date2 = new Date(2023, 5, 6);  // 6 juin 2023

//const diff = diffDates(date1, date2);
function calculateAgeString(dateNaissance) {

 /*let anneeNais=parseInt(dateNaissance.substring(0,4));
let moisNais=parseInt(dateNaissance.substring(5,7));
let jourNais=parseInt(dateNaissance.substring(8,10));
let dateNow=getGMTDateTime();


console.log("=================================",anneeNais)
console.log("=================================",moisNais)
console.log("=================================",jourNais)

console.log("=================================",dateNow.getFullYear())
console.log("=================================",dateNow.getMonth()+1)
console.log("=================================",dateNow.getDate())
console.log("=================================",dateNow)
let years=0

if(dateNow.getFullYear()>=anneeNais)
years=dateNow.getFullYear()-anneeNais;

let months=0;
if(dateNow.getMonth()+1 >=moisNais)
    months=dateNow.getMonth()+1-moisNais




let days=0;
if(dateNow.getDate()>=jourNais&&months>0)
    days=dateNow.getDate()-jourNais
else
    days=dateNow.getDate()
*/

/*let dateNow=getGMTDateTime();
  let dateNais=new Date(dateNaissance);
  const diffTime = Math.abs(dateNais - dateNow);
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const years = Math.floor(diffDays / 365);
  const bissextiles =Math.floor(years/4)
  diffDays=diffDays+bissextiles 
  const months = Math.floor((diffDays % 365) / 30);
  const days = diffDays % 30;*/


const aujourdHui = new Date(); // Date actuelle
    const naissance = new Date(dateNaissance); // Convertir la date de naissance en objet Date

  // Calcul de l'âge en années
  let years = aujourdHui.getFullYear() - naissance.getFullYear();

  // Calcul des mois et ajustement des années si nécessaire
  let months = aujourdHui.getMonth() - naissance.getMonth();
  if (months < 0) {
    years--; // Réduire d'une année si le mois n'est pas encore atteint cette année
    months += 12; // Ajouter 12 mois pour avoir une valeur positive
  }

  // Calcul des jours et ajustement des mois si nécessaire
  let days = aujourdHui.getDate() - naissance.getDate();
  if (days < 0) {
    months--; // Réduire d'un mois si le jour n'est pas encore atteint ce mois
    const moisPrecedent = new Date(aujourdHui.getFullYear(), aujourdHui.getMonth(), 0); // Dernier jour du mois précédent
    days += moisPrecedent.getDate(); // Ajouter les jours du mois précédent
  }

 
  let age=""
  if(years>0)
    age+=years+" ans ";
  if(months>0)
    age+=months+" mois ";
  if(days>0)
    age+=days+" jours";

return age;

}

function convertDateTOAnMoisJour(str) {

if(str!=null && str.length==10)
 {
    if(str.charAt(2)=="/" || str.charAt(2)=="-")
        return str.substring(6,10)+"-"+str.substring(3,5)+"-"+str.substring(0,2)
    else
        return str.substring(0,4)+"-"+str.substring(5,7)+"-"+str.substring(8,10)
}else 
return str

}

function dateDiff(date1, date2) {
let dt1 = new Date(date1);
let dt2 = new Date(date2);
return Math.abs(Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24))/365);
}



function setCssColor(customProperty, color) {
  //console.log(`Updating --color-logo to: ${color}`);
  document.documentElement.style.setProperty(customProperty, color);
}

function setCssSectionColor(section, bgColor,textColor, bgSelectColor,textSelectColor) {

    if(section=="body")
    {
    setCssColor("--body-background-color",bgColor);
    setCssColor("--main-container-jumbotron-background-color",bgColor)
    }else 

    if(section=="menu")
    {
    setCssColor("--menu-a-link-color",textColor);
    setCssColor("--menu-a-hover-color",textSelectColor)
    setCssColor("--menu-a-hover-background-color",bgSelectColor);
    setCssColor("--menu-a-visited-color",textColor)
    setCssColor("--submenu-color",bgColor);

    setCssColor("--horizontal-menu-background-color",bgColor)
    setCssColor("--vertical-menu-background-color",bgColor);
    setCssColor("--vertical-menu-text-color",textColor)
    setCssColor("--page-title-background-color",bgColor);

    setCssColor("--profile-menu-background-color",bgColor)
    setCssColor("--profile-menu-text-color",textColor)

    setCssColor("--a-link-color",bgColor)
    setCssColor("--a-hover-color",bgSelectColor)
    setCssColor("--a-visited-color",bgColor)
    setCssColor("--a-active-color",textColor)




    setCssColor("--page-title-background-color",bgColor)
setCssColor("--page-title-color",textSelectColor)


/*    --a-link-color: #254d32;
--a-hover-color: #BE0000;
--a-visited-color: #254d32;
--a-active-color: #254d32;*/
    }else 
    if(section=="table")
    {
    setCssColor("--table-th-text-color",textColor);
    setCssColor("--styled-table-thead-tr-text-color",textColor);
    setCssColor("--table-th-bacground-color",bgColor);
    setCssColor("--table-datatable-thead-text-color",textColor);
    setCssColor("--table-datatable-thead-background-color",bgColor);
      setCssColor("--bs-table-bg",bgColor);
    setCssColor("--styled-table-thead-tr-background-color",bgColor);

    
    /*setCssColor("--table-bordered-tbody-td-border-background-color",bgColor);*/

    /*}else 
     if(section=="modal")
    {*/
    setCssColor("--modal-title-text-color",textColor);
    setCssColor("--modal-title-background-color",bgColor);
    setCssColor("--modal-footer-background-color",bgColor);
    setCssColor("--modal-specific-background-color",bgColor);
    setCssColor("--div-sub-box-background-color",bgColor);
    setCssColor("--div-sub-box--title-text-color",textColor);


    setCssColor("--subtitle-text-color",textColor);
    setCssColor("--subtitle-bacground-color",bgColor);
    }

   

/*
--styled-table-thead-tr-background-color: #254d32;
--styled-table-thead-tr-text-color: #ffffff;
--styled-table-tbody-tr-background-color: #f3f3f3;
--styled-table-tbody-tr-texte-color:#2e401c;

--div-box-background-color: #fff;


--div-sub-box--title-text-color: white;
--div-sub-box-background-color: #254d32;

--heading-text-color: #2e401c;
--heading-border-background-color: #2e401c;
--heading-background-color: #f3f3f3;*/

}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function setDateZero(date){
  return date < 10 ? '0' + date : date;
}
function currentDateTime()
{
    let myCurrentDate = getGMTDateTime();
    let date = myCurrentDate.getFullYear() + '-' + setDateZero(myCurrentDate.getMonth()+1) + '-' + setDateZero(myCurrentDate.getDate()) +' '+ setDateZero(myCurrentDate.getHours())+':'+ setDateZero(myCurrentDate.getMinutes())+':'+ setDateZero(myCurrentDate.getSeconds());
    return date;
}
function currentDate()
{
    let myCurrentDate = getGMTDateTime();
    

    let date = myCurrentDate.getFullYear() + '-' + setDateZero(myCurrentDate.getMonth()+1) + '-' + setDateZero(myCurrentDate.getDate());
    return date;
}


function capitalizeFist(str){
    if(str!=null&& str.length>0)
    {
        let s=str.toLowerCase();
        return s.charAt(0).toUpperCase() + s.slice(1);
    }else
 return str
}


function getDate(d){

var date = "";
if(d==null)
 date=new Date();
else
 date=d
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
// an application may want to use UTC and make that visible
//options.timeZone = 'UTC';
options.timeZoneName = 'short';
let resp=date.toLocaleDateString('fr-FR', options).split(',')[0]
//console.log(resp);
return resp;
}


function calculateAgeYear(dateNaissance) {

let anneeNais=parseInt(dateNaissance.substring(0,4));
let dateNow=getGMTDateTime();
//var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
let an= dateNow.getFullYear()-anneeNais
return an;
}

function  passwordStrength(password){

        //total score of password
        let iPasswordScore = 0;

        if( password.length < 8 )
            return 0;
        else if( password.length >= 10 )
            iPasswordScore += 2;
        else 
            iPasswordScore += 1;

        //if it contains one digit, add 2 to total score
        if( password.match("(?=.*[0-9]).*") )
            iPasswordScore += 2;

        //if it contains one lower case letter, add 2 to total score
        if( password.match("(?=.*[a-z]).*") )
            iPasswordScore += 2;

        //if it contains one upper case letter, add 2 to total score
        if( password.match("(?=.*[A-Z]).*") )
            iPasswordScore += 2;    

        //if it contains one special character, add 2 to total score
        if( password.match("(?=.*[~!@#$%^&*()_-]).*") )
            iPasswordScore += 2;

        return iPasswordScore;

        /*output exemple
         * password: 3
            password1a: 6
            password01: 6
            Password01: 8
            P@ssword0: 9
            P@ssword01: 10
         */       
    }

function getFirstLetters(str) {
  const firstLetters = str
    .split(' ')
    .map(word => word[0])
    .join('');

  return firstLetters;
}


function compareArray(array1,array2) {
const array2Sorted = array2.slice().sort();
return array1.length === array2.length && array1.slice().sort().every(function(value, index) {
    return value === array2Sorted[index];
});
}


function filterArrayByFieldNameAndReturnUniqFieldValue(arr, fieldName) {
    return [...new Map(arr.map(item => [item[fieldName], item])).values()]
}

function filterArrayByFieldNameAndValue( array,fieldName, fieldValue)
{
    return  array.filter(function (el) {return el[fieldName] ==fieldValue;});
}

function filterArrayByFieldNameAndValueAndOneObject( array,fieldName, fieldValue)
{
    if(array!=null && array.length>0)
   {
       let list=array.filter(function (el) {return el[fieldName] ==fieldValue;});
       if(list.length>0)
        {
            return list[0];
        }
        else
            return null;
   }else 
   return null;
}
//var names = ["Mike","Matt","Nancy","Adam","Jenny","Nancy","Carl","Mike","Mike"];
//    return =[ 'Mike', 'Matt', 'Nancy', 'Adam', 'Jenny', 'Carl' ]
function getUniqValueInArrayOfString(array) {
   return Array.from(new Set(array));
}

function truncateStr(str, length, ending) {
    if (length == null) {
      length = 100;
    }
    if (ending == null) {
      ending = '...';
    }
    if (str!=null && str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  };


function timeConvert(num) {
if(num!=null)
{
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + " h " + rminutes + " mn";
}else
return 0
}

function dateTimeToString(date) {
let mois=date.getMonth()+1;

return date.getFullYear()+"-"+ (mois.toString().length==2?mois.toString():("0"+mois.toString())) +"-"+ (date.getDate().toString().length==2?date.getDate().toString():("0"+date.getDate().toString())) +" "+(date.getHours().toString().length==2?date.getHours().toString():("0"+date.getHours().toString())) +":"+ (date.getMinutes().toString().length==2?date.getMinutes().toString():("0"+date.getMinutes().toString()))+":"+(date.getSeconds().toString().length==2?date.getSeconds().toString():("0"+date.getSeconds().toString()))

}
function dateToString(date) {
let mois=date.getMonth()+1;

return date.getFullYear()+"-"+ (mois.toString().length==2?mois.toString():("0"+mois.toString())) +"-"+ (date.getDate().toString().length==2?date.getDate().toString():("0"+date.getDate().toString()));

}



//date ex: "2023-03-23"
function weekDay(date) {

var dt = new Date();
if(date!=null)
dt=new Date(date)  //current date of week
var currentWeekDay = dt.getDay();
var lessDays = currentWeekDay == 0 ? 6 : currentWeekDay-1
var wkStart = new Date(new Date(dt).setDate(dt.getDate()- lessDays));
var wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate()+6));

    return {"start":dateToString(wkStart),"end":dateToString(wkEnd) }
}


function getFirstAndLastDayOfMonth(date) {
    // Crée un nouvel objet Date avec la même année et le même mois, mais avec le jour 1 pour obtenir le premier jour du mois
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    
    // Crée un nouvel objet Date avec le mois suivant et le jour 0 pour obtenir le dernier jour du mois courant
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    return {
        firstDay: firstDay,
        lastDay: lastDay
    };
}

function sliceString( str,begin, end)
{
    //let newStr = str.split(''); // or newStr = [...str];
    //var  newStr = (' ' + str).slice(1);
    //newStr.slice(begin,end);
    //newStr = newStr.join('');
   // return newStr.toString().slice(begin,end);

    let  newStr =  [...str];
    newStr.splice(16);
    return newStr.join('');
}


function imc( poids, taille)
{

    if(!(isNaN(poids) ||isNaN(taille)) )
    {
        var tailleEnMetre=parseFloat(taille)/100
        if(tailleEnMetre>0)
        {
        var imc=parseFloat(poids)/(tailleEnMetre*tailleEnMetre)
        imc= imc.toFixed(2)
        if(imc<18.5)
            return  imc +" ("+"Insuffisance pondérale"+")"
        else
            if(imc>=18.5  && imc<25)
                 return  imc +" ("+"Corpulence normale"+")"
             else
                if(imc>=25  && imc<30)
                    return  imc +" ("+"Surpoids"+")"
                    else
                        if(imc>=30  && imc<35)
                            return  imc +" ("+"Obésité modérée"+")"
                            else
                                if(imc>=35  && imc<40)
                                return  imc +" ("+"Obésité sévère"+")"
                                else
                                    if(imc>=40)
                                        return  imc +" ("+"Obésité morbide"+")"
        }
                                       



    }
    return ""

}

function addLibrary(urlOfTheLibrary) {
const script = document.createElement('script');
script.src = urlOfTheLibrary;
script.async = true;
document.body.appendChild(script);
}


function isEntier(variable) {
  if (typeof variable === 'string' && variable.trim() !== '') {
    variable = Number(variable);
  }

  if (typeof variable !== 'number' || isNaN(variable)) {
    return false;
  }

  if (variable === 0) {
    return true; // 0 est considéré comme un entier positif
  }

  return Number.isInteger(variable) && variable !== 0;
}

function isInteger(str) {
  /*if (typeof str !== 'string') {
    return false;
  }*/

  
  /*the Math.sign() method has 5 possible return values:

    it returns 1 if the argument is positive
    it returns -1 if the argument is negative
    it returns 0 if the argument is 0
    it returns -0 if the argument is -0
    in all other cases it returns NaN (not a number) 
    */ 
  /*const num = Number(str);

  if (Number.isInteger(num) && Math.sign(num) >=- 1) {
    return true;
  }

  return false;*/
    console.log("str====>",str)
    //return typeof str === 'number' && str % 1 === 0;
  return Number.isInteger(str)|| (str == 0) || (str == "0");;

 /*     if((parseFloat(str) == parseInt(str)) && !isNaN(str)){ 
      
      return true;
  } else {
     
      return false;
  }*/
}



 function createMarkup1(html) {
    return {
      __html: DOMPurify.sanitize(html)
    }
  }

 function createMarkup2(html) {
    return {
      __html: html
    }
  }



   function createMarkup(data) {
    if(isJsonString(data))
        data=draftToHtml(JSON.parse(data))

    return {
      __html: data
    }
  }



  function isJsonString(text) {
            if (typeof text !== "string") {
                return false;
            }
            try {
                JSON.parse(text);
                return true;
            } catch (error) {
                return false;
            }
        }






/*function isPositiveInteger(str) {
  if (typeof str !== 'string') {
    return false;
  }

  const num = Number(str);

 
  if (Number.isInteger(num) && (Math.sign(num) === 0|| Math.sign(num) === 1)) {
    return true;
  }

  return false;
}*/


function stringToColor(stringInput) {

    let encode=encodeBase64(stringInput)
    let stringUniqueHash = [...stringInput].reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return `hsl(${stringUniqueHash % 360}, 95%, 35%)`;
}

function randomString(taille) {
//Can change 7 to 2 for longer results.
let value = (Math.random() + 1).toString(36).substring(taille);
return value
}



function createNotification  (type,title, msg)  {
 
      switch (type) {
        case 'info':
          NotificationManager.info(msg);
          break;
        case 'success':
          NotificationManager.success(msg, title);
          break;
        case 'warning':
          NotificationManager.warning(msg, title, 3000, () => {
            alert(msg);
          });
          break;
        case 'error':
          NotificationManager.error(msg, title, 5000, () => {
            alert(msg);
          });
          break;
      }
   
}

function autoCorrection(text, correction) {
  const reg = new RegExp(Object.keys(correction).join("|"), "g");
  return text.replace(reg, (matched) => correction[matched]).replaceAll("[[","").replaceAll("]]","");
}
//changeDivContent('#content',"whatever");
function changeDivContent(divSelector, value) {
    if(value!=null&&document.querySelector(divSelector)!=null)
    document.querySelector(divSelector).innerHTML = value;
}
async function addModele (typeModele, nomModele,description)  {
    let obj={}
    obj.typeModele=typeModele
    obj.nomModele=nomModele
    obj.description=description
    obj.actif=true
    obj.userId=globalObject?.user?.id
    let response= await ModelesDataService.createAsync(obj);
}

async function countNewMessage() {
    
    let count=""
    if(globalObject?.personne!=null && globalObject?.personne.personneId!=null)
    {
        let resp=null;
        let query=`?destinataireId=${globalObject?.personne.personneId}&deleteByDestinataire=false&lu=false&ignoreActivity=true`;
            resp= await MessagesDataService.findAsync(query);  
          if(resp!=null && resp.status=="200" )          
            {
                if(resp.data.length>0)
                 count=await resp.data.length                               
            }
    }
    return  await count;
}

function replaceAllCustom(data, search, replace) {
    if(data!=undefined &&data!=null && data!="")
        return data?.split(search)?.join(replace);
    else
        return data
}



function stringToArray(chaine) {
  var tableauResultat = [];
  if(chaine==null)
    return tableauResultat

  // Vérifier la présence de points-virgules
  if (chaine.includes(';')) {
    var elements = chaine.split(';');
    tableauResultat = tableauResultat.concat(elements);
  }

  // Vérifier la présence de retours à la ligne (Unix ou Windows)
  if (chaine.includes('\n')) {
    var elementsUnix = chaine.split('\n');
    tableauResultat = tableauResultat.concat(elementsUnix.filter(Boolean));
  } else if (chaine.includes('\r\n')) {
    var elementsWindows = chaine.split('\r\n');
    tableauResultat = tableauResultat.concat(elementsWindows.filter(Boolean));
  }
  let list=[]
  if(tableauResultat!=null && tableauResultat.length>0)
  {
    for (let i = 0; i < tableauResultat.length; i++)
    {
        if(tableauResultat[i]!="")
        {
        let elt={}
        elt.key=i+1;

        elt.value=tableauResultat[i]
        list.push(elt) 
        }
       
        
        }

    tableauResultat=list;
  }
//console.log("tableauResultat===============>>>",tableauResultat)
  return tableauResultat;
}



/*trierListeObjets
var listeObjets = [
  { nom: 'Objet 1', champ1: 3, champ2: 'A' },
  { nom: 'Objet 2', champ1: 1, champ2: 'B' },
  { nom: 'Objet 3', champ1: 2, champ2: 'C' }
];

var champs = ['champ1', 'champ2']; // Champs pour le tri, dans l'ordre de priorité

*/
function trierListeObjets(liste, champs) {
  return liste.sort(function(a, b) {
    for (var i = 0; i < champs.length; i++) {
      var champ = champs[i];
      if (a[champ] < b[champ]) {
        return -1;
      } else if (a[champ] > b[champ]) {
        return 1;
      }
    }
    return 0;
  });
}


function encodeBase64(str) {
  // Encodage en base 64
  const encodedStr = btoa(str);
  return encodedStr;
}

function decodeBase64(str) {
  // Encodage en base 64
  const encodedStr = atob(str);
  return encodedStr;
}

//var dateStr = '05/23/2014';
//var day = getDayName(dateStr, "en-US");
function getDayName(dateStr,truncate, locale)
{   if(locale==null)
        locale="fr-FR"
    var date = new Date(dateStr);
    let day= date.toLocaleDateString(locale, { weekday: 'long' });  
    //day=day[0].toUpperCase()+day.substring(1, 3);
    day=day[0].toUpperCase()+day.slice(1);
    if(truncate!=null && truncate==true)
    day=day.slice(0,3)
    return day;      
}
//var dateStr = '05/23/2014';
//var day = getDayName(dateStr, "en-US");
function getMonthName(dateStr,truncate, locale)
{   if(locale==null)
        locale="fr-FR"
    var date = new Date(dateStr);
    let day= date.toLocaleDateString(locale, { month: 'long' });  
    //day=day[0].toUpperCase()+day.substring(1, 3);
    day=day[0].toUpperCase()+day.slice(1);
    if(truncate!=null && truncate==true)
    day=day.slice(0,3)
    return day;      
}

function getDateName(dateStr,truncate, locale)
{
    var date = new Date(dateStr);
    return getDayName(dateStr,truncate, locale) + " "+date.getDate()+" " + getMonthName(dateStr,truncate, locale)+" "+date.getFullYear()
}
function getDateTimeName(dateStr,truncate, locale)
{
    var hour=""
    if(dateStr.length>15)
        hour=dateStr.slice(11,16).replace(":","h:")
    console.log("dateStr",dateStr)
    console.log("hour",hour)
    var date = new Date(dateStr);
        
    return getDayName(dateStr.slice(0, 10),truncate, locale) + " "+date.getDate()+" " + getMonthName(dateStr.slice(0, 10),truncate, locale)+" "+date.getFullYear()+" à "+hour 
}

function genererIntervalleTemps(heureDebut, heureFin, incrementMinutes) {
  // Convertir les heures de début et de fin en objets Date
  const dateDebut = new Date(`1970-01-01T${heureDebut}:00`);
  const dateFin = new Date(`1970-01-01T${heureFin}:00`);
  
  // Initialiser un tableau pour stocker les intervalles de temps
  const intervals = [];

  // Boucler tant que la date de début est inférieure à la date de fin
  while (dateDebut < dateFin) {
    // Ajouter la date de début actuelle à la liste des intervalles
    intervals.push(dateDebut.toTimeString().slice(0, 5));

    // Incrémenter la date de début de la durée spécifiée en minutes
    dateDebut.setMinutes(dateDebut.getMinutes() + incrementMinutes);
  }

  // Vérifier si le dernier intervalle dépasse l'heure de fin
  if (intervals.length > 0 && intervals[intervals.length - 1] !== heureFin) {
    // Retirer le dernier intervalle s'il ne correspond pas
    intervals.pop();
  }

  return intervals;
}

function ajouterMinutesAHeure(heure, minutes) {
  // Diviser l'heure en heures et minutes
  const [heuresStr, minutesStr] = heure.split(":");
  
  // Convertir les parties en entiers
  const heures = parseInt(heuresStr);
  const minutesActuelles = parseInt(minutesStr);
  
  // Ajouter les minutes
  const nouvellesMinutes = minutesActuelles + minutes;
  
  // Calculer les heures et minutes finales
  const heuresFinales = heures + Math.floor(nouvellesMinutes / 60);
  const minutesFinales = nouvellesMinutes % 60;
  
  // Formater l'heure finale
  const heureFinale = `${heuresFinales.toString().padStart(2, '0')}:${minutesFinales.toString().padStart(2, '0')}`;
  
  return heureFinale;
}
function ajouterMinutesALaDate(date, minutes) {
    date=new Date(date)
  // Convertir la date en millisecondes depuis le 1er janvier 1970 (timestamp)
  const timestamp = date.getTime();
  
  // Ajouter les minutes en millisecondes
  const nouvelleTimestamp = timestamp + minutes * 60 * 1000;
  
  // Créer une nouvelle date à partir du timestamp résultant
  const nouvelleDate = new Date(nouvelleTimestamp);
  
  // Formater la nouvelle date au format date time (par exemple, "YYYY-MM-DD HH:MM:SS")
  const formatDate = (date) => {
    const pad = (val) => (val < 10 ? "0" + val : val);
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  
  return formatDate(nouvelleDate);
}

//trie une liste d'objet selon le champ et par ordre croisant ou décroissant
function trierListeParChamp(liste, champ, ordreCroissant = true) {
   
  // Utilisation de la méthode Array.sort() pour trier la liste en fonction du champ
  liste.sort(function(a, b) {
    // Utilisation de la notation [] pour accéder aux valeurs des champs
     const valeurA =a[champ].toLowerCase(); // Conversion en minuscules pour une comparaison insensible à la casse
    const valeurB = b[champ].toLowerCase();

    // Comparaison des valeurs et retour du résultat pour le tri
     if (ordreCroissant) {
      return valeurA.localeCompare(valeurB); // Tri par ordre croissant
    } else {
      return valeurB.localeCompare(valeurA); // Tri par ordre décroissant
    }
  });

console.log("trierListeParChamp",liste)
  // La liste est maintenant triée en fonction du champ spécifié
  return liste;
}

function isURL(chaine) {
  const expressionReguliere = /^(ftp|http|https):\/\/[^ "]+$/;
  return expressionReguliere.test(chaine);
}

function getGMTDateTime() {
  const now = new Date();
  const londonOffset = 0; // Londres est en GMT, donc le décalage est de 0
  const localOffset = now.getTimezoneOffset(); // Décalage horaire local en minutes

  // Calcule le décalage entre l'heure actuelle et l'heure de Londres
  const offsetDifference = localOffset - londonOffset;

  // Ajoute le décalage à l'heure actuelle pour obtenir l'heure de Londres
  const londonTime = new Date(now.getTime() + (offsetDifference * 60 * 1000));
return londonTime
  //return londonTime.toISOString();
}


const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1]; // On extrait la partie base64
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error); // Gestion des erreurs
    reader.readAsDataURL(file);
  });
};


const initEditorEditable={
  license_key: 'gpl',
 
  entity_encoding: "raw",
  selector: 'textarea#editable-class',//
  height: 500,
  content_style: `
  body { font-family:Helvetica,Arial,sans-serif; font-size:16px }
  .editable { border: 0.1rem solid green; border-radius: 0.8rem; padding: 0.2rem; }
  `,
  editable_root: false,
  editable_class: 'editable',//uniquement le div editable sera modiable <div class="editable">You can edit me too</div>
 language_url: '/js/tinymce/langs/fr_FR.js', // path from the root of your web application — / — to the language pack(s)
 language: 'fr_FR',  // the name of the language pack file
 toolbar: 'print',
  menubar: false,
   statusbar: false,
  content_style: `
  
  .editor-table {
border: 1px solid black !important;
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

.editor-table td, .editor-table th {
  border: 1px solid #ddd;
  padding: 3px;
  font-size:12px;
}

.editor-table tr:nth-child(even){background-color: #f2f2f2;}

.editor-table tr:hover {background-color: #ddd;}

.editor-table th {
  padding-bottom: 10px;
  text-align: left;
  background-color: #adb5bd;
  color: black;
}

.no-border-table table, .no-border-table tr, .no-border-table td, {
  padding: 0;
  border:hidden; 
  border-collapse: collapse;
}
`,


  setup: (editor) => {
    editor.ui.registry.addButton('print', {
      text: 'Print',
      icon: 'print',
      onAction: () => {
      /*  // Code à exécuter avant l'impression
        const content = editor.getContent();
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Nom_du_Fichier</title></head><body>');
        printWindow.document.write(content);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();*/

         // Fonction pour générer le nom de fichier
      const generateFileName = () => {
        const date = new Date();
        return `mon_document_${date.toISOString().replace(/:/g, '-')}.pdf`;
      };
      const fileName = generateFileName();
        editor.getWin().print(true, fileName);
      }
    });
  }
}




const initEditorNonEditable={
  license_key: 'gpl',
  selector: 'textarea',  // change this value according to your HTML
  entity_encoding: "raw",
  editable_root: false,//contenu non editable pour avoir une partie editable mettre un div avec 
  menubar: false,
   editable_class:false,
  language_url: '/js/tinymce/langs/fr_FR.js', // path from the root of your web application — / — to the language pack(s)
 language: 'fr_FR',  // the name of the language pack file
 toolbar: 'print',
 /*inline: true,
  plugins: [
    'lists',
    'powerpaste',
    'autolink'
  ],
  toolbar: 'undo redo | bold italic underline',
  valid_elements: 'strong,em,span[style],a[href]',
  valid_styles: {
    '*': 'font-size,font-family,color,text-decoration,text-align'
  },
  powerpaste_word_import: 'clean',
  powerpaste_html_import: 'clean',*/

  setup: (editor) => {
    editor.ui.registry.addButton('print', {
      text: 'Print',
      icon: 'print',
      onAction: () => {
      /*  // Code à exécuter avant l'impression
        const content = editor.getContent();
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Nom_du_Fichier</title></head><body>');
        printWindow.document.write(content);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();*/

         // Fonction pour générer le nom de fichier
      const generateFileName = () => {
        const date = new Date();
        return `mon_document_${date.toISOString().replace(/:/g, '-')}.pdf`;
      };
      const fileName = generateFileName();
      console.log("fileName=====>",fileName)
        editor.getWin().print(true, fileName);
      }
    });
  }


}

const initEditor = 
   {
    license_key: 'gpl',
    entity_encoding: "raw",
    selector: 'textarea#open-source-plugins',
    language_url: '/js/tinymce/langs/fr_FR.js', // path from the root of your web application — / — to the language pack(s)
    language: 'fr_FR',  // the name of the language pack file
  plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',
  editimage_cors_hosts: ['picsum.photos'],
  menubar: 'file edit view insert format tools table help',
  toolbar: "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",
  newline_behavior: 'linebreak',
  autosave_ask_before_unload: true,
  autosave_interval: '30s',
  autosave_prefix: '{path}{query}-{id}-',
  autosave_restore_when_empty: false,
  autosave_retention: '2m',

  /* enable title field in the Image dialog*/
  image_title: true,
  /* enable automatic uploads of images represented by blob or data URIs*/
  automatic_uploads: true,
  /*
    URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
    images_upload_url: 'postAcceptor.php',
    here we add custom filepicker only to Image dialog
  */
  file_picker_types: 'image',
  /* and here's our custom image picker*/
  file_picker_callback: (cb, value, meta) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        /*
          Note: Now we need to register the blob in TinyMCEs image blob
          registry. In the next release this part hopefully won't be
          necessary, as we are looking to handle it internally.
        */
        const id = 'blobid' + (new Date()).getTime();
        const blobCache =  tinymce.activeEditor.editorUpload.blobCache;
        const base64 = reader.result.split(',')[1];
        const blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        /* call the callback and populate the Title field with the file name */
        cb(blobInfo.blobUri(), { title: file.name });
      });
      reader.readAsDataURL(file);
    });

    input.click();
  },
  quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
  noneditable_class: 'mceNonEditable',
  toolbar_mode: 'sliding',
  contextmenu: 'link image table',
 
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
  /*content_style: `
        table, th, td {
            border: none !important;
        }`,*/
                      


};



const initEditorLite = 
   {
    license_key: 'gpl',
    selector: 'textarea',
    language_url: '/js/tinymce/langs/fr_FR.js', // path from the root of your web application — / — to the language pack(s)
    language: 'fr_FR',  // the name of the language pack file
 //menubar: 'file edit insert format table',
    menubar:false,
 plugins: [
        "advlist", "anchor", "autolink", "charmap", 
         "image", "insertdatetime", "link", "lists", "media",
         "searchreplace", "table", "visualblocks",
    ],
    toolbar: "undo redo  | bold italic underline strikethrough| forecolor backcolor removeformat  | align bullist numlist outdent indent| styles | image|table",    
    automatic_uploads: true,

  /* enable title field in the Image dialog*/
  image_title: true,
  /* enable automatic uploads of images represented by blob or data URIs*/
  automatic_uploads: true,
  /*
    URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
    images_upload_url: 'postAcceptor.php',
    here we add custom filepicker only to Image dialog
  */
  file_picker_types: 'image',
  /* and here's our custom image picker*/
  file_picker_callback: (cb, value, meta) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        /*
          Note: Now we need to register the blob in TinyMCEs image blob
          registry. In the next release this part hopefully won't be
          necessary, as we are looking to handle it internally.
        */
        const id = 'blobid' + (new Date()).getTime();
        const blobCache =  tinymce.activeEditor.editorUpload.blobCache;
        const base64 = reader.result.split(',')[1];
        const blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        /* call the callback and populate the Title field with the file name */
        cb(blobInfo.blobUri(), { title: file.name });
      });
      reader.readAsDataURL(file);
    });

    input.click();
  },
  
 };
function htmlDefaultHeaderRigth() {

const logo=(globalObject?.logo!=null)?`<img src='${globalObject.logo}' style="width: 50px; height: 50px;"/>`:""
const content=`<div>                                
                       <h6 > ${logo} 
                       <span style=${styles.bold} > ${globalObject.clinique.nomEntreprise}</span><br/>
                        ${globalObject?.clinique?.numRue!=null?globalObject?.clinique?.numRue:""} ${globalObject?.clinique?.adresse!=null?globalObject?.clinique?.adresse:""} ${globalObject?.clinique?.cp!=null?globalObject?.clinique?.cp:""}<br/>
                        ${globalObject?.clinique?.ville!=null?globalObject?.clinique?.ville?.nomVille:""}  ${globalObject?.clinique?.ville!=null&& globalObject?.clinique?.ville?.pays!=null ?globalObject.clinique?.ville?.pays?.nomPays:""}<br/>
                         Tél.: ${globalObject.clinique.telAccueil}</h6>                
                    </div> `
  return content;
}

function htmlDefaultFooter() {

const content=`<div style="font-size:10px">  <br/><br/>                             
                      
                        Fait à ${globalObject?.clinique?.ville!=null?globalObject?.clinique?.ville?.nomVille:""} le ${formatDate(currentDate())} <br/>
                                        
                    </div> `
  return content;
}


 const initialHtml = 
     {
       "header": {
          "headerImg": "",
          "headerLeft": "",
          "headerCenter": "",
          "HeaderRight": "",           
       },
        
        "body": {
            "header": {
                  "rigth1": "",
                  "middle1": "",
                  "left1": "",
                  "rigth2": "",
                  "middle2": "",
                  "left2": "",      
                },
           "title": "",
           "content": "",
           "footer": {
                "rigth1": "",
                "middle1": "",
                "left1": "",   
                },
        },
        "footer": {
          "footerImg": "",
          "footerLeft": "",
          "footerCenter": "",
          "footerRight": "",           
       },

    };


function formatHtml(html, documentId){

return `
 
<table id="${documentId}" style="border:none; border-collapse: collapse;">
  <!-- Header section -->
  <thead style="border:hidden; border-collapse: collapse; ">
    <tr >
      <td colspan="3" style="border:hidden; border-collapse: collapse; ">
        <!-- Youre header here -->
        ${html?.header|| ""}
      </td>
    </tr>
  </thead>

  <!-- Body or content section -->
  <tbody style="border:hidden; border-collapse: collapse; ">
      
    <tr>
      <td colspan="3" style="border:hidden; border-collapse: collapse; ">
        <!-- Your content here -->
        ${html?.body}
      </td>
    </tr>
  </tbody>

  <!-- Footer section -->
  <tfoot style=" border:hidden; border-collapse: collapse;">
    <tr>
      <td colspan="3" style="border:hidden; border-collapse: collapse; " >
        <!-- Your footer here -->
        ${html?.footer|| ""}
      </td>
    </tr>
  </tfoot>
</table>
`
}


function formatHtmlBody(body){
  const bodyHeader=(body?.headerLeft?.length>0|| body?.headerMiddle?.length>0||body?.headerRight?.length>0) ?`
    <tr >
      <td style="border:hidden; border-collapse: collapse; width: 33%; ">
        <!-- Your content here -->
        ${body?.headerLeft|| ""}
      </td>
       <td style="border:hidden; border-collapse: collapse; width: 33%;">
        <!-- Your content here -->
        ${body?.headerMiddle|| ""}
      </td>
      <td style="border:hidden; border-collapse: collapse; width: 33%; ">
        <!-- Your content here -->
        ${body?.headerRight|| ""}
      </td>
    </tr>`:"";

    const bodyFooter=(body?.footerLeft?.length>0|| body?.footerMiddle?.length>0||body?.footerRight?.length>0) ?`
    <tr>
      <td style="border:hidden; border-collapse: collapse; width: 33%; ">
        <!-- Your content here -->
        ${body?.footerLeft|| ""}
      </td>
       <td style="border:hidden; border-collapse: collapse; width: 33%;">
        <!-- Your content here -->
        ${body?.footerMiddle|| ""}
      </td>
      <td style="border:hidden; border-collapse: collapse; width: 33%; ">
        <!-- Your content here -->
        ${body?.footerRight|| ""}
      </td>
    </tr>`:"";

 const bodyTitle=(body?.title?.length>0)?
 `<tr>
      <td colspan="3" style="border:hidden; border-collapse: collapse; ">
        <!-- Your content here -->
        <div style='border:0px; font-size:20px; text-align:center'><strong>${body?.title|| ""}</strong></div><br/>
        
      </td>
    </tr>`:"";
return `
<table style="border:none; border-collapse: collapse;">
 
  <!-- Body or content section -->
  <tbody style="border:hidden; border-collapse: collapse; ">
    ${bodyHeader}
    ${bodyTitle}    
    <tr>
      <td colspan="3" style="border:hidden; border-collapse: collapse; ">
        <!-- Your content here -->
        ${body?.content}
      </td>
    </tr>
    ${bodyFooter}
  </tbody>
</table>`
}


  const fromHtmlToPdf = (html) => {

    const options = {
      defaultStyles: {
        // Override default element styles that are defined below
        b: {bold:true},
        strong: {bold:true},
        u: {decoration:'underline'},
        del: {decoration:'lineThrough'},
        s: {decoration: 'lineThrough'},
        em: {italics:true},
        i: {italics:true},
        h1: {fontSize:24, bold:true, marginBottom:5},
        h2: {fontSize:22, bold:true, marginBottom:5},
        h3: {fontSize:20, bold:true, marginBottom:5},
        h4: {fontSize:18, bold:true, marginBottom:5},
        h5: {fontSize:16, bold:true, marginBottom:5},
        h6: {fontSize:14, bold:true, marginBottom:5},
        a: {color:'blue', decoration:'underline'},
        strike: {decoration: 'lineThrough'},
        p: {margin:[0, 5, 0, 10]},
        ul: {marginBottom:5,marginLeft:5},
        table: {marginBottom:5},
        th: {bold:true, fillColor:'#adb5bd',fontSize:12},
        td: {fontSize:10}
      },
      tableAutoSize: false,  // Enable automatic table sizing
      imagesByReference: false,  // Handle images by reference
      removeExtraBlanks: true,  // Remove extra whitespace
      removeTagClasses: false,  // Keep HTML tag classes
      window: window,  // Required for Node.js usage
      ignoreStyles: [],  // Style properties to ignore
      fontSizes: [6, 8, 10, 12, 14, 16, 18, 20, 24, 28], // Font sizes for legacy <font> tag
      //customTag: function(params) { /* Custom tag handler */ }
    };
     
     console.log("html.content=========>",html)
    // Convertir le contenu HTML en format compatible pdfmake
    const pdfMakeContent = htmlToPdfmake(html.content,options);

    // Configurer le document pdfMake
    const documentDefinition = {
      info: {
        title: html?.file?.info?.title,
        author: html?.file?.info?.author,
        subject: html?.file?.info?.subject,
        keywords: html?.file?.info?.keywords,
        creator:html?.file?.info?.creator,
        producer:html?.file?.info?.producer
      },
      pageSize: html?.file?.format||"A4",
      pageOrientation: html?.file?.orientation||"portrait",
      pageMargins: [20, 0, 20, 20],
      footer: (currentPage, pageCount) => {
            return {
              text: `${currentPage} / ${pageCount}`,
              alignment: "right", // Centrer le texte du pied de page
              fontSize: 10,
              margin: [0, 10, 10, 0], // Espacement du texte
            };
          },
      content: pdfMakeContent,

      //footer:htmlToPdfmake(Utils.printPage(contentHtml.footer))
    };
     //console.log("html===========>",html)
      //console.log("pdfMakeContent===========>",pdfMakeContent)
    // Générer et ouvrir/télécharger le PDF
    pdfMake.createPdf(documentDefinition).download(html?.file?.fileName||"document.pdf");
    



  };

const fromHtmlToPdf2 = (htmlContent, file) => {
 
    // Récupérer l'élément HTML par ID
      const pdfMakeContent = htmlToPdfmake(htmlContent, {
      window: window, // Nécessaire pour html-to-pdfmake
    });
    // Configurer le document pdfMake
    const documentDefinition = {
      info: {
        title: file?.info?.title,
        author: file?.info?.author,
        subject: file?.info?.subject,
        keywords: file?.info?.keywords,
        creator:file?.info?.creator,
        producer:file?.info?.producer
      },
          pageSize: file?.format||"A4",
          pageOrientation: file?.orientation||"portrait",//portrait ou landscape
          pageMargins: [10, 10, 10, 10], // Marges pour éviter le débordement
          footer: (currentPage, pageCount) => {
                return {
                  text: `${currentPage} / ${pageCount}`,
                  alignment: "right", // Centrer le texte du pied de page
                  fontSize: 10,
                  margin: [0, 10, 10, 0], // Espacement du texte
                };
              },
        styles: {
            header: {
              fontSize: 18,
              bold: true,
              margin: [0, 0, 0, 10],
            },
             /*defaultStyle: {
              fontSize: 10, // Taille globale du texte réduite
              lineHeight: 1.2, // Espacement vertical réduit
            },*/
          },
          content: pdfMakeContent,

          //footer:htmlToPdfmake(Utils.printPage(contentHtml.footer))
        };

        console.log("pdfMakeContent===========>",pdfMakeContent)
         console.log("file===========>",file)
        // Générer et afficher le PDF dans un nouvel onglet
          pdfMake.createPdf(documentDefinition).open();
        // Générer et ouvrir/télécharger le PDF
        //pdfMake.createPdf(documentDefinition).download(file?.fileName||"document.pdf");
    

  };


function printPage(html){
console.log ("html===========>",html)
  const bodyHeader=(html?.body?.headerLeft?.length>0|| html?.body?.headerMiddle?.length>0||html?.body?.headerRight?.length>0) ?`
    <tr >
      <td style="border:hidden; border-collapse: collapse; width: 33%; ">
        <!-- Your content here -->
        ${html?.body?.headerLeft|| ""}
      </td>
       <td style="border:hidden; border-collapse: collapse; width: 33%;">
        <!-- Your content here -->
        ${html?.body?.headerMiddle|| ""}
      </td>
      <td style="border:hidden; border-collapse: collapse; width: 33%; ">
        <!-- Your content here -->
        ${html?.body?.headerRight|| ""}
      </td>
    </tr>`:"";

    const bodyFooter=(html?.body?.footerLeft?.length>0|| html?.body?.footerMiddle?.length>0||html?.body?.footerRight?.length>0) ?`
    <tr>
      <td style="border:hidden; border-collapse: collapse; width: 33%; ">
        <!-- Your content here -->
        ${html?.body?.footerLeft|| ""}
      </td>
       <td style="border:hidden; border-collapse: collapse; width: 33%;">
        <!-- Your content here -->
        ${html?.body?.footerMiddle|| ""}
      </td>
      <td style="border:hidden; border-collapse: collapse; width: 33%; ">
        <!-- Your content here -->
        ${html?.body?.footerRight|| ""}
      </td>
    </tr>`:"";

 const bodyTitle=(html?.body?.title?.length>0)?
 `<tr>
      <td colspan="3" style="border:hidden; border-collapse: collapse; ">
        <!-- Your content here -->
        <div style='border:0px; font-size:20px; text-align:center'><strong>${html?.body?.title|| ""}</strong></div><br/>
        
      </td>
    </tr>`:"";
return `
 <html><head><title>Nom_du_Fichier</title></head><body>
<table style="border:none; border-collapse: collapse;">
  <!-- Header section -->
  <thead style="border:hidden; border-collapse: collapse; ">
    <tr >
      <td colspan="3" style="border:hidden; border-collapse: collapse; ">
        <!-- Youre header here -->
        ${html?.header|| ""}
      </td>
    </tr>
  </thead>

  <!-- Body or content section -->
  <tbody style="border:hidden; border-collapse: collapse; ">
    ${bodyHeader}
    ${bodyTitle}    
    <tr>
      <td colspan="3" style="border:hidden; border-collapse: collapse; ">
        <!-- Your content here -->
        ${html?.body?.content}
      </td>
    </tr>
    ${bodyFooter}
  </tbody>

  <!-- Footer section -->
  <tfoot style=" border:hidden; border-collapse: collapse;">
    <tr>
      <td colspan="3" style="border:hidden; border-collapse: collapse; " >
        <!-- Your footer here -->
        ${html?.footer|| ""}
      </td>
    </tr>
  </tfoot>
</table>
</body></html>`
}


function pdfFormatHtml(html)
{

const headerSpace=(html?.header?.rigth2!=""&&html?.header?.middle2!=""&&html?.header?.left2!="")?`<tr>
          <td colspan="3">&nbsp;</td></tr>`:""
const titleSpace=(html?.title!="")?`<tr><td colspan="3">&nbsp;</td></tr>`:""
const content = `
    <table>
      <thead>
        <tr>
          <th>${html?.header?.left1}</th>
          <th>${html?.header?.middle1}</th>
          <th>${html?.header?.rigth1}</th>
        </tr>
      </thead>
      <tbody>
     
      ${headerSpace}
        <tr>
          <td>${html?.header?.left2}</td>
          <td>${html?.header?.middle2}</td>
          <td>${html?.header?.rigth2}</td>
        </tr>
        ${titleSpace}
         <tr>
         <td></td>
          <td style={{"font-size": "12px", "text-align": "center"}}><b>${html?.title}</b></td>
          <td></td>       
        </tr>
         ${titleSpace}
        <tr>
          <td colspan="3">${html?.body}</td>        
        </tr>
        <tr>
          <th>${html?.footer?.left1}</th>
          <th>${html?.footer?.middle1}</th>
          <th>${html?.footer?.rigth1}</th>
        </tr>
      </tbody>
    </table>`;

return content;

}


function formatHtmlBody_old(body)
{


const titleSpace=(body?.title!="")?`<tr><td colspan="3">&nbsp;</td></tr>`:""
let content = `
    <table>
     
      <tbody>`
       if(body?.header?.left1?.length>0||body?.header?.middle1?.length||body?.header?.rigth1?.length)
          content += ` 
        <tr>
          <th>${body?.header?.left1}</th>
          <th>${body?.header?.middle1}</th>
          <th>${body?.header?.rigth1}</th>
        </tr>`
      if(body?.header?.left2?.length>0||body?.header?.middle2?.length||body?.header?.rigth2?.length)
          content += `
        <tr>
          <td>${body?.header?.left2}</td>
          <td>${body?.header?.middle2}</td>
          <td>${body?.header?.rigth2}</td>
        </tr>`
       
        if(body?.title?.length>0)
          content += `  ${titleSpace}
         <tr>
         
          <td colspan="3" style="font-size:14px; text-align:center;font-weight: 900;"><b>${body?.title}</b><br/><br/></td>
                
        </tr>
       
         `
          content += `   <tr>
          <td colspan="3">${body?.content}</td>        
        </tr>`

      if(body?.footer?.left1?.length>0||body?.footer?.middle1?.length||body?.footer?.rigth1?.length)
          content += `
       
        <tr>
          <th>${body?.footer?.left1}</th>
          <th>${body?.footer?.middle1}</th>
          <th>${body?.footer?.rigth1}</th>
        </tr>`
    

     content += `  </tbody>
    </table>`;

return content;

}

function formatHtmlForPdf(imgHaut,leftContent, centerContent, rightContent,imgBas)
{

let content = `
    <div>
      <table style="width: 100%;">
       `;
          if(imgHaut?.length>0)
          content += ` 
           <tr>
              <td colspan="3" style="text-align: center;">
               <img src="${imgHaut}" alt="Logo" style="display: block;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;" />
              </td>
           </tr> `
      if(leftContent?.length>0||centerContent?.length||rightContent?.length)
          content += ` 
        <tr>
          <td style=" text-align: left;">
            ${createMarkup(leftContent).__html}
          </td>
          <td style="width: 40%; text-align: center;">
           ${createMarkup(centerContent).__html}
          </td>
          <td style="width: 30%; text-align: right;">
            ${createMarkup(rightContent).__html}
          </td>
        </tr>`

         if(imgBas?.length>0)
          content += `
         <tr>
          <td colspan="3" style="text-align: center;">
            <img src="${imgBas}" alt="Logo" style="height: 50px; width: auto;" />
          </td>
        </tr>`

       content += ` 
      </table>
    </div>`;

return content;

}
function supprimerObjetSelonValeurDuChamp(liste, nomChamp, valeurChamp) {
    // Filtrer la liste pour exclure l'objet avec le champ correspondant à la valeur fournie
    return liste.filter(obj => obj[nomChamp] !== valeurChamp);
}
function supprimerObjetSelonContenuDuChamp(liste, nomChamp, valeurChamp) {
   // Filtrer la liste pour exclure les objets dont le champ spécifié contient la valeur fournie
    return liste.filter(obj => {
        // Vérifier si la valeur du champ est une chaîne et si elle contient la valeurChamp
        if (typeof obj[nomChamp] === 'string') {
            return !obj[nomChamp].includes(valeurChamp);
        }
        // Si le champ n'est pas une chaîne, comparer directement à la valeurChamp
        return obj[nomChamp] !== valeurChamp;
    });
}

function trouverObjetDansListObject(listeObjets, nomChamp, valeurRecherche) {
    if(listeObjets!=undefined&&listeObjets!=null)
   {
    // Filtrer la liste d'objets pour trouver ceux ayant le champ avec la valeur recherchée
    const objetTrouve = listeObjets.find(objet => objet[nomChamp] === valeurRecherche);

    // Retourner l'objet trouvé ou null s'il n'y a pas de correspondance
    return objetTrouve || null;
   } 
   return null
}

function filterArrayByFieldNameAndContent(liste, nomChamp, valeurChamp) {

     if(liste!=undefined&&liste!=null)
   {
    // Filtrer la liste pour exclure les objets dont le champ spécifié contient la valeur fournie
    let elts=liste.filter(obj => {
        // Vérifier si la valeur du champ est une chaîne et si elle contient la valeurChamp
        if (typeof obj[nomChamp] === 'string') {
            return obj[nomChamp].includes(valeurChamp);
        }
        // Si le champ n'est pas une chaîne, comparer directement à la valeurChamp
        return obj[nomChamp] === valeurChamp;
     });
    if(elts.length>0)
        return elts
   

    }
    return null
}


function isPositiveFloat(s) {
    if(s==null)
        return false
  return !isNaN(s) && Number(s) >= 0;
}

function getAttributeValues(list, attributeName) {
    if(list!=null && list.length>0)
    return list.map(obj => obj[attributeName]);
    else
    return []
}

function convertToBoolean(val)
   {
    console.log("val====>",val)
     if((val!=undefined && val!=null)&&( val.toLowerCase()=="yes"||val.toLowerCase()=="oui"||val.toLowerCase()=="true"))
       return true
     else
       return false
   }
const ressources=[ 

     // "DOSSIER_PATIENT/DOSSIER_PATIENT",
    
                      
       


      //"RH/RH#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "RH#RH/GESTION_PERSONNEL#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
    
     
     "STOCK#STOCK/GESTION_ENTREPOT#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "STOCK#STOCK/GESTION_ENTREPOT/ENTREE_SORTIE#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "STOCK#STOCK/PRODUIT#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "STOCK#STOCK/COMMANDE#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "STOCK#STOCK/COMMANDE_PRODUIT#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "STOCK#STOCK/DEMANDE_PRODUIT#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "STOCK#STOCK/INVENTAIRE#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "STOCK#CONFIGURATION/STOCK/ENTREPOT#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "STOCK#CONFIGURATION/STOCK/FOURNISSEUR#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "STOCK#CONFIGURATION/STOCK/CATEGORIE_PRODUIT#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "STOCK#CONFIGURATION/STOCK/EMPLACEMENT#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "STOCK#DASHBOARD/ENTREPOT#-Aucune permission|R-Consulter",
     "STOCK#DASHBOARD/PRODUIT#-Aucune permission|R-Consulter",
     "STOCK#DASHBOARD/COMMANDE#-Aucune permission|R-Consulter",


     
     "MESSAGERIE#MESSAGERIE/BOITE_ENVOI#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "MESSAGERIE#MESSAGERIE/BOITE_RECEPTION#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "MESSAGERIE#MESSAGERIE/CHAT#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",

     "DOCUMENT#DOCUMENT#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",

     
     "STATISTIQUE#STATISTIQUE#-Aucune permission|R-Consulter",
 

     "CONFIGURATION#CONFIGURATION/GENERALE/MODELE#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "CONFIGURATION#CONFIGURATION/GENERALE/VILLE#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "CONFIGURATION#CONFIGURATION/GENERALE/PAYS#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",

     

     "ADMINISTRATION#ETABLISSEMENT#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "ADMINISTRATION#USER#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "ADMINISTRATION#ROLE#-Aucune permission|R-Consulter|CR-Créer|RU-Mofifier|CRU-Consulter/Créer/Modifier|CRUD-Consulter/Créer/Modifier/Déactiver",
     "ADMINISTRATION#JOURNALISATION#-Aucune permission|R-Consulter",
     


   ]

   
export default {
  validateMobileNumber,
  isValidPhoneNumber,
  validateEmail,
  validDate,
  formatDate,
  calculateAge,
  uuidv4,
  currentDateTime,
  currentDate,
  dateCompare,
  passwordStrength,
  calculateAgeString,
  capitalizeFist,
  getFirstLetters,
  getDate,
  calculateAgeYear,
  compareArray,
  filterArrayByFieldNameAndReturnUniqFieldValue,
  filterArrayByFieldNameAndValue,
  getUniqValueInArrayOfString,
  truncateStr,
  timeConvert,
  dateTimeToString,
  sliceString,
  imc,
  convertDateTOAnMoisJour,
  setCssColor,
  setCssSectionColor,
  filterArrayByFieldNameAndValueAndOneObject,
  addLibrary,
  isInteger,
  isEntier,
  createMarkup,
  isJsonString,
  stringToColor,
  randomString,
  createNotification,
  addModele,
  autoCorrection,
  dateToString,
  weekDay,
  countNewMessage,
  changeDivContent,
  replaceAllCustom,
  stringToArray,
  trierListeObjets,
  encodeBase64,
  decodeBase64,
  getDayName,
  getMonthName,
  genererIntervalleTemps,
  ajouterMinutesALaDate,
  trierListeParChamp,
  getDateName,
  getDateTimeName,
  isURL,
  getGMTDateTime,
  pdfFormatHtml,
  htmlDefaultHeaderRigth,
  styles,
  nombreDeMois,
  htmlDefaultFooter,
  supprimerObjetSelonValeurDuChamp,
  supprimerObjetSelonContenuDuChamp,
  trouverObjetDansListObject,
  isPositiveFloat,
  filterArrayByFieldNameAndContent,
  ressources,
  createMarkup2,
  getAttributeValues,
  getFirstAndLastDayOfMonth,
  formatHtmlForPdf,
  formatHtmlBody,
  initialHtml,
  fileToBase64,
  initEditor,
  initEditorLite,
  initEditorEditable,
  initEditorNonEditable,
  printPage,
  formatHtml,
  formatHtmlBody,
  fromHtmlToPdf,
  convertToBoolean

};

