package com.upc.proyecto.repositorio;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.upc.proyecto.entidades.Cliente;

public interface ClienteRepositorio extends CrudRepository<Cliente, Long>{
	@Query("SELECT c FROM Cliente c WHERE c.idCliente=:idCliente")
	Cliente findByDni(@Param("idCliente") Long idCliente);
	
	@Query(nativeQuery=true, value ="select distinct tpcl.id_cliente,tpcl.apellidos,tpcl.clave_internet,tpcl.nombre from tp_cliente as tpcl " + 
			"inner join tp_cuenta as tpcu on tpcl.id_cliente = tpcu.id_cliente " + 
			"where " + 
			"tpcu.id_cliente = :ididc and " + 
			"tpcu.numero_tarjeta= :tarjeta and " + 
			"tpcl.clave_internet = :clave ;")
	Cliente find(@Param("tarjeta") String tarjeta, @Param("ididc") String idIDC, @Param("clave") String clave);
}