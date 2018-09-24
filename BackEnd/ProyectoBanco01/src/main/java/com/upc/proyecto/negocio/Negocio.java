package com.upc.proyecto.negocio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.upc.proyecto.repositorio.ClienteRepositorio;
import com.upc.proyecto.entidades.Cliente;


@Service
public class Negocio {

	@Autowired
	private ClienteRepositorio clienteRepositorio;
	
	public Cliente obtenerCliente(Long idCliente) {
		return clienteRepositorio.findByDni(idCliente);
		
	}
	
	
}
