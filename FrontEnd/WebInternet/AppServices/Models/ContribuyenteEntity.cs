using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace AppServices.Models
{
    [Serializable]
    [DataContract]
    public class ContribuyenteEntity
    {
        [DataMember]
        public string idContribuyente { get; set; }

        [DataMember]
        public string titular { get; set; }

        [DataMember]
        public string fecha_inscripción { get; set; }

        [DataMember]
        public List<TributoEntity> tributos { get; set; }

    }
}
