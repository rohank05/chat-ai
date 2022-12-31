import {GiftedChat} from "react-native-gifted-chat";
import {useCallback, useState} from "react";
import "react-native-url-polyfill/auto"
import {SafeAreaProvider} from "react-native-safe-area-context";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "",
});
const openai = new OpenAIApi(configuration);

export default function App() {
  const [messages, setMessages] = useState([]);
  let prompt = ""
  let id = 1;
  const onSend = useCallback(async (messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    prompt+=`\nYou: ${messages[0].text}\nFriend: `
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 60,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
      stop: ["You:"],
    })
    const reply = [{
      _id: id,
      text: response.data.choices[0].text,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Jarvis',
        avatar: 'https://placeimg.com/140/140/any',
      },
    }]
    setMessages(previousMessages=> GiftedChat.append(previousMessages, reply));
    prompt+=response.data.choices[0].text;

    id++;
  }, [])

  return (
      <SafeAreaProvider>
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: 1,
            }}
        />
      </SafeAreaProvider>
  )
}

