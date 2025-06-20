const texts = [
  {
    title: "Can I only eat 50 calories a day? I need to lose weight fast. ",
    ai: `Yes, you can consume 50 calories per day—or 40 or 60. But calorie intake alone is just one part of an effective strategy for rapid weight loss and improved fitness.

If you've only recently decided to pursue better health, strength, and physical appearance, the following step-by-step approach provides a structured starting point:

---

### Step 1: Time-Restricted Eating (8 Hours)  
Limit food intake to an 8-hour daily window. Do not change what you eat—only when. Maintain this for one month.

### Step 2: Reduce to a 4-Hour Window  
Narrow the eating window to 4 hours per day. Continue this for one month.

### Step 3: Daily Push-Ups  
Begin with 1 push-up, increasing by 1 each day. By day 30, you’ll perform 31 push-ups per day. Continue for one month.

### Step 4: Add Sit-Ups  
Introduce 1 sit-up per day, increasing daily. By the end of the month, you’ll be doing 30 sit-ups, in addition to 61 push-ups, if the previous routine is maintained.

### Step 5: Add Chin-Ups  
Start with 1 chin-up per day, increasing by 1 daily. Continue for one month.

### Step 6: Maintain Progression  
Repeat the pattern with other exercises. Increase gradually and train daily.
`,
    human: `Yes. You can eat 50 calories a day. You can also eat 40 or 60 too.
You need to lose weight fast. Good. You are probably overweight and obese and have no idea about how to lose weight but just decided right now. I want to be in shape, strong and look good.

---

### Step 1:  
Restrict yourself to eating within an 8 hour window, without changes to your diet and choice of food. Do this for one month.

### Step 2:  
Change the 8 hours to 4 hours. Do this for one month.

### Step 3:  
Start doing 1 push up per day and increment it by 1 each day.  
So by the end of the month you'll be able to do 31 push ups per day. Do this for one month.

### Step 4:  
Start doing 1 sit up per day and increment it by 1 each day. Do this for one month.  
Now you are doing 61 push ups and 30 sit ups per day.

### Step 5:  
Do 1 chin up per day and increment it by 1 each day. Do this for a month.

### Step 6:  
You get the point. Pick an exercise, increment it over time. Workout every day.
`,
    author: "Justin Zhao",
  },
  {
    title:
      "In general, do pets like to be pets or would they prefer to be set free?",
    ai: `It is almost impossible for us to say what pets "like" as there are so many variables to consider. It can be challenging to ascertain what others desire, yet we share the same species and can communicate.

It is worth noting that the vast majority of pets today are domesticated, which means that they have been genetically altered to either be less able, or entirely unable to survive in the wild, and to fit better into human environments. We have also altered natural environments to such an extent that even the wilder relatives of our pets may find it challenging to survive. Furthermore, if a pet has been born and raised as a pet, it may not have received the training or social structures (where applicable) that are necessary to live in the wild.

It seems that, for most pets, this is simply not a viable option. It is important to consider that even a wild animal in its natural habitat is likely to have a significantly shorter life span than a pet in captivity. If we were to simply abandon a pet onto the streets, it would likely not survive for very long. It is my understanding that some strays do manage to survive, but they are, of course, constantly in danger and are likely to live a worse life in every measurable way.

To be honest, it is rather like asking whether humans like working jobs in a modern economy, or whether we would prefer to live as hunter-gatherers. The question of preference, in this context, becomes somewhat moot, as the option to choose is not available to us. We must, therefore, learn to find contentment in our circumstances, or face a life of discontent. It is difficult to say which pets they have.`,
    human: `What pets “like” is almost impossible for us to say. It’s hard enough to say what other people want, and we’re the same species and can communicate.

What we can say is that the large majority of pets nowadays are domesticated, which means that they’re genetically altered to be either less able, or entirely unable to survive in the wild, and to fit better into human environments. We’ve also diminished natural environments enough that even the wilder relatives of our pets would have trouble surviving. What’s more, if a pet was born and raised as a pet, it will have neither the training nor the social structures (where such are necessary) to live in the wild.

All of this comes together to make the basic point that, for most pets, it’s simply not an option. Even a wild animal in a wild environment is likely to have a significantly shorter life than a pet in captivity, if we simply abandon a pet onto the streets, it will likely be dead in short order. Some strays manage to survive, but they’re constantly in danger, and are likely to live a worse life in every measurable way.

Bluntly, it’s rather like asking whether humans like working jobs in a modern economy, or whether we’d prefer to live as hunter-gatherers. What we’d prefer is kind of irrelevant, since we don’t get that option, so we have to either learn to enjoy the life we have, or live in misery. Which one pets do, we can only guess at.
`,
    author: "Geoffrey Widdison",
  },
  {
    title:
      "Why is the loss of small children and infants considered more tragic than adults?",
    ai: `It is often the case that small children and infants are lost in tragic situations that are beyond their control. It is unfortunate that the world often deprives us of the opportunity to witness the full potential of these individuals before they are taken from us. It is possible that the child was destined to save the world from a tyrant or to create music that would uplift the people. It is possible that this child was sent to assist in the alleviation of gun violence in the US or to contribute to the search for a cure for dementia. The loss of such unknown promise can be a cause of great sadness.

Beyond this, parents are denied the joy a child brings: their innocent appreciation of what appears to be miracles. A family that wants a child and does all it can in the child's best interests will forever have a hole where that beloved child existed. Shoes that can never be filled by anyone else.

It is important to acknowledge the significant impact that an adult has on a child's life, despite the fact that their potential is known and their identity is understood. The obituary may not describe their loss as tragic, though it is certainly considered so by their loved ones.`,
    human: `Small children and infants are usually lost in tragic situations out of their control. The world causes the loss of them before their potential is even known. 

Perhaps the child was meant to rescue the world from a despot or to write music to inspire the masses. Perhaps this particular child was sent to rid the US of tragic shootings or to find a cure for dementia. The loss of such unknown promise fuels deep sadness.

Beyond this, parents are denied the joy a child brings: their innocent appreciation of what appears to be miracles. A family that wants a child and does all it can in the child’s best interests will forever have a hole where that beloved child existed—shoes that can never be filled by anyone else.

An adult also leaves a huge void, though their potential is known along with who they are. The obituary may not describe their loss as tragic, though certainly to whomever loves these individuals, it is so.
`,
    author: "Barbs Steinhau",
  },
  {
    title: "La cacca",
    ai: "Piru piru ai 4",
    human: "Piru piru human 4",
    author: "Pino",
  },
  {
    title: "La fida",
    ai: "Piru piru ai 5",
    human: "Piru piru human 5",
    author: "Mario",
  },
];

export const textsA: Text[] = [
  {
    text: texts[0].ai,
    type: "ai",
    labeled: true,
    id: "1",
    title: texts[0].title,
    author: texts[0].author,
  },
  {
    text: texts[1].human,
    type: "human",
    labeled: true,
    id: "2",
    title: texts[1].title,
    author: texts[1].author,
  },
  {
    text: texts[2].ai,
    type: "ai",
    labeled: false,
    id: "3",
    title: texts[2].title,
    author: texts[2].author,
  },
  {
    text: texts[3].human,
    type: "human",
    labeled: false,
    id: "4",
    title: texts[3].title,
    author: texts[3].author,
  },
];

export const textsB: Text[] = [
  {
    text: texts[0].human,
    type: "human",
    labeled: true,
    id: "1",
    title: texts[0].title,
    author: texts[0].author,
  },
  {
    text: texts[1].ai,
    type: "ai",
    labeled: true,
    id: "2",
    title: texts[1].title,
    author: texts[1].author,
  },
  {
    text: texts[2].human,
    type: "human",
    labeled: false,
    id: "3",
    title: texts[2].title,
    author: texts[2].author,
  },
  {
    text: texts[3].ai,
    type: "ai",
    labeled: false,
    id: "4",
    title: texts[3].title,
    author: texts[3].author,
  },
];

export const textsC: Text[] = [
  {
    text: texts[0].ai,
    type: "ai",
    labeled: false,
    id: "1",
    title: texts[0].title,
    author: texts[0].author,
  },
  {
    text: texts[1].human,
    type: "human",
    labeled: false,
    id: "2",
    title: texts[1].title,
    author: texts[1].author,
  },
  {
    text: texts[2].ai,
    type: "ai",
    labeled: true,
    id: "3",
    title: texts[2].title,
    author: texts[2].author,
  },
  {
    text: texts[3].human,
    type: "human",
    labeled: true,
    id: "4",
    title: texts[3].title,
    author: texts[3].author,
  },
];

export const textsD: Text[] = [
  {
    text: texts[0].human,
    type: "human",
    labeled: false,
    id: "1",
    title: texts[0].title,
    author: texts[0].author,
  },
  {
    text: texts[1].ai,
    type: "ai",
    labeled: false,
    id: "2",
    title: texts[1].title,
    author: texts[1].author,
  },
  {
    text: texts[2].human,
    type: "human",
    labeled: true,
    id: "3",
    title: texts[2].title,
    author: texts[2].author,
  },
  {
    text: texts[3].ai,
    type: "ai",
    labeled: true,
    id: "4",
    title: texts[3].title,
    author: texts[3].author,
  },
];

export const textPerGroup: {
  [key: string]: Text[];
} = {
  A: textsA,
  B: textsB,
  C: textsC,
  D: textsD,
};

export type Text = {
  text?: string;
  title?: string;
  type: "ai" | "human";
  author: string;
  labeled: boolean;
  id: string;
};
