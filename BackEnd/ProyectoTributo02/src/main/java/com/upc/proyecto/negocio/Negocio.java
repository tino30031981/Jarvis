package com.upc.proyecto.negocio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.upc.proyecto.repositorio.ContribuyenteRepositorio;
import com.upc.proyecto.entidades.Contribuyente;
import com.upc.proyecto.entidades.Tributo;


@Service
public class Negocio {

	@Autowired
	private ContribuyenteRepositorio tributoRepositorio;
	
	public Contribuyente obtenerContribuyente(Long idContribuyente) {
		return tributoRepositorio.findByDni(idContribuyente);
		
	}
	
	
}
