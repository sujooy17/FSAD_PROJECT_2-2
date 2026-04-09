import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.io.File;
import java.nio.file.Files;
import java.net.InetSocketAddress;

public class Server {
    public static void main(String[] args) throws Exception {
        int port = 8000;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        
        // Serve static files from /public directory
        server.createContext("/", new StaticFileHandler("public"));
        
        // Basic API Endpoints for the full-stack requirement
        server.createContext("/api/subscriptions", new ApiHandler("{\"status\": \"success\", \"data\": [\"sub1\", \"sub2\"]}"));
        server.createContext("/api/releases", new ApiHandler("{\"status\": \"success\", \"data\": [\"release1\"]}"));
        
        server.setExecutor(null);
        server.start();
        System.out.println("Java AI Subscriptions & OTT Backend Server is running on port " + port);
        System.out.println("Access the application at: http://localhost:" + port + "/");
    }

    static class StaticFileHandler implements HttpHandler {
        private String baseDir;

        public StaticFileHandler(String baseDir) {
            this.baseDir = baseDir;
        }

        @Override
        public void handle(HttpExchange t) throws IOException {
            String path = t.getRequestURI().getPath();
            if (path.equals("/")) {
                path = "/index.html";
            }
            
            File file = new File(baseDir + path);
            if (!file.exists() || file.isDirectory()) {
                String response = "404 (Not Found)\n";
                t.sendResponseHeaders(404, response.length());
                OutputStream os = t.getResponseBody();
                os.write(response.getBytes());
                os.close();
                return;
            }

            try {
                byte[] bytes = Files.readAllBytes(file.toPath());
                String mimeType = "text/plain";
                if (path.endsWith(".html")) mimeType = "text/html";
                else if (path.endsWith(".css")) mimeType = "text/css";
                else if (path.endsWith(".js")) mimeType = "application/javascript";
                
                t.getResponseHeaders().set("Content-Type", mimeType);
                t.sendResponseHeaders(200, bytes.length);
                OutputStream os = t.getResponseBody();
                os.write(bytes);
                os.close();
            } catch (Exception e) {
                String response = "500 Internal Server Error\n";
                t.sendResponseHeaders(500, response.length());
                OutputStream os = t.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        }
    }

    static class ApiHandler implements HttpHandler {
        private String jsonResponse;

        public ApiHandler(String jsonResponse) {
            this.jsonResponse = jsonResponse;
        }

        @Override
        public void handle(HttpExchange t) throws IOException {
            t.getResponseHeaders().set("Content-Type", "application/json");
            t.sendResponseHeaders(200, jsonResponse.length());
            OutputStream os = t.getResponseBody();
            os.write(jsonResponse.getBytes());
            os.close();
        }
    }
}
