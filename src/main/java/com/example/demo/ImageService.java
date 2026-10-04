package com.example.demo;

import java.util.Base64;

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

    @Value("${cloudflare.account-id}")
    private String accountId;

    @Value("${cloudflare.api-token}")
    private String apiToken;

    public ImageService() {
        this.restClient = RestClient.builder().build();
        this.objectMapper = new ObjectMapper();
    }

    public byte[] generateImage(String prompt) {

        String url = "https://api.cloudflare.com/client/v4/accounts/"
                + accountId
                + "/ai/run/@cf/black-forest-labs/flux-2-klein-9b";

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        body.add("prompt", prompt);
        body.add("width", "1024");
        body.add("height", "1024");

        String response = restClient.post()
                .uri(url)
                .header("Authorization", "Bearer " + apiToken)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(String.class);

        try {
            JsonNode json = objectMapper.readTree(response);

            String base64Image = json
                    .get("result")
                    .get("image")
                    .asText();

            return Base64.getDecoder().decode(base64Image);

        } catch (Exception e) {
            throw new RuntimeException("Failed to process generated image", e);
        }
    }
}