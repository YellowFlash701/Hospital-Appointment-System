package nibm.hdse241.hospitalappointmentsystem.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class webConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(Arrays.asList(
                    "http://localhost:5173",
                    "https://hospital-appointment-system-delta.vercel.app/")) // Allow your frontend origin
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}

// [ai:2026-07-23] // TODO: Add CORS config for production frontend domains

// [ai:2026-07-23] // TODO: Verify CORS config aligns with frontend deployment
