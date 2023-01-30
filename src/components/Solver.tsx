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
        console.log(inf.getAcids());
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
                        return <p key={ind}>{rna.rna} -&gt; {rna.aminoAcid}</p>;
                    })
                }
            </div>
            :
            <p>Wpisz cos XD</p>
         }
    </div>
  )
}