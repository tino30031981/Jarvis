using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace AppServices.Models
{
    [Serializable]
    [DataContract]
    public class OperacionEntity
    {
        [DataMember]
        public ClienteEntity cliente { get; set; }

        [DataMember]
        public double monto { get; set; }

        [DataMember]
        public string numeroCuentaRetiro { get; set; }
    }
}
