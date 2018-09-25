using System;
using System.Runtime.Serialization;

namespace AppServices.Models
{
    [Serializable]
    [DataContract]
    public class ResponseEntity
    {
        [DataMember]
        public int idOperacion { get; set; }
        [DataMember]
        public ClienteEntity cliente { get; set; }

        [DataMember]
        public double monto { get; set; }

        [DataMember]
        public string numeroCuentaDeposito { get; set; }
        [DataMember]
        public string numeroCuentaRetiro { get; set; }
        [DataMember]
        public string respuesta { get; set; }
    }
}
