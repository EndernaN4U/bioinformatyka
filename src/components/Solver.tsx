import React, { createRef, useCallback, useEffect, useMemo, useState } from 'react'
import BioInformatyka from '../static/bioInfo'
import Props from './Props';

export default function Solver() {

    const [inf, setBioInfo] = useState(new BioInformatyka());
    const [data,setData] = useState('');
    const [type, setType] = useState('text');
    const [selected, setSelected] = useState("");

    let textRef = createRef<HTMLTextAreaElement>();
    let fileRef = createRef<HTMLInputElement>();


    const [dl,sdl] = useState(new Array<any>);

    const changeData = async()=>{
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
            inf.data?
            <div>
                {
                    inf.data.map((rna: any, ind: number)=>{
                        const data = inf.getProperties(rna.sequence);
                        return (
                            <Props data={data} inf={inf} key={ind}/>
                        ) ; 
                    })
                }
            </div>
            :<></>
         }
    </div>
  )
}
