import React, { createRef, useEffect, useState } from 'react'
import BioInformatyka from '../static/bioInfo'

export default function Solver() {

    const [inf, setBioInfo] = useState(new BioInformatyka());
    const [data,setData] = useState('');
    const [type, setType] = useState('text');

    let textRef = createRef<HTMLTextAreaElement>();
    let fileRef = createRef<HTMLInputElement>();

    const changeData = ()=>{
        if(type==="text"){
            let input = textRef.current?.value!;
            if(input === ""){
                inf.data = [];
                setData("");
                return;
            }
            inf.setData(input);
            setData(input);
        }
        else{
            if(!fileRef.current?.files) return; // No files 
            fileRef.current?.files![0].text().then(data=>{
                inf.setData(data);
                setData(data);
            })
        }
        
    } 

    useEffect(()=>{
        
    },[data])

  return (
    <div>
        <label>Text</label>
        <input type="radio" name="type" checked={(type==="text")} onClick={()=>setType("text")}/>

        <label>File</label>
        <input type="radio" name="type" checked={(type==="file")} onClick={()=>setType("file")}/>

        <textarea style={{display: (type==="text")? "block":"none"}} ref={textRef}></textarea>
        <input style={{display: (type==="file")? "block":"none"}} ref={fileRef} type="file" accept='.txt' multiple={false}/>
        <button onClick={changeData}>Calculate</button>
         {
            (inf.data)?
            <div>
                {
                    inf.data.map((rna: any, ind: any)=>{
                        const data = inf.getProperties(rna.sequence);
                        return (
                            <div key={ind} className='protein'>
                            <p>sequence: {rna.sequence}</p>
                            <p>three letter sequence: {data.longSequence}</p>
                            <p>length: {data.length}</p>
                            <p>gravy: {data.gravy}</p>
                            <p>mass: {data.mass}</p>
                            <p>net charge: {data.netCharge}</p>
                            <p>isoelectric point: {data.isoelectricPoint}</p>
                            <div style={{ width: '100%', overflow: 'auto' }}> {data.svg} </div>
                            </div>
                        );
                    })
                }
            </div>
            :
            <p></p>
         }
    </div>
  )
}
