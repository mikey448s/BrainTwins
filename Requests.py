from openai import OpenAI
import sys

def main(user1, user2, strictness, category):
  client = OpenAI()

  strictness = int(strictness)
  #strictness = strictness - 1
  category = int(category)

  context = "There are two users who will input two sentences or lists. You must process both user's ideas, and respond appropriately. Both users will read your response. If either user gains information that they did not already provide, their lives will be ruined. Do not explicitly repeat information from the users back in the response."
  prompt = ""
  models = ["gpt-3.5-turbo-0125", "gpt-4-0125-preview"]

  #Strictness effect
  #scale of 0-2, 2 being the strongest, 2 by default
  if strictness == 0:
    context = context + " Explaining similarity, if it exists, helps the users share potential common-knowledge. Try to hint at what makes the two user's inputs different if there is not enough similarity WITHOUT repeating specific information that isn't in common. Max 40 word response."
  elif strictness == 1:
    context = context + " Explaining if there is enough similarity helps the users share potential common-knowledge themselves. However, if there is not enough similarity, explain that. Max 35 word response."
  elif strictness == 2:
    context = context + " Explain that there is not enough similarity if so. Never repeat exact details unless they are guaranteed to be complete shared knowledge. Max 30 word response."
  else:
    raise Exception("Strictness fault.")

  #Category effect
  #math/sci = 0 // langarts/history = 1 // media = 2 // criteria = 3
  if category == 0:
    prompt = prompt + "Are the two user's mathematical/scientific inputs the same? Provide the common answer in the response if they are equivalent."
    model = models[0]
    temp = 1.2
  elif category == 1:
    prompt = prompt + "Are the two user's language-arts/history inputs the same? Provide details in the significance ONLY if they are similar."
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
    prompt = prompt + "Are the two user's media inputs the same? Provide details in the significance ONLY if they are similar. Make extra careful to not mention details like characters or plot points that do not overlap as it can spoil content."
    if strictness == 0:
      model = models[0]
      temp = 1.3
    elif strictness == 1:
      model = models[1]
      temp = 1.3
    elif strictness == 2:
      model = models[1]
      temp = 1.3
  elif category == 3:
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
  #print("\n--STRICTNESS--\n" + str(strictness) + "\n--CATEGORY--\n" + str (category))
  print("[RESPONSE]: " + completion.choices[0].message.content)
  #print("\n-- COST --\n" + str(completion.usage.total_tokens) + " tokens OR " + str(round(cost, 5)) + " cents\n")

if __name__ == "__main__":
    user1 = sys.argv[1]  # First command line argument
    user2 = sys.argv[2]       # Second command line argument
    strictness = sys.argv[3]       # Third command line argument
    category = sys.argv[4]    # Fourth command line argument

    main(user1, user2, strictness, category)
   