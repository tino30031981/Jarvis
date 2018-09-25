package com.upc.proyecto.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.upc.proyecto.repositorio.ContribuyenteRepositorio;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.upc.proyecto.jms.JMSProducer;
import com.upc.proyecto.entidades.Contribuyente;
import com.upc.proyecto.entidades.Respuesta;
import com.upc.proyecto.entidades.Tributo;
import com.upc.proyecto.negocio.Negocio;

@RestController
@RequestMapping("/api")
public class TributoRest {

	@Autowired
	private Negocio negocio;
	
	@Autowired
	private ContribuyenteRepositorio contribuyenteRepositorio;
	
	@Autowired
	private JMSProducer jmsProducer;
	
	@GetMapping("/tributo/{idContribuyente}")
	public Contribuyente obtenerContribuyente(@PathVariable(value="idContribuyente") Long idContribuyente) {
		return negocio.obtenerContribuyente(idContribuyente);
	
	}
	
	@PostMapping("/enviar")
	public Tributo enviar(@RequestBody Tributo tributo) {
		ObjectMapper mapper = new ObjectMapper();
		
		String jsonString=null;
		try {
			jsonString = mapper.writeValueAsString(tributo);
			jmsProducer.send(jsonString);
			System.out.println("Enviado a la cola");
	
		} catch (JsonProcessingException e) {
			// TODO: handle exception
			e.printStackTrace();
			
			System.out.println("ERROR");
		}
		return tributo;	
	}
	
	
	
	@JmsListener(destination="${jms.queue.destination}")
	public void miMensaje(String mensajeJson) {
		System.out.println("Recibido: " + mensajeJson);
		ObjectMapper mapper= new ObjectMapper();
		try {
			Tributo tributo = mapper.readValue(mensajeJson, Tributo.class);
		//	tributo.setRespuesta("Registrar a Tabla");
			System.out.println("Consultar cola");
			System.out.println(mensajeJson);
			Tributo respuesta = negocio.Actualizar(tributo);
			
			if (respuesta==null) {
				System.out.println("No se pudo actualizar");
			} else {
				System.out.println("Actualizado");

			}
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println(e.getMessage());
			System.out.println("No se pudo registrar");
		}
	} 
	
	
	
	
}
