using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MySql.Data.MySqlClient;
using ServicioInnovador.Entidades;

namespace ServicioInnovador.Persistencia
{
    public class conexion
    {
        public static MySqlConnection obtenerConexion(DatosDni datos)
        {
            MySqlConnection conexion = new MySqlConnection();
            string connectionString = "insert into datos values ('" + datos.dni + "','" + datos.nombres + "','" + datos.apellido_paterno + "','" + datos.apellido_materno + "')";
            try
            {
                conexion = new MySqlConnection("Server = localhost; Port = 3306; Database = datosPersona; Uid = root; Pwd = root;");
                conexion.Open();
                MySqlCommand comando = new MySqlCommand(connectionString, conexion);
                comando.ExecuteNonQuery();
                //MySqlDataAdapter adapter = new MySqlDataAdapter("SELECT * FROM usuarios", conexion);
            }
            catch (Exception ex )
            {
                string error = ex.Message;
            }
            return conexion;
        }
    }
}