using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;
using System.Configuration;
using ServicioInnovador.Utilitarios;

namespace ServicioInnovador.Email
{
    public class Mail
    {
        public bool sendMail(string fromName, string from, string to, string subject, string body, List<Attachment> adjuntos)
        {
            Encriptacion oEnc = new Encriptacion();
            //Variables de retorno 
            string oBody = string.Empty;
            string oRuta = string.Empty;

            //La variable booleana permitira indicar si se ejecuto el envió
            bool oBool = false;

            //Array de Correo
            string[] oArrayCorreos = new string[1] { "False" };

            if (from != "")
            {
                oBool = false;

                //Variables de envio
                string xStr_From = from;
                string xStr_FromName = fromName;

                MailMessage mMailMessage = new MailMessage();
                SmtpClient mSmtpClient = new SmtpClient();

                mMailMessage.From = new MailAddress(xStr_From, xStr_FromName);
                mMailMessage.CC.Add(xStr_From);
                mMailMessage.To.Add(to);
                mMailMessage.Subject = subject;
                mMailMessage.IsBodyHtml = true;
                mMailMessage.Priority = MailPriority.Normal;
                mMailMessage.BodyEncoding = System.Text.Encoding.UTF8;
                mMailMessage.Body = body;

                if (adjuntos != null)
                {
                    //agregado de archivo
                    foreach (Attachment archivo in adjuntos)
                    {
                        //comprobamos si existe el archivo y lo agregamos a los adjuntos

                        mMailMessage.Attachments.Add(archivo);

                    }
                }
                mSmtpClient.Credentials = new System.Net.NetworkCredential(oEnc.Decrypt(ConfigurationManager.AppSettings["smtpUser"].ToString(), Constantes.keyEncript), oEnc.Decrypt(ConfigurationManager.AppSettings["smtpPass"].ToString(), Constantes.keyEncript));
                mSmtpClient.Port = int.Parse(oEnc.Decrypt(ConfigurationManager.AppSettings["smtpPort"].ToString(), Constantes.keyEncript));
                mSmtpClient.EnableSsl = bool.Parse(oEnc.Decrypt(ConfigurationManager.AppSettings["smtpSSL"].ToString(), Constantes.keyEncript));
                mSmtpClient.Host = oEnc.Decrypt(ConfigurationManager.AppSettings["smtpHost"].ToString(), Constantes.keyEncript);

                try
                {
                    mSmtpClient.Send(mMailMessage);
                    oBool = true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return oBool;
        }
    }
}