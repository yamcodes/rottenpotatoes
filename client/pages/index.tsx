import type { NextPage } from 'next'

// TODO: Define an interface for the props. 
const Home:NextPage = ({gameState, wait, setUsername}: any) => {
  async function submitUsername(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // get the username from the input
    const username = event.currentTarget.username.value;

    // add the username to a list of users on the server
    const response = await fetch(`/api/users/${username}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
  
    // if successful, navigate to the game  after a wait
    if (response.ok) {
      setUsername(username);
      wait();
    }
  }
  // return a username text input and a button
  return (
    <form onSubmit={(event)=>submitUsername(event)}>
      <label htmlFor="username">Username:</label>
      <input type="text" id="username" name="username" autoComplete="username" required 
        disabled={gameState==="waiting"}/>
      <button type="submit" disabled={gameState==="waiting"}>Submit</button>
  </form>
  )
}

export default Home
