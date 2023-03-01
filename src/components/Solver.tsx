import React, { createRef, useEffect, useState } from 'react'
import BioInformatyka from '../static/bioInfo'

export default function Solver() {

    const [inf, setBioInfo] = useState(new BioInformatyka());
    const [data,setData] = useState('');

    let myRef = createRef<HTMLTextAreaElement>();

    const changeData = (input: string)=>{
        inf.setData(input);
        setData(input);
    } 

    useEffect(()=>{
        
    },[data])

  return (
    <div>
        <textarea ref={myRef}
         onInput={(e)=>changeData((e.target as any).value)}></textarea>
         {
            (inf.data)?
            <div>
                {
                    inf.data.map((rna: any, ind: any)=>{
                        const data = inf.getProperties(rna.aminoAcid);
                        return (
                            <div key={ind} className='protein'>
                            {/* <p>sequence: {rna.rna}</p> */}
                            <p>sequence: {rna.aminoAcid}</p>
                            <p>length: {data.length}</p>
                            <p>gravy: {data.gravy}</p>
                            <p>mass: {data.mass}</p>
                            <p>isoelectric point: {data.pi}</p>
                            <p>net charge: </p>
                            <p>prop</p>
                            <p>prop</p>
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
