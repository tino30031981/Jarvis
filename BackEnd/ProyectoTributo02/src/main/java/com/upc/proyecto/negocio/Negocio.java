package com.upc.proyecto.negocio;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.upc.proyecto.repositorio.ContribuyenteRepositorio;
import com.upc.proyecto.repositorio.TributoRepositorio;
import com.upc.proyecto.entidades.Contribuyente;
import com.upc.proyecto.entidades.Tributo;


@Service
public class Negocio {

	@Autowired
	private ContribuyenteRepositorio contribuyenteRepositorio;
	
	@Autowired
	private TributoRepositorio tributoRepositorio;
	
	public Contribuyente obtenerContribuyente(Long idContribuyente) {
		return contribuyenteRepositorio.findByDni(idContribuyente);
		
	}
	
	@Transactional
	public Tributo Actualizar(Tributo tributo) {
		 
		Tributo operacionRespuesta = new Tributo();
		
			// actualiza campo de la BD
			
			Long idTributo = tributo.getIdTributo();
			String estado = tributo.getEstado();
			System.out.println(estado);
			if (estado != null) {
				
				Tributo RespuestaConsulta = tributoRepositorio.findByID(idTributo);
				tributo.setContribuyente(RespuestaConsulta.getContribuyente());
				tributo.setEstado(estado);
				System.out.println("Actualiza estado");
				operacionRespuesta = tributoRepositorio.save(tributo);
				return operacionRespuesta;
			}else {
				System.out.println("No se actualizo");
				return null;
			}
			

		}	
							
	}
	
