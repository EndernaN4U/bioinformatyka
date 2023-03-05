import React, { createRef, useEffect, useState } from 'react'
import BioInformatyka from '../static/bioInfo'

export default function Solver() {

    const [inf, setBioInfo] = useState(new BioInformatyka());
    const [data,setData] = useState('');

    let myRef = createRef<HTMLTextAreaElement>();

    const changeData = ()=>{
        let input = myRef.current?.value!;
        if(input === ""){
            inf.data = [];
            setData("");
            return;
        }
        inf.setData(input);
        setData(input);
    } 

    useEffect(()=>{
        
    },[data])

  return (
    <div>
        <textarea ref={myRef}></textarea>
        <button onClick={changeData}>Calculate</button>
         {
            (inf.data)?
            <div>
                {
                    inf.data.map((rna: any, ind: any)=>{
                        const data = inf.getProperties(rna.aminoAcid);
                        return (
                            <div key={ind} className='protein'>
                            <p>sequence: {rna.aminoAcid}</p>
                            <p>length: {data.length}</p>
                            <p>gravy: {data.gravy}</p>
                            <p>mass: {data.mass}</p>
                            <p>pi: {data.pi}</p>
                            <div style={{ width: '100%', overflow: 'auto' }}> {data.svg} </div>
                            </div>
                        );
                    })
                }
            </div>
            :
            <p>Wpisz cos XD</p>
         }
    </div>
  )
}
