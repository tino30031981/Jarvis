using AppServices.Models;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Net;
using System.Text;

namespace AppServices.Service
{
    public class Service
    {
        public ClienteEntity Login(string tarjeta, string idc, string clave)
        {
            ClienteEntity eRespuesta = new ClienteEntity();
            try
            {
                string data = this.ServiceGet(tarjeta + "/" + idc + "/" + clave, "http://localhost:8080/api/cliente/");
                eRespuesta = JsonConvert.DeserializeObject<ClienteEntity>(data);
            }
            catch (Exception ex)
            {
                eRespuesta = null;
            }
            return eRespuesta;
        }

        public ClienteEntity Login(string idCliente)
        {
            ClienteEntity eRespuesta = new ClienteEntity();
            try
            {
                string data = this.ServiceGet(idCliente, "http://localhost:8080/api/cliente/");
                eRespuesta = JsonConvert.DeserializeObject<ClienteEntity>(data);
            }
            catch (Exception ex)
            {
                eRespuesta = null;
            }
            return eRespuesta;
        }

        public ContribuyenteEntity ConsultaTributos(string buscar)
        {
            ContribuyenteEntity eRespuesta = new ContribuyenteEntity();
            try
            {
                string data = this.ServiceGet(buscar, "http://localhost:8888/api/tributo/");
                eRespuesta = JsonConvert.DeserializeObject<ContribuyenteEntity>(data);
            }
            catch (Exception ex)
            {
                eRespuesta = null;
            }
            return eRespuesta;
        }       

        public int Pagar(TributoEntity item, OperacionEntity operacion)
        {
            int value = 0;
            try
            {
                string datos = JsonConvert.SerializeObject(item);
                string json = this.ServicPost(datos, "http://localhost:8888/api/enviar");
                string datos2 = JsonConvert.SerializeObject(operacion);
                string json2 = this.ServicPost(datos2, "http://localhost:8080/api/retiro");
                value = 1;
            }
            catch (Exception)
            {
                value = 0;
            }            
            return value;
        }

        public string ServiceGet(string parameters, string path)
        {
            string json = string.Empty;
            var tiempoEspera = "10";
            var url = path + parameters;
            url = url.Replace("$", "&");
            HttpWebRequest peticion;
            peticion = WebRequest.Create(url) as HttpWebRequest;
            peticion.Timeout = Convert.ToInt32(tiempoEspera) * 1000;
            peticion.Method = "GET";
            peticion.ContentType = "application/json; charset=utf-8";
            try
            {
                HttpWebResponse respuesta = peticion.GetResponse() as HttpWebResponse;
                StreamReader lectura = new StreamReader(respuesta.GetResponseStream(), Encoding.UTF8);
                json = lectura.ReadToEnd();
            }
            catch (Exception ex)
            {
            }
            return json;
        }

        public string ServicPost(string parameters, string path)
        {
            string datos = parameters;
            string json = string.Empty;
            var tiempoEspera = "50";
            var url = path;
            url = url.Replace("$", "&");
            byte[] data = UTF8Encoding.UTF8.GetBytes(datos);
            HttpWebRequest peticion;
            peticion = WebRequest.Create(url) as HttpWebRequest;
            peticion.Timeout = Convert.ToInt32(tiempoEspera) * 1000;
            peticion.Method = "POST";
            peticion.ContentLength = data.Length;
            peticion.ContentType = "application/json; charset=utf-8";
            //peticion.Headers.Add("Usuario", usuario);
            //peticion.Headers.Add("Clave", clave);
            Stream postTorrente = peticion.GetRequestStream();
            postTorrente.Write(data, 0, data.Length);
            postTorrente.Close();
            try
            {
                HttpWebResponse respuesta = peticion.GetResponse() as HttpWebResponse;
                StreamReader lectura = new StreamReader(respuesta.GetResponseStream(), Encoding.UTF8);
                json = lectura.ReadToEnd();
            }
            catch (Exception ex)
            {
            }
            return json;
        }
    }
}
