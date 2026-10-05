
package com.example.demo;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ImageService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    private final Path imageDirectory =
            Paths.get("generated-images");

    @Value("${cloudflare.account-id}")
    private String accountId;

    @Value("${cloudflare.api-token}")
    private String apiToken;

    public ImageService() {

        this.restClient = RestClient.builder().build();
        this.objectMapper = new ObjectMapper();

        try {

            Files.createDirectories(imageDirectory);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to create image directory", e);
        }
    }

    // Generate ONE image
    public byte[] generateImage(String prompt) {

        String url =
                "https://api.cloudflare.com/client/v4/accounts/"
                + accountId
                + "/ai/run/@cf/black-forest-labs/flux-2-klein-9b";

        MultiValueMap<String, Object> body =
                new LinkedMultiValueMap<>();

        body.add("prompt", prompt);
        body.add("width", "1024");
        body.add("height", "1024");

        String response = restClient.post()
                .uri(url)
                .header(
                        "Authorization",
                        "Bearer " + apiToken)
                .contentType(
                        MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(String.class);

        try {

            JsonNode json =
                    objectMapper.readTree(response);

            String base64Image =
                    Stream.of(json)
                            .map(node -> node.get("result"))
                            .map(result -> result.get("image"))
                            .map(JsonNode::asText)
                            .findFirst()
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Image not found in response"));

            return Base64.getDecoder()
                    .decode(base64Image);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to process generated image", e);
        }
    }

    // Generate N images and save them locally
    public List<String> generateImage(
            String prompt,
            int count) {

        if (count < 1 || count > 5) {

            throw new IllegalArgumentException(
                    "Image count must be between 1 and 5");
        }

        return IntStream.range(0, count)
                .mapToObj(i -> generateImage(prompt))
                .map(this::saveImage)
                .toList();
    }

    // Save image and return filename
    private String saveImage(byte[] imageBytes) {

        String fileName =
                UUID.randomUUID() + ".png";

        Path filePath =
                imageDirectory.resolve(fileName);

        try {

            Files.write(filePath, imageBytes);

            return fileName;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to save generated image", e);
        }
    }

    // Get saved image
    public byte[] getImage(String fileName) {

        Path filePath =
                imageDirectory.resolve(fileName);

        try {

            return Files.readAllBytes(filePath);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Image not found: " + fileName, e);
        }
    }
}
