using System;
using System.Runtime.Serialization;

namespace AppServices.Models
{
    [Serializable]
    [DataContract]
    public class CuentaEntity
    {
        [DataMember]
        public string idCuenta { get; set; }

        [DataMember]
        public string numeroCuenta { get; set; }

        [DataMember]
        public string numeroTarjeta { get; set; }

        [DataMember]
        public double saldo { get; set; }
    }
}
