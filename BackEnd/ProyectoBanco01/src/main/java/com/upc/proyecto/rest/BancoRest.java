package com.upc.proyecto.rest;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.upc.proyecto.repositorio.ClienteRepositorio;
import com.upc.proyecto.entidades.Operacion;
import com.upc.proyecto.entidades.Cliente;
import com.upc.proyecto.negocio.Negocio;

@RestController
@RequestMapping("/api")
public class BancoRest {

	@Autowired
	private Negocio negocio;
	
	@GetMapping("/cliente/{idCliente}")
	public Cliente obtenerCliente(@PathVariable(value="idCliente") Long idCliente) {
		return negocio.obtenerCliente(idCliente);
	}
	
	@PostMapping("/retiro")
	public Operacion deposito(@Valid @RequestBody Operacion operacion) {
		return negocio.retiro(operacion);
	}
	
	@GetMapping("/cliente/{idtarjeta}/{ididc}/{idclave}")
	public Cliente obtenerClient(@PathVariable(value="idtarjeta") String tarjeta,@PathVariable(value="ididc") String idIDC,@PathVariable(value="idclave") String idClave ) {
		return negocio.obtenerClient(tarjeta, idIDC, idClave);
	}	
	
}
