package com.upc.proyecto.entidades;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "TP_CUENTA")
public class Cuenta implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 6606788307404586851L;
	public Cuenta() {
		// TODO Auto-generated constructor stub
	}

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="ID_CUENTA")
	private Long idCuenta;
	
	@Column(name="NUMERO_CUENTA",unique=true)
	private Long numeroCuenta;
	
	@Column(name="NUMERO_TARJETA")
	private Long numeroTarjeta;
	
	@ManyToOne(optional=false)
	@JoinColumn(name="ID_CLIENTE", nullable=false)//no genera
	@JsonIgnore
	private Cliente cliente;
	
	private Double saldo;
    
	public Long getIdCuenta() {
		return idCuenta;
	}

	public void setIdCuenta(Long idCuenta) {
		this.idCuenta = idCuenta;
	}

	public Long getNumeroCuenta() {
		return numeroCuenta;
	}

	public void setNumeroCuenta(Long numeroCuenta) {
		this.numeroCuenta = numeroCuenta;
	}

	public Long getNumeroTarjeta() {
		return numeroTarjeta;
	}

	public void setNumeroTarjeta(Long numeroTarjeta) {
		this.numeroTarjeta = numeroTarjeta;
	}

	public Double getSaldo() {
		return saldo;
	}

	public void setSaldo(Double saldo) {
		this.saldo = saldo;
	}

	public Cliente getCliente() {
		return cliente;
	}

	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}

}
