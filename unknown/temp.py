kish = ["a", "b", "d", "e", "g", "h", "i", "j", "k", "m", "n", "o", "r", "s", "u", "y"]
mnem = ['*', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v']
plu = ["address", "big", "hello", "how", "me", "move", "not", "object", "paper", "person", "small", "thanks", "want", "what", "when", "where", "who", "why", "you"]
mu = ["address", "big", "friend", "hello", "how", "like", "me", "move", "not", "object", "paper", "person", "small", "thanks", "want", "what", "when", "where", "who", "why", "you"]
osv = ["address", "big", "friend", "hello", "how", "like", "me", "move", "not", "object", "paper", "person", "small", "thanks", "want", "what", "when", "where", "who", "why", "you"]


print("osv")
translations = {}
for char in osv:
    translations[char] = input(char+": ")

print(translations)