package com.upc.proyecto.repositorio;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.upc.proyecto.entidades.Contribuyente;

public interface ContribuyenteRepositorio extends CrudRepository<Contribuyente, Long>{
	@Query("SELECT c FROM Contribuyente c WHERE c.idContribuyente=:idContribuyente")
	Contribuyente findByDni(@Param("idContribuyente") Long idContribuyente);
	

}