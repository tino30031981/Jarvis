package com.upc.proyecto.entidades;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name="TP_CONTRIBUYENTE")
public class Contribuyente implements Serializable{

	
	/**
	 * 
	 */
	private static final long serialVersionUID = 322049809038647592L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="ID_CONTRIBUYENTE")
	private Long idContribuyente;
		
	private String titular;
	private String Fecha_Insccripción;


	@OneToMany(mappedBy="contribuyente", cascade = CascadeType.ALL,fetch=FetchType.LAZY)
	private List<Tributo> tributos;


	public Long getIdContribuyente() {
		return idContribuyente;
	}


	public void setIdContribuyente(Long idContribuyente) {
		this.idContribuyente = idContribuyente;
	}


	public String getTitular() {
		return titular;
	}


	public void setTitular(String titular) {
		this.titular = titular;
	}


	public String getFecha_Insccripción() {
		return Fecha_Insccripción;
	}


	public void setFecha_Insccripción(String fecha_Insccripción) {
		Fecha_Insccripción = fecha_Insccripción;
	}


	public List<Tributo> getTributos() {
		return tributos;
	}


	public void setTributos(List<Tributo> tributos) {
		this.tributos = tributos;
	}
	
	
	
}
