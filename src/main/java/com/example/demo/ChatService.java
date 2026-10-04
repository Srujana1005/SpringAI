package com.example.demo;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.google.genai.GoogleGenAiChatOptions;
import org.springframework.stereotype.Service;

@Service
public class ChatService {
private final ChatModel chatModel;

public ChatService(ChatModel chatModel) {
	
	this.chatModel = chatModel;
}
public String getResponse(String prompt) {
	return chatModel.call(prompt);
}
public String getResponseOptions(String prompt) {
	ChatResponse response=chatModel.call( 
			new Prompt(
	       prompt,
	        GoogleGenAiChatOptions.builder()
	        .model("gemini-3.8-flash")
	        
	            .temperature(0.4)
	        .build()
	    ));
	return response.getResult().getOutput().getText();
}


	   

}
