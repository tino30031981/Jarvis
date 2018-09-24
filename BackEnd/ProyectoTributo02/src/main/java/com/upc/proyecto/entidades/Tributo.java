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
@Table(name="TP_TRIBUTO")
public class Tributo implements Serializable{
	
	
	private static final long serialVersionUID = -4438461748650552110L;
	
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="ID_TRIBUTO")
	private Long idTributo;
	
	private String Tipo;
	private Double Monto;
	private String Estado;
	
	@ManyToOne(optional=false)
	@JoinColumn(name="ID_CONTRIBUYENTE", nullable=false)//no genera
	@JsonIgnore
	private Contribuyente contribuyente;
	

	public Long getIdTributo() {
		return idTributo;
	}
	public void setIdTributo(Long idTributo) {
		this.idTributo = idTributo;
	}

	public String getTipo() {
		return Tipo;
	}
	public void setTipo(String tipo) {
		Tipo = tipo;
	}
	public Double getMonto() {
		return Monto;
	}
	public void setMonto(Double monto) {
		Monto = monto;
	}
	public String getEstado() {
		return Estado;
	}
	public void setEstado(String estado) {
		Estado = estado;
	}
	
	


	
	
}
