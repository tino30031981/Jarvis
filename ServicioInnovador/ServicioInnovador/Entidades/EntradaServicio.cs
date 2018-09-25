using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace ServicioInnovador.Entidades
{
    [DataContract]
    public class EntradaServicio
    {
        [DataMember(Name = "Dni", IsRequired = false, Order = 0)]
        public string Dni { get; set; }

        [DataMember(Name = "Email", IsRequired = false, Order = 1)]
        public string Email { get; set; }
    }
}