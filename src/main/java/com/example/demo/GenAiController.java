 
package com.example.demo;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GenAiController {

    private final ChatService chatService;
    private final ImageService imageService;
    private final RecipeService recipeService; 

    public GenAiController(
            ChatService chatService,
            ImageService imageService,RecipeService recipeService) {

        this.chatService = chatService;
        this.imageService = imageService;
        this.recipeService = recipeService;
    }

    @GetMapping("/ask-ai")
    public String getResponse(
            @RequestParam String prompt) {

        return chatService.getResponse(prompt);
    }

    @GetMapping("/ask-ai-options")
    public String getResponseOptions(
            @RequestParam String prompt) {

        return chatService.getResponseOptions(prompt);
    }

    // Generate ONE image
    @GetMapping(
            value = "/generate-image",
            produces = "image/png")
    public byte[] generateImage(
            @RequestParam String prompt) {

        return imageService.generateImage(prompt);
    }
    
    @GetMapping("/recipe-generate")
    public String recipeCreator(
            @RequestParam String ingredients,
            @RequestParam(defaultValue="any") String cuisine,
            @RequestParam(defaultValue="") String dietaryRestrictions) {
    	return recipeService.createRecipe(ingredients,cuisine,dietaryRestrictions);
    }
    


    // Generate MULTIPLE images
    @GetMapping("/generate-images")
    public List<String> generateImages(
            @RequestParam String prompt,
            @RequestParam int count) {

        List<String> fileNames =
                imageService.generateImage(prompt, count);

        return fileNames.stream()
                .map(fileName ->
                        "http://localhost:8080/images/"
                        + fileName)
                .toList();
    }

    // Serve saved image
    @GetMapping(
            value = "/images/{fileName}",
            produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getImage(
            @PathVariable String fileName) {

        byte[] image =
                imageService.getImage(fileName);

        return ResponseEntity.ok(image);
    }
}
