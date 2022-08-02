import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {useCallback, useEffect, useRef} from 'react';
import useState from 'react-usestateref';
import { useRouter } from 'next/router';
 
function MyApp({ Component, pageProps }: AppProps) {
  // useStates to store the username and the game state
  const [gameState, setGameState, gameRef] = useState("justStarted");
  const [feedback, setFeedback, feedbackRef] = useState("");
  const [side, setSide, sideRef] = useState();
  const [username, setUsername, usernameRef] = useState("");

  // useRouter to programmatically navigate to the game page
  const router = useRouter();

  // useRefs to keep track of timers
  const timer = useRef(null); 
  const sideTimer = useRef(null);

  // TODO: define a better type for the event.
  const detectKeyPress = useCallback((event: { key: any; }) => {
    if (gameRef.current==="justStarted") return;
    const wrongKey = event.key !== sideRef.current;

    if (gameRef.current==="waiting") setFeedback("Too Soon");
    else if (gameRef.current==="playing" && sideRef.current==="")
      setFeedback("Too Late");
    else if (gameRef.current==="playing" && wrongKey) 
      setFeedback("Wrong Key");
    else {
      // user succeeded
      setFeedback("Success");
      fetch(`/api/users/${usernameRef.current}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
    }
    wait();
  }, []);

  const wait = () => {
      const waitTime = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
      setGameState("waiting");  
      clearInterval(timer.current);
      // useRef value stored in .current property
      // setGameState("waiting");
      timer.current = setInterval(() => {
        // Set the state to the response.
        router.push("/game");
        setGameState("playing");
        setFeedback("");
        setSide(Math.random() < 0.5 ? "a" : "l");
        clearInterval(sideTimer.current);
        sideTimer.current = setInterval(() => {
          setSide("");
          if (feedbackRef.current === "") setFeedback("Too Late");
        }
        , 1000);
      }, waitTime);
  
      // clear on component unmount
      return () => {
        clearInterval(timer.current);
      };
  }

  useEffect(() => {
    document.addEventListener("keydown", detectKeyPress, false);
    return () => {
      document.removeEventListener("keydown", detectKeyPress, false);
    };
  }, []);

  return (
<div>
  <Component {...pageProps} gameState={gameState} wait={wait} side={side} setUsername={setUsername}/>
  <div style={{color: feedback==="Success" ? "green" : "red"}}>{feedback}</div>
</div>);
}

export default MyApp
