//function Wgs2Utm( lan1,fi) {
//
//var a=6378137.000;
//var b=6356752.314;
//var f=(a-b)/a;
//var e2=Math.sqrt((Math.pow(a,2)-Math.pow(b,2))/Math.pow(b,2));
//var e=Math.sqrt((Math.pow(a,2)-Math.pow(b,2))/Math.pow(a,2));
//
//var zone;
//var lan0;
//if (lan1>0)
//{
//    var zone=30+Math.ceil(lan1/6);
//    lan0=Math.floor(lan1/6)*6+3;
//}
//else
//{
//    var zone=30-Math.floor(Math.abs(lan1)/6);
//    lan0=-Math.floor(Math.abs(lan1)/6)*6-3;
//}
//
//
////-----------------------------------------------
//
//var lan=lan1-lan0;
//lan=lan*Math.PI/180;
//fi=fi*Math.PI/180;
//var N=a/Math.pow(1-Math.pow(e,2)*Math.pow(Math.sin(fi),2),0.5);
//var M=a*(1-Math.pow(e,2))/Math.pow((1-(Math.pow(e,2)*Math.pow(Math.sin(fi),2))),(3/2));
//var t=Math.tan(fi);
//var p=N/M;
//
////----------------------------------------------
//var k0=0.9996;
//
//var term1=Math.pow(lan,2)*p*Math.pow(Math.cos(fi),2)/2;
//var term2=Math.pow(lan,4)*Math.pow(Math.cos(fi),4)*(4*Math.pow(p,3)*(1-6*Math.pow(t,2))+Math.pow(p,2)*(1+24*Math.pow(t,2))-4*p*Math.pow(t,2))/24;
//var term3=Math.pow(lan,6)*Math.pow(Math.cos(fi),6)*(61-148*Math.pow(t,2)+16*Math.pow(t,4))/720;
//
//var Kutm=k0*(term1+term2+term3);
//
//
////----------------------------------------------
//term1=Math.pow(lan,2)*p*Math.pow(Math.cos(fi),2)*(p-Math.pow(t,2))/6;
//term2=Math.pow(lan,4)*Math.pow(Math.cos(fi),4)*(4*Math.pow(p,3)*(1-6*Math.pow(t,2))+Math.pow(p,2)*(1+8*Math.pow(t,2))-Math.pow(p,2)*Math.pow(t,2)+Math.pow(t,4))/120;
//term3=Math.pow(lan,6)*Math.pow(Math.cos(fi),6)*(61-479*Math.pow(t,2)+179*Math.pow(t,4)-Math.pow(t,6))/5040;
//
//var Xutm=500000+k0*lan*N*Math.cos(fi)*(1+term1+term2+term3);
//
////----------------------------------------------
//
//var A0=1-0.25*Math.pow(e,2)-3/64*Math.pow(e,4)-5/256*Math.pow(e,6);
//var A2=3/8*(Math.pow(e,2)+0.25*Math.pow(e,4)+15/128*Math.pow(e,6));
//var A4=15/256*(Math.pow(e,4)+0.75*Math.pow(e,6));
//var A6=35/3072*Math.pow(e,6);
//
//var sfi=a*(A0*fi-A2*Math.sin(2*fi)+A4*Math.sin(4*fi)-A6*Math.sin(6*fi));
//
////----------------------------------------------
//
//term1=Math.pow(lan,2)*N*Math.sin(fi)*Math.cos(fi)/2;
//term2=Math.pow(lan,4)*N*Math.sin(fi)*Math.pow(Math.cos(fi),3)*(4*Math.pow(p,2)+p-Math.pow(t,2))/24;
//term3=Math.pow(lan,6)*N*Math.sin(fi)*Math.pow(Math.cos(fi),5)*(8*Math.pow(p,4)*(11-24*Math.pow(t,2))-28*Math.pow(p,3)*(1-6*Math.pow(t,2))+Math.pow(p,2)*(1-32*Math.pow(t,2))-p*2*Math.pow(t,2)+Math.pow(t,4));
//var term4=Math.pow(lan,8)*N*Math.sin(fi)*Math.pow(Math.cos(fi),7)*(1385-3111*Math.pow(t,2)+543*Math.pow(t,4)-Math.pow(t,6));
//
//var Yutm=k0*(sfi+term1+term2+term3+term4);
//var sn='N';
//if (fi <0)
//{
//    Yutm = 10000000 + Yutm;
//    sn='S';
//}
//    return Xutm.toString().concat(" ; " + Yutm.toString() + " "+zone.toString()+sn) ;
//
//}
//
//function Utm2Wgs( X,Y,zone,sn) {
//    if (sn=='S')
//    {
//        Y = Y - 10000000;
//    }
//    X = X - 500000;
//    var sa = 6378137.000000;
//    var sb = 6356752.314245;
//
//   var e = Math.pow( Math.pow(sa , 2) - Math.pow(sb , 2) , 0.5 ) / sa;
//   var e2 = Math.pow( Math.pow( sa , 2 ) - Math.pow( sb , 2 ) , 0.5 ) / sb;
//   var e2cuadrada = Math.pow(e2 , 2);
//   var c = Math.pow(sa , 2 ) / sb;
//
//
//
//   var S = ( ( zone * 6 ) - 183 ); 
//   var lat =  Y / ( 6366197.724 * 0.9996 );                         
//   var v =  (c * 0.9996)/ Math.pow( 1 + ( e2cuadrada * Math.pow( Math.cos(lat), 2 ))  , 0.5 ) ;
//   var a = X / v;
//   var a1 = Math.sin( 2 * lat );
//   var a2 = a1 * Math.pow( Math.cos(lat), 2);
//   var j2 = lat + ( a1 / 2 );
//   var j4 = ( ( 3 * j2 ) + a2 ) / 4;
//   var j6 = ( ( 5 * j4 ) + ( a2 * Math.pow( Math.cos(lat) , 2) ) ) / 3;
//   var alfa = ( 3 / 4 ) * e2cuadrada;
//   var beta = ( 5 / 3 ) * Math.pow(alfa , 2);
//   var gama = ( 35 / 27 ) * Math.pow(alfa , 3);
//   var Bm = 0.9996 * c * ( lat - alfa * j2 + beta * j4 - gama * j6 );
//   var b = ( Y - Bm ) / v;
//   var Epsi = ( ( e2cuadrada * Math.pow(a , 2)) / 2 ) * Math.pow( Math.cos(lat) , 2);
//   var Eps = a * ( 1 - ( Epsi / 3 ) );
//   var nab = ( b * ( 1 - Epsi ) ) + lat;
//   var senoheps = ( Math.exp(Eps) - Math.exp(-Eps) ) / 2;
//   var Delt = Math.atan(senoheps / Math.cos(nab) );
//   var TaO = Math.atan(Math.cos(Delt) * Math.tan(nab));
//   var longitude = (Delt *(180 / Math.PI ) ) + S;
//   var latitude = ( lat + ( 1 + e2cuadrada* Math.pow(Math.cos(lat), 2) - ( 3 / 2 ) * e2cuadrada * Math.sin(lat) * Math.cos(lat) * ( TaO - lat ) ) * ( TaO - lat ) ) * (180 / Math.PI);
//    return longitude.toString().concat(" ; " + latitude.toString()) ;
//}