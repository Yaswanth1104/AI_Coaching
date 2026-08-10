from agents.supervisor_agent import supervisor_review

quality = {

    "overall":95,

    "professionalism":98

}

result = supervisor_review(

    "Internet is down",

    "I'm sorry to hear that.",

    quality

)

print(result)