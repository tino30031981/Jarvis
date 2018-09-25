﻿using AppServices.Models;
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
                string data = this.ServiceGet(tarjeta + "/" + idc + "/" + clave, "http://localhost:8080/api/cliente");
                eRespuesta = JsonConvert.DeserializeObject<ClienteEntity>(data);
            }
            catch (Exception ex)
            {
                eRespuesta = null;
            }
            return eRespuesta;
        }


        public string ServiceGet(string parameters, string path)
        {
            string json = string.Empty;
            //var usuario = ConfigurationManager.AppSettings["usuario"].ToString();
            //var clave = ConfigurationManager.AppSettings["clave"].ToString();
            var tiempoEspera = "10";
            var url = path + "/" + parameters;
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

        public void EnvioPost()
        {
            ClienteEntity utem = new ClienteEntity();
            string datos = JsonConvert.SerializeObject(utem);
            this.ServicPost(datos, "cliente");
        }

        public string ServicPost(string paraments, string path)
        {
            string datos = paraments;
            string json = string.Empty;
            //var usuario = ConfigurationManager.AppSettings["usuario"].ToString();
            //var clave = ConfigurationManager.AppSettings["clave"].ToString();
            var tiempoEspera = "10";
            var url = "http://localhost:8080/api/" + path;
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
