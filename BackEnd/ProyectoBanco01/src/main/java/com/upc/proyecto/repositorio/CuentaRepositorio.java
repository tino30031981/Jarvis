package com.upc.proyecto.repositorio;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.upc.proyecto.entidades.Cuenta;

public interface CuentaRepositorio extends CrudRepository<Cuenta, Long> {
	
	
/*	 @Query("SELECT cta FROM Cuenta cta, Cliente cli  WHERE "
	 		+ "cli.idCliente=:idCliente and cli.idCliente = cta.cliente.idCliente and "
	 		+ "cta.numeroCuenta=:numeroCuenta ")
	 Cuenta ObtenerCuentas(@Param("idc") Long idc);	  
	 */
	@Query("SELECT c FROM Cuenta c WHERE c.numeroCuenta=:numeroCuenta")
	 Cuenta verificarNumeroCuenta(@Param("numeroCuenta") Long numeroCuenta);
	
	@Query("SELECT c FROM Cuenta c WHERE c.numeroCuenta=:numeroCuenta and c.saldo>=:monto")
	 Cuenta verificarCuentaSaldo(@Param("numeroCuenta") Long numeroCuenta, @Param("monto") Double monto);
	 
	
}
