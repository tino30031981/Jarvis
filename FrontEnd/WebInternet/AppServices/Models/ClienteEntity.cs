using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace AppServices.Models
{
    [Serializable]
    [DataContract]
    public class ClienteEntity
    {
        [DataMember]
        public string idCliente { get; set; }

        [DataMember]
        public string nombre { get; set; }

        [DataMember]
        public string apellidos { get; set; }

        [DataMember]
        public string claveInternet { get; set; }

        [DataMember]
        public List<CuentaEntity> cuentas { get; set; }

    }
}
