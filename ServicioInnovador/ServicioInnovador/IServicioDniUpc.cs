using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.ServiceModel.Web;
using ServicioInnovador.Entidades;

namespace ServicioInnovador
{
    // NOTA: puede usar el comando "Rename" del menú "Refactorizar" para cambiar el nombre de interfaz "IServicioDniUpc" en el código y en el archivo de configuración a la vez.
    [ServiceContract]
    public interface IServicioDniUpc
    {
        [OperationContract]
   
        [WebInvoke(Method = "POST", UriTemplate = "ConsultarDatos", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        SalidaServicio ConsultarDatos(EntradaServicio consulta);

    }
}
