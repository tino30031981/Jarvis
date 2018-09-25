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


@Entity
@Table(name = "TP_OPERACION")
public class Operacion implements Serializable{

	
	/**
	 * 
	 */
	private static final long serialVersionUID = 7564131616925324623L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="ID_OPERACION")
	private Long idOperacion;
	
	@ManyToOne
	@JoinColumn(name="ID_CLIENTE")
	private Cliente cliente;
	
	private Double monto;
	private Long numeroCuentaDeposito;
	private Long numeroCuentaRetiro;
	private String respuesta;
	
	
	public Long getIdOperacion() {
		return idOperacion;
	}
	public void setIdOperacion(Long idOperacion) {
		this.idOperacion = idOperacion;
	}
	public Cliente getCliente() {
		return cliente;
	}
	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}
	public Double getMonto() {
		return monto;
	}
	public void setMonto(Double monto) {
		this.monto = monto;
	}
	public Long getNumeroCuentaDeposito() {
		return numeroCuentaDeposito;
	}
	public void setNumeroCuentaDeposito(Long numeroCuentaDeposito) {
		this.numeroCuentaDeposito = numeroCuentaDeposito;
	}
	public Long getNumeroCuentaRetiro() {
		return numeroCuentaRetiro;
	}
	public void setNumeroCuentaRetiro(Long numeroCuentaRetiro) {
		this.numeroCuentaRetiro = numeroCuentaRetiro;
	}
	public String getRespuesta() {
		return respuesta;
	}
	public void setRespuesta(String respuesta) {
		this.respuesta = respuesta;
	}
	
	
}
