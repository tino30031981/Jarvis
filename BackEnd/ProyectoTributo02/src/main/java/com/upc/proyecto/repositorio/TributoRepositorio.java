package com.upc.proyecto.repositorio;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;


import com.upc.proyecto.entidades.Tributo;

public interface TributoRepositorio  extends CrudRepository<Tributo, Long>{
	@Query("SELECT c FROM Tributo c WHERE c.idTributo=:idTributo")
	Tributo findByID(@Param("idTributo") Long idTributo);
	
	 @Query("UPDATE Tributo t SET t.estado=:estado WHERE t.idTributo=:idTributo")
		 Tributo Actualizar(@Param("idTributo") Long idTributo ,
				            @Param("estado") String estado);	

}
