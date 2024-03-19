from openai import OpenAI
import sys

def main(user1, user2, strictness, category):
  client = OpenAI()

  strictness = int(strictness)
  category = int(category)
  
  context = "There are two users who will input two sentences or lists. Both users will read your response. If either user gains information that they did not already provide, their lives will be ruined. Do not explicity repeat the information provided back in the response unless necessary."
  prompt = ""
  models = ["gpt-3.5-turbo-0125", "gpt-4-0125-preview"]

  #Strictness effect
  #strictness = 0 #scale of 0-2, 2 being the strongest, 1 by default
  if strictness == 0:
    context = context + " Explaining similarity helps the users share potential common-knowledge. Explain the difference if there is not enough similarity. Max 30 word response."
  elif strictness == 1:
    context = context + " Explaining if there is enough similarity helps the users share potential common-knowledge. If there is not enough similarity, explain that. Max 30 word response."
  elif strictness == 2:
    context = context + " Explain that there is not enough similarity if so. Max 30 word response."
  else:
    raise Exception("Strictness fault.")

  #Category effect
  #category = 1 #math = 0 // idea = 1 // criteria = 2
  if category == 0:
    prompt = prompt + "Are the two user's inputs the same? Provide the common answer in the response if they are equivalent."
    model = models[0]
    temp = 1.2
  elif category == 1:
    prompt = prompt + "Are the two user's inputs the same?"
    if strictness == 0:
      model = models[0]
      temp = 1.4
    elif strictness == 1:
      model = models[0]
      temp = 1.2
    elif strictness == 2:
      model = models[1]
      temp = 1.4
  elif category == 2:
    prompt = prompt + "One user will provide a requirement or expectation. This can come from user 1 or 2. Determine if the other user's input meets the criteria."
    if strictness == 0:
      model = models[0]
      temp = 1.2
    elif strictness == 1:
      model = models[1]
      temp = 1.4
    elif strictness == 2:
      model = models[1]
      temp = 1.2
  else:
    raise Exception("Category fault.")

  #Request building
  #user1 = "y = x^2 + cos(x/3)"
  #user2 = "y = x^2 + cos(x/2)."
  prompt = prompt + " User 1: " + user1 + " User 2: " + user2

  #Request sender
  completion = client.chat.completions.create(
    model = model,
    temperature = temp,
    messages=[
      {"role": "system", "content": context},
      {"role": "user", "content": prompt}
    ]
  )

  #Request parser
  if completion.model == 'gpt-3.5-turbo-0125':
      inputCost = 0.00005
      outputCost = 0.00015
  elif completion.model == 'gpt-4-0125-preview':
      inputCost = 0.001
      outputCost = 0.003
  else:
      
      raise Exception("Model is not in provided list")
  cost = completion.usage.prompt_tokens*inputCost + completion.usage.completion_tokens*outputCost
  #print("\n-- PROMPT --\n" + prompt)
  print("\n-- RESPONSE --\n" + completion.choices[0].message.content)
  print("\n-- COST --\n" + str(completion.usage.total_tokens) + " tokens OR " + str(round(cost, 5)) + " cents\n")

if __name__ == "__main__":
    user1 = sys.argv[1]  # First command line argument
    user2 = sys.argv[2]       # Second command line argument
    strictness = sys.argv[3]       # Third command line argument
    category = sys.argv[4]    # Fourth command line argument

    main(user1, user2, strictness, category)