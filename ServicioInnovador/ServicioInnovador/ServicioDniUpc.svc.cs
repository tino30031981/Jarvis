using System;
using System.Text;
using ServicioInnovador.Entidades;
using System.Configuration;
using System.IO;
using System.Net;
using Newtonsoft.Json;
using System.Net.Http;
using ServicioInnovador.Email;
using ServicioInnovador.Persistencia;

namespace ServicioInnovador
{
    // NOTA: puede usar el comando "Rename" del menú "Refactorizar" para cambiar el nombre de clase "ServicioDniUpc" en el código, en svc y en el archivo de configuración a la vez.
    // NOTA: para iniciar el Cliente de prueba WCF para probar este servicio, seleccione ServicioDniUpc.svc o ServicioDniUpc.svc.cs en el Explorador de soluciones e inicie la depuración.
    public class ServicioDniUpc : IServicioDniUpc
    {
        public SalidaServicio ConsultarDatos(EntradaServicio entrada)
        {
			string GetBody = "";
            SalidaServicio oResultado = new SalidaServicio();
            DatosDni datosDni = new DatosDni();

            datosDni = SolicitaDatosDni(entrada.Dni);
            oResultado.DatosDni = datosDni;

			GetBody = datosDni.dni + ", " + datosDni.nombres + " " + datosDni.apellido_paterno + " " + datosDni.apellido_materno  + " " + datosDni.caracter_verificacion;
            
            SendMail(GetBody, "tino30031981@gmail.com", entrada.Email);
            conexion.obtenerConexion(datosDni);
            oResultado.Resultado = true;
            return oResultado;
        }
        public DatosDni SolicitarDatosDni(string Parametros)
        {
            DatosDni eRespuesta = new DatosDni();
            string datos = JsonConvert.SerializeObject(Parametros);

            string json = string.Empty;

            var tiempoEspera = ConfigurationManager.AppSettings["tiempoEspera"].ToString();
            var url = ConfigurationManager.AppSettings["url"].ToString();
            url = url.Replace("$", "&");
            byte[] data = UTF8Encoding.UTF8.GetBytes(datos);

            HttpWebRequest peticion;
            peticion = WebRequest.Create(url) as HttpWebRequest;
            peticion.Timeout = Convert.ToInt32(tiempoEspera) * 1000;
            peticion.Method = "POST";
            peticion.ContentLength = data.Length;
            peticion.Accept = "application/json";
            peticion.Headers.Add("Authorization", "Bearer KMiiIzg2ybE4GDn9fKdUYUwSl7a3tjcV3Oa6U4QX");
            //peticion.ContentType = "application/json";

            Stream postTorrente = peticion.GetRequestStream();
            postTorrente.Write(data, 0, data.Length);
            postTorrente.Close();

            try
            {
                HttpWebResponse respuesta = peticion.GetResponse() as HttpWebResponse;
                StreamReader lectura = new StreamReader(respuesta.GetResponseStream(), Encoding.UTF8);

                json = lectura.ReadToEnd();
                eRespuesta = JsonConvert.DeserializeObject<DatosDni>(json);
            }
            catch (Exception ex)
            {
                string error = ex.Message;
            }
            return eRespuesta;
        }
        public DatosDni SolicitaDatosDni(string Parametro)
        {
            DatosDni eRespuesta = new DatosDni();

            try
            {
                var dni = new Tecactus.Api.Reniec.Dni("KMiiIzg2ybE4GDn9fKdUYUwSl7a3tjcV3Oa6U4QX");
                var person = dni.get(Parametro);
                eRespuesta.dni = person.dni;
                eRespuesta.nombres = person.nombres;
                eRespuesta.apellido_paterno = person.apellido_paterno;
                eRespuesta.apellido_materno = person.apellido_materno;
                eRespuesta.caracter_verificacion = person.caracter_verificacion;
                eRespuesta.caracter_verificacion_anterior = person.caracter_verificacion_anterior;
                
            }
            catch (Exception ex)
            {
                string error = ex.Message;

                //respuestaCulq = false;
            }
            return eRespuesta;
        }

        public void EnvioCorreo(string correo)
        {
            string subject = "PruebaCorreo";
            string body = "Datos del dni";

            Mail oMail = new Mail();

            //string path = System.IO.Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + Constantes.folderTemplates;
            string path = AppDomain.CurrentDomain.BaseDirectory.ToString() + ConfigurationManager.AppSettings["RutaPlantillas"];

            oMail.sendMail(ConfigurationManager.AppSettings["smtpFromName"].ToString(), ConfigurationManager.AppSettings["smtpFromName"].ToString(), correo, subject, body, null);

        }
		protected virtual void SendMail(string GetBody, string correoEmisor, string correoReceptor)
        {
            try
            {
                using (MailMessage message = new MailMessage(correoEmisor, correoReceptor))
                {
         
                    message.Subject = "Correo de Prueba" + " " + DateTime.Now.ToShortDateString();
                    message.SubjectEncoding = Encoding.UTF8;
                    message.Body = GetBody;
                    message.BodyEncoding = Encoding.UTF8;
                    message.IsBodyHtml = true;
                    message.Priority = MailPriority.Normal;
                    using (SmtpClient smtp = new SmtpClient())
                    {
                        smtp.DeliveryMethod = SmtpDeliveryMethod.Network;

                        smtp.Host = "smtp.gmail.com";
                        smtp.Port = 587;
                        //sc.UseDefaultCredentials = true;
                        smtp.Credentials = new NetworkCredential(correoEmisor, "r4m1r02085");
                        smtp.EnableSsl = true;
                        smtp.Send(message);
 
                    }
                }
            }
            catch (Exception ex)
            {
                string error = ex.Message;
            }
        }
    }
}
