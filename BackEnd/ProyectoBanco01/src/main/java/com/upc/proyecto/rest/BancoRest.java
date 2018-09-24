package com.upc.proyecto.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.upc.proyecto.entidades.Cuenta;
import com.upc.proyecto.repositorio.ClienteRepositorio;
import com.upc.proyecto.entidades.Cliente;
import com.upc.proyecto.negocio.Negocio;

@RestController
@RequestMapping("/api")
public class BancoRest {

	@Autowired
	private Negocio negocio;
	
	@Autowired
	private ClienteRepositorio clienteRepositorio;
	
	@GetMapping("/cliente/{idCliente}")
	public Cliente obtenerCliente(@PathVariable(value="idCliente") Long idCliente) {
		return negocio.obtenerCliente(idCliente);
	
	}
	
/*	@GetMapping("/cuentas/{idc}")
	public List<Cuenta> obtenerCuentas(@PathVariable(name="idc") String idc){
		List<Cuenta> cuentas = clienteRepositorio.findByIdc(idc).getCuentas();
		return cuentas;
	}
	*/
	
}
