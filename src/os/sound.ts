let audio:AudioContext|undefined;
export function playSound(kind:'open'|'close'|'select'|'save'|'alarm'='select'){
 try{audio??=new AudioContext();void audio.resume();const osc=audio.createOscillator(),gain=audio.createGain();osc.connect(gain);gain.connect(audio.destination);const t=audio.currentTime;osc.type='triangle';const f={open:560,close:340,select:760,save:880,alarm:660}[kind];osc.frequency.setValueAtTime(f,t);osc.frequency.exponentialRampToValueAtTime(kind==='close'?220:f*1.4,t+.075);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.035,t+.006);gain.gain.exponentialRampToValueAtTime(.0001,t+(kind==='alarm'?.8:.11));osc.start(t);osc.stop(t+1);}catch{/* Audio is optional; unsupported environments remain quiet. */}
}
