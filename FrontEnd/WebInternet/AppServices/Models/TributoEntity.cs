using System;
using System.Runtime.Serialization;

namespace AppServices.Models
{
    [Serializable]
    [DataContract]
    public class TributoEntity
    {
        [DataMember]
        public string idTributo { get; set; }

        [DataMember]
        public string tipo { get; set; }

        [DataMember]
        public double monto { get; set; }

        [DataMember]
        public string estado { get; set; }
    }
}
