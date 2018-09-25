package com.upc.proyecto.negocio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.upc.proyecto.repositorio.ClienteRepositorio;
import com.upc.proyecto.entidades.Cuenta;
import com.upc.proyecto.entidades.Operacion;
import com.upc.proyecto.repositorio.OperacionRepositorio;
import com.upc.proyecto.repositorio.CuentaRepositorio;
import com.upc.proyecto.entidades.Cliente;


@Service
public class Negocio {

	@Autowired
	private ClienteRepositorio clienteRepositorio;
	
	@Autowired
	private OperacionRepositorio operacionRepositorio;
	
	@Autowired
	private CuentaRepositorio cuentaRepositorio;
	
	public Cliente obtenerCliente(Long idCliente) {
		return clienteRepositorio.findByDni(idCliente);	
	}
	
	public Cliente obtenerClient(String tarjeta, String idIDC, String clave) {
		return clienteRepositorio.find(tarjeta, idIDC, clave);		
	}
	
	@Transactional(propagation=Propagation.REQUIRED )
	public Operacion retiro(Operacion operacion) {
		Operacion operacionRespuesta = new Operacion();
		try {
			// verificamos si cliente existe por id
			Cliente cliente = clienteRepositorio.findById(operacion.getCliente().getIdCliente()).get();
			if (cliente != null) {
				// verificamos si numero de cuenta deposito existe
				Cuenta cuenta = cuentaRepositorio.verificarNumeroCuenta(operacion.getNumeroCuentaRetiro());
				if (cuenta != null) {
					// restamos a su saldo
					cuenta.setSaldo(cuenta.getSaldo() - operacion.getMonto());
					// actualizamos nuevo saldo
					cuentaRepositorio.save(cuenta);
					// registramos operacion
					operacion.setNumeroCuentaDeposito(operacion.getNumeroCuentaDeposito());
					cliente.setCuentas(null); // para evitar la recursividad de JSON
					operacion.setCliente(cliente);
					operacion.setRespuesta("Ok");
					operacionRespuesta = operacionRepositorio.save(operacion);
				}else {
					operacionRespuesta.setRespuesta("Cuenta retiro no existe");
				}
			} else {
				operacionRespuesta.setRespuesta("Cliente no existe");
		 	}
	}	catch (Exception e) {
				//Transactional.setRollbackOnly();
				System.out.println("Mensaje:" + e.getMessage());
				operacion.setRespuesta("Error:No se realizó la operación");
			}
		return operacionRespuesta;
	}
	
	
	
}
