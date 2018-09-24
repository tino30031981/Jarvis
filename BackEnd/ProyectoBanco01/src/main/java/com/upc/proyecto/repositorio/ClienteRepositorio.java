package com.upc.proyecto.repositorio;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.upc.proyecto.entidades.Cliente;

public interface ClienteRepositorio extends CrudRepository<Cliente, Long>{
	@Query("SELECT c FROM Cliente c WHERE c.idCliente=:idCliente")
	Cliente findByDni(@Param("idCliente") Long idCliente);
	

}