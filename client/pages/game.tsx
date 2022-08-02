function Game({side}) {
  return ((side==="") ? <div></div> : 
  <div style={{textAlign: side==="l" ? 'right' : 'left'}}>INDICATOR</div>);
}

export default Game