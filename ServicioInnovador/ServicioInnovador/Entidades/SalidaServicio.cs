using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace ServicioInnovador.Entidades
{
    [DataContract]
    public class SalidaServicio
    {
        [DataMember(Name = "Resultado", IsRequired = false, Order = 0)]
        public bool Resultado { get; set; }

        [DataMember(Name = "DatosDni", IsRequired = false, Order = 1)]
        public DatosDni DatosDni { get; set; }
    }

    [DataContract]
    public class DatosDni
    {
        [DataMember(Name = "dni", IsRequired = false, Order = 0)]
        public string dni { get; set; }

        [DataMember(Name = "nombres", IsRequired = false, Order = 0)]
        public string nombres { get; set; }

        [DataMember(Name = "apellido_paterno", IsRequired = false, Order = 0)]
        public string apellido_paterno { get; set; }

        [DataMember(Name = "apellido_materno", IsRequired = false, Order = 0)]
        public string apellido_materno { get; set; }

        [DataMember(Name = "caracter_verificacion", IsRequired = false, Order = 0)]
        public string caracter_verificacion { get; set; }

        [DataMember(Name = "caracter_verificacion_anterior", IsRequired = false, Order = 0)]
        public string caracter_verificacion_anterior { get; set; }

    }
}