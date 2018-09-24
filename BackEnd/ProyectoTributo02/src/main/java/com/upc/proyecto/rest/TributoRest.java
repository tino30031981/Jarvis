package com.upc.proyecto.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.upc.proyecto.repositorio.ContribuyenteRepositorio;
import com.upc.proyecto.entidades.Contribuyente;
import com.upc.proyecto.entidades.Tributo;
import com.upc.proyecto.negocio.Negocio;

@RestController
@RequestMapping("/api")
public class TributoRest {

	@Autowired
	private Negocio negocio;
	
	@Autowired
	private ContribuyenteRepositorio contribuyenteRepositorio;
	
	@GetMapping("/tributo/{idContribuyente}")
	public Contribuyente obtenerContribuyente(@PathVariable(value="idContribuyente") Long idContribuyente) {
		return negocio.obtenerContribuyente(idContribuyente);
	
	}
	

	
}
