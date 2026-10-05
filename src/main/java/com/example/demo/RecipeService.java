package com.example.demo;
import java.util.Map;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;

@Service
public class RecipeService {
	private final ChatModel recipeModel;

	public RecipeService(ChatModel recipeModel) {
		
		this.recipeModel = recipeModel;
	}
	
	public String createRecipe(String ingredients,
			String cuisine,
			String dietaryRestrictions) {
		var template="""
				I want to create a recipe using the following ingredients:{ingredients},
				The cuisine type I prefer is {cuisine}.
				Please consider the following dietary restrictions:{dietaryRestrictions}.
				Please provide me with a detailed recipe including title,list of ingrdients a, and cooking instructions
				""";
		PromptTemplate promptTemplate=new PromptTemplate(template);
		Map<String,Object> params=Map.of("ingredients",ingredients,
				"cuisine",cuisine,
				"dietaryRestrictions",dietaryRestrictions
				);
		Prompt prompt=promptTemplate.create(params);
		return recipeModel.call(prompt).getResult().getOutput().getText();
		
	}

}
