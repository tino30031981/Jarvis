package com.upc.proyecto.jms;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component
public class JMSProducer {

	@Autowired
	private JmsTemplate jmsTemplate;
	
	@Value("${jms.cola.envio}")
	String destinationQueue;
	
	public String send (String msg) {
		jmsTemplate.convertAndSend(destinationQueue, (msg));
		String mensaje = "Se envió a la cola";
		return mensaje;
		
	}
}
