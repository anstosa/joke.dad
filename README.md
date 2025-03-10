# joke.dad

A self explanatory meme site

## Can I add a joke?

I DON'T KNOW, CAN YOU?? jk, yes you may. Edit `jokes.json` to add a new joke (you can do it right from GitHub without even downloading the repo) and open a PR, I'd be happy to merge it

## What's with the hashes?

1. I wanted people to be able to link to specific jokes
2. I didn't want the hashes to be incredibly long (base64 or plain text)
3. I didn't want contributors to have to add a unique ID as part of their PRs

So it uses browser-native crypto libraries to hash the joke text and truncates the result into a short, very likely unique, slug

**What happens if the hashes aren't unique?**
It will pick the first match from the top of the jokes.json file.

## What's with the GIFs?

Everything is funnier with a GIF. Fight me.

## How much did you pay for this stupid domain?

$50. Wasn't even parked! I know, I couldn't believe it either!

## I'm not amused

HI 'NOT AMUSED', I'M DAD
