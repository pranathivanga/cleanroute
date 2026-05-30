package com.cleanroute;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CleanrouteApplication {

	public static void main(String[] args) {
		SpringApplication.run(CleanrouteApplication.class, args);
	}

}
